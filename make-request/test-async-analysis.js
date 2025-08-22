// Test de l'API d'analyse asynchrone de texte SEO
const config = require('./config');

async function testAsyncAnalysis() {
  console.log('🚀 Test de l\'API Analysis Text SEO ASYNCHRONE');
  console.log('===============================================\n');

  const testToken = config.TOKEN;
  
  console.log('🔧 Configuration:');
  console.log('- Base URL:', config.BASE_URL);
  console.log('- Token configuré:', testToken ? '✅' : '❌');
  console.log('');

  try {
    // 1. Créer une analyse asynchrone
    console.log('📤 1. Création d\'une analyse asynchrone...');
    const createResponse = await fetch(config.BASE_URL + '/analysis-text-seo/async', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: "Voici un exemple de texte SEO plus long à analyser de manière asynchrone pour tester l'optimisation du contenu et la qualité rédactionnelle. Ce contenu doit être suffisamment long pour obtenir une analyse pertinente des critères SEO comme la densité des mots-clés, la lisibilité et la structure du texte. L'objectif est d'optimiser le référencement naturel en utilisant des techniques avancées. Les moteurs de recherche analysent le contenu selon plusieurs facteurs importants.",
        keywords: ["SEO", "optimisation", "référencement", "contenu"]
      })
    });

    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      console.log('❌ Erreur création:', createData);
      return;
    }

    console.log('✅ Analyse créée avec succès!');
    console.log('📊 ID:', createData.data.id);
    console.log('📊 Status:', createData.data.status);
    console.log('📊 Jobs créés:', createData.data.jobs.length);
    console.log('📊 Temps estimé:', createData.data.estimatedTime);
    console.log('📊 URL de statut:', createData.data.statusUrl);
    console.log('');

    const analysisId = createData.data.id;

    // 2. Suivre le progrès de l'analyse
    console.log('📊 2. Suivi du progrès de l\'analyse...');
    let completed = false;
    let attempts = 0;
    const maxAttempts = 20; // Maximum 2 minutes d'attente

    while (!completed && attempts < maxAttempts) {
      attempts++;
      
      // Attendre 6 secondes entre chaque vérification
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      console.log(`🔄 Vérification ${attempts}/${maxAttempts}...`);
      
      const statusResponse = await fetch(`${config.BASE_URL}/analysis-text-seo/${analysisId}/status`, {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      });

      const statusData = await statusResponse.json();
      
      if (!statusResponse.ok) {
        console.log('❌ Erreur récupération statut:', statusData);
        break;
      }

      console.log(`📈 Progrès: ${statusData.data.progress}%`);
      console.log(`📊 Jobs: ${statusData.data.completed}/${statusData.data.totalJobs} terminés`);
      
      if (statusData.data.failed > 0) {
        console.log(`⚠️ Jobs échoués: ${statusData.data.failed}`);
      }

      // Afficher le statut des jobs
      statusData.data.jobs.forEach(job => {
        const statusIcon = job.status === 'completed' ? '✅' : 
                          job.status === 'failed' ? '❌' : 
                          job.status === 'active' ? '🔄' : '⏳';
        console.log(`  ${statusIcon} ${job.name}: ${job.status}${job.progress ? ` (${job.progress}%)` : ''}`);
      });

      if (statusData.data.status === 'completed') {
        completed = true;
        console.log('\n🎉 Analyse terminée avec succès!');
        console.log('📊 Résultats finaux:');
        console.log(`- Score SEO: ${statusData.data.seoScore}/100`);
        console.log(`- Grade: ${statusData.data.grade}`);
        console.log(`- Thématique: ${statusData.data.topic}`);
        console.log(`- Mots: ${statusData.data.metrics?.wordCount}`);
        console.log(`- Temps de traitement: ${Math.round(statusData.data.processingTime / 1000)}s`);
        
        // Afficher les scores par critère
        if (statusData.data.baremeResults?.criteria) {
          console.log('\n📈 Scores par critère:');
          Object.entries(statusData.data.baremeResults.criteria).forEach(([key, criteria]) => {
            console.log(`  - ${criteria.name}: ${criteria.score}/${criteria.maxScore} (${Math.round(criteria.score/criteria.maxScore*100)}%)`);
          });
        }
      }
      
      console.log('');
    }

    if (!completed) {
      console.log('⏰ Timeout: L\'analyse prend plus de temps que prévu');
      console.log('💡 Vous pouvez vérifier le statut plus tard avec:');
      console.log(`GET ${config.BASE_URL}/analysis-text-seo/${analysisId}/status`);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test asynchrone:', error.message);
  }
}

// Vérifier la configuration
if (!config.isTokenConfigured()) {
  console.log('⚠️  ATTENTION: Configure ton fichier .env!');
  console.log('Assure-toi que JWT_SECRET est configuré et que le serveur fonctionne.');
} else {
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch n\'est pas disponible.');
    console.log('💡 Utilise Node.js 18+ ou installe node-fetch');
  } else {
    testAsyncAnalysis();
  }
}
