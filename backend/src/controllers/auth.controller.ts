import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

/**
 * Controller to handle all Authentication related requests.
 */
export const authController = {
  // --- Registration & Verification Section ---

  /**
   * Register a new user and handle referral logic.
   * @route POST /api/auth/register
   */
  register: async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, referrerCode, role } = req.body;

      const newUser = await authService.register({
        fullName,
        email,
        password,
        referrerCode,
        role: role as Role,
      });

      return res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email to verify account.",
        data: newUser,
      });
    } catch (error: any) {
      const status = error.message.includes("already") ? 409 : 400;
      return res
        .status(status)
        .json({ success: false, message: error.message });
    }
  },

  /**
   * Verify user's email using a numeric token.
   * @route POST /api/auth/verify-email
   */
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { email, verificationToken } = req.body;

      const verifiedUser = await authService.verifyEmail({
        email,
        verificationToken,
      });

      generateTokenAndSetCookie(res, verifiedUser.id, verifiedUser.role);

      return res.status(200).json({
        success: true,
        message: "Email verified successfully. Welcome to Eventin!",
        user: verifiedUser,
      });
    } catch (error: any) {
      const status = error.message.includes("found") ? 404 : 400;
      return res
        .status(status)
        .json({ success: false, message: error.message });
    }
  },

  /**
   * Resend a new verification token to the user's email.
   * @route POST /api/auth/resend-verification
   */
  resendVerification: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await authService.resendVerification(email);

      return res.status(200).json({
        success: true,
        message: "Verification email has been resent.",
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // --- Session Management Section ---

  /**
   * Authenticate user and set session cookie.
   * @route POST /api/auth/login
   */
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await authService.login({ email, password });

      generateTokenAndSetCookie(res, user.id, user.role);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user,
      });
    } catch (error: any) {
      const status = error.message.includes("verified") ? 403 : 401;
      return res
        .status(status)
        .json({ success: false, message: error.message });
    }
  },

  /**
   * Clear user session cookie.
   * @route POST /api/auth/logout
   */
  logout: async (_req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // --- Password Recovery Section ---

  /**
   * Send a password reset link to user's email.
   * @route POST /api/auth/forgot-password
   */
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      return res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset link has been sent to your email.",
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Validate if the provided reset token is still active.
   * @route GET /api/auth/validate-reset-token/:token
   */
  validateResetToken: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const result = await authService.validateResetToken(token as string);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Update user's password using the reset token.
   * @route PATCH /api/auth/reset-password/:token
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { token } = req.params;

      await authService.resetPassword(password, token as string);

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully. Please log in with your new password.",
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // --- Profile & State Section ---

  /**
   * Check if the current user is authenticated (Sync frontend state).
   * @route GET /api/auth/check-auth
   */
  checkAuth: async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user ID found in request.",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          isVerified: true,
          referralCode: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  },
};
