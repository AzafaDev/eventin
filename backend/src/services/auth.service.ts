import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import getUniqueReferralCode from "../utils/getUniqueReferralCode";
import { sendEmail } from "../utils/sendEmail";
import { Role } from "../../generated/prisma/enums";

// --- Types ---
interface VerifyEmailProps {
  email: string;
  verificationToken: string;
}
interface RegisterProps {
  fullName: string;
  email: string;
  password: string;
  referrerCode: string;
  role: Role;
}

// --- Helpers ---

/**
 * Generates a random 6-digit numeric string for email verification.
 */
const generateVerificationToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Calculates expiry date based on current time plus specified hours.
 */
const getExpiryDate = (hours: number = 1) =>
  new Date(Date.now() + hours * 60 * 60 * 1000);

/**
 * Returns a date object set to 3 months from the current date.
 * Used for referral rewards (points and coupons).
 */
const getThreeMonthsExpiry = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date;
};

/**
 * Validates if the cooldown period (e.g., 60 seconds) has passed since the last email sent.
 * @throws Error if the cooldown is still active.
 */
const validateEmailCooldown = (lastSentAt: Date | null) => {
  if (!lastSentAt) return;
  const cooldownMs = 60 * 1000; // 60 seconds
  const timePassed = Date.now() - lastSentAt.getTime();

  if (timePassed < cooldownMs) {
    const secondsLeft = Math.ceil((cooldownMs - timePassed) / 1000);
    throw new Error(
      `Please wait ${secondsLeft} seconds before requesting another email.`,
    );
  }
};

export const authService = {
  /**
   * Registers a new user, handles password hashing, referral logic,
   * and rewards distribution within a database transaction.
   */
  register: async ({
    fullName,
    email,
    password,
    referrerCode,
    role,
  }: RegisterProps) => {
    // Standardize email to lowercase for consistency
    const sanitizedEmail = email.trim().toLowerCase();

    // Step 1: Basic input validation
    if (!fullName?.trim() || !sanitizedEmail || !password?.trim())
      throw new Error("All fields are required");

    if (!["customer", "organizer"].includes(role))
      throw new Error("Invalid role selection");

    // Step 2: Ensure email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    if (existingUser) throw new Error("Email has already been registered");

    // Step 3: Validate referrer and prevent Self-Referral Abuse
    let referrer = null;
    if (referrerCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: referrerCode },
      });

      if (!referrer) throw new Error("Referral code not found");

      // Prevent user from referring themselves using their own code
      if (referrer.email.toLowerCase() === sanitizedEmail) {
        throw new Error("Self-referral is not allowed");
      }
    }

    // Step 4: Prepare security data
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const referralCode = await getUniqueReferralCode();
    const rewardExpiry = getThreeMonthsExpiry();

    // Step 5: Execute database transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          fullName,
          email: sanitizedEmail,
          password: hashedPassword,
          referralCode,
          role,
          referredBy: referrer?.id || null,
          verificationToken,
          verificationTokenExpiresAt: getExpiryDate(1),
          lastSentAt: new Date(), // Set current time as first email sent
        },
      });

      if (referrer) {
        await tx.point.create({
          data: { userId: referrer.id, expiresAt: rewardExpiry },
        });
        await tx.coupon.create({
          data: { userId: newUser.id, expiresAt: rewardExpiry },
        });
      }

      return newUser;
    });

    // Step 6: Background email task
    sendEmail
      .verification(result.email, result.fullName, result.verificationToken!)
      .catch((err) => console.error("Email Service Error (Register):", err));

    const { password: _, ...userResponse } = result;
    return userResponse;
  },

  /**
   * Verifies user email by matching the provided token and checking expiration.
   */
  verifyEmail: async ({ email, verificationToken }: VerifyEmailProps) => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!verificationToken?.trim() || !sanitizedEmail)
      throw new Error("Verification credentials are required");

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("Email is already verified");

    const isTokenExpired =
      user.verificationTokenExpiresAt &&
      new Date() > user.verificationTokenExpiresAt;

    if (isTokenExpired) throw new Error("Verification code has expired");
    if (user.verificationToken !== verificationToken)
      throw new Error("Invalid verification code");

    const updatedUser = await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    sendEmail
      .verificationSuccess(updatedUser.email, updatedUser.fullName)
      .catch((err) => console.error("Email Service Error (Verify):", err));

    const { password: _, ...userResponse } = updatedUser;
    return userResponse;
  },

  /**
   * Generates and sends a new verification token with cooldown protection.
   */
  resendVerification: async (email: string) => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) throw new Error("Email is required");

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    if (!user || user.isVerified) return;

    // Step 1: Fix Race Condition & Spam via cooldown logic
    validateEmailCooldown(user.lastSentAt);

    const newToken = generateVerificationToken();
    const updatedUser = await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        verificationToken: newToken,
        verificationTokenExpiresAt: getExpiryDate(1),
        lastSentAt: new Date(), // Update timestamp to reset cooldown
      },
    });

    sendEmail
      .verification(updatedUser.email, updatedUser.fullName, newToken)
      .catch((err) => console.error("Email Service Error (Resend):", err));
  },

  /**
   * Authenticates user with case-insensitive email check.
   */
  login: async ({ email, password }: any) => {
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) throw new Error("Invalid credentials");
    if (!user.isVerified)
      throw new Error("Please verify your email before logging in");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const { password: _, ...userResponse } = user;
    return userResponse;
  },

  /**
   * Initiates password recovery with cooldown protection.
   */
  forgotPassword: async (email: string) => {
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail) throw new Error("Email is required");

    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    // Security: Generic message to prevent user enumeration
    if (!user)
      throw new Error(
        "If an account exists with this email, a reset link has been sent.",
      );

    // Anti-spam cooldown
    validateEmailCooldown(user.lastSentAt);

    const resetToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresAt: getExpiryDate(1),
        lastSentAt: new Date(), // Reset cooldown
      },
    });

    sendEmail
      .resetPassword(user.email, user.fullName, resetToken)
      .catch((err) => console.error("Email Service Error (ForgotPass):", err));
  },

  /**
   * Updates the user's password using a valid reset token.
   */
  resetPassword: async (password: string, token: string) => {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Invalid or expired reset token");

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword)
      throw new Error("New password cannot be the same as the old one");

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });
  },

  /**
   * Validates reset token activity.
   */
  validateResetToken: async (token: string) => {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Reset link is invalid or has expired");

    return { valid: true, email: user.email };
  },
};
