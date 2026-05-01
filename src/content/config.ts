import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
type: 'content',
schema: z.object({
title: z.string(),
description: z.string(),
 author: z.string().default('PROJECT-DEFIANT'),
pubDate: z.coerce.date(),
updatedDate: z.coerce.date().optional(),
tags: z.array(z.string().trim().min(1)).default([]),
heroImage: z.string().optional(),
heroImageAlt: z.string().optional(),
 featured: z.boolean().default(false),
 sourceFile: z.string().optional(),
 importedAt: z.string().optional(),
}),
});

export const collections = { blog };
