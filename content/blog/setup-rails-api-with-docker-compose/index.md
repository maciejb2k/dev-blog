---
title: Setup Rails API with Docker Compose
date: 2022-11-03
description: How to setup new Rails 7 API project with Postgers 13 inside Docker containers.
thumbnail: "./thumbnail.jpg"
readTime: "5"
---

The most important thing when dealing with Rails is to use Linux, it's a must! Also keep in mind that installing Rails is tricky and sometimes it can drive you crazy. Lets get straight into configuration.

If you are ready, open terminal and type the following commands:
```bash
mkdir <project-name>
cd <project-name>

touch Dockerfile
touch entrypoint.sh
touch docker-compose.yml
touch .dockerignore
touch .env
touch Gemfile
touch Gemfile.lock
```

Files listed below should have the following content:

`.env`
```
RUBY_VERSION=3.1.0

RAILS_USER=rails-user

GEM_HOME=/home/${RAILS_USER}/.gem/${RUBY_VERSION}

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
```

`docker-compose.yml`
```yml
version: "3"

services:
  db:
    image: postgres:13
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    env_file:
      - ".env"
  rails:
    build:
      context: .
      args:
        - RUBY_VERSION=$RUBY_VERSION
        - RAILS_USER=$RAILS_USER
        - GEM_HOME=$GEM_HOME
    volumes:
      - .:/app
      - gems:$GEM_HOME
    ports:
      - "3000:3000"
    command: rails server -p 3000 -b '0.0.0.0'
    depends_on:
      - db
    env_file:
      - ".env"

volumes:
  pgdata:
  gems:
```

`Dockerfile`
```dockerfile
ARG RUBY_VERSION

FROM ruby:$RUBY_VERSION-alpine

ARG RAILS_USER
ENV RAILS_ROOT /app

ARG GEM_HOME

ENV LANG C.UTF-8

RUN apk add --update --no-cache \
  build-base \
  postgresql-dev \
  tzdata \
  sudo \
  git

RUN adduser -D $RAILS_USER

RUN mkdir -p $RAILS_ROOT \
    chown $RAILS_USER $RAILS_ROOT

WORKDIR $RAILS_ROOT

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

USER $RAILS_USER

COPY --chown=$RAILS_USER Gemfile Gemfile.lock ./

RUN echo "gem: --user-install --env-shebang --no-rdoc --no-ri" > /home/$RAILS_USER/.gemrc
ENV GEM_HOME $GEM_HOME
ENV PATH $GEM_HOME/bin:$PATH

RUN bundle install

COPY --chown=$RAILS_USER . .

EXPOSE 3000
```

`entrypoint.sh`
```bash
#!/bin/sh
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f $RAILS_ROOT/tmp/pids/server.pid

exec "$@"
```

`Gemfile.lock` - should be empty

`Gemfile`
```ruby
source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

gem "rails", "~> 7.0.3"
```

I assume you've already installed Docker on your machine ([use docker command without prefacing with sudo every time](https://docs.docker.com/engine/install/linux-postinstall/)).

Now, let's build docker image. Run the following command:
```bash
docker compose build
```

**You should only type this one command below if you are setting up project for first time!**

It creates new Rails API project inside container and installs it:
```bash
docker compose run --rm rails rails new . --force --api --database=postgresql --skip-test --skip-spring --skip-coffee
```

If installation went fine, we can move on to configuring database inside Rails project. Edit that code fragment inside Rails project in `config/database.yml`:
```yml
default: &default
  adapter: postgresql
  encoding: unicode
  host: <%= ENV['POSTGRES_HOST'] %>
  port: <%= ENV['POSTGRES_PORT'] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: <%= ENV['POSTGRES_USERNAME'] %>
  password: <%= ENV['POSTGRES_PASSWORD'] %>
```

Now run both Postgres and Rails using docker compose:
``` bash
docker compose up
```

Application isn't working yet, because we have to setup database and apply migrations. To access Rails container type in terminal:
```bash
docker compose exec rails sh
```

When we have direct access to `rails` executable, type:
```
rails db:setup
```

If everyting works, you are ready to start working on your project.
