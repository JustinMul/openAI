const express = require("express");
require('dotenv').config();

const generateEmbeddingsFromClient = require('./embeddingConversion');
const vectorPairing = require('./vectorScore');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ message: "test" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/api/endpoint', async (req, res) => {
  const receivedData = req.body.data;
  console.log('Received data:', receivedData);
  const embedding = await(generateEmbeddingsFromClient(receivedData));
  const vectorPair = await(vectorPairing(embedding));

  console.log('embeddign', embedding);
  console.log('vp',vectorPair);
  res.json({ message: 'Data received successfully!' });
});

const mysql = require('mysql2/promise');

