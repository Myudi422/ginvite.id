// components/khitananForm/schema.ts
import { z } from 'zod';

export const khitananSchema = z.object({
  theme: z.number().min(1, 'Pilih theme').optional(),
  font: z.object({
    body: z.string(),
    heading: z.string(),
    special: z.string(),
    color: z.object({
      text_color: z.string().startsWith('#'),
      accent_color: z.string().startsWith('#'),
    }),
  }),
  event: z.object({
    khitanan: z.object({
      date: z.string(),
      time: z.string(),
      location: z.string(),
      mapsLink: z.string().url(),
    }),
  }),
  gallery: z.object({ items: z.array(z.string().url()).min(1) }),
  parents: z.object({
    father: z.string().min(2, 'Nama ayah wajib diisi'),
    mother: z.string().min(2, 'Nama ibu wajib diisi'),
  }),
  children: z
    .array(
      z.object({
        name: z.string().min(1, 'Nama anak wajib diisi'),
        nickname: z.string().optional(),
        profile: z.string().url().optional(),
        instagramUsername: z.string().optional(),
      })
    )
    .min(1, 'Minimal 1 anak')
    .max(1, 'Maksimal 1 anak'),
  our_story: z
    .array(
      z.object({
        title: z.string().min(1),
        pictures: z.array(z.string().url()).min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  bank_transfer: z
    .object({
      enabled: z.boolean().default(false),
      accounts: z
        .array(
          z.object({
            account_name: z.string().min(1, 'Nama pemilik rekening wajib diisi'),
            account_number: z.string().min(1, 'Nomor rekening wajib diisi'),
            bank_name: z.string().min(1, 'Nama bank wajib diisi'),
          })
        )
        .min(1, 'Minimal 1 rekening')
        .max(2, 'Maksimal 2 rekening'),
    })
    .optional(),
  turut: z
    .object({
      enabled: z.boolean().default(false),
      list: z
        .array(
          z.object({
            name: z.string().min(1, 'Nama tamu wajib diisi'),
          })
        )
        .min(1, 'Minimal 1 tamu'),
    })
    .optional(),
  music: z
    .object({
      enabled: z.boolean().default(false),
      url: z.string().url().optional(),
    })
    .optional(),
  plugin: z
    .object({
      rsvp: z.boolean().default(false),
      navbar: z.boolean().default(false),
      gift: z.boolean().default(false),
      whatsapp_notif: z.boolean().default(false),
    })
    .optional(),
  // Tambahkan toggle untuk kutipan
  quoteCategory: z.string().min(1, 'Pilih kategori kutipan').optional(),
  quote: z.string().min(1, 'Pilih kutipan').optional(),
});

