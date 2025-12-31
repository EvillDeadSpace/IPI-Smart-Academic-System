import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

export class CommentController {
  /**
   * GET /api/news/:newsId/comments
   * Get all comments for a news item
   */
  static async getCommentsByNewsId(req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const comments = await CommentService.getCommentsByNewsId(Number(newsId));
      return res.json(comments);
    } catch (error) {
      console.error("[COMMENT] Error fetching comments:", error);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  /**
   * POST /api/news/:newsId/comments
   * Add a comment to a news item
   */
  static async createComment(req: Request, res: Response) {
    try {
      const { newsId } = req.params;
      const { content, email } = req.body;

      if (!content || !email) {
        return res
          .status(400)
          .json({ error: "Content and email are required" });
      }

      const comment = await CommentService.createComment({
        content,
        email,
        newsId: Number(newsId),
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error("[COMMENT] Error creating comment:", error);
      return res.status(500).json({ error: "Failed to create comment" });
    }
  }

  /**
   * PUT /api/comments/:id
   * Change a comment (only owner can)
   */
  static async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, userId } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const comment = await CommentService.updateComment(
        id,
        content,
        Number(userId)
      );

      if (!comment) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      return res.json(comment);
    } catch (error) {
      console.error("[COMMENT] Error updating comment:", error);
      return res.status(500).json({ error: "Failed to update comment" });
    }
  }

  /**
   * DELETE /api/comments/:id
   * Delete a comment (only owner can)
   */
  static async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      const deleted = await CommentService.deleteComment(id, email);

      if (!deleted) {
        return res
          .status(404)
          .json({ error: "Comment not found or unauthorized" });
      }

      return res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("[COMMENT] Error deleting comment:", error);
      return res.status(500).json({ error: "Failed to delete comment" });
    }
  }
}
