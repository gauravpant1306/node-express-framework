const pool=require('../core/pgpool').pool;

// pool.on('connect', () => {
//   console.log('connected to the db');
// });

pool.on('error', err => {
    // tslint:disable-next-line no-console
    console.message('PostgreSQL client generated error: ', err.message);
   });

/**
 * Create User Table
 */
const createCompaniesTable = () => {
  return  `CREATE TABLE IF NOT EXISTS companies
  (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  name VARCHAR(100) UNIQUE NOT NULL,
  created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_on TIMESTAMP WITHOUT TIME ZONE )`;  
  
};

  const dropCompaniesTable = () => {
    return  `DROP TABLE companies`;
  };

/**
 * Create All Tables
 */
const createAllTables = () => {
    pool.query(createCompaniesTable(), function(err, result) {
        console.log("createCompaniesTable migrated");
        pool.end();
        console.log("Successfully migrated");
       
      });
    
  

};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
    pool.query(dropCompaniesTable(), function(err, result) {
        console.log("dropCompaniesTable removed");
        pool.end();
        console.log("Successfully removed migrations");
      
      });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


module.exports= {
  createAllTables,
  dropAllTables,
};

require('make-runnable');