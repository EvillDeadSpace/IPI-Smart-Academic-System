import { Request, Response } from "express";
import { NewsServices } from "../services/news.service";

export class NewsController {
  /**
   * POST /api/news
   */
  static async createNews(req: Request, res: Response) {
    try {
      const { tagName, titles, likes, content, linksParent } = req.body;

      if (!tagName || !titles || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const news = await NewsServices.createNews({
        tagName,
        title: titles,
        likes,
        content,
        linksParent,
      });
      return res.json({ message: "News created", news });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to create news" });
    }
  }

  static async getAllNews(req: Request, res: Response) {
    try {
      const newList = await NewsServices.getAllNews();
      return res.json(newList);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
  }

  // Delete news by ID
  static async deleteNewsById(req: Request, res: Response) {
    const { newsId } = req.body;
    try {
      const deleteNews = await NewsServices.deleteNewsById(newsId);
      return res.status(200).json({ message: "News deleted", deleteNews });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete news!" });
    }
  }
}
