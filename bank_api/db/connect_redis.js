import redis from 'redis';

const redis_client = redis.createClient();

function connect_redis() {
    redis_client.on('error', (error) => console.log(`Error: ${error}`));

    return redis_client.connect()
        .then((res) => {
            console.log("Successfully connect to Redis.");
        })
        .catch((err) => {
            console.error(`Redis connection error: ${err}`);
        });
}

const redis_connect = {
    redis_client,
    connect_redis
}

export default redis_connect;