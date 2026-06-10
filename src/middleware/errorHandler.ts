// src/middleware/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode =
    err instanceof AppError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  let message = err.message || "Something went wrong";
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  // ১. Extract only the vital summary line if it's a Prisma error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = err.message.split("\n").shift()?.trim() || "Database error";
  }

  // ২. Handle known Prisma client errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P1000":
        message = "Authentication failed against the database server.";
        statusCode = StatusCodes.BAD_GATEWAY;
        break;

      case "P1001":
        message = "Cannot reach the database server. Please check connection.";
        statusCode = StatusCodes.BAD_GATEWAY;
        break;

      case "P1002":
        message = "The database operation timed out.";
        statusCode = StatusCodes.REQUEST_TIMEOUT;
        break;

      case "P2000":
        message = "Value too long for a database column.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2001":
        message = "Record not found.";
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2002":
        const target = (err.meta?.target as string[])?.join(", ") || "field";
        message = `Duplicate key error — unique constraint failed on (${target}).`;
        statusCode = StatusCodes.CONFLICT;
        break;

      case "P2003":
        message = "Foreign key constraint failed.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2004":
        message = "Database constraint failed.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2005":
        message = "Invalid value stored in the database.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2006":
        message = "Invalid value type provided for the field.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2007":
        message = "Data validation error.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2008":
        message = "Query parsing failed.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2009":
        message = "Query validation failed.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2010":
        message = "Raw query failed. Check your query syntax.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2011":
        message = "Null constraint violation — missing required field.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2012":
        message = "Missing required value for a field.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2013":
        message = "Missing required argument for a field.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2014":
        message = "Relation violation between records.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2015":
        message = "Related record not found.";
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2016":
        message = "Query interpretation error.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2017":
        message = "Record relation inconsistency.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2018":
        message = "Required connected record not found.";
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2019":
        message = "Input error — invalid data.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2020":
        message = "Value out of range for the column type.";
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2021":
        message = "Table not found in the database.";
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2025":
        message =
          (err.meta?.cause as string) ||
          "An operation failed because a required record was not found.";
        statusCode = StatusCodes.NOT_FOUND;
        break;

      default:
        // Fallback for any code omitted above
        statusCode = StatusCodes.BAD_REQUEST;
        break;
    }
  }

  // ৩. ফাইনাল রেসপন্স পাঠানো
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export const catchAsync =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
