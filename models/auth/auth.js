const pg=require("../../db/core/pgquery");

 function createUser(email, first_name, last_name, password, mobile) {

    const getUserQuery =  `INSERT INTO
    users(email, first_name, last_name, password,mobile)
    VALUES($1, $2, $3, $4,$5)
    returning id,email,mobile,concat_ws(' ', first_name, last_name) AS name;`;

    return pg.query(getUserQuery,[email, first_name, last_name, password,mobile]);
  }

  function forgotPassword(email, otpHash) {

    const getUserQuery =  `UPDATE 
    users SET otp_password_reset=$2 WHERE email=$1
    returning email,mobile,concat_ws(' ', first_name, last_name) AS name;`;

    return pg.query(getUserQuery,[email, otpHash]);
  }

  function changePassword(email, password) {

    const getUserQuery =  `UPDATE 
    users SET password=$2 WHERE email=$1
    returning *;`;

    return pg.query(getUserQuery,[email, password]).then(
       (email) =>{
        const forgotPassQuery =  `UPDATE 
        users SET otp_password_reset='', WHERE email=$1
        returning email,mobile,concat_ws(' ', first_name, last_name) AS name;`;
    
        return pg.query(forgotPassQuery,[email]);
       }
    );
  }

  function getUserFromEmail(username) {

    let getUserQuery = `SELECT otp_password_reset FROM users WHERE email = $1`;
  
    //execute the query to get the user
    return pg.query(getUserQuery,[username]);
  }

  module.exports = {
    createUser,
    forgotPassword,
    changePassword,
    getUserFromEmail
 }
  