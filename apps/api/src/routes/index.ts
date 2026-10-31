import { Router } from "express";
import { publicRouter } from "./public.routes.js";
import { adminRouter } from "./admin.routes.js";

export const v1Router = Router();

v1Router.use("/public", publicRouter);
v1Router.use("/admin", adminRouter);
