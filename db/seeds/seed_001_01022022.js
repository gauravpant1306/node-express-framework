const pool=require('./../core/pgpool').pool;

// pool.on('connect', () => {
//   console.log('connected to the db');
// });

/**
 * SEED Admin User
 */
 const seedUser = () => {
    const seedUserQuery = ``;
  
    pool.query(seedUserQuery)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

  /**
 * SEED Admin User
 */
 const seedClient = () => {
    const seedClientQuery = `INSERT INTO
    oauth_client
    (client_id,
    client_secret) VALUES 
      ( $1,$2)`;
      const {v4 : uuidv4} = require('uuid');
      uuid=uuidv4();
  
   pool.query('INSERT INTO oauth_client (client_id,client_secret) VALUES ( $1,$2) returning *', [uuid,'12345'], (err, result)=> {
        if(err)
        {
console.log("some error: "+ err);
        }
        console.log("Client ID:"+result.rows[0].client_id);
        console.log("Secret:"+result.rows[0].client_secret);
        
        pool.end();
        console.log("Successfully data initialized");
    });



  };


  
  /**
   * Seed users
   */
  const seed = () => {
   
    seedClient();
  };


  
  pool.on('error', (err,client) => {
    console.log('err'+err);
  });

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


module.exports= {
  seed
};

require('make-runnable');