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

There are lots of takes on using AI for software engineering right now. I've heard plenty of podcasts from AI CEOs doing their rounds, and I've read plenty of articles from engineers who work from those companies. I'm not here to blow smoke, though -- this is my no-nonsense report of how I use AI daily at the time of writing. I don't work for an AI company, and neither I nor anyone I know will have any delta in our finances regardless of what tips you do or don't take from this post. I'm not trying to convince you that you need AI, I just want you to have a realistic understanding of what it can do and what it can't, with examples along the way.

If you've paid much attention to AI or LLMs, then you'll understand why I put had to qualify the time of writing in the title of this post. Quite simply, the landscape is changing so incredibly quickly. It might workflow with AI was quite different 2 months ago, and it will probably be quite different again and another 2 months. If you're reading this article in 2026 or maybe even at the end of 2025, it's probably wildly out of date.

## Who's This Post For? 

Maybe you're a senior engineer with decades of experience and you're just not sold on what sounds like the latest gimmick. Or you're a junior engineer who just hasn't had the chance to go find new tools and figure out the right AI tools for your particular workflow. Perhaps you're a project manager who wants to introduce some new tools and your team and just hasn't found the opportunity yet. You may even be a CTO, a director of engineering or an engineering manager who just hasn't quite been able to convince everybody on your team that AI "isn't just a phase, Mom". Whether you're one of these people or you're just a curious engineer trying to figure out how other engineers are realistically using AI in their day-to-day workflow, this post is for you.


## TL, DR

AI can do the easy, boring work for you which leaves you more time to work on the things you probably _want_ to be doing instead.

The tools I use, vaguely in order of their importance to me today:

