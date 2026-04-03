const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false
    }
});

redisClient.on('error', (err) => console.log('Redis Error:', err));

redisClient.connect()
    .then(() => console.log("Redis Connected!"))
    .catch((err) => console.log("Redis failed to connect:", err));

module.exports = redisClient;