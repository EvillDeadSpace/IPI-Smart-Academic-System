import express from "express";
import corsMiddleware from "./src/config/cors";
import routes from "./src/routes";

export function createApp() {
  const app = express();

  // Middleware
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api", routes);

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  // Error Handler
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  );

  return app;
}
