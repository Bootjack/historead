# Historead
A timeline of historical and fictional events.

This is mostly a learning exercise to get to know Docker and play with some different technologies. The concept for the app is the kind of thing that happens when your spouse is a writer and an anglophile.

## Dockerized
This application is organized into a collection of microservices. Well, services at any rate; size is subjective. Each service is set up to be built into a Docker container and coordinated via the top-level `docker-compose.yml` file.

    $ docker-compose up -d

> Note: There will be some warnings about the deploy key only being used in swarm mode. Still trying to figure out how to support swarm mode without running everything through docker.com.

With a little luck, the app now should be available on [localhost:8000](http://localhost:8000).

## The Stack
These are the services described in `docker-compose.yml`. See the `README.md` in each service directory for more information.

1. `db` a plain old Postgres image
2. `backend` [an Express server providing the REST API](./backend/README.md)
3. `frontend` [a React single page app](./frontend/README.md)
4. `visualizer` a Docker swarm dashboard (not really used)
5. `proxy` [an Nginx static file server and proxy server](./proxy/README.md)
