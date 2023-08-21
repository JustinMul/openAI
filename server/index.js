const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require('dotenv').config();

const generateEmbeddingsFromClient = require('./embeddingConversion');
const vectorPair = require('./vectorScore');
const sendOpenAiRequest = require('./openaiRequest');
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);

const cors = require("cors");
app.use(cors()); // Use cors middleware to allow cross-origin requests

let io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

app.use(bodyParser.json());

let openAIAnswer = '';
app.get("/api", (req, res) => {
  res.json({ message: openAIAnswer });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/api/endpoint', async (req, res) => {
  const receivedData = req.body.data;
  const embedding = await generateEmbeddingsFromClient(receivedData);
  const vectorPairing = await vectorPair(embedding);
  openAIAnswer = await sendOpenAiRequest(embedding[0].text, vectorPairing[0]);

  // Emit the updated value to connected clients
  io.emit("openAIAnswer", openAIAnswer);

  res.json({ message: 'Data received successfully!' });
});

server.listen(PORT + 1, () => {
  console.log(`Socket.io listening on ${PORT + 1}`);
});
