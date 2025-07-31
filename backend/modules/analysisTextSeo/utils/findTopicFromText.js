const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function detectTopicWithGPT(text) {
  if (!OPENAI_API_KEY) {
    return { success: false, error: 'Clé API OpenAI manquante.' };
  }
  if (!text || typeof text !== 'string') {
    return { success: false, error: 'Le texte est requis et doit être une chaîne de caractères.' };
  }

  // Charger le prompt depuis le fichier
  const promptPath = path.join(__dirname, '../prompts/findTopicFromText.txt');
  let prompt;
  
  try {
    prompt = fs.readFileSync(promptPath, 'utf8');
    prompt = prompt.replace('{{TEXT}}', text);
  } catch (error) {
    console.error('Erreur lors du chargement du prompt:', error.message);
    return { success: false, error: 'Erreur lors du chargement du prompt.' };
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.2,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const topic = response.data.choices[0].message.content.trim();
    return {
      success: true,
      topic,
      raw: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

module.exports = { detectTopicWithGPT }; 