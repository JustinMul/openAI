require('dotenv').config();
const fetch = require("node-fetch");

const openAiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
};

const sendOpenAiRequest = async (prompt, relatedData) => {
  console.log('this is prop', relatedData[0]);
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: 'I am providing you with the revelant pieces of information to answer the next prompt, which includes real time financial data for the company Apple from years 2013-2023'}, // User message
    { role: 'assistant', content: relatedData[0].text },
    { role: "user", content: prompt } 
  ];

  const requestBody = {
    model: "gpt-3.5-turbo",
    temperature: 1,
    messages: messages
  };

  console.log('this is request body', requestBody)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
 
    method: 'POST',
    headers: openAiHeaders,
    body: JSON.stringify(requestBody)
  });

  const responseData = await response.json();
  console.log('this is res', responseData)
  console.log('res', responseData.choices[0].message)
  return responseData;
};

module.exports = sendOpenAiRequest;
