docker stop listeral-redis
docker rm listeral-redis

docker build -t listeral-backend ./backend/

docker run --volumes-from listeral-data --name listeral-redis -d redis redis-server --appendonly yes
docker run -P --link listeral-redis:redis listeral-backend

