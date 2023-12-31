require('dotenv').config();
const fetch = require("node-fetch");

const openAiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPEN_API_KEY}`
};

const sendOpenAiRequest = async (prompt, relatedData) => {
 
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content:'I am providing you with the relevant pieces of information to answer the next prompt, which includes real-time financial data for the company Apple from the years 2013 to 2023 , and all year calculations should be based on this. It is important to note the most recent quarter is Q3 Fiscal Year 2023 for the company Apple'},
    { role: 'assistant', content: relatedData[0].text },
    { role: 'assistant', content: relatedData[1].text },
    { role: 'assistant', content: relatedData[2].text },
    { role: 'assistant', content: relatedData[3].text },
    { role: "user", content: prompt }
  ];

  const requestBody = {
    model: "gpt-3.5-turbo",
    temperature: .5,
    messages: messages
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: openAiHeaders,
    body: JSON.stringify(requestBody)
  });


  const responseData = await response.json();
  return responseData.choices[0].message.content;
};

module.exports = sendOpenAiRequest;
