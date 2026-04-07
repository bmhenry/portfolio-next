---
title: "How Complex Event Processing Made Me a Better Engineer"
date: "2026-03-07"
tags: ["Engineering"]
excerpt: "A deep dive into lessons learned from implementing Complex Event Processing in Verifier"
image: "/blog/cep/cep.png"
author:
  name: "Brandon"
  avatar: "/portrait_web_small.jpg?height=100&width=100"
  bio: "Software Engineer & Photographer"
relatedPosts:
---


## Why You Should Care

Despite the huge advances & dramatic step change in the use of AI for engineering in the past year, LLMs are still a byproduct of human knowledge. Because of that, I'd argue that the way we  _engineer our code_ thus far remains completely unchanged, and **code hygiene and solid design might matter _even more_ than ever before**. Whether you're designing code that will only ever be seen by yourself, advanced by a team of other engineers potentially more junior than yourself, or upgrade by robot agents, I've found that _good code design principles_ will absolutely improve the end results.

**Complex Event Programming** is the name of a method for receiving and processing a large amount of incoming data and reacting to it accordingly, and it's also ostensibly what this blog post is about. However, the lessons I've learned from the application of this method over the past few years have taken me back to basic principles of quality software engineering that's pertinent across the full gamut of modern programming.

As you read on, you should consider first how each of the lessons I've learned might apply in any of your own direct needs with regards to CEP, but then how they might apply to the way you write code in general. _Especially_ if you're fresher in your career or pursuit of programming, I hope you'll return regularly to these principles and continue finding value in them.


## Complex Event Processing

Let's start with a working definition of CEP: "Complex Event Processing" is commonly used in log aggregation services, where a program needs to receive vast amounts of log data from some number of cloud services, grabbing all that data from many different possible sources. Some input channels may be as simple as raw TCP streams, others might be from modern queues like Redis, and others still might be raw syslog output. Taking all this input and then putting it all in a single storage location for easy debugging might be simple enough, but these services also may need to (for example) read performance data from each of the services, compare the priorities of each service in that moment, and scale services up and down on demand. The service might use all the log data to provide a service "down detector", or warn you when a service is being DDOSed.

![CEP](/blog/cep/complex_event_processing.png)

