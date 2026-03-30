import { Response } from "express";
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (
  res: Response,
  userId: string,
  role: string,
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ userId, role }, secret, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export default generateTokenAndSetCookie;
