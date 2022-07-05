const pg=require("../db/core/pgquery");

  function getInsurerList() {

    let query = `SELECT id,name FROM companies`;
  
    //execute the query to get the user
    return pg.query(query);
  }

  function addDetails(user_id,policy_category) {

    const query =  `INSERT INTO  
    user_policies(user_id,policy_category)
    VALUES($1, $2)
    returning id;`;

    return pg.query(query,[user_id,policy_category]);
  }

  
  module.exports = {
    addDetails,
    getInsurerList
 }
  