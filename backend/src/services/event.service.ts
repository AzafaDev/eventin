import { EventCategory } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { eventSchema } from "../schemas/event.schema";

export const eventService = {
  createEvent: async (rawData: any) => {
    try {
      const validatedData = eventSchema.createEventSchema.parse(rawData);
      return await prisma.event.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: Math.floor(validatedData.price),
          date: validatedData.date,
          time: validatedData.time,
          location: validatedData.location,
          availableSeats: Math.floor(validatedData.availableSeats),
          category: validatedData.category as EventCategory,
          image: validatedData.imageUrl,
          organizerId: validatedData.organizerId,
        },
      });
    } catch (error: any) {
      console.error("[EventService Error]:", error);
      throw new Error(error.message || "Gagal membuat event.");
    }
  },
  getAllEvents: async (rawData: any) => {
    try {
      const { page, limit, search, location, category } =
        eventSchema.getAllEvents.parse(rawData);
      const skip = (page - 1) * limit;

      const whereClause: any = {};
      whereClause.date = { gte: new Date() };

      if (search) {
        whereClause.title = { contains: search, mode: "insensitive" };
      }
      if (location) {
        whereClause.location = { contains: location, mode: "insensitive" };
      }
      if (category) {
        whereClause.category = category;
      }

      const [events, totalEvents] = await Promise.all([
        await prisma.event.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        await prisma.event.count({
          where: whereClause,
        }),
      ]);

      return { events, totalEvents, page, limit };
    } catch (error: any) {
      console.error("[EventService Error]:", error);
      throw new Error(error.message);
    }
  },
  getEventById: async (rawData: any) => {
    try {
      const { id } = rawData;
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) throw new Error("Event does not exist");
      return event;
    } catch (error: any) {
      console.error("[EventService Error]:", error);
      throw new Error(error.message);
    }
  },
};
