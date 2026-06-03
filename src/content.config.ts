import { defineCollection, z } from 'astro:content';

const worksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    emoji: z.string(),
    theme: z.enum(['amber', 'orange', 'indigo', 'emerald', 'rose']),
    tags: z.array(z.string()),
    ogImage: z.string(),
    status: z.enum(['online', 'coming']),
    statusLabel: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      })
    ),
  }),
});

export const collections = {
  works: worksCollection,
};
