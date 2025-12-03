import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class NewsServices {
  static async createNews(data: {
    tagName: string;
    title: string;
    likes?: number;
    content: string;
    linksParent?: string;
  }) {
    const { tagName, title, likes, content, linksParent } = data;

    const news = await prisma.newsInformation.create({
      data: {
        tagName,
        title,
        likes: likes || 0,
        content,
        linksParent: linksParent || null,
      },
    });
    return news;
  }

  // Get all news
  static async getAllNews() {
    const newList = await prisma.newsInformation.findMany({});
    return newList;
  }

  static async deleteNewsById(id: number) {
    await prisma.newsInformation.delete({
      where: { id },
    });
  }
}
