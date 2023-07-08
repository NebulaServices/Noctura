import { z } from "zod";

export const BlogFrontmatterSchema = z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    section: z.string(),
    tags: z.string(),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export interface BlogPost {
    frontmatter: BlogFrontmatter;
    url: string;
}

export interface RepoData {
    author: {
        name: string;
        avatar: string;
    };
    name: string;
    description: string;
    language: {
        name: string;
        color: string;
    };
    stars: number;
}
