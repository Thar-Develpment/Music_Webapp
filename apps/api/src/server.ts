import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { getSupabase } from "./config/supabase.js";

async function bootstrap() {
  const app = createApp();

  // Test Supabase connection on startup
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("settings").select("id").limit(1);
    if (error) {
      console.warn("⚠️ Warning: Supabase initial check:", error.message);
    } else {
      console.log("Connected to Supabase PostgreSQL database successfully.");
    }
  } catch (err) {
    console.warn("⚠️ Warning: Supabase client initialization check:", err);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`
==============================================================
  VELVET NOIR RECORDINGS — API SERVER ONLINE
==============================================================
  Environment : ${env.NODE_ENV}
  Port        : ${env.PORT}
  Health Check: http://localhost:${env.PORT}/health
  Base API    : http://localhost:${env.PORT}/api/v1
  Supabase DB : ${env.SUPABASE_URL}
==============================================================
    `);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down API server...`);
    server.close(() => {
      console.log("HTTP server closed. Exiting process.");
      process.exit(0);
    });

    // Force close after 10 seconds if lingering
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  console.error("Fatal Server Startup Error:", err);
  process.exit(1);
});
