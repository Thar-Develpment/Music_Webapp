import { Request, Response, NextFunction } from "express";
import * as settingsService from "../services/settings.service.js";
import * as pagesService from "../services/pages.service.js";
import * as homeExtrasService from "../services/home-extras.service.js";
import * as galleryService from "../services/gallery.service.js";
import * as teamService from "../services/team.service.js";
import * as mediaService from "../services/media.service.js";
import * as enquiriesService from "../services/enquiries.service.js";

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : String(id || "");
}

// Settings
export async function getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await settingsService.getSettings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await settingsService.updateSettings(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Pages
export async function updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : String(req.params.slug);
    const data = await pagesService.updatePageContent(slug, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Home Extras
export async function createHomeExtraItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, item } = req.body;
    const data = await homeExtrasService.createHomeExtraItem(type, item);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function batchUpdateHomeExtras(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, items } = req.body;
    const data = await homeExtrasService.batchUpdateHomeExtras(type, items);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Gallery Categories
export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await galleryService.createCategory(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryService.deleteCategory(getParamId(req));
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
}

// Gallery Items
export async function upsertGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await galleryService.upsertItem(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteGalleryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await galleryService.deleteItem(getParamId(req));
    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    next(err);
  }
}

export async function reorderGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderedIds } = req.body;
    await galleryService.reorderItems(orderedIds);
    res.json({ success: true, message: "Items reordered successfully" });
  } catch (err) {
    next(err);
  }
}

// Team Members
export async function upsertTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await teamService.upsertTeamMember(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await teamService.deleteTeamMember(getParamId(req));
    res.json({ success: true, message: "Team member removed" });
  } catch (err) {
    next(err);
  }
}

// Media
export async function getMedia(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await mediaService.getAllMediaAssets();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded" });
      return;
    }
    const asset = await mediaService.uploadMediaFile(req.file, {
      title: req.body.title,
      alt: req.body.alt,
    });
    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
}

// Enquiries
export async function getEnquiries(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await enquiriesService.getEnquiries();
    res.json({
      success: true,
      data,
      meta: {
        total: data.length,
        unread: data.filter((e) => !e.readAt).length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function markEnquiryRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await enquiriesService.markEnquiryRead(getParamId(req), req.body.markRead !== false);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await enquiriesService.deleteEnquiry(getParamId(req));
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    next(err);
  }
}
