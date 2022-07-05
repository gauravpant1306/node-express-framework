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
const alterUserTable = () => {
  return  `ALTER TABLE users
  ALTER COLUMN mobile TYPE varchar(15);`;  
  
};

/**
 * Drop User Table
 */
const dropUserTableChange = () => {
  return  `ALTER TABLE users
  MODIFY COLUMN mobile int;`;
};

/**
 * Create All Tables
 */
const createAllTables = () => {
    pool.query(alterUserTable(), function(err, result) {
        console.log("alterUserTable migrated");
        pool.end();
        console.log("Successfully migrated");
      });      
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
    pool.query(dropUserTableChange(), function(err, result) {
        console.log("dropUserTableChange removed");
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