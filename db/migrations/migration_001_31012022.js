const pool=require('./../core/pgpool').pool;

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
const createUserTable = () => {
  return  `CREATE TABLE IF NOT EXISTS users
  (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  mobile INT UNIQUE, 
  first_name VARCHAR(100), 
  last_name VARCHAR(100), 
  password VARCHAR(100) NOT NULL,
  is_logged_in BOOLEAN,
  created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_on TIMESTAMP WITHOUT TIME ZONE )`;
  
  return pool.query(userCreateQuery);
};

/**
 * Create OAuth Refresh Token Table
 */
 const createOauthToken = () => {
    return  `CREATE TABLE IF NOT EXISTS oauth_refresh_token
    (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    refresh_token TEXT UNIQUE NOT NULL, 
    refresh_token_expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    oauth_client_id uuid, 
    user_id INT,
    created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_on TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_users_oauthtoken 
    FOREIGN KEY(user_id)
    REFERENCES users(id),
    CONSTRAINT fk_client_oauthtoken
    FOREIGN KEY(oauth_client_id)
    REFERENCES oauth_client(client_id) )`;
  
    return pool.query(userCreateQuery);
  };

  const createOauthClient = () => {
    return  `CREATE TABLE IF NOT EXISTS oauth_client
    (client_id UUID PRIMARY KEY, 
    client_secret TEXT NOT NULL, 
    redirect_uri VARCHAR(100),
    created_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_on TIMESTAMP WITHOUT TIME ZONE )`;
  
    return pool.query(userCreateQuery);
  };

  const createIndexUserTable = () => {
    return  `CREATE INDEX user_uname_password ON users USING 
    BTREE(email,password)`;
  
    return pool.query(userCreateQuery);
  };

/**
 * Drop User Table
 */
const dropUserTable = () => {
  return  'DROP TABLE users';
  return pool.query(usersDropQuery)
    .then((res) => {
      console.log(res);
      // pool.end();
    })
    .catch((err) => {
      console.log(err);
      // pool.end();
    });
};

/**
 * Drop OAuth Refresh Token Table
 */
 const dropOauthToken = () => {
    return  'DROP TABLE oauth_refresh_token';
    return pool.query(usersDropQuery)
      .then((res) => {
        console.log(res);
        // pool.end();
      })
      .catch((err) => {
        console.log(err);
        // pool.end();
      });
  };

  /**
 * Drop OAuth Client Table
 */
const dropOauthClient = () => {
    return  'DROP TABLE oauth_client';
    return pool.query(usersDropQuery)
      .then((res) => {
        console.log(res);
        // pool.end();
      })
      .catch((err) => {
        console.log(err);
        // pool.end();
      });
  };

  const dropIndexUserTable = () => {
    return  `DROP INDEX user_uname_password`;
  
    return pool.query(userCreateQuery)
      .then((res) => {
        console.log(res);
        // pool.end();
      })
      .catch((err) => {
        console.log(err);
        // pool.end();
      });
  };

/**
 * Create All Tables
 */
const createAllTables = () => {
    pool.query(createUserTable(), function(err, result) {
        console.log("createUserTable migrated");
        pool.query(createIndexUserTable(), function(err, result) {
            console.log("createIndexUserTable migrated");
            pool.query(createOauthClient(), function(err, result) {
                console.log("createOauthClient migrated");
                pool.query(createOauthToken(), function(err, result) {
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
    pool.query(dropIndexUserTable(), function(err, result) {
        console.log("createUserTable removed");
        pool.query(dropOauthToken(), function(err, result) {
            console.log("createIndexUserTable removed");
            pool.query(dropUserTable(), function(err, result) {
                console.log("createOauthClient removed");
                pool.query(dropOauthClient(), function(err, result) {
                    console.log("createOauthToken removed");
                    pool.end();
                    console.log("Successfully removed migrations");
                });
            });
        });
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