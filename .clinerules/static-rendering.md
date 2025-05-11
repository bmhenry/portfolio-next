# Static Rendering Guidelines

## Brief overview
This set of guidelines focuses on ensuring static rendering is always prioritized in the Next.js application. Static rendering improves performance, SEO, and reduces server load by pre-rendering pages at build time.

## Static rendering principles
- Always prefer static rendering over dynamic rendering when possible
- Avoid using `dynamic = 'force-dynamic'` export in page components
- Never use `searchParams.then` or await searchParams in server components
- Handle URL query parameters on the client side using `useSearchParams` hook
- Pass complete data sets to client components and let them handle filtering

## Server component best practices
- Keep server components statically renderable by avoiding dynamic data dependencies
- Do not directly access or await `searchParams` in server components
- Pass data to client components instead of processing it in server components
- Use `generateStaticParams` for routes with dynamic segments
- Avoid direct access to request-specific data in server components

## Client component patterns
- Use client components for any logic that depends on URL query parameters
- Implement filtering, sorting, and pagination logic in client components
- Use `useSearchParams` from 'next/navigation' to access URL query parameters
- Use `useMemo` to efficiently compute derived state from props and URL parameters
- Maintain URL parameters in navigation links to preserve state

## Data fetching strategy
- Fetch complete data sets in server components
- Pass complete data to client components
- Let client components handle filtering and processing based on URL parameters
- Use static data fetching methods like `getStaticProps` when applicable
- Avoid fetching data based on dynamic parameters in server components

## URL parameter handling
- Always handle URL query parameters in client components
- Use the URL as the source of truth for filter state
- Include filter parameters in navigation links to maintain state
- Update the URL when filter state changes to make states shareable
