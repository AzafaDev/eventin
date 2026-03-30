import { z } from "zod";
import { EventCategory } from "../../generated/prisma/enums";

export const eventSchema = {
  createEventSchema: z.object({
    title: z.string().min(5, { error: "Judul minimal 5 karakter" }).trim(),

    description: z
      .string()
      .min(20, { error: "Deskripsi minimal 20 karakter" })
      .trim(),

    price: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { error: "Harga tidak boleh negatif" }),
    ),

    date: z.preprocess(
      (val) => new Date(val as string),
      z.date().refine((date) => date > new Date(), {
        error: "Tanggal event harus di masa depan",
      }),
    ),

    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      error: "Format waktu harus HH:mm",
    }),

    location: z.string().min(3, { error: "Lokasi minimal 3 karakter" }).trim(),

    availableSeats: z.preprocess(
      (val) => Number(val),
      z.number().int().positive({ error: "Kursi minimal 1" }),
    ),

    category: z.enum(Object.values(EventCategory) as [string, ...string[]], {
      error: (issue) =>
        issue.input === undefined
          ? "Kategori wajib dipilih"
          : "Kategori tidak valid",
    }),

    imageUrl: z.string().url({ error: "Format URL gambar tidak valid" }),

    organizerId: z.string().uuid({ error: "ID Organizer tidak valid" }),
  }),

  getAllEvents: z.object({
    search: z.string().optional(),
    category: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.nativeEnum(EventCategory).optional(),
    ),
    location: z.string().optional(),
    page: z.coerce
      .number({ error: "Page harus berupa angka" }) // Pesan jika bukan angka
      .int({ error: "Page harus bilangan bulat" }) // Pesan jika desimal
      .positive({ error: "Page minimal 1" }) // Pesan jika 0 atau negatif
      .default(1)
      .catch(1),
    limit: z.coerce
      .number({ error: "Limit harus berupa angka" }) // Pesan jika bukan angka
      .int({ error: "Limit harus bilangan bulat" }) // Pesan jika desimal
      .positive({ error: "Limit minimal 10" }) // Pesan jika 0 atau negatif
      .default(16)
      .catch(16),
  }),
};
