const pg=require("../db/core/pgquery");

 function addCompany(name, logo) {

    const query =  `INSERT INTO
    companies(name, logo)
    VALUES($1, $2)
    returning id,name,logo;`;

    return pg.query(query,[name, logo]);
  }

  function getInsurerCompany(name) {

    const query =  `SELECT name,logo,id FROM
    companies WHERE NAME=$1;`;

    return pg.query(query,[name]);
  }

  



  module.exports = {
    addCompany,   
    getInsurerCompany
 }
  