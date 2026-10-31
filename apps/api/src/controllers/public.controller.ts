import { Request, Response, NextFunction } from "express";
import * as settingsService from "../services/settings.service.js";
import * as pagesService from "../services/pages.service.js";
import * as homeExtrasService from "../services/home-extras.service.js";
import * as galleryService from "../services/gallery.service.js";
import * as teamService from "../services/team.service.js";
import * as enquiriesService from "../services/enquiries.service.js";

export async function getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await settingsService.getSettings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) as "home" | "about" | "contact";
    const data = await pagesService.getPageContent(slug);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getHomeExtras(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await homeExtrasService.getAllHomeExtras();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getGallery(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await galleryService.getGalleryData();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getTeam(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await teamService.getTeamMembers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function submitEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await enquiriesService.createEnquiry(req.body);
    res.status(201).json({
      success: true,
      message: "Transmission received. Management will be in touch shortly.",
      data: record,
    });
  } catch (err) {
    next(err);
  }
}
