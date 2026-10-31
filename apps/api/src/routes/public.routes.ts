import { Router } from "express";
import * as publicController from "../controllers/public.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { rateLimiter } from "../middleware/rate-limiter.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { EnquirySubmissionSchema } from "@music-label/shared";

export const publicRouter = Router();

// Cache public GET responses for 5 minutes (300s)
const publicCache = cacheMiddleware(300);

// Strict rate limiter for contact form submission (5 submissions per 15 min per IP)
const enquiryRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many enquiries submitted from this IP. Please wait 15 minutes before submitting again.",
});

publicRouter.get("/settings", publicCache, publicController.getSettings);
publicRouter.get("/pages/:slug", publicCache, publicController.getPage);
publicRouter.get("/home-extras", publicCache, publicController.getHomeExtras);
publicRouter.get("/gallery", publicCache, publicController.getGallery);
publicRouter.get("/team", publicCache, publicController.getTeam);

// Enquiry submission
publicRouter.post(
  "/enquiries",
  enquiryRateLimiter,
  validate(EnquirySubmissionSchema),
  publicController.submitEnquiry
);
