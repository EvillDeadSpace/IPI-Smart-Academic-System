import { Router } from "express";
import { NewsController } from "../controllers/news.controller";

const router = Router();

// POST /api/news - Create news
router.post("/", NewsController.createNews);

// GET all news from /api/news
router.get("/", NewsController.getAllNews);

// GET calendar news (calendarNews = true)
router.get("/calendar", NewsController.getCalendarNews);

// DELETE news by ID
router.delete("/:id", NewsController.deleteNewsById);

export default router;
