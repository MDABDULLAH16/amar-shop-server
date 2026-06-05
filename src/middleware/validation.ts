import { Request, Response, NextFunction } from "express";
import { ZodObject, } from "zod";
import { sendError } from "../utils/response";
import { StatusCodes } from "http-status-codes";
 

export const validateSchema = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      return sendError(res, StatusCodes.NOT_FOUND, error.errors[0].message);
    }
  };
};
