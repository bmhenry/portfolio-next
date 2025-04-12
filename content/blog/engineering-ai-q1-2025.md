---
title: "A Software Engineer's Realistic Use of AI - March 2025"
date: "2025-03-29"
tags: ["Engineering", "Tech", "Code", "LLM", "AI"]
excerpt: "A no-BS explanation of how a software engineer at a non-AI company uses AI daily."
image: "/blog/ai-human-crop.jpg"
author:
  name: "Brandon"
  avatar: "/portrait_web_small.jpg?height=100&width=100"
  bio: "Software Engineer & Photographer"
relatedPosts:
---


# State of AI: A Software Engineer's Realistic AI Use in March of 2025

There are lots of takes on using AI for software engineering right now. The AI CEOs are doing their rounds on the tech podcasts I listen to, and I've read plenty of articles from engineers who work at those companies too. This post is different: I'm not here to blow smoke -- this is my no-nonsense report of how I use AI daily. I don't work for an AI company, and neither I nor anyone I know will have any change in our investments based on the tips you do or don't take from this post. I'm not trying to convince you that you need AI, I just want you to have a realistic understanding of what it can do and what it can't, with examples along the way.

If you've paid much attention to AI or LLMs, then you'll understand why I had to qualify the time of writing in the title of this post. Quite simply, the landscape is changing so incredibly quickly that my workflow with AI was quite different 2 months ago, and it will probably be quite different again in another 2 months. If you're reading this article in 2026 or maybe even at the end of 2025, it's probably wildly out of date.


## Who's This Post For? 

Maybe you're a senior engineer with decades of experience and you're just not sold on (what sounds like) the latest gimmick. Or you're a junior engineer who just hasn't had the chance to go find new AI tools that work for your particular workflow. Perhaps you're a project manager who wants to introduce some new tools to your team and just hasn't found the opportunity yet. You may even be a tech lead or an engineering manager who just hasn't quite been able to convince everybody on your team that AI "isn't just a phase, Mom". Whether you're any of those people or you're just a curious engineer trying to figure out how a programmer can realistically use AI in their day-to-day workflow, this post is for you.

This post is _not_ a "How To" tutorial for any of the mentioned tools: it's a synopsis of my everyday use with some general storytelling and some examples to demonstrate that usage.


## TL,DR

AI can do the easy, boring work for you, which leaves you with more time to work on the things you probably _want_ to be doing instead.

The tools I use today:

