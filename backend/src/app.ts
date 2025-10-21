import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./routes/index";
import { getPrismaClient } from "./config/database";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  getPrismaClient();

  app.use("/api", apiRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res
      .status(err?.status || 500)
      .json({ error: err?.message || "Internal Server Error" });
  });

  return app;
}

export default createApp;
