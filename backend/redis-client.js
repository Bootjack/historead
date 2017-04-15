const Redis = require('ioredis');
const REDIS_ADDR = process.env.REDIS_PORT_6379_TCP_ADDR;
module.exports = new Redis({host: REDIS_ADDR, port: 6379});

