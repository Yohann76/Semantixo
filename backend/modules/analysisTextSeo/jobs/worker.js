// Worker Bull - PROCESSING ONLY selon les bonnes pratiques
const Queue = require('bull');
const mongoose = require('mongoose');
const { bullRedisConfig } = require('../../../config/redis');

console.log('🚀 [WORKER] Démarrage - PROCESSING MODE');

async function connectMongoDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/semantixo';
      await mongoose.connect(mongoUri);
      console.log('✅ [WORKER] MongoDB connecté');
    } else {
      console.log('✅ [WORKER] MongoDB déjà connecté');
    }
  } catch (error) {
    console.error('❌ [WORKER] Erreur MongoDB:', error.message);
    throw error;
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 [WORKER] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 [WORKER] Uncaught Exception:', error);
});

async function startWorker() {
  try {

    await connectMongoDB();
  
    const redisConfig = {
      redis: {
        port: bullRedisConfig.port,
        host: bullRedisConfig.host,
        maxRetriesPerRequest: null
      }
    };
    
    console.log('📡 [WORKER] Configuration Redis:', redisConfig);
    
    // Créer queue SEULEMENT pour processing
    const textAnalysisQueue = new Queue('text analysis', redisConfig);
    console.log('✅ [WORKER] Queue worker créée - PROCESS ONLY');
    
    const KeywordAnalysisJob = require('./KeywordAnalysisJob');
    const KeywordPositionJob = require('./KeywordPositionJob');
    const ContentLengthJob = require('./ContentLengthJob');
    const ReadabilityJob = require('./ReadabilityJob');
    const UniquenessJob = require('./UniquenessJob');
    
    console.log('📦 [WORKER] Classes de jobs importées');
    
    textAnalysisQueue.process('keyword-analysis', 2, async (job) => {
      console.log(`🚀 [WORKER] START keyword-analysis ID:${job.id} pour ${job.data.analysisId}`);
      const result = await KeywordAnalysisJob.process(job);
      console.log(`✅ [WORKER] DONE keyword-analysis ID:${job.id}`);
      return result;
    });
    
    textAnalysisQueue.process('keyword-position', 2, async (job) => {
      console.log(`🚀 [WORKER] START keyword-position ID:${job.id} pour ${job.data.analysisId}`);
      const result = await KeywordPositionJob.process(job);
      console.log(`✅ [WORKER] DONE keyword-position ID:${job.id}`);
      return result;
    });
    
    textAnalysisQueue.process('content-length', 3, async (job) => {
      console.log(`🚀 [WORKER] START content-length ID:${job.id} pour ${job.data.analysisId}`);
      const result = await ContentLengthJob.process(job);
      console.log(`✅ [WORKER] DONE content-length ID:${job.id}`);
      return result;
    });
    
    textAnalysisQueue.process('readability', 2, async (job) => {
      console.log(`🚀 [WORKER] START readability ID:${job.id} pour ${job.data.analysisId}`);
      const result = await ReadabilityJob.process(job);
      console.log(`✅ [WORKER] DONE readability ID:${job.id}`);
      return result;
    });
    
    textAnalysisQueue.process('uniqueness', 1, async (job) => {
      console.log(`🚀 [WORKER] START uniqueness ID:${job.id} pour ${job.data.analysisId}`);
      const result = await UniquenessJob.process(job);
      console.log(`✅ [WORKER] DONE uniqueness ID:${job.id}`);
      return result;
    });
    
    console.log('✅ [WORKER] Tous les processeurs enregistrés');
    
    // Événements Bull pour tracking
    textAnalysisQueue.on('completed', (job, result) => {
      console.log(`🎉 [WORKER] Job ${job.name} ID:${job.id} TERMINÉ`);
    });
    
    textAnalysisQueue.on('failed', (job, err) => {
      console.error(`💥 [WORKER] Job ${job.name} ID:${job.id} ÉCHOUÉ: ${err.message}`);
    });
    
    textAnalysisQueue.on('active', (job) => {
      console.log(`⚡ [WORKER] Job ${job.name} ID:${job.id} ACTIF`);
    });
    
    console.log('🎯 [WORKER] Worker prêt - Bull traite automatiquement !');
    
    // Stats periodiques
    setInterval(async () => {
      try {
        const stats = await textAnalysisQueue.getJobCounts();
        console.log(`📊 [WORKER] Stats: ${stats.waiting} attente, ${stats.active} actifs, ${stats.completed} terminés, ${stats.failed} échoués`);
      } catch (error) {
        console.error('❌ [WORKER] Erreur stats:', error.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('💥 [WORKER] Erreur fatale:', error);
    process.exit(1);
  }
}

// Start worker
startWorker();