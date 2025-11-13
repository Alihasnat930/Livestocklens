import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeFeedScheduler } from "./scheduler";
import { setupBlockchainRoutes } from "./blockchain-routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    database: !!process.env.DATABASE_URL,
    blockchain: process.env.BLOCKCHAIN_ENABLED === 'true',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let server;
  
  try {
    server = await registerRoutes(app);
    
    // Setup blockchain routes
    setupBlockchainRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Error:', err);
    });
  } catch (error) {
    console.error('Failed to register routes:', error);
    log('⚠️  Some routes may not be available due to database connection issues');
    
    // Create basic HTTP server if registerRoutes failed
    const { createServer } = await import("http");
    server = createServer(app);
    
    // Setup blockchain routes even if main routes fail
    setupBlockchainRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Error:', err);
    });
  }

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Initialize feed plan scheduler for automated daily execution (only if database is available)
  if (process.env.DATABASE_URL) {
    initializeFeedScheduler();
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.platform === 'win32' ? 'localhost' : '0.0.0.0';
  
  server.listen(port, host, () => {
    log(`🚀 Server running on http://${host}:${port}`);
    log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected to Neon' : 'Not configured'}`);
    log(`⛓️  Blockchain: ${process.env.BLOCKCHAIN_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
  });
})();
