import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/app-error.js";

type RequestLocation = "body" | "query" | "params";

export function validate(schema: ZodSchema, location: RequestLocation = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[location]);
      req[location] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError("Request validation failed", error.flatten()));
      } else {
        next(error);
      }
    }
  };
}
