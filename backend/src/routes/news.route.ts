import { Router } from "express";
import { NewsController } from "../controllers/news.controller";
import { CommentController } from "../controllers/comment.controller";

const router = Router();

// POST /api/news - Create news
router.post("/", NewsController.createNews);

// GET all news from /api/news
router.get("/", NewsController.getAllNews);

// GET calendar news (calendarNews = true)
router.get("/calendar", NewsController.getCalendarNews);

// DELETE news by ID
router.delete("/:id", NewsController.deleteNewsById);

// ============================================
// COMMENTS ROUTES (nested under news)
// ============================================

// GET /api/news/:newsId/comments - Get all comments for a news item
router.get("/:newsId/comments", CommentController.getCommentsByNewsId);

// POST /api/news/:newsId/comments - Add a comment to a news item
router.post("/:newsId/comments", CommentController.createComment);

// PUT /api/news/comments/:id - Update a comment
router.put("/comments/:id", CommentController.updateComment);

// DELETE /api/news/comments/:id - Delete a comment
router.delete("/comments/:id", CommentController.deleteComment);

export default router;
