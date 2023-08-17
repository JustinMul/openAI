const generateEmbeddings = require('./embedding');

require('dotenv').config();

const mysql = require('mysql2/promise');

const create = async({conn, content,vector}) => {
  const [results] = await conn.execute(
    'INSERT INTO myvectortable (text, vector) VALUES (?,JSON_ARRAY_PACK(?))',
    [content,JSON.stringify(vector)]
  );
  return results.insertId;
};

const main = async() =>{
  let singleStoreConnection;
  try {
    singleStoreConnection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });
    
    console.log("You have successfully connected to SingleStore.");
    const embeddings = await generateEmbeddings();
   
    await Promise.all(embeddings.map(async(element) => {
      await create({
        conn: singleStoreConnection,
        content: element.text,
        vector: element.embedding
      });
    }));
    
    
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
  
};

main();
