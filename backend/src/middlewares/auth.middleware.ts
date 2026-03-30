import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Interface for the data stored within the JWT.
 */
interface AuthPayload {
  userId: string;
  role: "customer" | "organizer";
}

/**
 * Extend Express Request interface to include custom user properties.
 * This ensures TypeScript recognizes 'req.userId' and 'req.userRole' throughout the app.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: "customer" | "organizer";
    }
  }
}

/**
 * Middleware collection for authentication and authorization.
 */
export const authMiddleware = {
  /**
   * Validates the JWT from the request cookies.
   * If valid, attaches the user ID and role to the request object.
   * * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction
   */
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract token from cookies
    const accessToken = req.cookies?.token;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    try {
      // 2. Verify and decode the JWT
      const secretKey = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(accessToken, secretKey) as AuthPayload;

      // 3. Validate that the payload contains necessary identity data
      if (!decoded || !decoded.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Invalid session data.",
        });
      }

      // 4. Attach identity data to the request for use in controllers
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      // 5. Proceed to the next middleware or controller
      return next();
    } catch (error) {
      // Log critical errors for server-side monitoring
      console.error("[AuthMiddleware Error]:", error);

      return res.status(401).json({
        success: false,
        message: "Your session has expired or the token is invalid.",
      });
    }
  },

  /**
   * Guard untuk route yang HANYA boleh diakses Organizer
   */
  isOrganizer: (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== "organizer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only organizers can perform this action.",
      });
    }
    next();
  },

  /**
   * Guard untuk route yang HANYA boleh diakses Customer
   */
  isCustomer: (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can perform this action.",
      });
    }
    next();
  },
};
