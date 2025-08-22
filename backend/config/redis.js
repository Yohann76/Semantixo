const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const bullRedisConfig = {
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 60000,
  commandTimeout: 30000,
  retryDelayOnFailover: 100,
  family: 4,
  keepAlive: true,
  db: 0
};

module.exports = { bullRedisConfig };