---
title: Docker commands overview
date: 2022-11-07
description: Quick overview of useful docker commands with brief explanations.
thumbnail: "./thumbnail.jpg"
readTime: "4"
---

To avoid typing `sudo` every time before executing `docker` command, it's recommended to [configure this](https://docs.docker.com/engine/install/linux-postinstall/).

## Commands overview

### `docker`
- **`docker --version`** - shows docker version.

### `docker login`
- **`docker login`** - singns in to Docker Hub.

### `docker pull`
- **`docker pull <image>`** - pulls image from Docker Hub.

### `docker push`
- **`docker push <image>`** - pushes images to Docker Hub.

### `docker build`
- **`docker build <container>`** - builds container from image.

### `docker run`
- **`docker run <container>`** - creates new independent container from image and runs it.
- **`docker run --name <name>`** - sets name of container, otherwise Docker will provide random name for created container.
- **`docker run -p <dest>:<src>`** - publishes container ports to public.
- **`docker run -e NAME1=value1 -e NAME2=value2`** - sets enviroment variables.
- **`docker run -d`** - runs container in background.
- **`docker run --rm`** - removes the container when it exits.

### `docker exec`
- **`docker exec <container> <command>`** - runs command inside existing and running container.

### `docker rename`
- **`docker rename <old_name> <new_name>`** - renames container.

### `docker start`
- **`docker start <container>`** - starts existing container by name or id.

### `docker stop`
- **`docker stop <container>`** - stops existing container by name or id.

### `docker kill`
- **`docker kill <container>`** - `docker stop` waits until container stops and `docker kill` immediately kills the container.

### `docker restart`
- **`docker restart <container>`** - restarts container by name or id.

### `docker system`
- **`docker system df`** - shows information about disk space used.
- **`docker system prune -af `** - removes everything (unused containers, networks, images, volumes etc.)

### `docker ps`
- **`docker ps`** - shows running containers.
- **`docker ps -a`** - shows all running and stopped containers.

### `docker rm`
- **`docker rm <container>`** - removes container by name or id.

### `docker rmi`
- **`docker rmi <image>`** - removes image by name or id.
- **`docker rmi $(docker images -f "dangling=true" -q)`** - when new image is build (e.g. by making changes in Dockerfile), old ones stays untagged (dangled) and this command clears these images.

### `docker container`
- **`docker container ls`** - lists running containers.
- **`docker container ls -a`** - lists all containers.
- **`docker container prune`** - removes all stopped containers.

### `docker images`
- **`docker images`** - lists all images.
- **`docker images -f “dangling=true” -q`** - lists untagged images.

### `docker logs`
- **`docker logs <contanier>`** - show logs of container by id or name. Useful when container crashes or doesn't start.

### `docker stats`
- **`docker stats`** - shows live statistics of containers resources usage.

### `docker commit`
- **`docker commit <conatainer> <image-name>`** - creates a new image of edited container.

### `docker compose`
- **`docker compose build`** - builds containers from `docker-compose.yml` file.
- **`docker compose exec <container-name> <command>`** - run command in existing and running container. For example we can access container shell by typing `docker compose exec web sh`.
- **`docker compose run --rm <container-name> <command>`** - creates new independet container and removes it when it exits. Useful when `docker compose up` fails, because for example some gems are not installed, and executing `docker compose run --rm web bundle install` will solve the problem.
- **`docker compose up`** - starts all containers listed in `docker-compose.yml` file.
- **`docker compose -d up`** - starts all containers in background.
- **`docker compose down`** - stops all running containers listed in `docker-compose.yml` file.

## Example use case of Docker

Example of setting up PostgreSQL and pgAdmin for quick demonstration.

```bash
# Pull images from docker hub
docker pull dpage/pgadmin4
docker pull postgres:13

# Show images and running containers
docker images
docker ps

# Run contanier with PostgreSQL
docker run --name postgres --rm -p 5433:5432 -e POSTGRES_PASSWORD=password -d postgres:13

# Enter postgres container
docker exec -it postgres bash

# Create database inside postgres container
su postgres            # default ident authentication
psql                   # enter postgres
\conninfo              # show connection info
\l                     # list databases
CREATE DATABASE test;  # create database
\l                     # list databases
\q                     # quit psql

# Run container with pgAdmin4
docker run --rm --name pgadmin -p 80:80 -e PGADMIN_DEFAULT_EMAIL=email@example.com -e PGADMIN_DEFAULT_PASSWORD=password -d dpage/pgadmin4

# Show running containers
docker ps

# PostgreSQL address and password for pgAdmin4:
# Host: host.docker.internal
# Port: 5433
# Username: postgres
# Password: password
```
