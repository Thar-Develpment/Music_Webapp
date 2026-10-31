import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env.js";
import { v1Router } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp(): Express {
  const app: Express = express();

  // Trust proxy for rate limiting behind reverse proxies (Nginx / Vercel / Railway)
  app.set("trust proxy", 1);

  // 1. Security HTTP Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // 2. CORS configuration
  const allowedOrigins = [
    env.CORS_ORIGIN,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Fallback permissive for development
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Key", "If-None-Match"],
    })
  );

  // 3. High-Performance Gzip / Brotli Compression
  app.use(compression());

  // 4. Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 5. Request Logging (lightweight production-safe logger)
  if (env.NODE_ENV !== "test") {
    app.use((req: Request, res: Response, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
          `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
        );
      });
      next();
    });
  }

  // 6. Health Check Endpoints
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "UP",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  // 7. API Routes Version 1
  app.use("/api/v1", v1Router);

  // 8. 404 Route Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
