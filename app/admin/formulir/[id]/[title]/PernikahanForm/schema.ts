// components/PernikahanForm/schema.ts
import { z } from 'zod';

export const pernikahanSchema = z.object({
  font: z.object({
    body: z.string(),
    heading: z.string(),
    special: z.string(),
  }),
  event: z.object({
    iso: z.string(),
    date: z.string(),
    note: z.string(),
    time: z.string(),
    title: z.string(),
    location: z.string(),
    mapsLink: z.string().url(),
  }),
  gallery: z.object({ items: z.array(z.string().url()).min(1) }),
  parents: z.object({
    bride: z.object({ father: z.string().min(2), mother: z.string().min(2) }),
    groom: z.object({ father: z.string().min(2), mother: z.string().min(2) }),
  }),
  children: z
    .array(
      z.object({
        name: z.string().min(1),
        order: z.enum(['Pengantin Pria', 'Pengantin Wanita']),
        nickname: z.string().optional(),
        profile: z.string().url().optional(),
      })
    )
    .min(2),
  our_story: z
    .array(
      z.object({
        title: z.string().min(1),
        pictures: z.array(z.string().url()).min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  invitationNote: z.string().optional(),
});

export type FormValues = z.infer<typeof pernikahanSchema>;
