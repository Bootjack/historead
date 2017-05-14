## 2017-05-13 22:36
JRH

Throughout the past week, I've been building a simple React frontend. It shows a list of events and has form to query by start and end dates, which updates the list. There's a second form that allows the creation of new events, given a name, start, and end date. I grabbed an icon font from Fontello, which was pretty handy. In order to get webpack to resolve the imported CSS from Fontello, I did have to make a configuration change, adding the `file-loader` plugin like so

    module: {
      rules: [{
        // *other rules*
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }]
    },

The backend now has an `/api/events/:id` delete endpoint, which only serves to highlight the need for some sort of layer in between the API server and the database. Ideally, it would take some sort of consensus from multiple users before an event is actually deleted. Moving ahead with modifying, tagging, and grouping events will make this increasingly necessary.

In the React application, I challenged myself to better understand the problem that a flux data store like Redux solves, and so I avoided using any existing library for that concern. Instead, I introduced the concept of connectors that manage subscriptions to different sets of data and also expose methods to alter those datasets by sending requests to the backend. I'm pretty pleased with the pattern I came up with. The `connectEvents` function will wrap any React component and provide it with an `events` property that will update any time new events are fetched from the connector. To support multiple simultaneous collections of events from the same connector, there is also a `channel` argument provided when a component subscribes. Otherwise, it would be impossible to show two separate lists of events side-by-side to compare two different categories (like, historical events next to episodes of a TV show).

### Next Up
Add a layer between the API server and the database, probably Redis, that aggregates requests and only proceeds with altering records once multiple users have expressed agreement. That deserves some more design thought. A similar Redis layer (or the same one) could also serve to queue all requests regardless of validation, so that event create requests couldn't unduly bog down the database itself.

Olivia has mentioned that she imagines most users wanting to start at a simple search box that can query events by topic or keyword and suggest books and shows from a similar time period. So, that means getting search with auto-complete up and running.

And of course, tagging. That's the next really juicy set of feature work.

Further along, we also need to dig in to the whole side-by-side display thing I just mentioned. Displaying this information in a smart layout will take quite a few attempts, I think.

---

## 2017-05-04 23:15
JRH

Well, that went pretty well. The database is now switched over to Postgres and has appropriate constraints to enforce data integrity for events. I only hit two minor hiccups.

First, similar to initially setting up Sequelize, where the dialects `mysql` and `mariadb` were not synonymous even though some documentation implied they were, the meager Knex documentation on its connection configuration includes `client: 'pg'` but I had to guess that it really required `client: 'postgresql'` in order to successfully connect. The only error message I got when it wouldn't was the cryptic warning `calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.`

Second, the whole motivation for switching to Postgres was its support for check constraints and for a while it looked like Knex didn't support them. And it kind of doesn't. There's no way to add `table.raw()` inside of a `createTable` callback, so what I ended up doing was chaining a completely separate `ALTER TABLE` query onto the `createTable` promise. It goes a little something like this:

    return knex.schema.createTable('events', function (table) {
      table.increments('id');
      table.varchar('name', 255).notNullable();
      // *snip*
      table.index('end');
    }).then(knex.raw(`ALTER TABLE events ADD CHECK (name <> '')`));

### Next Up
The backend service is currently configured so that whenever it starts it runs pending migrations and then re-seeds the database, which is pretty handy for development. Figuring out some environment configuration should definitely come soon. That goes for connection details like Postgres credentials, too.

There's also some design work to be done on in-memory caching, something like a Redis caching layer, and/or a Redis queue for database transactions. Anything to remove the pattern of querying the database for every incoming HTTP request on the API.

Also tucked away in those decisions is some thought in how to balance validating user-generated content in a community-centric, crowd-sourced sort of way. If this app ever grows beyond a hobby experiment, that kind of thing could make or break it.

And lastly, it's going to be time soon for some rudimentary UI. That will be fun and a good chance to add another layer to the docker stack (a simple apache/nginx server with static front-end assets). But really, I just want to alleviate poking the app via `curl` all the time, novel though it may be.

Oh man, one more thing. I just realized that the only `events` column I left nullable is the `end` date, because some events occur on only one date and so we can assume their start and end values are the same. But rather than apply that assumption in the application code, why not apply at insertion using a calculated `DEFAULT` clause? I'm not sure exactly how to write that, but Postgres must support it.

---

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
