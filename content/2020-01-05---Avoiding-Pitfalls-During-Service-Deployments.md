---
slug: avoiding-pitfalls-during-service-deployments
title: Avoiding pitfalls during service deployments
date: 2020-01-05
description: Method of safely handling deployments and rollback of services.
template: post
draft: false
category: DevOps
tags:
  - DevOps
  - Kubernetes
  - Deployments
---

Nowadays deploying software on the cloud using technologies like Docker and a container orchestration system (k8s, ECS, docker swarm etc.), has become effortless, leveraging strategies like "rolling updates" and "canary releases" which are practically included and require no additional undertaking. While this ensures that we can release our software with zero-downtime to our customers, what happens when we introduce a change in the system that we cannot go back from? 

The most common reason for this is a change of protocol, or changes in the way a service handles data reads or writes, for example. When deploying a new version of a service, it may work perfectly well from the previous version to the next, but often times the software may not function well during the time of **transition** between the two states of the service.

For example, on a staging environment you might run only one process or container of the service and deploying it is a one step process, but what will happen on a live environment where you possibly run hundreds of containers of the same service? Also, nowadays the [*microservices*](https://microservices.io/) architecture is increasingly popular, so now you have many different services that need to communicate with each other, and more importantly depending on one another or depending on a shared state.

Deployment of such an architecture can present additional challenges. Services may run different versions of the software, and as a result they could read or write the state differently, which can cause outages in the system or induce some unexpected behavior.

![microservices](https://microservices.io/i/Microservice_Architecture.png)
<figcaption>Image by microservices.io</figcaption>

The most common pitfall, is the change of behavior or protocol. For example let's create a simple scenario involving two services, we'll call them **Reader** and **Writer**. The Writer service writes data in some storage (Amazon S3 for example), and Reader then reads the data and does some calculations. Currently, the Writer service writes the data in an XML format. 

Let's say we'll want to refactor this service to persist the data in a JSON format instead. How should we continue about this? We cannot simply change the behavior of the Writer service to write the data as JSON, since the Reader service won't be able to read the newly provided data.
