---
title: Your Perfect Infrastructure Sucks
image: ./simen-hoyesterett.jpg
date: 2024-12-16
description: |
    Building systems designed for easy change is more valuable than
    attempting to create the perfect future-proof architecture.
author: Simen A. W. Olsen
---

I remember standing in front of our engineering team in 2018, proudly presenting
what I believed was the future-proof architectural design for our new
distributed system. The diagrams were immaculate, the technology choices were
cutting-edge, and the scalability patterns were ready for any possible future
scenario.

I was basically the Leonardo da Vinci of system design… if Leonardo had been
really into Kubernetes and had a concerning addiction to coffee. But six months
later, that “future-proof” architecture had become a constraint rather than an
enabler, and my masterpiece was looking more like a finger painting done by a
caffeinated raccoon.

This experience taught me something crucial: trying to build the perfect system
that anticipates every future need is often worse than creating a system
designed to change quickly. It’s like trying to predict what your kid will want
to be when they grow up and pre-buying all the necessary equipment. Congrats,
you now own a space suit, a stethoscope, and a dragon costume — and they decided
to become a software engineer anyway.

## The Over-Planning

Many teams fall into a common trap: they try to design systems that anticipate
every possible future requirement. This happens even in agile teams, where we
convince ourselves we need to “get the architecture right” before we can start
iterating. You know, because nothing says “agile” like spending three months in
a room drawing boxes and arrows while muttering “microservices” under your
breath like it’s a magic spell.

In 2008, Netflix faced a choice: build the perfect data center that could handle
all their anticipated future needs, or move to the cloud with a simpler
architecture that could evolve. They chose the latter, focusing on making their
system easy to change rather than trying to make it perfect. Smart move — unlike
those my past self made who probably would’ve insisted on building a data center
capable of streaming to Mars, just in case Elon asked nicely.

## The Core Principles of Change-Ready Architecture

Through both failures and successes, I’ve identified three principles that
define truly adaptable architecture:

- **Embrace simplicity.** I think it makes sense to start with the simplest
  architecture that could possibly work for your current needs. Complexity
  should be earned, not presumed. If your architecture diagram looks like a
  plate of spaghetti that’s been hit by lightning, you might be doing it wrong.
- **Make change cheap.** Instead of trying to avoid change, make it inexpensive.
  This means investing in automated testing, continuous deployment, and
  monitoring. When change is cheap, you don’t need to fear it.
- **Learn through action.** Rather than trying to predict the future, build
  mechanisms that help you learn quickly about real needs. It includes feature
  toggles (Protip: Try [Unleash][unleash].), A/B testing, and robust monitoring
  of how your system is actually being used. You know, actual data, not just
  what that one loud guy in planning insists will definitely happen.

[unleash]: https://www.getunleash.io/

The rise of AI and machine learning systems has made one thing clear: we can’t
predict how our systems will need to evolve. The most successful teams aren’t
those that try to build the perfect AI architecture upfront, but those that can
rapidly experiment and adapt their systems based on real-world feedback.

The biggest pushback I hear is, “But what if we need to scale?” or “What about
future requirements?” These fears often drive teams to over-architect their
solutions. But here’s the reality: the cost of changing a simple system is
usually lower than the cost of maintaining an over-engineered one. The key is
understanding that good architecture isn’t about predicting the future — it’s
about making future changes as painless as possible.

## Conclusion

That over-engineered system I was so proud of in 2018? Its most significant flaw
wasn’t in what it got wrong about the future — it was that it tried too hard to
be right about the future in the first place. It’s like bringing a fully packed
suitcase to a first date. Today, I know that the best architecture isn’t one
that anticipates every need, but one that makes it easy to respond to needs as
they emerge.

The next time you’re tempted to design for every possible future scenario,
remember: the goal isn’t to build a perfect system, but to build one that’s
perfectly easy to change. And if someone tells you they’ve designed the perfect
future-proof architecture, they’re either lying, or they’ve discovered time
travel — and in that case, they should be sharing lottery numbers, not system
designs.
