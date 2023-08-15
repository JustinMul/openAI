
require('dotenv').config();
const { text } = require('express');
const importedArray = require('./fileParser');
const fetch = require("node-fetch");

const embedder = ()=>{
  const embeddingArray = [];
  const openAiHeaders = {
    'Content-Type': 'application/json',
    'Authorization':`Bearer ${process.env.OPEN_API_KEY}`
  };
  
  const createEmbedding = async(textToEmbed)=> {
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

  (async() => {
    try {
      // const textArray1 = await importedArray;
      // console.log('ARRAY ', textArray1)
      const textArray = ['hel', 'go'];

      const batchSize = 3;
      const delay = 90000; // 1.5 minutes in milliseconds

      for (let i = 0; i < textArray.length; i += batchSize) {
        const batch = textArray.slice(i, i + batchSize);

        for (const text of batch) {
          console.log('TExt', text);
          const embedding = await createEmbedding(text);
          
          console.log('this is embedding', embedding.data[0].embedding)
          embeddingArray.push({'text':text, 'embedding':embedding.data[0].embedding});
          
        }

        if (i + batchSize < textArray.length) {
          console.log(`Waiting for ${delay / 1000} seconds before the next batch...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      console.log(embeddingArray)
      // console.log('this is the thing',textArray);
      //here
    } catch (error) {
      console.error('An error occurred:', error);
    }
  })();
  
  
  
  return embeddingArray;
};


module.exports = embedder();