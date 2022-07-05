const pool=require('../core/pgpool').pool;

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
 const seedProductType = () => {
  
   pool.query('INSERT INTO product_types (name) VALUES ( $1) returning *', [''], (err, result)=> {
        if(err)
        {
console.log("some error: "+ err);
        }
        console.log("ID:"+result.rows[0].id);
        console.log("Name:"+result.rows[0].name);
        
        pool.end();
        console.log("Successfully data initialized");
    });



  };


  
  /**
   * Seed users
   */
  const seed = () => {
   
    seedProductType();
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