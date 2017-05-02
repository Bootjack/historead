## 2017-05-01 23:57
JRH

I worked out a development process with less overhead, using `docker-compose` to avoid having to create a local swarm and keep redeploying via the stack after rebuilding the image. The key to this was adding a volume to the backend service as

    volumes:
      - ./backend/src:/usr/app/src

so that local code changes would be available to the container immediately. I had to specify the `src` directory (and reshuffle some files there) because I needed to exclude `node_modules` or else `require`s would fail altogether. I assume `npm install` needs some symlinks to remain intact or something. On the plus side, there's no need to install node modules locally. So updating after local backend file changes is now down to one command, `docker-compose restart backend`.


Additionally, I now have some server-side code to create a table using `knex`, a SQL query builder that I'm currently favoring over `sequelize` because the latter is specifically an ORM. I'd like to keep everything in this project as functional as I can, and introducing ORM seems antithetical to that.

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
