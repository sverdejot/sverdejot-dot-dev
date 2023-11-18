---
title: "Microservices - The good, the bad and the ugly"
description: "What problem are microservices trying to solve, as explained by a guy who thinks he knows what he's talking about."
pubDate: "Nov 18 2023"
heroImage: "/think-about-it.jpg"
tags: ["software-architecture", "microservices", "ddd"]
badge: "NEW"
---

If there is one thing I’ve heard about on every job I landed since I started working back in 2020, it is **microservices**. I remember the first time I searched about microservices. By that time I didn’t even know what was a container nor I was thinking beyond the method I had to implement. 

I remember the first use case I saw about microservices: a small team in Atlassian that managed the service in charge of uploading the Jira comments’ attachments to their CDN. It all sounded good, a small (5) and specialized team managing the whole DevOps workflow of a small piece of code (I barely remember it was about ~300-400 lines of code by that time) but with independency with other services on its whole lifecycle.

For a long time, I didn’t care much about it. I was studying for AWS certifications and although it mentioned a lot about microservices by that moment I was not part of modeling them but just the infrastructure.

It was when I read my first soft. architecture book when the **microservices hype** hit me hard (btw, Architectural Patterns with Python, recommended if you are starting your soft. architecture journey - I can hand you one). 

Although that book was a game changer, the best about it was that it pointed me towards my first two *bibles*: ***Building microservices*** by Sam Newman (can hand you another copy too) and ***Learning Domain-Driven Design*** by *Vlad Khononov*. With *Building Microservices*, I learned not only the actual problem *microservices* are trying to solve but a wide range of technologies, practices, stacks, concepts and so on that helped me deep dive into loosely coupled architecture.

---

> I highly recommend *Learning Domain-Driven Design* too, loved how Vlad explains everything, from modeling of Entities and Aggregates to *Event Sourcing*, *Event Storming* and real-world use cases.
> 

---

Because that’s the most important lesson that book taught me: *microservices is just a name we give to loosely coupled architecture in infrastructure, DevOps and soft. architecture terms.*

---

Against the general thought that *microservices* will help you out scalling your monolithic application, most of the time, **they won’t,** because all the new challenges and trade-offs you will be facing by deploying a distributed architecture (CAP, ACID vs. SAGA or 2PC, circuit-breakers, monitoring, tracing, service discovery, etc. just to mention some).

Furthermore, they can decrease your application performance by the countless network hops a request makes before returning a request. The same applies to reliability, ease of monitoring and tracing, availability, deployability (because yes, you can model so tightly-coupled your microservices to a the point where instead of deploying a big chunk of code, you have to deploy 50 small portions but all at the same time).

*Microservices* is just a way of decoupling your whole system to a level where each chunk has separate lifecycle from another in (hopefully) all terms. It’s a way to increase cohesion and reduce coupling in such a way you can split your big and unmanageable team into separate squads, who can focus in smaller portions and, by so, build a better service, focusing on its real requirements (one service may need higher availability than elasticity, another may need higher consistency and the other rely on eventual consistency, etc.). Thus, ***microservices won’t only help you scale your application but most important your team***.

All these advantages flush away without a proper *microservices* modeling and architecting. People don’t usually pay attention tp how microservices *should* be built.

---

* There is no a single way of building distributed architectures, of course, but *microservices is not EDA (Event-Driven Architecture) nor SOA (Service-Oriented Architecture) nor Enterprise Bus*, although they share common features or technologies with EDA, PDA, etc. 

---

The term ***microservices*** was coined back in 2011/2012, when a group or architects (*ThoughtWorks*, always *ThoughtWorks*) were applying DDD and SOA, to a level which each service solves a single problem, has a single responsability or represents a single entity within the whole problem domain.

Because (for me), that’s the proper way of developing microservices: applying DDD to a macroscopic level (both domain modeling and infrastructure/architecture), leveraging the concepts of bounded context and its logical boundaries to physical boundaries, detaching and decoupling a giant system to its finest-grain state while ensuring consistency, cohesion and reliability.

---

My journey in microservices just started: I am probably not taking into account a ton of things, but when someone mentions to build a *microservice* I always suggest* to start by modularizing the monolith applying DDD and Clean Architecture: we will be facing some challenges like a proper modeling of the problem, taking apart infrastructure concerns (get the f*ck out the ORM from your entities, please), pushing domain logic back to where it belongs - domain layer (entities and domain services), defining the consistancy and transactional boundaries (aggregates), decoupling our use cases by using domain events, etc.

When I had the change to apply those concepts, I found more advantages than disadvantages: DDD had helped me in building more extensible and testable applications, as well as readable and maintainable. It adds some complexity to how the system is built (sometimes, specially when facing them first, *SOLID* and *Clean Architecture* principales may be hard to spot its short-term benefit) but, in the long-term, you’ll be thankful you made the effort.

---

* Take it at your own risk, I am not a guru but a dude from Albacete who likes to read O’Reilly books and follows Martin Fowler on Twitter.

---

> ***If you can’t build a monolith, what makes you think microservices are the answer?***
*Simon Brown* (C4 architecting model creator).
> 

---

### *👋🏻 See you folks!*