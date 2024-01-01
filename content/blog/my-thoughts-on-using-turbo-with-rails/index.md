---
title: My thoughts on using Turbo with Rails
date: 2024-01-01
description: I want to share my views on using Turbo with Rails.
thumbnail: "./thumbnail.jpg"
author: "Maciej Biel"
authorPhoto: "./author.jpg"
readTime: "5"
---

I started using Turbo with Rails half a year ago. I implemented Turbo in two of my projects (side and commercial one) and I have some initial thoughts about it.

## Multi Page Applications

To better understand <b>what problems Turbo solves</b>, let's assume we have a web application with single codebase, where backend and frontend are tightly coupled like Rails with ERB views, Laravel with Blades, Django with Django Templates etc.

With every request, a full page reload is performed by the browser, and an entirely new HTML page is sent back by the server. The browser then proceeds to parse it and subsequently fetches resources like CSS, JS, images, etc.

On each reload/refresh, the page is destroyed, the process on the flowchart is repeated and the browser fetches the same assets over and over again.

This is the most classic type of web applications called **Multi Page Applications** (MPA).

<br>

![MPA](./mpa.png)

<br>


If we want to update only a part of the page or add some interactivity, we need to write some custom JavaScript code to fetch the data (previously known as AJAX) and update the DOM, which leads to a lot of extra code and work for the developer.

## What Turbo is?

Turbo is a small and simple JavaScipt library, which consists of three major parts.

### Turbo Drive

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl.

### Turbo Frames

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl.

### Turbo Streams

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl. Donec auctor, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl.

### Hotwire and Rails

The frontend in Rails 7+ is closely integrated with three JavaScript libraries: **Turbo**, **Stimulus** and **Strada**, which all combined are called **Hotwire**. They are developed and maintained by 37signals.

All of them are intended to be framework agnostic, but they work best with Rails and there are the most tutorials and examples for Rails.

This is only brief explanation of Turbo, for detailed explanation and deep dive, check out [documentation](https://turbo.hotwired.dev/handbook/introduction), [this article](https://www.writesoftwarewell.com/turbo-drive-essentials/) or [this guide](https://www.hotrails.dev/turbo-rails).