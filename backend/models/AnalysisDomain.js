const mongoose = require('mongoose');

const analysisDomainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  domainScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  metrics: {
    domainAge: Number,
    domainAuthority: Number,
    domainLength: Number,
    domainExtension: String,
    domainKeywords: Number,
    domainReadability: Number
  },
  domainElements: {
    hasGoodLength: Boolean,
    hasGoodExtension: Boolean,
    hasKeywords: Boolean,
    isMemorable: Boolean,
    isBrandable: Boolean,
    isAvailable: Boolean
  },
  analysis: {
    domainQuality: String,
    domainStrength: String,
    domainWeakness: String,
    recommendations: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisDomain', analysisDomainSchema); 