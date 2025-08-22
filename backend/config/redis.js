const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

console.log('🔍 [REDIS CONFIG] Variables d\'environnement:');
console.log('  REDIS_HOST:', process.env.REDIS_HOST);
console.log('  REDIS_PORT:', process.env.REDIS_PORT);
console.log('  Résolu host:', redisHost);
console.log('  Résolu port:', redisPort);

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

console.log('📡 [REDIS CONFIG] Configuration Bull finale:', {
  host: bullRedisConfig.host,
  port: bullRedisConfig.port
});

module.exports = { bullRedisConfig };