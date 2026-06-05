import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response";
import { StatusCodes } from "http-status-codes";
 

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", error);

  if (error instanceof ZodError) {
    return sendError(res, StatusCodes.BAD_REQUEST, error.issues[0].message);
  }

  if (error.message) {
    return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }

  return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
