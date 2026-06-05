import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(StatusCodes.NOT_FOUND, `Your route ${req.originalUrl} not found`),
  );
};
