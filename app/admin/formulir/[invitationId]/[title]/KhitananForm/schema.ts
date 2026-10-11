// components/khitananForm/schema.ts
import { z } from 'zod';

export const khitananSchema = z.object({
  theme: z.number().min(1, 'Pilih theme').optional(),
  font: z.object({
    body: z.string().optional(),
    heading: z.string().optional(),
    special: z.string().optional(),
    color: z.object({
      text_color: z.string().optional(),
      accent_color: z.string().optional(),
    }).default({ text_color: '', accent_color: '' }),
  }).default({
    body: '',
    heading: '',
    special: '',
    color: { text_color: '', accent_color: '' },
  }),
  event: z.object({
    date: z.string().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    mapsLink: z.string().optional(),
    khitanan: z.object({
      date: z.string().optional(),
      note: z.string().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      mapsLink: z.string().optional(),
    }).default({
      date: '',
      note: '',
      time: '',
      location: '',
      mapsLink: '',
    }),
  }).default({
    date: '',
    time: '',
    location: '',
    mapsLink: '',
    khitanan: { date: '', note: '', time: '', location: '', mapsLink: '' },
  }),
  gallery: z.object({ items: z.array(z.string().optional()).default([]) }).default({ items: [] }),
  parents: z.object({
    father: z.string().optional(),
    mother: z.string().optional(),
  }).default({ father: '', mother: '' }),
  children: z
    .array(
      z.object({
        name: z.string().optional(),
        order: z.enum(['Pengantin Pria', 'Pengantin Wanita']).optional(),
        nickname: z.string().optional(),
        profile: z.string().optional(),
        instagramUsername: z.string().optional(),
      })
    )
    .min(1, 'Minimal 1 anak')
    .default([
      { name: 'nama lengkap anak', nickname: 'panggilan anak', profile: '', instagramUsername: '', order: 'Pengantin Pria' },
    ]),
  our_story: z.array(
    z.object({
      title: z.string().optional(),
      pictures: z.array(z.string().optional()).default([]),
      description: z.string().optional(),
    })
  ).default([]),
  bank_transfer: z
    .object({
      enabled: z.boolean().default(false),
      account_name: z.string().optional(),
      account_number: z.string().optional(),
      bank_name: z.string().optional(),
      accounts: z.array(
        z.object({
          account_name: z.string().optional(),
          account_number: z.string().optional(),
          bank_name: z.string().optional(),
        })
      ).default([]),
    })
    .default({ enabled: false, account_name: '', account_number: '', bank_name: '', accounts: [] })
    .optional(),
  turut: z
    .object({
      enabled: z.boolean().default(false),
      list: z.array(
        z.object({
          name: z.string().optional(),
        })
      ).default([]),
    })
    .default({ enabled: false, list: [] })
    .optional(),
  music: z
    .object({
      enabled: z.boolean().default(false),
      url: z.string().optional(),
    })
    .default({ enabled: false, url: '' })
    .optional(),
  plugin: z
    .object({
      rsvp: z.boolean().default(false),
      navbar: z.boolean().default(false),
      gift: z.boolean().default(false),
      whatsapp_notif: z.boolean().default(false),
    })
    .default({ rsvp: false, navbar: false, gift: false, whatsapp_notif: false })
    .optional(),
  quote_enabled: z.boolean().default(false).optional(),
  quoteCategory: z.string().optional(),
  quote: z.string().optional(),
});

export type FormValues = z.infer<typeof khitananSchema>;

