const accessTokenModel=require("../../models/auth/oauth")
var jwt = require('jsonwebtoken');
const dotenv=require("dotenv");
const {hashPassword, isNumber, comparePassword}=require("../../utils/validations");
const { compare } = require("bcryptjs");
dotenv.config();
let accessTokensDBHelper

let accessTokenLifetime = process.env.ACCESS_TOKEN_LIFETIME;
let refreshTokenLifetime = process.env.REFRESH_TOKEN_LIFETIME;

var secretKey = process.env.JWT_SECRET_KEY;

/**
 *
 * This method returns the client application which is attempting to get the
 * accessToken. The client is normally found using the clientID & clientSecret
 * and validated using the clientSecrete. However, with user facing client applications
 * such as mobile apps or websites which use the password grantType we don't use the 
 * clientID or clientSecret in the authentication flow.  Therefore, although the client
 * object is required by the library all of the client's fields can be  be null. This 
 also includes the grants field. Note that we did, however, specify that we're using the
 * password grantType when we made the* oAuth object in the index.js file.
 *
 * @param clientID - used to find the clientID
 * @param clientSecret - used to validate the client
 * @param callback
 *
 * The callback takes 2 parameters. The first parameter is an error of type falsey
 * and the second is a client object. As we're not retrieving the client using the 
 * clientID and clientSecret (as we're using the password grantt type) we can just 
 * create an empty client with all null values. Because the client is a hardcoded 
 * object - as opposed to a clientwe've retrieved through another operation - we just 
 * pass false for the error parameter as no errors can occur due to the aforemtioned
 * hardcoding.
 */
function getClient(clientID, clientSecret, callback){

    console.log('in getClient (clientId: ' + clientID + 
              ', clientSecret: ' + clientSecret + ')');
    
    accessTokenModel.getClient(clientID, clientSecret)
    .then(
        (res)=>{
            var client=res.rows[0];
            client.grants=['password'];
            return callback(false,client);
        })
    .catch(error =>{ return callback(error, false)})
             
}

/**
 *
 * This method determines whether or not the client which has to the specified clientID 
 * is permitted to use the specified grantType.
 *
 * @param clientID
 * @param grantType
 * @param callback
 *
 * The callback takes an error of type truthy, and a boolean which indcates whether the
 * client that has the specified clientID* is permitted to use the specified grantType.
 * As we're going to hardcode the response no error can occur hence we return false for
 * the error and as there is there are no clientIDs to check we can just return true to
 * indicate the client has permission to use the grantType.
 */
function grantTypeAllowed(clientID, grantType, callback) {

    console.log('in grantTypeAllowed (clientId: ' + clientId + 
              ', grantType: ' + grantType + ')');

  // Authorize all clients to use all grants.
  callback(false, true);
}

function saveAuthorizationCode(code, client, user){
	console.log('in saveAuthorizationCode (clientId: ' + clientId + 
              ', code: ' + code + ')');

	callback(false, true);
};


/**
 * The method attempts to find a user with the specified username and password.
 *
 * @param username
 * @param password
 * @param callback
 * The callback takes 2 parameters.
 * This first parameter is an error of type truthy, and the second is a user object.
 * You can decide the structure of the user object as you will be the one accessing 
 * the data that it contains in the saveAccessToken() method. The library doesn't 
 * access the user object it just supplies it to the saveAccessToken() method
 */
function getUser(username, password, callback){
let user;
    //try and get the user using the user's credentials
    if(isNumber(username))
    {
        return accessTokenModel.getUserFromMobile(username)
        .then(res => {
            user=res.rows[0];
        return user;}).
            then(user=>{
            return comparePassword(user.password,password)})
            .then((passVerify)=>{
                user.passVerify=passVerify;
                return user;
            }).
            then((user)=>{
           return callback(false, user);})
        .catch(error => {return callback(error, null);})
    }
    else{
        return accessTokenModel.getUserFromEmail(username)
        .then(res => {
            user=res.rows[0];
        return user;}).
            then(user=>{
            return comparePassword(user.password,password)})
            .then((passVerify)=>{
                user.passVerify=passVerify;
                return user;
            }).
            then((user)=>{
           return callback(false, user);})
        .catch(error => {return callback(error, null);})
    }

}

/**
 * saves the accessToken along with the userID retrieved from the given user
 *
 * @param accessToken
 * @param clientID
 * @param expires
 * @param user
 * @param callback
 */
function saveToken(token, client,  user, callback){

    console.log('in saveAccessToken (token: ' + token.accessToken + 
              ', clientId: ' + client.client_id + ', userId: ' + user.id );

  //No need to store JWT tokens.
  token.client = {
    id: client.client_id
  }
  token.user = {
    username: user.email
  }
  return callback(false,token);
  
}