- [GitHub Copilot](#github-copilot)
	- A multiplier on your workflow as it exists today
- [Cline](#cline)
	- Disruptive: transforms your workflow
- [Chat](#chat)
	- ChatGPT, Gemini, or free tokens by chatting jailbreaking your local car dealership's help desk... pick your poison


## Why Bother with AI

One of the best feelings in engineering is finding yourself with unexpected free time:  suddenly, you can work on that project you've been putting off for months, or research a new programming language or library that you find interesting. Also a great feeling: having _someone else_ that you can give tasks to, which similarly frees up more of your time even though you'll lose a bit in overhead.

AI gives you a very similar capability: with tools like [Cline](#cline), you'll be able to offload the straightforward, boring, or repetitive tasks to AI so that you can place your focus elsewhere. You'll still lose a little time in overhead reviewing code or fixing mistakes, the same as you would with a team member, but overall you'll gain time. There is one big difference, though: AI writes code much faster than a human team member (or you) ever could. It'll absolutely _churn_ out a thousand lines of code per minute. So when it gets it right, it's incredible. When it gets it wrong... you do a `git reset`.

## GitHub Copilot

*[Official Site](https://github.com/features/copilot)*

I played around with ChatGPT when it released to public, of course, and it was a nice party trick. It wasn't until I tried Copilot, however, that I had my first real "Oh, shit" moment with AI. It's a fancy template filler in the best kind of way:
- Write the first block of a switch/match statement, and Copilot will fill out the rest of the conditions for you
- Start typing a variable definition, and Copilot can probably guess from the variable name and the surrounding context how to fill out the rest of the line
- Need to write a new function for your existing class? Write a halfway decent comment describing what the function should do, and Copilot has a good shot at just writing the whole function for you.

And the *best* part of all this? Copilot uses *your* code as context: when it writes that if statement or that function for you, *it'll look like your code, with your style*. This isn't a "fool the boss" kind of moment, this is actually critically important to code readability and maintenance.

I've used Copilot since 2022, and to this day I find this kind of LLM-guided code completion to be *the absolute most useful tool that modern AI provides*. I would ditch the chat interface, and even the crazy capability of Cline, but the productivity gains of Copilot-like functionality will be pried from my cold, dead hands. It's just *so* freeing to be so close to just *thinking* what the code should be and having it appear there for you, all you do is hit tab (it really feels that fluid, sometimes!). And when it doesn't hit the jackpot, when it gives you the wrong line of code - it costs you nothing. Keep typing, and it might still figure it out before you get halfway through the line. It's _so_ nice to use that at the office, where I can't use Copilot due to data requirements, I would rather replace it with a local model in Ollama that's maybe ~60% as good as Copilot than go without the functionality at all.

### Examples

#### In Rust

Let me walk you through an example of how I might use Copilot to add a new function to a Rust file, using an example program that extracts data from a Markdown file.

Using Copilot is very straightforwards: go through the auth process the first time you install the plugin, and afterwards you'll start getting code suggestions that attempt to complete based on the surrounding context:

![Getting Started](/blog/copilot_rust.png)

In the above image, the "surrounding context" is the rest of the file with an emphasis on the incomplete function definition that I started writing. You can see it's autofilled the rest of the function, but let's say I only want it to give me the *next* paragraph rather than find all of them in the file. Copilot uses comments as context, too:

![Commented Copilot](/blog/copilot_rust2.png)

All you have to do is write a comment!

This gets closer to my vision, but if you're familiar with Rust you might be thinking "That's cool, but it's cloning every line in the input `Vec` and I would never do that". Fear not, if we give the AI just slightly more instruction it will get closer to whatever your goal is:

![Proper Context](/blog/copilot_rust4.png)

We can start specifying the function args we want the function to have, and from there it figures it out: we now get an autofilled function that gets a list of lines as references and will return any unused lines as references too, to avoid unnecessary `clone`-ing of memory resources. We took a few steps to get here as a demonstration, but if you were actually doing this work then Copilot is already essentially free here unless you don't tend to write comments. However, there's one more step that takes it to the next level:

![Prior Work](/blog/copilot_rust5.png)

Like I said earlier: Copilot will basically copy your style and your prior work to write new code. In this case, if we already have that `get_next_paragraph` function defined in just the way we want it to work, Copilot will just *copy that style* when it's autofilling a similar function.


#### In Flutter

I won't draw out this example like I did the other. Here's a screenshot of GitHub Copilot essentially being a fancy copy-paste engine for me: the widget that this "new" function is building is already implemented below, but I want to break it out for readability. While this kind of refactor help isn't saving me minutes of time, it's very fluid and easy to use.

![Flutter Refactor](/blog/copilot_flutter.png)

Here's another example that more appropriately demonstrates why I end up hitting `Tab` so often, and how Copilot increases my productivity:

![Single Line](/blog/copilot_flutter2.png)

Yeah, Copilot just filled out the rest of a line for me, big whoop. But I hit one key instead of 40, without needing to scroll up and look at other uses of the `_controller` in my class or hit `Tab` as I pick through the class object to figure out which sub-item I need. I use Copilot *all the time* for this type of usage: small but convenient line completion.


### Cline

*[Official Site](https://cline.bot/)*

I don't have any numbers to compare my productivity pre/post AI -- engineering productivity has always been difficult (impossible, even!) to measure and I'm not going to start now. So if I had to try to make up some numbers for what co-pilot has done for me, let's give it... somewhere between maybe 10% and 20% increase in productivity? I know that's a giant range, but it definitely depends on what I'm working on, and I'm just guessing anyways. Regardless, I would say that's *humongous* increase for any single tool to provide, and that number perhaps gives you an idea of just how often I can simply hit `Tab` and let AI finish my thought for me. However, Copilot is just the tip of the iceberg compared to Cline. Where Copilot is a multiplier on my existing workflow, Cline is *transformational*, changing the way that I tackle ~50% of my professional and personal projects.

![A View of Cline](/blog/cline_intro.png)

#### "Plan" Mode

Cline is an *agentic framework* that makes use of an LLM to plan and perform code changes. In "Plan" mode, you give Cline details on the task you want it to perform: this may be as straightforward as copy-pasting a compiler error into the chat window and asking it to fix the bug, or as complex as a multi-paragraph set of instructions with explicit "do" and "don't" requirements:
- Point it at specific files you'd like it to pay attention to or make changes in
- Specify style guidelines for the code or documentation you want it to update
- Add requirements on how and where to make changes to unit tests
- Tell it to build & run tests and to then check errors in the console output, etc
- Give it specific instructions on what you _don't_ want it to do
- Pass files to it that provide inspiration or previous implementations of the task you want it to perform

 When you press `Enter`, Cline begins a multi-step back and forth with an LLM (with the provider being configurable by you -- see the [Chat](#chat) section below) to take your instructions and devise a detailed technical plan on how it should execute. It might start by trying to walk through the files in your repository, reading the files it thinks appear relevant. It'll send the files it reads, your instructions, and any other intermediate context or plans it generates to the LLM over multiple API calls until it decides it has the necessary context to construct a full plan of action. This iteration step can be surprisingly complex: I've even had cases where I gave it some zip files for licensing tests, and it decided that it wanted to unzip those files to better understand what was in them!
 
 When it thinks it's done constructing a plan, it'll print that out for you and ask for your further input. It may have decided that it needs more context and it isn't ready to have a fully prepared plan yet, in which case it will prompt you for questions about whatever it's unsure about. However, most of the time it returns a full plan of action and is ready to go. In that case, it will request that you toggle it into "Act" mode. 
 
#### "Act" Mode

In Act mode, Cline will pick apart its own plan into steps to execute, and then proceed through those one at a time. Often, this might mean editing the same file multiple times as it performs each step, usually by essentially generating a "diff" rather than completely rewriting the file.



If you didn't pay attention to the plan that Cline generated, it might surprise you at this point: very often (kinda dependent on the type of code base it's operating in) Cline will give itself some debugging steps in the plan. It may try to build the code, run tests, and even browse to the web page (for web app, obviously) to see if everything appears as it should. If it encounters build errors, broken tests, console error logs, or missing UI elements, it will continue to iterate and attempt to solve the task until the stated goals of the plan are met.

With some languages, I've had *great* success with Cline here: when writing a Flutter app, Cline can very effectively diagnose and fix build errors. In a personal website based on Next JS, Cline also (usually) does a fantastic job at fixing errors but is more likely to spin in circles for a while dealing with syntax issues or broken UI. With C++ programs... well, I'm still hoping I can find the right set of instructions to put in the `.clinerules` file which will tell Cline how to operate on the code in a reliable way.


If Cline could just spin itself in circles forever, you could potentially find yourself with a big API bill. Fortunately, it has a default limit of 20 API calls before it hits the brakes and asks you to either approve another 20 calls or cancel the task. I usually just give the go-ahead, but remember that every new call and every file read or modified generates more context: API calls are usually quite cheap, but if it modifies several files and spins for 40 or 60 calls, you can find yourself with a $2+ bill for a single task.

As mentioned above, I find a tremendous of success with Cline in specific areas. While working on a Flutter app, it does a fantastic job of solving bugs or adding new UI elements ~50% of the time with little to no manual interjection. Another 20% of the time, I need to give it further instruction or focus it on something it missed or broke. The remaining 30% is where it will fall apart, usually due to not understanding a library's API or spinning in circles trying to fix a syntax error. 

In C++, my current success is much much lower: maybe a 10-20% success rate with significant input by me as part of the process. It struggles to understand APIs, especially when parsing custom libraries that aren't in its training data. One in-house header-only library I use makes very liberal use of [SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) on a majority of the defined functions. By pointing Cline at the documentation and example code included in the library in the `.clinerules` file, I've been able to see some success generating new tests or examples within the library. But in a codebase which uses that library as a dependency, Cline has fallen apart quite rapidly.  The success I've had internal to the library leads me to believe that success in downstream code is possible if you're willing to add more specific instructions for Cline in the `.clinerules` for each dependency, but that would get annoying and repetitive very quickly. Even within the library, my success rate isn't as high as in projects using other languages.

#### Examples

TODO

### Chat

Ye ol' chat interface, the original LLM entry point. At this point, it's become a fancier Google alternative for me. You may find yourself thinking "Why would I use it when I can't trust what it says?", and I completely understand the sentiment. I wouldn't trust Gemini to tell me which stocks to buy, though, or ask ChatGPT who I should vote for. Rather, I use it for *easily provable technical queries*:
- How do replicate Go's `x509.MarshalPKIXPublicKey` function using the `openssl` cli? 
- What's the best Flutter widget to contain a scrollable list within a sliding drawer?
- How do I pull from an external Docker registry in a GitLab CI job?  

Maybe the LLM gives you a solid answer, maybe it doesn't. If it does, you saved yourself 5+ minutes of finding and reading the right two or three different blog posts or doc sites to determine the right set of *jq* eval arguments you need to filter a list of objects (if you're like me, you do this once every 9 months and have to look it up again every time). If it doesn't, you lost 30 seconds to a minute of time trying it out. Even if it fails, there's a decent chance it points you in the right direction and speeds up your follow-up questions or your research. That's a great trade-off, and it pays off for me every single day. 

When it comes to technical questions that have a *right answer* and a fast implementation/trial time, my suggestion is this: ask the LLM first. If it's something you do rarely and don't particularly care to develop skill in, it's an obvious win. If you *do* want to develop skill in the area, you might be tempted to disregard AI because you want to learn it and prove you can do it yourself. I get that: my ego puts me in a similar boat *frequently*. Consider this, though: we read books and have mentors because we can learn faster when we start with the right answer. If an LLM will give you that right answer, you can use that as the basis for further research and you'll have saved yourself time barking up the wrong tree.


### Summary

Personally, I find AI too useful to ignore. I use it to boost my productivity every day, which is a very corporate way of saying "I have to type less bullshit and I get to spend more time thinking about interesting things like architecture, new features, or trying out random ideas". Being able to give one task to Cline while I work on something else? Awesome. Asking it to fix a bug by just pasting an error in the chat window? Incredible. Diving into manual code changes and getting the thoughts out of my head faster thanks to Copilot? Fantastic.

*By no means* is AI perfect: it's absolutely not intelligent by any stretch. It is still genius in its own stochastic way, in its utility and in its effectiveness when provided through the right tools. I don't blindly trust it, but I trust myself enough to use it to improve my quality of life and the quality of my work. Whether you ultimately decide to use it too, I highly recommend that you at least become familiar enough with its capabilities to make an informed choice.


