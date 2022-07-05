const pg=require("../../db/core/pgquery")


/**
 * Saves the accessToken against the user with the specified userID
 * It provides the results in a callback which takes 2 parameters:
 *
 * @param accessToken
 * @param userID
 * @param callback - takes either an error or null if we successfully saved the accessToken
 */
 function saveRefreshToken(token, userId,clientId,expires, callback) {

    const getUserQuery =  `INSERT INTO oauth_refresh_token (refresh_token, refresh_token_expires_at,client_id,user_id) VALUES ($1,$2,$3,$4);`
  
    //execute the query to get the user
    return pg.query(getUserQuery,[token,expires,clientId,userId])
  }
  
  /**
   * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
   * to the callback if it has been retrieved else it passes null
   *
   * @param refreshToken
   * @param callback - takes the user id we if we got the userID or null to represent an error
   */
  function getRefreshToken(refreshToken, callback){
  
        //create query to get the userID from the row which has the bearerToken
        const getUserIDQuery = `SELECT * FROM oauth_refresh_token WHERE refresh_token = $1;`
  
        //execute the query to get the userID
        pg.query(getUserIDQuery,[refreshToken]);
  }

/**
 * Gets the user with the specified username and password.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a user object which will be null if there is no user
 *
 * @param username
 * @param password
 * @param callback - takes an error and a user object
 */
 function getUserFromEmail(username,callback) {

    let getUserQuery = `SELECT * FROM users WHERE email = $1`;
    
  
    console.log('getUserFromCredentials query is: ', getUserQuery);
  
    //execute the query to get the user
    return pg.query(getUserQuery,[username]);
  }

  /**
 * Gets the user with the specified username and password.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a user object which will be null if there is no user
 *
 * @param username
 * @param password
 * @param callback - takes an error and a user object
 */
 function getUserFromMobile(username, callback) {

    let  getUserQuery= `SELECT * FROM users WHERE mobile = $1`;
    console.log('getUserFromCredentials query is: ', getUserQuery);
  
    //execute the query to get the user
    return pg.query(getUserQuery,[username]);
  }

  /**
 * Gets the client with the specified id and secret.
 * It provides the results in a callback which takes an:
 * an error object which will be set to null if there is no error.
 * and a client object which will be null if there is no client
 *
 * @param clientID
 * @param clientSecret
 * @param callback - takes an error and a client object
 */
 function getClient(clientID, clientSecret, callback) {

    //create query using the data in the req.body to register the user in the db
    const getUserQuery = `SELECT * FROM oauth_client WHERE client_id=$1 AND client_secret = $2`
  
    console.log('getUserFromCredentials query is: ', getUserQuery);
  
    //execute the query to get the user
    return pg.query(getUserQuery,[clientID, clientSecret]);
  }

  module.exports = {
    saveRefreshToken,
    getUserFromEmail,
    getUserFromMobile,
    getRefreshToken,
    getClient
 }