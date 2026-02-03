import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import apiRouter from "./routes/index";
import pdfRouter from "./routes/pdf.routes";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // PDF serving endpoint (outside /api prefix)
  app.use("/pdfs", pdfRouter);

  app.use("/api", apiRouter);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res
      .status((err as any)?.status || 500)
      .json({ error: err?.message || "Internal Server Error" });
  });

  return app;
}

export default createApp;
