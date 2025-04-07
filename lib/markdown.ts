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
  tags: string[];
  excerpt: string;
  image: string;
  readTime?: string; // Made optional since we'll calculate it if not provided
  author: Author;
  relatedPosts: RelatedPost[];
};

export type Post = PostMetadata & {
  content: string;
  contentHtml: string;
};

/**
 * Calculate read time for a blog post
 * Assumes average reading speed of 250 words per minute
 * Adds 10 seconds for each image in the content
 */
function calculateReadTime(content: string): string {
  // Count words in content
  const wordCount = content.trim().split(/\s+/).length;
  
  // Count images in content (both markdown and HTML format)
  const markdownImageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];
  const htmlImageMatches = content.match(/<img.*?>/g) || [];
  const imageCount = markdownImageMatches.length + htmlImageMatches.length;
  
  // Calculate total read time in minutes
  // 250 words per minute, plus 10 seconds (1/6 of a minute) per image
  const readTimeMinutes = (wordCount / 250) + (imageCount * (10 / 60));
  
  // Format the read time (round up to nearest minute, or use "less than 1 min" for very short content)
  return readTimeMinutes < 1 
    ? "Less than 1 min read" 
    : `${Math.ceil(readTimeMinutes)} min read`;
}

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
      
      // Get the post data
      const postData = matterResult.data as Omit<PostMetadata, 'slug'>;
      
      // Calculate read time if not provided
      if (!postData.readTime) {
        postData.readTime = calculateReadTime(matterResult.content);
      }

      // Combine the data with the slug
      return {
        slug,
        ...postData,
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
  
  // Calculate read time if not provided in frontmatter
  if (!postData.readTime) {
    postData.readTime = calculateReadTime(matterResult.content);
  }
  
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
  
  let contentHtml = result.toString();
  
  // Process collapsible sections
  contentHtml = processCollapsibleSections(contentHtml);

  // Combine the data with the slug and contentHtml
  return {
    slug,
    content: matterResult.content,
    contentHtml,
    ...postData,
  };
}

/**
 * Process collapsible sections in HTML content
 * Converts :::collapsible[Title]{open} syntax to HTML with data attributes
 */
function processCollapsibleSections(content: string): string {
  // First, check if there are any raw collapsible tags in the content
  if (content.includes(':::collapsible[')) {
    // Process the raw markdown syntax directly
    const regex = /:::collapsible\[(.*?)\](?:\{(.*?)\})?\s*\n([\s\S]*?):::/g;
    
    // Also handle the case where the collapsible syntax appears in the HTML content
    const htmlRegex = /&lt;p&gt;:::collapsible\[(.*?)\](?:\{(.*?)\})?\s*&lt;\/p&gt;([\s\S]*?)&lt;p&gt;:::&lt;\/p&gt;/g;
    
    // First, process the raw markdown syntax
    let processedContent = content.replace(regex, (match, title, options, body) => {
      const isOpen = options && options.includes('open');
      const openAttr = isOpen ? ' data-collapsible-open' : '';
      
      return `<div data-collapsible${openAttr}>
  <div data-collapsible-title>${title}</div>
  <div data-collapsible-content>
    ${body.trim()}
  </div>
</div>`;
    });
    
    // Then, process any HTML-encoded collapsible syntax
    processedContent = processedContent.replace(htmlRegex, (match, title, options, body) => {
      const isOpen = options && options.includes('open');
      const openAttr = isOpen ? ' data-collapsible-open' : '';
      
      return `<div data-collapsible${openAttr}>
  <div data-collapsible-title>${title}</div>
  <div data-collapsible-content>
    ${body.trim()}
  </div>
</div>`;
    });
    
    // Handle the case where the collapsible syntax is in a code block
    const codeBlockRegex = /<pre><code>[\s\S]*?:::collapsible\[(.*?)\](?:\{(.*?)\})?([\s\S]*?):::[\s\S]*?<\/code><\/pre>/g;
    processedContent = processedContent.replace(codeBlockRegex, (match) => {
      // Don't process collapsible syntax inside code blocks
      return match;
    });
    
    // Finally, handle any remaining raw syntax that might be in the HTML content
    // but not inside code blocks
    const remainingRawSyntaxRegex = /<p>:::collapsible\[(.*?)\](?:\{(.*?)\})?<\/p>/g;
    processedContent = processedContent.replace(remainingRawSyntaxRegex, (match, title, options) => {
      const isOpen = options && options.includes('open');
      const openAttr = isOpen ? ' data-collapsible-open' : '';
      
      return `<div data-collapsible${openAttr}>
  <div data-collapsible-title>${title}</div>
  <div data-collapsible-content>`;
    });
    
    // Close any remaining collapsible sections
    const closingTagRegex = /<p>:::<\/p>/g;
    processedContent = processedContent.replace(closingTagRegex, `</div>
</div>`);
    
    return processedContent;
  }
  
  return content;
}

/**
 * Get all unique tags from all blog posts
 */
export function getAllBlogTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Filter blog posts by multiple tags (AND logic)
 */
export function filterPostsByTags(posts: PostMetadata[], tags: string[]): PostMetadata[] {
  if (tags.length === 0) return posts;
  
  return posts.filter(post => 
    post.tags && Array.isArray(post.tags) && 
    tags.every(tag => post.tags.includes(tag))
  );
}
