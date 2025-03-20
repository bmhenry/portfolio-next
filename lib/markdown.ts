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
export function getAllPostSlugs(): { slug: string }[] {
  // Ensure the posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`);
    return [];
  }

  // Get all markdown files in the directory
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));
  
  if (markdownFiles.length === 0) {
    console.warn('No markdown files found in posts directory');
  }
  
  // Log the found files for debugging
  console.log(`Found ${markdownFiles.length} markdown files:`, markdownFiles);
  
  // Map filenames to slug objects with the correct format for generateStaticParams
  const slugs = markdownFiles.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    return { slug };
  });
  
  // Log the generated slugs for debugging
  console.log('Generated slugs:', slugs.map(s => s.slug));
  
  return slugs;
}

/**
 * Get post data by slug
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`Blog post file not found: ${fullPath}`);
    throw new Error(`Blog post not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  
  // Get the post data
  const postData = matterResult.data as Omit<PostMetadata, 'slug'>;
  
  // Filter out related posts that don't exist
  if (postData.relatedPosts && Array.isArray(postData.relatedPosts)) {
    const existingRelatedPosts = postData.relatedPosts.filter(relatedPost => {
      const relatedPostPath = path.join(postsDirectory, `${relatedPost.slug}.md`);
      const exists = fs.existsSync(relatedPostPath);
      if (!exists) {
        console.warn(`Related post not found: ${relatedPost.slug} (referenced in ${slug})`);
      }
      return exists;
    });
    
    if (existingRelatedPosts.length !== postData.relatedPosts.length) {
      console.log(`Filtered out ${postData.relatedPosts.length - existingRelatedPosts.length} non-existent related posts for ${slug}`);
      postData.relatedPosts = existingRelatedPosts;
    }
  }

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
    ...postData,
  };
}
