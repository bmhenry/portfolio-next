# Portfolio Next.js Site

This is a personal portfolio website built with Next.js.

## Getting Started

First, install the dependencies:

```bash
npm install --legacy-peeer-deps
```

You'll need that extra flag because I built this with AI and a bunch of deps aren't what they should be, but updating them breaks things.

Prepare the down-res'd pictures:

```bash
npm run process-images
```

If there are any new images, you'll want to update `content/photos/metadata.json` after running processing.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

To build the application for production, run:

```bash
npm run build
```

## Deploy

You can deploy the application using platforms like Vercel, Netlify, or any other hosting service that supports Next.js.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Adding Blog Posts

You'll want this header data at the top:

```md
---
title: "The Art of Landscape Photography: Capturing the Perfect Shot"
date: "2023-02-18"
tags: ["Photography", "Landscape", "Techniques", "Lighting", "Composition"]
excerpt: "Discover techniques for capturing stunning landscape photographs in any lighting condition."
image: "/headshot.jpg"
readTime: "6 min read"
author:
  name: "Brandon"
  avatar: "/placeholder.svg?height=100&width=100"
  bio: "Software Engineer & Photographer"
relatedPosts:
  - slug: "building-scalable-web-apps"
    title: "Building Scalable Web Applications with React and Next.js"
  - slug: "patagonia-backpacking"
    title: "Exploring Remote Trails: My Backpacking Journey Through Patagonia"
---
```

### Collapsible Sections

Do this:

```md
:::collapsible[Title]

Content
:::
```

Optionally, do

```md
:::collapsible[Golden Hour Lighting Tips]{open}
content
:::
```

to default to open.

You can collapse images too:

```md
>![Image Title](image source)
```

## License

This project is licensed under the MIT License.