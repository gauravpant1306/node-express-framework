const createAllTables = () => {
  //read all file and check file executed from migration table
  ////migration table -- id,filename,created_on
  pool.query(createUserTable(), function (err, result) {
    console.log("createUserTable migrated");
    pool.query(createIndexUserTable(), function (err, result) {
      console.log("createIndexUserTable migrated");
      pool.query(createOauthClient(), function (err, result) {
        console.log("createOauthClient migrated");
        pool.query(createOauthToken(), function (err, result) {
          console.log("createOauthToken migrated");
          pool.end();
          console.log("Successfully migrated");
        });
      });
    });
  });
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
  pool.query(dropIndexUserTable(), function (err, result) {
    console.log("createUserTable removed");
    pool.query(dropOauthToken(), function (err, result) {
      console.log("createIndexUserTable removed");
      pool.query(dropUserTable(), function (err, result) {
        console.log("createOauthClient removed");
        pool.query(dropOauthClient(), function (err, result) {
          console.log("createOauthToken removed");
          pool.end();
          console.log("Successfully removed migrations");
        });
      });
    });
  });
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

module.exports = {
  createAllTables,
  dropAllTables,
};

require("make-runnable");
