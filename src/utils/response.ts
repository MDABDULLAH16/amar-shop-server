import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

export const sendError = (
  res: Response,

  statusCode: number,
  message: string,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
