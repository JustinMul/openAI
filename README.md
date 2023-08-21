# openAI that allows for own datasets

## Installation 
- Clone the repository using git clone
- Install the required dependencies using npm i


## Usage
This application is intended to allow you to use your own datasets with the OpenAI API to create a chatGPT experience with custom data.

## Configuration
You will need to set up an account at *https://openai.com/* and generate an API key, which will be used in your environment file. Additionally, you will need to create an account on *https://www.singlestore.com/* and create a databse + table. Once that is set up, you can put all your text files in a folder and change the folder path in the environment (env) file. Finally, to seed the database, navigate into the 'db' folder from your terminal and run node *createVectorDBEntry.js*.