/**
 * This method is called to validate a user when they're calling APIs
 * that have been authenticated. The user is validated by verifying the
 * bearerToken which must be supplied when calling an endpoint that requires 
 * you to have been authenticated. We can tell if a  bearer token is valid 
 * if passing it to the getUserIDFromBearerToken() method returns a userID. 
 * It's able to return a userID because each row in the access_tokens table 
 * has a userID in itbecause we store it along with the userID when we save
 * the bearer token. So, as they're bothpresent in the same row in the db we
 * should be able to use the bearerToken to query for a row  which will have
 a userID in it.
 *
 * @param bearerToken
 * @param callback
 * The callback takes 2 parameters:
 *
 * 1. A truthy boolean indicating whether or not an error has occured. It
 should be set to a truthy if there is an error or a falsy if there is no
 error
 *
 * 2. An accessToken which will be accessible in the  req.user object on 
 * endpoints that are authenticates
 */
function getAccessToken(bearerToken, callback) {

    console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

    try {
      var decoded = jwt.verify(bearerToken, secretKey, { 
          ignoreExpiration: true //handled by OAuth2 server implementation
      });
      return callback(null, {
        accessToken: bearerToken,
        accessTokenExpiresAt:new Date( decoded.expire_in),
        scope: decoded.scope,
        client: {"id": decoded.sub}, // with 'id' property
        user:decoded.user,
        expires: new Date(decoded.exp * 1000)
      });
    } catch(e) {    
      return callback(e,false);
    }
}


/**
 * saves the accessToken along with the userID retrieved from the given user
 *
 * @param token
 * @param clientID
 * @param expires
 * @param user
 * @param callback
 */
 function saveRefreshToken(token, clientID, expires, user, callback){

    console.log('in saveRefreshToken (token: ' + token + 
    ', clientId: ' + clientId +
    ', userId: ' + userId.id + ', expires: ' + expires + ')');

    //save the accessToken along with the user.id
    accessTokenModel.saveRefreshToken(token, user.id,clientId,expires)
        .then(() => callback(null))
        .catch(error => callback(error))
}

/**
 * This method is called to validate a user when they're calling APIs
 * that have been authenticated. The user is validated by verifying the
 * bearerToken which must be supplied when calling an endpoint that requires 
 * you to have been authenticated. We can tell if a  bearer token is valid 
 * if passing it to the getUserIDFromBearerToken() method returns a userID. 
 * It's able to return a userID because each row in the access_tokens table 
 * has a userID in itbecause we store it along with the userID when we save
 * the bearer token. So, as they're bothpresent in the same row in the db we
 * should be able to use the bearerToken to query for a row  which will have
 a userID in it.
 *
 * @param bearerToken
 * @param callback
 * The callback takes 2 parameters:
 *
 * 1. A truthy boolean indicating whether or not an error has occured. It
 should be set to a truthy if there is an error or a falsy if there is no
 error
 *
 * 2. An accessToken which will be accessible in the  req.user object on 
 * endpoints that are authenticates
 */
function getRefreshToken(refreshToken, callback) {

    console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

    accessTokenModel.getRefreshToken(refreshToken)
        .then(accessToken=>callback(null, false, accessToken))
        .catch(error => callback(true , null))
}

/**
 * Creates and returns an accessToken which contains an expiration date field.
 * You can assign null to it to ensure the token doesn't expire.  You must also 
 * assign it either a user object, or a userId whose value must be a string or
 * number. If you create a user object you can access it in authenticated endpoints
 * in the req.user variable. If you create a userId you can access it in authenticated 
 * endpoints in the req.user.id variable.
 *
 * @param userID
 * @returns {Promise.<{user: {id: *}, expires: null}>}
 */
function generateAccessToken(client, user, scope,callback) {

    //Use the default implementation for refresh tokens
  console.log('generate access Token: ' + client.client_id);
  
  var expires = new Date();

  expires.setSeconds(expires.getMilliseconds() + accessTokenLifetime);
  //Use JWT for access tokens
  var token = jwt.sign({
    user: {"id":user.id,
    "name":user.first_name+" "+user.last_name},
    scope:[],
    expire_in:expires
  }, secretKey, {
    expiresIn: accessTokenLifetime,
    subject: client.client_id
  });
  
  return callback(null, token);
}

// /**
//  * Creates and returns an accessToken which contains an expiration date field.
//  * You can assign null to it to ensure the token doesn't expire.  You must also 
//  * assign it either a user object, or a userId whose value must be a string or
//  * number. If you create a user object you can access it in authenticated endpoints
//  * in the req.user variable. If you create a userId you can access it in authenticated 
//  * endpoints in the req.user.id variable.
//  *
//  * @param userID
//  * @returns {Promise.<{user: {id: *}, expires: null}>}
//  */
//  function generateRefreshToken(type, req, callback) {

//     //Use the default implementation for refresh tokens
//   console.log('generate Refresh Token: ' + type);
  
//     return callback(null, null);
  
  
// }

module.exports =  {

    generateAccessToken,

    // generateRefreshToken,

    getRefreshToken,

    saveRefreshToken,

    getAccessToken,

    saveToken,

    getUser,

    accessTokenLifetime,

    refreshTokenLifetime,

    getClient,

    saveAuthorizationCode
}