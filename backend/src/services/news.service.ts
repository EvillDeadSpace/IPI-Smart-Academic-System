import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export class NewsServices {
  static async createNews(data: {
    tagName: string;
    title: string;
    likes?: number;
    content: string;
    linksParent?: string;
    calendarNews?: boolean;
    eventDate?: string;
  }) {
    const {
      tagName,
      title,
      likes,
      content,
      linksParent,
      calendarNews,
      eventDate,
    } = data;

    const news = await prisma.newsInformation.create({
      data: {
        tagName,
        title,
        likes: likes || 0,
        content,
        linksParent: linksParent || null,
        calendarNews: calendarNews || false,
        eventDate: eventDate ? new Date(eventDate) : null,
        online: true,
      },
    });
    return news;
  }

  // Get all news (for /news page - shows ALL news)
  static async getAllNews() {
    const newList = await prisma.newsInformation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return newList;
  }

  // Get calendar news (calendarNews = true)
  static async getCalendarNews() {
    const calendarNewsList = await prisma.newsInformation.findMany({
      where: {
        calendarNews: true,
        online: true, // Only online calendar news
      },
    });
    return calendarNewsList;
  }

  static async deleteNewsById(id: number) {
    await prisma.newsInformation.delete({
      where: { id },
    });
  }
}
