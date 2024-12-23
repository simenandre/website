import { defineCollection, z } from 'astro:content';

// Define the schema for the blog collection
const articleCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      author: z.string(),
      description: z.string().optional(),
      image: image(),
      tags: z.array(z.string()).optional(),
      language: z.enum(['en', 'nb-NO']).default('en'),
      alternateUrls: z.record(z.string(), z.string()).optional(),
      syndications: z
        .array(
          z.object({
            publication: z.string(),
            url: z.string(),
            publishedAt: z.date(),
            rights: z.string().optional(),
          }),
        )
        .optional(),
    }),
});

// Export the collections object
export const collections = {
  article: articleCollection,
};
