import { Redis } from '@upstash/redis';

// Only initialize if the environment variables are present, 
// otherwise we can return null to allow the app to work without Redis
const initRedis = () => {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    console.warn("Redis credentials not found. Caching will be disabled.");
    return null;
};

const redis = initRedis();

export default redis;
