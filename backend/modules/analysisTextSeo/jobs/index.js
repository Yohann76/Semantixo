// Module de CRÉATION de jobs uniquement - Backend mode
const Queue = require('bull');
const { bullRedisConfig } = require('../../../config/redis');

console.log('🔧 [JOBS] Backend - Module création jobs uniquement');

// add only
const redisConfig = {
  redis: {
    port: bullRedisConfig.port,
    host: bullRedisConfig.host,
    maxRetriesPerRequest: null
  }
};

console.log('📡 [JOBS] Configuration Redis:', redisConfig);
const textAnalysisQueue = new Queue('text analysis', redisConfig);
console.log('✅ [JOBS] Queue backend créée - ADD ONLY');

async function testConnection() {
  try {
    const test = await textAnalysisQueue.add('connection-test', { test: true });
    console.log(`✅ [JOBS] Redis OK - Test: ${test.id}`);
    return true;
  } catch (error) {
    console.error(`❌ [JOBS] Redis KO: ${error.message}`);
    throw error;
  }
}

// Fonction SIMPLE pour créer des jobs
async function startTextAnalysis(analysisId, text, keywords) {
  console.log(`🚀 [JOBS] Création jobs pour analyse ${analysisId}`);
  
  const jobTypes = ['keyword-analysis', 'keyword-position', 'content-length', 'readability', 'uniqueness'];
  const jobs = [];
  
  try {
    // Test connexion rapide
    await testConnection();
    
    // Créer chaque job
    for (const jobType of jobTypes) {
      const job = await textAnalysisQueue.add(jobType, {
        analysisId,
        text,
        keywords
      }, {
        removeOnComplete: false,
        removeOnFail: false
      });
      
      jobs.push({ id: job.id, name: jobType, status: 'queued' });
      console.log(`✅ [JOBS] ${jobType} créé: ID ${job.id}`);
    }
    
    console.log(`🎯 [JOBS] ${jobs.length} jobs ajoutés à la queue`);
    return { success: true, jobs };
    
  } catch (error) {
    console.error(`❌ [JOBS] Erreur:`, error.message);
    throw error;
  }
}

module.exports = {
  startTextAnalysis,
  queue: textAnalysisQueue
};