import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

interface CachedResponse {
  body: unknown;
  etag: string;
  expiresAt: number;
}

const responseCache = new Map<string, CachedResponse>();

export function getCacheKey(req: Request): string {
  return `${req.method}:${req.originalUrl || req.url}`;
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    responseCache.clear();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(prefix)) {
      responseCache.delete(key);
    }
  }
}

export function cacheMiddleware(ttlSeconds = 300) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache safe GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = getCacheKey(req);
    const cached = responseCache.get(key);
    const now = Date.now();

    if (cached) {
      // ETag check
      const clientEtag = req.headers["if-none-match"];
      if (clientEtag && clientEtag === cached.etag) {
        res.status(304).end();
        return;
      }

      // Check if not expired
      if (now < cached.expiresAt) {
        res.setHeader("ETag", cached.etag);
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Cache-Control", `public, max-age=${ttlSeconds}, stale-while-revalidate=600`);
        res.json(cached.body);
        return;
      }
    }

    // Intercept response json method
    const originalJson = res.json.bind(res);
    res.json = (body: unknown): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const bodyString = typeof body === "string" ? body : JSON.stringify(body);
        const etag = `W/"${crypto.createHash("md5").update(bodyString).digest("hex")}"`;

        responseCache.set(key, {
          body,
          etag,
          expiresAt: Date.now() + ttlSeconds * 1000,
        });

        res.setHeader("ETag", etag);
        res.setHeader("X-Cache", "MISS");
        res.setHeader("Cache-Control", `public, max-age=${ttlSeconds}, stale-while-revalidate=600`);
      }
      return originalJson(body);
    };

    next();
  };
}
