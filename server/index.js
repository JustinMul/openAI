const express = require("express");
require('dotenv').config();

const generateEmbeddingsFromClient = require('./embeddingConversion');
const vectorPair = require('./vectorScore');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');


app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ message: "test" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/api/endpoint', async (req, res) => {
  const receivedData = req.body.data;
  // console.log('Received data:', receivedData);
  const embedding = await(generateEmbeddingsFromClient(receivedData));
  // console.log("this is embeddings", embedding)
  const vectorPairing = await(vectorPair(embedding));
  res.json({ message: 'Data received successfully!' });
});