- [GitHub Copilot](#github-copilot)
	- A multiplier on your workflow as it exists today
- [Cline](#cline)
	- Disruptive: transforms your workflow
- [Chat](#chat)
	- ChatGPT, Gemini, or free tokens by jailbreaking your local car dealership's "help desk" popup... pick your poison

I have many screenshots in this post, so to reduce visual clutter I've kept many of them collapsed. Click on them to open them.


## Why Bother with AI

Like many engineers, I always have ideas I'd like to pursue: applications I want to exist that I've been putting off for months, new programming languages I'd like to try, libraries or tools I find intriguing. There's just not enough time in the day, right? The only solution is hiring other engineers to do some of that stuff for us.

Until now. AI gives you a very similar capability: with tools like [Cline](#cline), you'll be able to offload the straightforward, boring, or repetitive tasks to AI so that you can place your focus elsewhere. You'll still lose a little time in overhead reviewing code or fixing mistakes, the same as you would by delegating to a team member, but overall you'll gain time. Of course, AI absolutely does not replace a person completely: it's mostly suitable for rote & boring jobs where no creativity is needed. On the other hand, AI writes code much faster than a human team member (or you) ever could. It'll absolutely _churn_ out code, a thousand lines in a minute. So when it gets it right, it's incredible. When it gets it wrong... you do a `git reset`. The odds are absolutely in your favor.


## GitHub Copilot

*[Official Site](https://github.com/features/copilot)*

I played around with ChatGPT when it was released to the public, of course, and it was a nice party trick. It wasn't until I tried Copilot, however, that I had my first real "Oh, shit" moment with AI. It's a fancy template filler in the best kind of way:
- Write the first block of a switch/match statement, and Copilot will fill out the rest of the conditions for you
- Start typing a variable definition, and Copilot can probably guess from the variable name and the surrounding context how to fill out the rest of the line
- Need to write a new function for your existing class? Write a halfway decent comment describing what the function should do, and Copilot has a good shot at just writing the whole function for you.

And the *best* part of all this? Copilot uses *your* code as context: when it writes an `if` statement or function for you, *it'll look like your code, with your style*. This isn't a "fool the boss" kind of moment - it's critical for code readability and maintenance, especially if you're not the only one who will touch that code in the future.

I've used Copilot since 2022, and to this day I find this kind of LLM-guided code completion to be *the absolute most useful tool that modern AI provides*. I could ditch the chat interface, and would even begrudgingly give up the crazy capability of Cline, but the productivity gains of Copilot-like functionality will be pried from my cold, dead hands. It's just *so* freeing to be so close to just *thinking* what the code should be and having it appear there for you, all you do is hit tab (it really feels that fluid, sometimes!). And when it doesn't hit the jackpot, when it gives you the wrong line of code - it costs you nothing. Keep typing, and it might still figure it out before you get halfway through the line. It's _so_ nice to use that at the office, where I can't use Copilot due to data requirements, I would rather replace it with a local model in Ollama that's maybe ~60% as good as Copilot than go without the functionality at all.


### Examples

#### Context is King

Let me walk you through an example of how I might use Copilot to add a new function to a Rust file, using an example program that extracts data from a Markdown file.

Using Copilot is very straightforward: go through the auth process the first time you install the plugin, and afterwards you'll start getting code suggestions that attempt to complete based on the surrounding context:

_Copilot generating a function_
![Getting Started](/blog/copilot_rust.png)

In the above image, the "surrounding context" is the rest of the file with an emphasis on the incomplete function definition that I started writing. You can see it's autofilled the rest of the function, but let's say I only want it to give me the *next* paragraph rather than find all of them in the file. Copilot uses comments as context, too:

>![Commented Copilot](/blog/copilot_rust2.png)

All you have to do is write a comment!

This gets closer to my vision, but if you're familiar with Rust you might be thinking "That's cool, but it's cloning every line in the input `Vec` and I would never do that". Fear not, if we give the AI just slightly more instruction it will get closer to whatever your goal is:

>![Proper Context](/blog/copilot_rust4.png)

We can start specifying the function args we want the function to have, and from there it figures it out: we now get an autofilled function that gets a list of lines as references and will return any unused lines as references too, to avoid unnecessary `clone`-ing of memory resources. We took a few steps to get here as a demonstration, but if you were actually doing this work then Copilot is already essentially free here unless you don't tend to write comments. However, there's one more step that takes it to the next level:

>![Prior Work](/blog/copilot_rust5.png)

Like I said earlier: Copilot will basically copy your style and your prior work to write new code. In this case, if we already have that `get_next_paragraph` function defined in just the way we want it to work, Copilot will just *copy that style* when it's autofilling a similar function.


#### Everyday Use

I won't draw out this example like I did the other. Here's a screenshot of GitHub Copilot essentially being a fancy copy-paste engine for me: the widget that this "new" function is building is already implemented below, but I want to break it out for readability. While this kind of refactor help isn't saving me minutes of time, it's very fluid and easy to use.

>![Flutter Refactor](/blog/copilot_flutter.png)

Here's another example that more appropriately demonstrates why I end up hitting `Tab` so often, and how Copilot increases my productivity:

>![Single Line](/blog/copilot_flutter2.png)

Yeah, Copilot just filled out the rest of a line for me, big whoop. But I hit one key instead of 40, without needing to scroll up and look at other uses of the `_controller` in my class or hit `Tab` as I pick through the class object to figure out which sub-item I need. I use Copilot *all the time* for this type of usage: small but convenient line completion.


## Cline

*[Official Site](https://cline.bot/)*

I don't have any numbers to compare my productivity pre/post AI -- engineering productivity has always been difficult (impossible, even!) to measure and I'm not going to start now. So if I had to try to make up some numbers for what Copilot has done for me, let's give it... somewhere between maybe 10% and 20% increase in productivity? I know that's a giant range, but it definitely depends on what I'm working on, and I'm just guessing anyways. Regardless, I would say that's a *humongous* increase for any single tool to provide, and that number perhaps gives you an idea of just how often I can simply hit `Tab` and let AI finish my thought for me. However, Copilot is just the tip of the iceberg compared to Cline. Where Copilot is a multiplier on my existing workflow, Cline is *transformational*, changing the way that I tackle ~50% of my professional and personal projects.

_Cline creating a new file_
![A View of Cline](/blog/cline_intro.png)


### "Plan" Mode

Cline is an *agentic framework* that makes use of an LLM to plan and perform code changes. In "Plan" mode, you give Cline details on the task you want it to perform: this may be as straightforward as copy-pasting a compiler error into the chat window and asking it to fix the bug, or as complex as a multi-paragraph set of instructions with explicit "do" and "don't" requirements:
- Point it at specific files you'd like it to pay attention to or make changes in
- Specify style guidelines for the code or documentation you want it to update
- Add requirements on how and where to make changes to unit tests
- Tell it to build & run tests and to then check errors in the console output, etc
- Give it specific instructions on what you _don't_ want it to do
- Pass files to it that provide inspiration or previous implementations of the task you want it to perform


When you press `Enter`, Cline begins a multi-step back and forth with an LLM (with the provider being configurable by you -- see the [Chat](#chat) section below) to take your instructions and devise a detailed technical plan on how it should execute. It might start by trying to walk through the files in your repository, reading the files it thinks appear relevant. It'll send the files it reads, your instructions, and any other intermediate context or plans it generates to the LLM over multiple API calls until it decides it has the necessary context to construct a full plan of action. This iteration step can be surprisingly complex: I've even had cases where I gave it some zip files for licensing tests, and it decided that it wanted to unzip those files to better understand what was in them!

>![Cline Generating a Plan](/blog/cline_site_task_plan.png)

When it thinks it's done constructing a plan, it'll print that out for you and ask for your further input. It may have decided that it needs more context and it isn't ready to have a fully prepared plan yet, in which case it will prompt you for questions about whatever it's unsure about. However, most of the time it returns a full plan of action and is ready to go. In that case, it will request that you toggle it into "Act" mode. 


### "Act" Mode

In Act mode, Cline will pick apart its own plan into steps to execute, and then proceed through those one at a time. Often, this might mean editing the same file multiple times as it performs each step, usually by essentially generating a "diff" rather than completely rewriting the file.

If you didn't pay attention to the plan that Cline generated, it might surprise you at this point: very often (kinda dependent on the type of codebase it's operating in) Cline will give itself some debugging steps in the plan. It may try to build the code, run tests, and even browse to the web page (for web apps, obviously) to see if everything appears as it should. If it encounters build errors, broken tests, console error logs, or missing UI elements, it will continue to iterate and attempt to solve the task until the stated goals of the plan are met.

>![AI Debugging Its Work](/blog/cline_site_responsive_act.png)

With some languages, I've had *great* success with Cline here: when writing a Flutter app, Cline can very effectively diagnose and fix build errors. In a personal website based on Next JS, Cline also (usually) does a fantastic job at fixing errors but is more likely to spin in circles for a while dealing with syntax issues or broken UI. With C++ programs... well, I'm still hoping I can find the right set of instructions to put in the `.clinerules` file which will tell Cline how to operate on the code in a reliable way.

If Cline could just spin itself in circles forever, you could potentially find yourself with a big API bill. Fortunately, it has a default limit of 20 API calls before it hits the brakes and asks you to either approve another 20 calls or cancel the task. I usually just give the go-ahead, but remember that every new call and every file read or modified generates more context: API calls are usually quite cheap, but if it modifies several files and spins for 40 or 60 calls, you can find yourself with a $2+ bill for a single task. If you're using this all day for work, that can add up.

>![What's Your Cost Tolerance?](/blog/cline_expensive_fail.png)


### Realistic Capabilities

As mentioned above, I find a tremendous amount of success with Cline in specific areas. While working on a Flutter app, it does a fantastic job of solving bugs or adding new UI elements ~50% of the time with little to no manual interjection. Another 20% of the time, I need to give it further instruction or focus it on something it missed or broke. The remaining 30% is where it will fall apart, usually due to not understanding a library's API or spinning in circles trying to fix a syntax error.

In C++, my current success is much much lower: maybe a 10-20% success rate with significant input by me as part of the process. It struggles to understand APIs, especially when parsing custom libraries that aren't in its training data. One in-house header-only library I use makes very liberal use of [SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) on a majority of the defined functions. By pointing Cline at the documentation and example code included in the library in the `.clinerules` file, I've been able to see some success generating new tests or examples within the library. But in a codebase which uses that library as a dependency, Cline has fallen apart quite rapidly. The success I've had internal to the library leads me to believe that success in downstream code is possible if you're willing to add more specific instructions for Cline in the `.clinerules` for each dependency, but that would get annoying and repetitive very quickly. Even within the library, my success rate isn't as high as in projects using other languages.


### Cline In Summary

Overall, while Copilot feels more fluid to use, Cline saves me more time. I use it to one-shot Python scripts which handle CloudFlare DNS for me, or to add new features to my existing Rust apps, or modify this Next JS website. _Far more often than not_, Cline saves me a ton of time: I get to finish more work in a shorter amount of time, offload boring work to AI, and pursue more loose threads that I find interesting.

Sometimes, it'll run through 20 API calls only to forget what the original task is. I've watched it modify code in ways that definitely doesn't make sense. But, like I said up top: in these less common failures, you can just do a `git reset` or restore files using the "checkpoints" built into Cline, and then try again or just do it yourself.


### Editing This Site With Cline

99.9% of the code for this website was generated using a combination of [v0](https://v0.dev) and Cline. If you're a frontend engineer or a designer, you might be thinking "Yeah, coulda told you that". If you're _anybody else_, you're very likely thinking "Wow, maybe it's time for me to make a new personal website."

My requirements for this website are all about visuals and editability rather than architecture or speed:
- I want to
  - have a personal/resume site to share experience
  - share images
  - post thoughts & projects in long form
  - host this for free as a static site
- I don't want to
  - serve this to hundreds of people per day
  - collect analytics
  - hit any particular page latency

Besides rendering this site to static files for free hosting (e.g. GitHub Pages or Cloudflare Pages), my primary requirement for this site was that it was based on React _because I knew AI would be able to do the most for me_. I don't really know JavaScript or React, so **v0** got me most of the way here and then I've used Cline to flesh out details along the way.

Here's an example prompt that I used to add the Table of Contents that appears at the top right of the page (on desktop/large screen devices):

>![Give Cline A Task](/blog/cline_new_task_site.png)

:::collapsible[Example of Cline's Plan]
````
# GitHub-like Table of Contents Panel Implementation Plan
Based on my analysis of your NextJS blog codebase, I've developed a plan to implement a GitHub-like table of contents panel that will appear in the top right of each blog post. This will allow users to easily navigate to any header in the article.

## Current Understanding
Your blog uses:

- NextJS for the framework
- Markdown for blog content
- `rehype-slug` to add IDs to headings (already implemented)
- `rehype-autolink-headings` to add anchor links to headings (already implemented)
A component structure with client and server components
The good news is that you already have the foundation in place with `rehype-slug` adding IDs to your headings, which we'll leverage for the table of contents links.

## Implementation Plan
I'll create a new component called `TableOfContents` that will:

1. Extract all headings from the blog post content
2. Generate a hierarchical structure based on heading levels (h1, h2, h3, etc.)
3. Display this structure as a fixed panel in the top right of the blog post
4. Highlight the current section as the user scrolls through the content
5. Allow clicking on any heading to smoothly scroll to that section

### Component Structure
```
components/
  blog/
    table-of-contents.tsx  (new file - client component)
```

### Technical Approach
1. Server-side preparation:
  - Extract headings from the HTML content during the markdown processing
  - Pass the headings data to the client component
  - Client-side implementation:

2. Create a fixed position panel component
  - Implement scroll position tracking to highlight the current section
  - Add smooth scrolling when clicking on TOC links
  - Style it to match GitHub's TOC appearance

3. Integration:
  - Add the component to the blog post page layout
  - Ensure it only appears on desktop (hide on mobile)
  - Make sure it doesn't overlap with other content

### Styling Considerations
  - The TOC panel will be fixed position in the top right
  - It will have a max-height with scrolling for long articles
  - Current section will be highlighted
  - We'll use your existing design system colors for consistency
  - It will be responsive and hide on smaller screens

## Implementation Steps
1. Modify `lib/markdown.ts` to extract headings during processing
2. Create the `TableOfContents` client component
3. Update the blog post page to include the new component
4. Add appropriate styling
5. Test with various blog posts to ensure it works with different heading structures

Would you like me to proceed with this implementation? Or do you have any specific requirements or changes you'd like to make to this plan?
````
:::


After it added the table of contents (pretty much as you see it now!), it began spinning in circles because it couldn't "see" the ToC in its internal browser. I had to help it out:

> You're having trouble seeing the table of contents because it's not visible in a browser window with a small width. It's only visible in a browser window that's close to a regular desktop size, like 16 by 9

It proceeded to attempt to launch its internal browser with a larger viewport, and when that didn't work it tried changing the code to just show the ToC on all screen sizes for debugging purposes (it said it would change it back afterwards). The changes it made apparently causes some kind of "navigation error", so it reverted the changes and then claimed success:

>![Cline Claims Success](/blog/cline_site_done.png)

To be fair, I did (kinda) tell it that the ToC was working. And it worked! Take a look at the screenshot, and you'll see it cost me $1.43. That seems a little pricey for the work it did, but it also beats actually learning how _any_ of the code in this site works!


## Chat

At this point, the chat interface (ChatGPT, Gemini, pick your poison) has become a fancier Google alternative for me. You may find yourself thinking "Why would I use it when I can't trust what it says?", and I completely understand the sentiment. I wouldn't trust Gemini to tell me which stocks to buy, though, or ask Claude who I should vote for. Rather, I use it at work for *easily provable technical queries*:
- How can I replicate Go's `x509.MarshalPKIXPublicKey` function using the `openssl` cli? 
- What's the best Flutter widget to contain a scrollable list within a sliding drawer?
- How do I pull from an external Docker registry in a GitLab CI job?  

Maybe the LLM gives you a solid answer, maybe it doesn't. If it does, you saved yourself 5+ minutes of finding and reading the right two or three different blog posts or doc sites to determine the right set of *jq* eval arguments you need to filter a list of objects (if you're like me, you do this once every 9 months and have to look it up again every time). If it doesn't, you lost 30 seconds to a minute of time copy-pasting the generated answer into a terminal. Even if it fails, there's a decent chance it points you in the right direction and speeds up your follow-up questions or your research. That's a great trade-off, and it pays off for me every single day. 

When it comes to technical questions that have a *right answer* and a fast implementation/trial time, my suggestion is this: ask the LLM first. If it's something you do rarely and don't particularly care to develop skill in, it's an obvious win. If you *do* want to develop skill in the area, you might be tempted to disregard AI because you want to learn it and prove you can do it yourself. I get that: my ego puts me in a similar boat *frequently*. Consider this, though: we read books and have mentors because we can learn faster when we start with the right answer. If an LLM will give you that right answer, you can use that as the basis for further research and you'll have saved yourself time barking up the wrong tree.


## Where AI Falls Down, and How To Pick It Up

At the end of the day, LLMs are just fancy prediction engines which (to oversimplify) will tend to generate code that they've seen thousands (if not hundreds of thousands) of times before.
- Using a stable React JS component library that a million people have used in their public GitHub repos? Easy.
- Implementing a Flutter widget that's part of the standard library? No problem.
- Following your architectural decisions and copying the function-calling paradigm you've created in your code base? Maybe on accident.
- Picking the _right_ library to implement a new feature rather than the _most popular_ library? Unlikely.
- Writing C++ code using a custom library you've written, without _explicitly_ telling it where to find the library headers and giving it example usage? Nope.

It turns out that humans are pretty predictable, and (especially in a programming context) we often like to follow patterns that we know will work. LLMs take heavy advantage of this, and that's why they're so successful! However, they're missing the key ingredient of _real_ intelligence, and the more you use it the more you'll find that your expertise in a subject will allow you to help the AI to help you:
- **Give it more context:** whether that's pointing it at existing files, telling it more precisely which libraries to use, or requesting a particular implementation for solving a task, you can use your knowledge and expertise to guide the LLM.
- **Stop it when it goes off track:** It's rare that Cline does the task perfectly on the first try. I almost always need to tell it to modify its implementation after it thinks it's completed the job, and sometimes I stop it mid-action to stop it from going down the wrong path. Occasionally, Cline will spend $1 to $2 in API calls and I'll just completely throw away the work it did!


## Summary

Personally, I find AI too useful to ignore. I use it to boost my productivity _literally_ every day that I write code, which is a very corporate way of saying "I have to type less bullshit and I get to spend more time thinking about interesting things like architecture, new features, or trying out random ideas". Being able to give one task to Cline while I work on something else? Awesome. Asking it to fix a bug by just pasting an error in the chat window? Incredible. Diving into manual code changes and getting the thoughts out of my head faster thanks to Copilot? Fantastic.

*By no means* is AI perfect: it's not intelligent by any stretch. It is still genius in its own stochastic way, in its utility and in its effectiveness when used correctly. I don't blindly trust it, but when used with eyes open it can improve my quality of life. Whether you ultimately decide to use it or not, I highly recommend that you at least become familiar enough with its capabilities to make an informed choice. I hope that this summary has been helpful in that.
