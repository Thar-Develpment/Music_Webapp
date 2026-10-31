import { Router } from "express";
import multer from "multer";
import * as adminController from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  SettingSchema,
  GalleryCategorySchema,
  GalleryItemSchema,
  TeamMemberSchema,
} from "@music-label/shared";

// Configure in-memory upload (max 20MB for concert stills and high-res vinyl artwork)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const adminRouter = Router();

// Require admin authorization for all /api/v1/admin routes
adminRouter.use(requireAdmin);

// Settings
adminRouter.get("/settings", adminController.getSettings);
adminRouter.put("/settings", validate(SettingSchema), adminController.updateSettings);

// Pages
adminRouter.put("/pages/:slug", adminController.updatePage);

// Home Extras
adminRouter.post("/home-extras", adminController.createHomeExtraItem);
adminRouter.put("/home-extras", adminController.batchUpdateHomeExtras);

// Gallery
adminRouter.post(
  "/gallery/categories",
  validate(GalleryCategorySchema),
  adminController.createCategory
);
adminRouter.delete("/gallery/categories/:id", adminController.deleteCategory);

adminRouter.post("/gallery/items", validate(GalleryItemSchema), adminController.upsertGalleryItem);
adminRouter.put("/gallery/items/:id", validate(GalleryItemSchema), adminController.upsertGalleryItem);
adminRouter.delete("/gallery/items/:id", adminController.deleteGalleryItem);
adminRouter.patch("/gallery/reorder", adminController.reorderGallery);

// Documentary Team
adminRouter.post("/team", validate(TeamMemberSchema), adminController.upsertTeamMember);
adminRouter.put("/team/:id", validate(TeamMemberSchema), adminController.upsertTeamMember);
adminRouter.delete("/team/:id", adminController.deleteTeamMember);

// Media
adminRouter.get("/media", adminController.getMedia);
adminRouter.post("/media/upload", upload.single("file"), adminController.uploadMedia);

// Enquiries
adminRouter.get("/enquiries", adminController.getEnquiries);
adminRouter.patch("/enquiries/:id", adminController.markEnquiryRead);
adminRouter.delete("/enquiries/:id", adminController.deleteEnquiry);
