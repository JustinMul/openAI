const generateEmbeddings = require('./embedding');
require('dotenv').config();
const mysql = require('mysql2/promise');

const create = async({conn, content,vector}) => {
  const [results] = await conn.execute(
    'SELECT text dot_product(?,JSON_ARRAY_PACK(?)) as score from myvectortable order by score desc, limit 5',
    [content,JSON.stringify(vector)]
  );
  console.log('results', results);
  return results.insertId;
};

const vectorPair = async(text) =>{
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

vectorPair();
