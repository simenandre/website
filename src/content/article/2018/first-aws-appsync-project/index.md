---
title: Our first AWS AppSync project
image: ./simen-cardiff.jpg
date: 2018-07-31
author: Simen A. W. Olsen
---

At Bjerk we develop applications lean and rapidly, these days we use Angular 6
for frontend applications and AWS or
[Google Firebase](https://firebase.google.com/) on our backend. Mostly AWS,
honestly.

However, we’re here to talk about
[AWS AppSync](https://aws.amazon.com/appsync/). First of all, I want to give a
shoutout to AWS for providing this awesome service. AppSync serves as a kind of
[GraphQL](https://graphql.org/) as a Service deal, where implementation is
easier and more rapid than using [_Serverless_](https://serverless.com/), and
it’s rock solid and production-ready. At Bjerk we’re currently releasing our
first application that is AppSync-based, and I’ve had some time to reflect on
what makes it good.

1.  **Easy to prototype** _(also, get started)_
2.  **Easy to scale.**
3.  **Rock solid infrastructure.**
4.  **Real-time ❤️**

When we tested out AWS AppSync for [Tabetalt.no](http://tabetalt.no/), a service
we build here at Bjerk, I was worried that the only good way to build AppSync
APIs was through the management console. Honestly, I don’t like to be forced to
use it, it’s a bit messy when there is more than one developer. After some
research I found that was attacking the problem, with a
[Serverless-plugin](https://github.com/sid88in/serverless-appsync-plugin). The
API still needs some work, but we are certainly getting there!

Worried by building a monolith before knowing if AppSync is a _thing_ for the
future, we decided to make our first AppSync-application, Teach Me, through the
management console. Teach Me is a learning application, currently we are making
the Minimum Viable Product (MVP). The idea is to port the application into the
Serverless framework with Siddharth’s plugin later.

The learning curve was amazing, we got all our developers onboard pretty much
the same day. Some of them hadn’t learned GraphQL yet, but it’s quite simple to
learn. (_Tip: Depending on what size of project you want to try out AppSync on,
you should consider to create it with Serverless and a repository early on. We
have about 11 GraphQL types, three developers on this project, and it’s a bit of
a hassle actually. Or use_
[_CloudFormation_](https://read.acloud.guru/deploy-an-aws-appsync-graphql-api-with-amazon-cloudformation-9a783fdd8491))
Since we’ve been using Serverless for a couple of years now, we added all of our
Lambda code through a Serverless project to keep those things rockin’ and pretty
from the start.

All in all – I love AppSync. I promise to keep you updated on the process going
forward!
