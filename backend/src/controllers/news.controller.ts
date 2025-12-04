import { Request, Response } from "express";
import { NewsServices } from "../services/news.service";

export class NewsController {
  /**
   * POST /api/news
   */
  static async createNews(req: Request, res: Response) {
    try {
      console.log("[NEWS] Create news request:", req.body);
      const { tagName, titles, likes, content, linksParent } = req.body;

      if (!tagName || !titles || !content) {
        console.log("[NEWS] Missing required fields:", {
          tagName,
          titles,
          content,
        });
        return res.status(400).json({ error: "Missing required fields" });
      }
      const news = await NewsServices.createNews({
        tagName,
        title: titles,
        likes,
        content,
        linksParent,
      });
      console.log("[NEWS] News created successfully:", news.id);
      return res.json({ message: "News created", news });
    } catch (error) {
      console.error("[NEWS] Error creating news:", error);
      return res.status(500).json({ error: "Failed to create news" });
    }
  }

  static async getAllNews(req: Request, res: Response) {
    try {
      console.log("[NEWS] Fetching all news...");
      const newList = await NewsServices.getAllNews();
      console.log(`[NEWS] Found ${newList.length} news items`);
      return res.json(newList);
    } catch (error) {
      console.error("[NEWS] Error fetching news:", error);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
  }

  // Delete news by ID
  static async deleteNewsById(req: Request, res: Response) {
    try {
      console.log("[NEWS] Delete request params:", req.params);
      const { id } = req.params;

      if (!id) {
        console.log("[NEWS] Missing ID parameter");
        return res.status(400).json({ error: "News ID is required" });
      }

      const newsId = parseInt(id, 10);

      if (isNaN(newsId)) {
        console.log("[NEWS] Invalid ID format:", id);
        return res.status(400).json({ error: "Invalid news ID" });
      }

      console.log("[NEWS] Deleting news with ID:", newsId);
      const deleteNews = await NewsServices.deleteNewsById(newsId);
      console.log("[NEWS] News deleted successfully");
      return res.status(200).json({ message: "News deleted", deleteNews });
    } catch (error) {
      console.error("[NEWS] Error deleting news:", error);
      return res.status(500).json({ error: "Failed to delete news!" });
    }
  }
}
