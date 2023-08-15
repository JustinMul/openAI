

const express = require("express");
const importedArray = require('./fileParser');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();
const fetch = require("node-fetch");
app.get("/api", (req, res) => {
  res.json({ message: "test" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const openAiHeaders = {
  'Content-Type': 'application/json',
  'Authorization':`Bearer ${process.env.OPEN_API_KEY}`
};

(async() => {
  try {
    const textArray = await importedArray;
    // console.log(textArray);
 
    // Rest of your code that uses textArray
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

// const createEmbedding = async(textToEmbed)=> {
//   let response = await fetch(`https://api.openai.com/v1/embeddings`, {
//     method: 'POST',
//     headers: openAiHeaders,
//     body: JSON.stringify({
//       'model': 'text-embedding-ada-002',
//       'input': textToEmbed
//     }),
//   });
//   if (response.ok) {
//     response.json().then(data=>{
//       console.log(data);
//       return data;
//     });
//   } else {
//     console.log('this is res', response);
//   }
// };

// createEmbedding('apple stock');
