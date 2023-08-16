require('dotenv').config();
const fetch = require("node-fetch");
const readFilesInFolder = require('./fileParser');

const folderPath = '/Users/justinmulroney/Documents/transcripts';

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

const generateEmbeddings = async () => {
  const embeddingArray = [];
  const openAiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
  };

  try {
    const textArray = await readFilesInFolder(folderPath);

    const batchSize = 3;
    const delay = 90000; // 1.5 minutes in milliseconds

    for (let i = 0; i < textArray.length; i += batchSize) {
      const batch = textArray.slice(i, i + batchSize);

      for (const text of batch) {
        console.log('Text', text);
        const embedding = await createEmbedding(text, openAiHeaders);

        console.log('This is embedding', embedding.data[0].embedding);
        embeddingArray.push({ 'text': text, 'embedding': embedding.data[0].embedding });

      }

      if (i + batchSize < textArray.length) {
        console.log(`Waiting for ${delay / 1000} seconds before the next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }

  return embeddingArray;
};

module.exports = generateEmbeddings;
