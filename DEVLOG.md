## 2017-05-04 02:27
JRH

I know, I know. I should be asleep. But I got a whole bunch done. I added migrations and seeds for the MariaDB database using Knex and it was relatively painless. Knex is no help when it comes to actually writing the migrations, and their seed function stub steers you right into the brick wall of nested promise hell. But I'm pretty smart, so I figured it all out.

I also completely refactored the backend server to break up the routing into modular `express.Router()`s. That started because I wanted to validate that the database had run all its migrations before starting the server, which introduced some asynchronous behavior and made it a little more awkward to pass the database connection around. I think it worked out pretty well.

## Next Up
It looks like the smart move is to swap out MariaDB in favor of Postgres so that we can do more data integrity in the database with `CHECK` constraints, which MySQL does not support.

Make a decision on whether to move the migrations and/or seeds to the database service. It's been relatively straightforward to check and run migrations when the api server starts up, but I'm not sure whether that makes sense. I'd also like to do something like re-seeding the database when starting in a dev environment. That likely means sorting out how docker data volumes can be used for seeding from known states, with consideration for how that might work for recovering from backup in a production scenario.

Lastly, I need to validate how portable this actually is. I expect it to work pretty painlessly anywhere docker is available, but that remains untested.

---

## 2017-05-03 19:54
JRH

Today I learned that Moment supports dates with years between `-271820` and `275760`. MariaDB supports `DATE` values between `1000-01-01` and `9999-12-31`. So the plan is to store events with start and end dates and also a year offset to allow for dates that span all of human history and presumably all science fiction. In the rare event we need to represent a work of fiction set beyond the date range supported by Moment, we still have options given that with `INT UNSIGNED` our year offset supports 4 billion years `-2147483648` to `2147483647`.

---

## 2017-05-02 23:04
JRH

I focussed on using Knex to build the `events` table correctly and then writing `SELECT` and `INSERT` queries with it in the API.

I also brought in the javascript library Moment to aid in date manipulation so that the API endpoint can fetch a range of dates with flexible date format support. Basically, I got tired of having to use YYYY-MM-DD dates all the time while testing out the API, especially since it involved a lot of `curl`ing.

The current state of the API is encouraging, even considering how rudimentary its functionality is. The only thing that bugs me is I don't know exactly why the event dates in the response are full ISO strings; that could be from MariaDB, Knex, or Express. I think it's what I want, ultimately since it's easy for clients to consume as simple javascript `Date`s.

### Next Up
Knex appears to have pretty good support for database migrations, with CLI tools similar to `rake`. Figure out how to use them and then how to integrate them into a docker workflow so that it remains easy to recover to a known state when the database inevitably becomes corrupted.

---

## 2017-05-01 23:57
JRH

I worked out a development process with less overhead, using `docker-compose` to avoid having to create a local swarm and keep redeploying via the stack after rebuilding the image. The key to this was adding a volume to the backend service as

    volumes:
      - ./backend/src:/usr/app/src

so that local code changes would be available to the container immediately. I had to specify the `src` directory (and reshuffle some files there) because I needed to exclude `node_modules` or else `require`s would fail altogether. I assume `npm install` needs some symlinks to remain intact or something. On the plus side, there's no need to install node modules locally. So updating after local backend file changes is now down to one command, `docker-compose restart backend`.


Additionally, I now have some server-side code to create a table using `knex`, a SQL query builder that I'm currently favoring over `sequelize` because the latter is specifically an ORM. I'd like to keep everything in this project as faithful to functional programming as I can, and introducing ORM seems antithetical to that.

### Next Up
Get the REST API to read and write. Also, do figure out migrations because I bet that will become relevant real soon. And bonus points for automating updates to the running container on every local file change.

---

## 2017-05-01 00:51
JRH

I paired with Kent for most of the day. Progress was frustratingly slow, but I felt like I learned a little bit more about how docker works as I cleared each tiny hurdle. By the end, I now have a running mariadb database on a docker stack that I can connect to from another container using `sequelize`.

### Lessons Learned
1. Docker volumes hang around and are aggressively reused. I created one via `docker-compose.yml` and later changed the environment variables in the compose file, but the changes never loaded because docker was reusing the original volume. After stopping the containers using the volume and then deleting it, the default `mysql` user, password, and database were all created as expected.

2. I painstakingly verified that I could connect to the container within the docker stack (via `ping db`, where `db` was the service name as defined in the compose file). I also verified that the mysql database was set up correctly by running `docker exec -it <db_container_id> bash` and then running `mysql` directly on the container with the user/password combinations expected and confirming the expected result from `SHOW DATABASES;`.

3. This isolated the final connection issue as a problem with the npm module `sequelize` used to connect to the database container from a node container. After finally stumbling upon slightly newer docs that clarified the correct npm module to use as a mysql adapter, and that _there is a separate dialect for mariadb_, I finally had the magic sauce to get `sequelize` to connect successfully:

    `new Sequelize('mariadb://user:pass@db_service/db_name');`

### Next Up
Use `sequelize` to define some table schemas and get the rudimentary REST API to read and write to them. Bonus points for figuring out how to manage a docker volume as a fixed set of immutable test data. Also, how to use them to handle migrations as the database schema evolves.