CEP isn't just for the cloud, though. I've used it over the past few years to develop (and redevelop, and refactor, several times) a tool called Verifier. If you're interested, I'll provide a little context on Verifier [at the end of this post](#about-verifier) to give you some context on how I've arrived at the conclusive I have.

For now, let's get to the reason you're here: how can we improve our CEP design, and become better engineers in the process.

## Thoughts & Lessons Learned

If there's one thing that the past decade of engineering has taught me, it's that the _maintenance cost_ of written code can be one of the most significant costs to a business (especially a startup). Maintenance cost has _everything_ to do with engineering design: how quickly new engineers can be brought on board, how long it takes for bugs to be fixed or new features to be added, how understandable the code is for programmers both new and experienced with it.

As you read through my thoughts below, I expect you'll find a common theme: _how can we make our code design clearer_, with my argument being that clearer code is better code.

### Keep Event Channels Light

With regards to CEP, **channels** are how we receive events via some transport method from some source, and how we can send data back out. Transport methods might be something like UDP packets, message queues like Rabbit, or even raw Unix sockets. If the whole goal of our program is to efficiently receive data and process it before taking some action, channels are _very_ important. The more data you need to handle, the faster you'll need your input channels to be.

Let me explain with a little analog in the embedded programming world, which generally involves hooking up lots of wires between microcontrollers and sensors - - think smart refrigerators, fans with remotes, and electric toothbrushes. When a microcontroller interacts with those sensors, it often does so using _interrupts_: signals from the sensor to the microcontroller saying "stop what you're doing and deal with me, I'm important!"

For example, imagine you're building a new digital camera. You take it to a Little League game, hold down the shutter button, and *click click click click* capture several photos. These photos are transferred quickly to a very fast cache, and then more slowly transferred to the slower SD card over time. But as the camera is in the middle of transferring picture 3, *click click click* you rattle of several more photos.

![Camera Signals](/blog/cep/camera_shutter_events.png)

When you press the shutter button down, that button press _interrupts_ the background processing the camera is doing to ensure it can handle the most critical activity: taking a photo _precisely_ when you press the button. It can return to less important activities afterwards.

What's _critical_ is that we don't spend too much time dealing with the interrupt: we need to do the _least possible amount of necessary work_, and then move on, because the interrupt function (generally) won't be able to interrupt itself. In the example above, if the interrupt function takes a picture _and_ saves it to the SD card, the user won't be able to take another photo until the previous one has finished saving.

Back to event channels: if you're grabbing events from multiple incoming delivery methods, you're almost certainly going to loop a `recv()` call for each of those incoming channels in a thread. Concurrency (whether threads or ) is your only real hope of watching all of the potential incoming channels at once. It'll look vaguely like:

```cpp
while (should_loop) {
	Maybe<Data> data = incoming.recv();
	if (data) {
		// Do work
	}
}
```

Just as with interrupts, any extra work your code has to do inside the loop before it wraps back around to the `recv` call is _preventing_ it from receiving another event. For some transport methods, this is _critical_: for message queues like ZeroMQ, if you're not actively listening for a message then you'll miss it. For receipt from servers that have their own cache (like Redis), it's less important because the message will be there when you're ready for it. However, in both cases you should be receiving events as fast as you can so that you  _handle_ those events when they happen.

If your current problem has incoming data that already uses a cached queue (again, like Redis, or some other message queue that keeps messages around for a long time like RabbitMQ) then you may be content to just skip this whole section. Otherwise, your receiver threads should simply intercept incoming data and pass it off to either other processing threads or the main threads using a fast, thread-safe queue.

### Structure Gives You Wings

_Use your type system_.

You're probably receiving lots of different events, each containing different data. What you _could_ do is pass that data around directly from event channels to all the places your code uses it, but then you'll need to deserialize that data and determine what event actually happened in about half a dozen places. Instead, **parse your data once into a specific data type.** Use structs, templates, traits, variants, enums, or whatever other options your chosen programming language exposes to make it simple to pass around data and know _exactly_ what you're working with.

Seriously, don't make yourself check some combination of JSON attributes in 3 distinct files just to figure out what data you're working with. Putting all the parsing in one place will make it easier to add new events later, will help new developers trace your program logic, and will make refactoring a breeze. The silver lining on top: AI performs _far_ better when you use the type system, because LLMS **love** structure.


### Follow the Yellow Brick Road

When you start developing your event processing code, you'll like start with a single function called something like `processEvent` that's essentially a simple `if-else` branch. It works at the start, because you've just got a couple events you're handling, but as you extend the number of incoming events and add capabilities, you'll be tempted to add more branches, with tested conditionals and a mess of variables tracking data & state.

Resist that temptation! An expansive `processEvent` function will turn into a maintenance nightmare: new engineers will cry during onboarding, and if you don't look at the code for a couple months you might cry too.

![Typed Event Flow](/blog/cep/event_to_type_to_flow.png)

Instead, follow the well-marked path you've already laid for yourself by using [clearly differentiated types](#structure-gives-you-wings) for your events. You'll probably keep a single top-level processing function, but it should very quickly split up its logic into a number of sub-functions based on your data types. This will once again make maintenance easier: as new events are added, and types are added for those events, the processing flow for those events will become extremely obvious to any who have to touch the code.

Breaking up functionality by incoming event type will make code changes for new features obvious, finding bugs more straightforward, and unit testing simpler. The mental load on the programmer will be lower, and we'll once again have a lower cost of maintenance over time.

### Uniting States

Processing lots of events (especially lots of different kinds of events) is may be necessary, but has a severe downside: what we do with each event often depends on events that came before it.

Imagine you're programming that camera again, and wiring up the handler for the shutter button. When the user presses that button, there are _so_ many questions we need to answer:
- Is the camera in standby/sleep mode?
- Is the camera ready to shoot?
- Is the user in a menu, or some other intermediate screen?
- Did they just press the button, or are they holding it down?
- Is the camera's RAM full?
- Is there permanent storage (SD card usually) in the camera and available?

This is all _state_: some of these questions can be answered pretty quickly and might not need much work, but others need to be _tracked over time_, and the answer to the question of "what happens when the user presses the shutter" will change dramatically based on what other work the camera has recently done.

When you're compacting multiple input events, handling some internal state, and advancing some variety of checks and balances before performing some work or sending an output event... It's time. You need a graph.

![Unmanaged Chaos](/blog/cep/crazy_state.png)

What you're probably looking for is a way to put your program logic into a specific _state_ when a certain event happens or some combination of data is received, and then advance to another state later based on the conjunction of past and new data. This is _precisely_ the job of a graph: a node represents a state, and the edges between nodes represent conditions which must be met before the edge can be traversed to advance from one state to the next. As you progress through the graph, you'll have _natural, searchable, and easily understandable_ places to hold data associated with past events.

![Camera State Graph](/blog/cep/camera_state.png)

Graphs get a bad rap -- not because people don't _like_ them, but because people think they're solutions for "big data" or complicated systems. If they do receive a (somewhat) valid criticism, it's that they're "too slow". However, I'll challenge both notions: _prove_ to yourself that the graph is too slow by benchmarking the performance, because the _developer ergonomics_ of the graph for tracking all the required state will be worth the very slightly slower performance unless you _know_ that extra performance matters.

Besides providing a clear place for state to live, graphs also provide an easily _debuggable interface_ to all that state, which can be _absolutely invaluable_ for complex systems.

## In Review

Hopefully you've followed the thread I tried to place at the beginning of the post, and maybe you even agree with it too:
- Proper program flow starts with clean flow of data into the program
- Incoming data should be labelled clearly to make it simple to work with
- Processing events can then follow your data structure to make code flow obvious
- Information extracted through processing events is also clearly labelled and what your program should do next will be obvious

Almost none of this has to do with writing "good code" from the perspective of the code itself: we don't care what language you're using, if you're using the standard library to its best potential, or if you're writing "idiomatic" code. _Engineering_ means designing to meet a need, and in this case the high bar is for your program to be feature rich, bug free, and easy to maintain. Putting in forethought will _help future you._

---

## About Verifier

This post isn't about Verifier, but in case you're wondering where I've pulled my lessons from I'll add some context.

Verifier is a software test tool for message-based software components. By consuming a software program's "message model" (the messages a component sends & receives, the order of those messages, and optional constraints which detail how fields in those messages must relate to each other) Verifier can test software at runtime by acting as the external actor that the component would normally interact with.


In the process of testing the component, Verifier needs to be capable of handling a variety of different Events (thus this post). It manages the life cycle of the component being tested, incoming and outgoing messages, and timeouts. Of these, the messages are obviously the most important, most frequent, and most time sensitive -- if Verifier slows down the software under test, it's not an accurate test! Messages must be _sent_ somehow (almost always over a network, but sometimes serial, shared memory, etc.), and they may be sent over _multiple_ channels: TCP, UDP, or commonly a variety of different message queues (NATS, ZeroMQ, etc.).

Verifier models the _component's state_ while testing, not through looking at the actual code but by parsing the message model. As messages are received and then sent, Verifier needs to be able to accurately progress its internal model of the component state, determine if messages are valid, and generate new messages to send to the component -- all with as little impact as possible.

I've used the lessons learned above in multiple iterations and subcomponents of Verifier, not just with message handling but also with
message constraint parsing and message spec handling. As a result, adding new features to Verifier is easier than it's ever been before,
debugging is more straightforward, and I can onboard new engineers by assigning them genuinely useful work.

