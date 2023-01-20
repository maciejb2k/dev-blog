---
title: Multi-stage Rails Docker images
date: 2023-01-20
description: Updated version of my previous article about dockerizing Rails apps.
thumbnail: "./thumbnail.jpg"
author: "Maciej Biel"
authorPhoto: "./author.jpg"
readTime: "5"
---

A few days ago, when I saw my [previous article from a few months ago](https://dev-blog.maciejbiel.pl/setup-rails-api-with-docker-compose/), I see now, after some time that it has quite a few problems:
- my image was only for local development, not for production,
- **the image size was huge (~ 800MB),**
- there was a mess with gems installation location and binaries,
- naming of variables was misleading.

Now I've made some improvements and corrected old mistakes:
- I've used multi-stage builds, so the image size **reduced to ~150MB**,
- majority of ENV variables are set and named properly,
- gems and binaries (like rails) have proper paths,
- I removed unnecessary files and leftovers from gem installations.
- more things are explicit, like `BUNDLER_VERSION`, etc.,
- each layer in Dockerfile has comments.

In the current setup, I have **two Dockerfiles** inside `./docker` directory, with two subdirectories called `prod` and `dev`.

As you might guess, Dockerfile inside `dev` directory is for local development inside container, and Dockerfile inside `prod` directory is for production deployment.

The differences between these two Dockerfiles are not significant, they differ in the environment variables and the packages installed in the final image.

To take dockerizing Rails to the next level, I've introduced [devcontainers](https://code.visualstudio.com/docs/devcontainers/containers) from VS Code.

Using a config saved in the root of the project under `.devcontainer/devcontainer.json`, I can "Reopen in container" my current project. All extensions specified in the config are automatically installed, and my working environment for development is more portable than before.

I'm still using Docker Compose, but only for local development purposes.

Probably in the near future, when I see these files again, I'll catch myself shaking my head, how many errors I made again. Learning is a never-ending process :)

---

Let's get to improved files:

`Dockerfile` for local development:
```dockerfile
# Dockerfile for local development.

# Default Ruby version for this project.
ARG RUBY_VERSION=3.1.0

# Base image
FROM ruby:$RUBY_VERSION-alpine AS base

# Set environment variables for the username,
# app directory, and the language.
ENV USER app
ENV APP_DIR /app

# Set env variables for dev
ENV BUNDLER_VERSION 2.3.3
ENV GEM_HOME=/usr/local/bundle
ENV BUNDLE_PATH=$GEM_HOME
ENV BUNDLE_APP_CONFIG=$BUNDLE_PATH
ENV BUNDLE_JOBS 4
ENV BUNDLE_RETRY 3
ENV RAILS_ENV development
ENV RACK_ENV development
ENV PATH=/app/bin:$PATH
ENV LANG C.UTF-8

# Add PostgreSQL, timezone libraries,
# and git for development.
RUN apk add --no-cache --update \
      libpq-dev \
      tzdata \
      git \
    && rm -rf /var/cache/apk/*

# Start building a new image called "dependencies"
# from the "base" image.
FROM base AS dependencies

# Add libraries required for installing gems.
RUN apk add --no-cache  --update \
      build-base \
    && rm -rf /var/cache/apk/*

# Copy the Gemfile and Gemfile.lock
# files to the current directory.
COPY Gemfile Gemfile.lock ./

# Install bundler with specified version.
RUN gem install bundler -v $BUNDLER_VERSION

# "frozen" option means that the exact versions of gems
# specified in the Gemfile.lock file will be used,
# and any updates to those gems will be ignored.
#
# Install gems with ENV options from above,
# remove unnecessary files from gems.
RUN bundle config --global frozen 1 && \
    bundle install && \
    rm -rf $BUNDLE_PATH/cache/*.gem && \
    rm -rf $BUNDLE_PATH/ruby/*/cache && \
    find $BUNDLE_PATH/gems/ -name "*.c" -delete && \
    find $BUNDLE_PATH/gems/ -name "*.o" -delete

# Start building a new image from the "base" image.
FROM base

# Copy entrypoint, make it executable.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Add new user in the system.
RUN adduser -D $USER

# Create directory for rails application,
# set user as the owner.
RUN mkdir -p $APP_DIR && \
    chown $USER $APP_DIR

# Set the working directory to the app directory.
WORKDIR $APP_DIR

# Switch from root to specified user.
USER $USER

# Copy the bundle directory from the "dependencies"
# image and copy all files to the current directory,
# setting the ownership to the specified user.
COPY --from=dependencies $BUNDLE_PATH $BUNDLE_PATH
COPY --chown=$USER . ./

# Expose port 3000 for the application.
EXPOSE 3000

# Run the command to start the Rails server.
CMD ["rails", "s", "-b", "0.0.0.0"]

```

`Dockerfile` for production:
```dockerfile
# Dockerfile for production enviroment.

# Default Ruby version for this project.
ARG RUBY_VERSION=3.1.0

# Base image
FROM ruby:$RUBY_VERSION-alpine AS base

# Set environment variables for the username,
# app directory, and the language.
ENV USER app
ENV APP_DIR /app

# Set env variables for production.
ENV BUNDLER_VERSION 2.3.3
ENV GEM_HOME=/usr/local/bundle
ENV BUNDLE_PATH=$GEM_HOME
ENV BUNDLE_APP_CONFIG=$BUNDLE_PATH
ENV BUNDLE_JOBS 4
ENV BUNDLE_RETRY 3
ENV BUNDLE_WITHOUT development:test
ENV BUNDLE_CACHE_ALL true
ENV RACK_ENV production
ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT=true
ENV PATH=/app/bin:$PATH
ENV LANG C.UTF-8

# Add PostgreSQL and timezone libraries.
RUN apk add --no-cache --update \
      libpq-dev \
      tzdata \
    && rm -rf /var/cache/apk/*

# Start building a new image called "dependencies"
# from the "base" image.
FROM base AS dependencies

# Add libraries required for installing gems.
RUN apk add --no-cache  --update \
    build-base \
    git && \
    rm -rf /var/cache/apk/*

# Copy the Gemfile and Gemfile.lock
# files to the current directory.
COPY Gemfile Gemfile.lock ./

# Install bundler with specified version.
RUN gem install bundler -v $BUNDLER_VERSION

# "frozen" option means that the exact versions of gems
# specified in the Gemfile.lock file will be used,
# and any updates to those gems will be ignored.
#
# Install gems with ENV options from above,
# remove unnecessary files from gems.
RUN bundle config --global frozen 1 && \
    bundle install && \
    rm -rf $BUNDLE_PATH/cache/*.gem && \
    rm -rf $BUNDLE_PATH/ruby/*/cache && \
    find $BUNDLE_PATH/gems/ -name "*.c" -delete && \
    find $BUNDLE_PATH/gems/ -name "*.o" -delete

# There should be albo something like rails precomplie assets,
# but I don't know whether it's important in API only project.

# Start building a new image from the "base" image.
FROM base

# Copy entrypoint, make it executable.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Add new user in the system.
RUN adduser -D $USER

# Create directory for rails application,
# set user as the owner.
RUN mkdir -p $APP_DIR && \
    chown $USER $APP_DIR

# Set the working directory to the app directory.
WORKDIR $APP_DIR

# Switch from root to specified user.
USER $USER

# Copy the bundle directory from the "dependencies"
# image and copy all files to the current directory,
# setting the ownership to the specified user.
COPY --from=dependencies $BUNDLE_PATH $BUNDLE_PATH
COPY --chown=$USER . ./

# Expose port 3000 for the application.
EXPOSE 3000

# Run the command to start the Rails server.
CMD ["rails", "s", "-b", "0.0.0.0"]
```

Here's a small note regarding the use of devcontainers in VS Code. 

To make it work properly, I recommend opening external terminal, executing `docker compose up` inside it, to see, what's going on inside of our app.

The next step is to open project root directory in visual studio code, then by pressing `F1`, `CTRL + P`, or by clicking remote icon in bottom left corner, select **"Reopen in Container"**.

We can also get into container by selecting "Attach to running container", but then our `.devcontainer.json` file won't load.

  `.devcontainer/devcontainer.json` - devcontainer settings:
```json
{
  "name": "Rails Appp",
  
  // service must have the same name as in docker-compose.yml
  "dockerComposeFile": ["../docker-compose.yml"],
  "service": "web",

  "workspaceFolder": "/app",

  "extensions": [
    // Docker
    "ms-azuretools.vscode-docker",
    // GitLens
    "eamodio.gitlens",
    // Ruby
    "rebornix.ruby",
    // Ruby snippets
    "wingrunr21.vscode-ruby",
    // Rubocop
    "misogi.ruby-rubocop",
    // Auto close do..end
    "kaiwood.endwise",
    // Schema autocompletion
    "aki77.rails-db-schema",
    // GitHub Copilot
    "github.copilot",
    // GitHub pull requests
    "github.vscode-pull-request-github",
    // Markdown preview
    "yzhang.markdown-all-in-one",
    // GitHub markdown preview
    "bierner.markdown-preview-github-styles"
  ],

  "remoteUser": "app"
}
```

`docker-compose.yml`
```yml
version: '3'

services:
  db:
    image: postgres:13
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    env_file:
      - ".env"
    networks:
      dev_network:
  web:
    build:
      context: ./
      dockerfile: ./docker/dev/Dockerfile
    volumes:
      - ./:/app
    ports:
      - "3000:3000"
    depends_on:
      - db
    env_file:
      - ".env"
    networks:
      dev_network:

volumes:
  pgdata:

networks:
  dev_network:
```

---

Summarizing this post, advice to myself in the future is - spend more time analyzing performance 