require('dotenv').config();
const fetch = require("node-fetch");

const createEmbedding = async (textToEmbed, openAiHeaders) => {
  let response = await fetch(`https://api.openai.com/v1/embeddings`, {
    method: 'POST',
    headers: openAiHeaders,
    body: JSON.stringify({
      'model': 'text-embedding-ada-002',
      'input': textToEmbed
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.log('this is res', response);
  }
};

const generateEmbeddings = async(text) => {
  const embeddingArray = [];
  const openAiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
  };

  try {
    const embedding = await createEmbedding(text, openAiHeaders);
   
    embeddingArray.push({ 'text': text, 'embedding': embedding.data[0].embedding });
  } catch (error) {
    console.error('An error occurred:', error);
  }

  return embeddingArray;
};

module.exports = generateEmbeddings;
