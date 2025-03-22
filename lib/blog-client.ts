"use client"

import { PostMetadata } from "./markdown";

/**
 * Filter blog posts by multiple tags (AND logic)
 * Client-side version that doesn't depend on server-only modules
 */
export function filterPostsByTags(posts: PostMetadata[], tags: string[]): PostMetadata[] {
  if (tags.length === 0) return posts;
  
  return posts.filter(post => 
    post.tags && Array.isArray(post.tags) && 
    tags.every(tag => post.tags.includes(tag))
  );
}

/**
 * Count posts with a specific tag
 * Client-side helper function
 */
export function countPostsWithTag(posts: PostMetadata[], tag: string): number {
  return posts.filter(post => post.tags && post.tags.includes(tag)).length;
}
