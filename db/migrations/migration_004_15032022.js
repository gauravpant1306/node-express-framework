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
const alterCompaniesTable = () => {
  return  `ALTER TABLE companies
  ADD COLUMN logo varchar(200);`;  
  
};

/**
 * Drop User Table
 */
const dropCompaniesTableChange = () => {
  return  `ALTER TABLE companies
  DROP COLUMN logo;`;
};

// /**
//  * Create User Table
//  */
//  const alterProductTable = () => {
//   return  `ALTER TABLE policies
//   ADD COLUMN uin varchar(20);`;  
  
// };

// /**
//  * Drop User Table
//  */
// const dropProductTableChange = () => {
//   return  `ALTER TABLE policies
//   DROP COLUMN uin;`;
// };

/**
 * Create All Tables
 */
const createAllTables = () => {
    pool.query(alterCompaniesTable(), function(err, result) {
      console.log("alterCompaniesTable migrated");
      pool.end();
        console.log("Successfully migrated");
        //     pool.query(alterProductTable(), function(err, result) {
        // console.log("alterProductTable migrated");
        // pool.end();
        // console.log("Successfully migrated");
        //     });
      });      
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
    pool.query(dropCompaniesTableChange(), function(err, result) {
      console.log("dropCompaniesTableChange migrated");
      pool.end();
      console.log("Successfully removed migrations");
        //     pool.query(dropProductTableChange(), function(err, result) {
        // console.log("dropProductTableChange removed");
        // pool.end();
        // console.log("Successfully removed migrations");
        //     });
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