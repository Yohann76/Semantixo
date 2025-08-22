// Worker Bull - PROCESSING ONLY selon les bonnes pratiques
const Queue = require('bull');
const mongoose = require('mongoose');
const { bullRedisConfig } = require('../../../config/redis');



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
    

    
    // Créer queue SEULEMENT pour processing
    const textAnalysisQueue = new Queue('text analysis', redisConfig);

    
    const KeywordAnalysisJobProcessor = require('./KeywordAnalysisJob');
    const KeywordPositionJobProcessor = require('./KeywordPositionJob');
    const ContentLengthJobProcessor = require('./ContentLengthJob');
    const ReadabilityJobProcessor = require('./ReadabilityJob');
    const UniquenessJobProcessor = require('./UniquenessJob');
    

    
    textAnalysisQueue.process('keyword-analysis', 2, async (job) => {

      const result = await KeywordAnalysisJobProcessor.process(job);

      return result;
    });
    
    textAnalysisQueue.process('keyword-position', 2, async (job) => {

      const result = await KeywordPositionJobProcessor.process(job);

      return result;
    });
    
    textAnalysisQueue.process('content-length', 3, async (job) => {

      const result = await ContentLengthJobProcessor.process(job);

      return result;
    });
    
    textAnalysisQueue.process('readability', 2, async (job) => {

      const result = await ReadabilityJobProcessor.process(job);

      return result;
    });
    
    textAnalysisQueue.process('uniqueness', 1, async (job) => {

      const result = await UniquenessJobProcessor.process(job);

      return result;
    });
    

    
    // Événements Bull pour tracking
    textAnalysisQueue.on('completed', (job, result) => {

    });
    
    textAnalysisQueue.on('failed', (job, err) => {
      console.error(`💥 [WORKER] Job ${job.name} ID:${job.id} ÉCHOUÉ: ${err.message}`);
    });
    
    textAnalysisQueue.on('active', (job) => {

    });
    

    
    // Stats periodiques
    setInterval(async () => {
      try {
        const stats = await textAnalysisQueue.getJobCounts();

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