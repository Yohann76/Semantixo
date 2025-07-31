const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function detectTopicWithGPT(text) {
  if (!OPENAI_API_KEY) {
    return { success: false, error: 'Clé API OpenAI manquante.' };
  }
  if (!text || typeof text !== 'string') {
    return { success: false, error: 'Le texte est requis et doit être une chaîne de caractères.' };
  }

  // Todo : replace prompt in analysisTextSeo/prompt/findTopicFromText.txt
  const prompt = `
Tu es un expert en analyse de texte. Donne-moi la thématique principale de ce texte, en un seul mot ou une courte phrase, sans phrase d'introduction ni explication. Sois précis et synthétique.
Texte :
"""${text}"""
Thématique :
`;

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