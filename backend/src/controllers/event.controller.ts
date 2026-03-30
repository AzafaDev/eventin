import { Request, Response } from "express";
import cloudinary from "../configs/cloudinary";
import { eventService } from "../services/event.service";
import fs from "fs"; // Import fs untuk hapus file temp
import { eventSchema } from "../schemas/event.schema";

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "eventin_events", // Sebaiknya simpan di folder khusus
      resource_type: "auto",
    });

    // Hapus file dari folder temp setelah upload berhasil
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error: any) {
    // Tetap hapus file temp jika upload gagal agar tidak menumpuk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Cloudinary Upload Failed: " + error.message);
  }
};

export const eventController = {
  createEvent: async (req: Request, res: Response) => {
    try {
      const organizerId = req.userId;

      // --- TAHAP 1: VALIDASI DATA TEKS DULU ---
      // Kita panggil .parse di awal (tanpa imageUrl dulu) untuk memastikan format benar
      // Jika error di sini, code langsung loncat ke 'catch' dan Cloudinary tidak akan dipanggil.
      // Kita tambahkan placeholder imageUrl agar schema tidak komplain.

      const dataToValidate = {
        ...req.body,
        organizerId,
        imageUrl: "pending_upload", // Placeholder
      };

      eventSchema.createEventSchema.parse(dataToValidate);

      // --- TAHAP 2: VALIDASI FILE ---
      if (!req.files || !req.files.imageFile) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      // --- TAHAP 3: UPLOAD KE CLOUDINARY (Hanya jika data teks & file aman) ---
      const imageFile = req.files.imageFile as any;
      const imageUrl = await uploadToCloudinary(imageFile.tempFilePath);

      // --- TAHAP 4: SIMPAN KE DATABASE ---
      const newEvent = await eventService.createEvent({
        ...req.body,
        imageUrl, // Kirim URL asli hasil upload
        organizerId,
      });

      return res.status(201).json({
        success: true,
        message: "Created event successfully",
        event: newEvent,
      });
    } catch (error: any) {
      console.error("[CreateEvent Controller Error]:", error);

      // Jika error berasal dari Zod (validasi gagal), kirim pesan yang rapi
      return res.status(400).json({
        success: false,
        message: error.errors
          ? "Validation Error"
          : error.message || "Internal Server Error",
        details: error.errors
          ? error.errors.map((e: any) => e.message)
          : undefined,
      });
    }
  },
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const { events, totalEvents, page, limit } =
        await eventService.getAllEvents(req.query);
      return res.status(200).json({
        success: true,
        events,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalEvents / limit),
          totalEvents,
        },
      });
    } catch (error: any) {
      // Usahakan kirim error message yang lebih deskriptif
      console.error("[GetAllEvents Controller Error]:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  getEventById: async (req: Request, res: Response) => {
    try {
      const event = await eventService.getEventById(req.params);
      res.status(200).json({ event });
    } catch (error: any) {
      console.error("[getEventById Controller Error]:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
