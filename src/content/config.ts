/** Docs + changelog collections — typed Markdown, Zod-validated at build. */
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(99),
    updated: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const changelog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = { docs, changelog };
