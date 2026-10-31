import dotenv from "dotenv";
import path from "path";

// Load from apps/api/.env or fallback to root .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "apps/web/.env.local") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5001", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  SUPABASE_URL:
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || "velvet-noir-secret-key-2026",
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || "300", 10),
};
