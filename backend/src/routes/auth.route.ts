import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

/**
 * Authentication & Authorization Routes
 * This module handles user registration, login, and password recovery for Eventin.
 */
const authRoute = Router();

// --- 1. Account Creation & Verification ---

// Register a new user (Customer or Organizer)
authRoute.post("/register", authController.register);

// Verify email using the token sent to the user
authRoute.post("/verify-email", authController.verifyEmail);

// Resend a new verification token if the previous one expired
authRoute.post("/resend-verification", authController.resendVerification);

// --- 2. Session Management ---

// Authenticate user and set session cookie
authRoute.post("/login", authController.login);

// Clear session cookie and log out the user
authRoute.post("/logout", authController.logout);

// Sync user state with frontend (Protected Route)
authRoute.get(
  "/check-auth",
  authMiddleware.verifyToken,
  authController.checkAuth,
);

// --- 3. Password Recovery ---

// Request a password reset link via email
authRoute.post("/forgot-password", authController.forgotPassword);

// Verify if the reset token from the email is still valid
authRoute.get(
  "/validate-reset-token/:token",
  authController.validateResetToken,
);

// Update password using the valid reset token
authRoute.post("/reset-password/:token", authController.resetPassword);

export default authRoute;
