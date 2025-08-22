const { AnalysisTextSeo, KeywordAnalysisJob, KeywordPositionJob, ContentLengthJob, ReadabilityJob, UniquenessJob } = require('../models');

class AnalysisAggregationService {
  
  // Mapping des types de jobs vers leurs modèles
  static jobModels = {
    'keyword-analysis': KeywordAnalysisJob,
    'keyword-position': KeywordPositionJob,
    'content-length': ContentLengthJob,
    'readability': ReadabilityJob,
    'uniqueness': UniquenessJob
  };

  /**
   * Obtenir une vue d'ensemble rapide d'une analyse
   * @param {string} analysisId 
   * @param {string} userId 
   * @returns {object} Vue d'ensemble avec résumé des jobs
   */
  static async getAnalysisOverview(analysisId, userId) {
    const analysis = await AnalysisTextSeo.findOne({ 
      _id: analysisId, 
      user_id: userId 
    });

    if (!analysis) {
      throw new Error('Analyse non trouvée');
    }

    // Récupérer le résumé de tous les jobs
    const jobsSummary = await this._getJobsSummary(analysisId);
    
    return {
      id: analysis._id,
      user_id: analysis.user_id,
      status: analysis.status,
      scoreSeo: analysis.scoreSeo,
      notation: analysis.getNotation(),
      progress: analysis.progress,
      parameter: analysis.parameter,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
      metadata: analysis.metadata,
      jobsSummary
    };
  }

  /**
   * Obtenir une analyse complète avec tous les détails des jobs
   * @param {string} analysisId 
   * @param {string} userId 
   * @returns {object} Analyse complète avec détails des jobs
   */
  static async getAnalysisComplete(analysisId, userId) {
    const overview = await this.getAnalysisOverview(analysisId, userId);
    const jobs = await this._getAllJobsDetails(analysisId);
    
    return {
      analysis: overview,
      jobs
    };
  }

  /**
   * Obtenir les détails d'un job spécifique
   * @param {string} analysisId 
   * @param {string} jobType 
   * @param {string} userId 
   * @returns {object} Détails du job
   */
  static async getJobDetails(analysisId, jobType, userId) {
    // Vérifier que l'utilisateur a accès à cette analyse
    const analysis = await AnalysisTextSeo.findOne({ 
      _id: analysisId, 
      user_id: userId 
    });

    if (!analysis) {
      throw new Error('Analyse non trouvée');
    }

    const JobModel = this.jobModels[jobType];
    if (!JobModel) {
      throw new Error(`Type de job '${jobType}' non supporté`);
    }

    const job = await JobModel.findOne({ 
      analysisId, 
      jobName: jobType 
    });

    return job || { error: `Job '${jobType}' non trouvé` };
  }

  /**
   * Calculer et mettre à jour le score global de l'analyse
   * @param {string} analysisId 
   * @returns {object} Score mis à jour
   */
  static async updateGlobalScore(analysisId) {
    const jobs = await this._getAllJobsDetails(analysisId);
    const jobsConfig = AnalysisTextSeo.getJobsConfig();
    
    let totalScore = 0;
    let completedJobs = 0;
    let totalWeight = 0;

    for (const config of jobsConfig) {
      const job = jobs[config.type];
      totalWeight += config.weight;
      
      if (job && job.status === 'completed') {
        totalScore += (job.score || 0) * (config.weight / 100);
        completedJobs++;
      }
    }

    const finalScore = Math.round(totalScore);
    const progress = Math.round((completedJobs / jobsConfig.length) * 100);
    const status = completedJobs === jobsConfig.length ? 'completed' : 'processing';

    // Mettre à jour l'analyse principale
    await AnalysisTextSeo.findByIdAndUpdate(analysisId, {
      scoreSeo: finalScore,
      progress,
      status,
      'metadata.completedAt': status === 'completed' ? new Date() : undefined
    });

    return { score: finalScore, progress, status };
  }

  /**
   * Obtenir la liste des analyses pour l'historique (vue rapide)
   * @param {string} userId 
   * @param {number} page 
   * @param {number} limit 
   * @returns {object} Liste paginée des analyses
   */
  static async getAnalysesList(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const analyses = await AnalysisTextSeo.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id status scoreSeo progress parameter createdAt metadata');

    const total = await AnalysisTextSeo.countDocuments({ user_id: userId });

    return {
      data: analyses.map(analysis => ({
        id: analysis._id,
        status: analysis.status,
        scoreSeo: analysis.scoreSeo,
        notation: analysis.getNotation(),
        progress: analysis.progress,
        text: analysis.parameter?.text?.substring(0, 100) + '...',
        keywords: analysis.parameter?.keywords || [],
        createdAt: analysis.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // ===== MÉTHODES PRIVÉES =====

  /**
   * Récupérer le résumé de tous les jobs d'une analyse
   * @private
   */
  static async _getJobsSummary(analysisId) {
    const jobsConfig = AnalysisTextSeo.getJobsConfig();
    const summary = [];

    for (const config of jobsConfig) {
      const JobModel = this.jobModels[config.type];
      const job = await JobModel.findOne({ 
        analysisId, 
        jobName: config.type 
      }).select('status score processingTime');

      summary.push({
        type: config.type,
        name: config.name,
        weight: config.weight,
        status: job?.status || 'waiting',
        score: job?.score || 0,
        processingTime: job?.processingTime || null
      });
    }

    return summary;
  }

  /**
   * Récupérer tous les détails des jobs d'une analyse
   * @private
   */
  static async _getAllJobsDetails(analysisId) {
    const jobs = {};

    for (const [jobType, JobModel] of Object.entries(this.jobModels)) {
      console.log(`🔍 [AnalysisAggregationService] Recherche job ${jobType} pour analyse ${analysisId}`);
      
      const job = await JobModel.findOne({ 
        analysisId, 
        jobName: jobType 
      });
      
      if (job) {
        console.log(`✅ [AnalysisAggregationService] Job ${jobType} trouvé, status: ${job.status}, score: ${job.score}`);
        jobs[jobType] = job.toObject();
      } else {
        console.log(`❌ [AnalysisAggregationService] Job ${jobType} non trouvé`);
        jobs[jobType] = {
          status: 'waiting',
          message: 'Job pas encore démarré'
        };
      }
    }

    return jobs;
  }
}

module.exports = AnalysisAggregationService;
