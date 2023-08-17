require('dotenv').config();
const mysql = require('mysql2/promise');

const findTopMatches = async({conn, vector}) => {
  const [results] = await conn.execute(
    'SELECT text, dot_product(vector,JSON_ARRAY_PACK(?)) as score FROM myvectortable ORDER BY score DESC LIMIT 5',
    [JSON.stringify(vector)]
  );
  return results;
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
   
    const resultsArray = await Promise.all(text.map(async(element) => {
      return findTopMatches({
        conn: singleStoreConnection,
        vector: element.embedding
      });
    }));

    return resultsArray; // Return the array of results from all iterations
    
    
    
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
  
};

module.exports = vectorPair;
