import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export type Author = {
  name: string;
  avatar: string;
  bio: string;
};

export type RelatedPost = {
  slug: string;
  title: string;
};

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  author: Author;
  relatedPosts: RelatedPost[];
};

export type Post = PostMetadata & {
  content: string;
  contentHtml: string;
};

/**
 * Get all blog posts metadata
 */
export function getAllPosts(): PostMetadata[] {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...(matterResult.data as Omit<PostMetadata, 'slug'>),
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get all post slugs
 */
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

/**
 * Get post data by slug
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark with enhanced plugins to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm) // Adds support for GitHub Flavored Markdown
    .use(html)
    .process(matterResult.content);
  
  // Further process the HTML with rehype for better header handling and spacing
  const result = await unified()
    .use(rehypeParse) // Parse HTML
    .use(rehypeSlug) // Adds IDs to headings
    .use(rehypeAutolinkHeadings) // Adds anchor links to headings
    .use(rehypeStringify) // Serializes the HTML
    .process(processedContent.toString());
  
  const contentHtml = result.toString();

  // Combine the data with the slug and contentHtml
  return {
    slug,
    content: matterResult.content,
    contentHtml,
    ...(matterResult.data as Omit<PostMetadata, 'slug'>),
  };
}
