import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || undefined,
    });
    return;
  }

  // Unhandled internal server error
  console.error("Unhandled Exception:", err);

  const response: Record<string, unknown> = {
    success: false,
    error: "Internal Server Error",
  };

  if (env.NODE_ENV !== "production") {
    response.stack = err.stack;
    response.message = err.message;
  }

  res.status(500).json(response);
}
