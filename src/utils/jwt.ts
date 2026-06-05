import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";
 
 

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(StatusCodes.UNAUTHORIZED,"Token has expired. Please log in again.");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid token. Please log in again.");
    }
    throw new AppError(StatusCodes.UNAUTHORIZED,'you are not out member');
  }
};
