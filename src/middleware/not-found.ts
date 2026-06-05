import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const notFound = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  throw new AppError(StatusCodes.NOT_FOUND, `Route ${_req.originalUrl}`);
};
