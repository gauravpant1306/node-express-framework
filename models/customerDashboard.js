const pg=require("../db/core/pgquery");

  function getInsurerList() {

    let query = `SELECT id,name FROM companies`;
  
    //execute the query to get the user
    return pg.query(query);
  }

  function getInsurerProductList() {

    let getUserQuery = `SELECT id,name,uin,companies_id,category FROM policies`;
  
    //execute the query to get the user
    return pg.query(getUserQuery);
  }

  function getInsurerDetails(policy_id) {

    let query = `SELECT t1.name as product_name,t1.uin,t2.name as insurer FROM policies t1 join companies t2 on t2.id=t1.companies_id where t1.id=$1`;
      
    return pg.query(query,[policy_id]);
  }

  function getInsurerDetailsByUIN(uin) {

    let query = `SELECT t1.name as product_name,t1.uin,t2.name as insurer FROM policies t1 join companies t2 on t2.id=t1.companies_id where t1.uin=$1`;
      
    return pg.query(query,[uin]);
  }

  function addPolicy(policies_id,policy_number,user_id,plan_name,client_id,uin,
    ph_name,ph_address,ph_dob,risk_commencement_date,
    sum_assured,annual_premium,policy_term,ppt,premium_freq,premium_per_freq,
    grace_period,last_premium_date,final_premium_date,maturity_date,policy_category) {

    const query =  `INSERT INTO  
    user_policies(policies_id,policy_number,user_id,plan_name,client_id,uin,
        ph_name,ph_address,ph_dob,risk_commencement_date,
        sum_assured,annual_premium,policy_term,ppt,premium_freq,premium_per_freq,
        grace_period,last_premium_date,final_premium_date,maturity_date,policy_category)
    VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    returning id,policy_number;`;

    return pg.query(query,[policies_id,policy_number,user_id,plan_name,client_id,uin,
        ph_name,ph_address,ph_dob,risk_commencement_date,
        sum_assured,annual_premium,policy_term,ppt,premium_freq,premium_per_freq,
        grace_period,last_premium_date,final_premium_date,maturity_date,policy_category]);
  }

  
  function addPolicyNominee(user_policies_id,nominee_name,nominee_address,nominee_dob,
    nominee_percentage) {

    const query =  `INSERT INTO  
    user_policies_nominee(user_policies_id,nominee_name,nominee_address,nominee_dob,
        nominee_percentage)
    VALUES($1, $2,$3,$4,$5)
    returning id,nominee_name,nominee_percentage;`;

    return pg.query(query,[user_policies_id,nominee_name,nominee_address,nominee_dob,
        nominee_percentage]);
  }

  function addPolicyFund(user_policies_id,fund_name,
    fund_percentage,unit,fund_id) {

    const query =  `INSERT INTO  
    user_policy_fund(user_policies_id,name,allocation,unit,fund_id)
    VALUES($1, $2,$3,$4,$5)
    returning id,name,allocation;`;

    return pg.query(query,[user_policies_id,fund_name,fund_percentage,unit,fund_id]);
  }

  function removePreviousPolicyFund(user_policies_id) {

    const query =  `update   
    user_policy_fund set deleted_on=now() where user_policies_id=$1
    returning id,name,allocation;`;

    return pg.query(query,[user_policies_id]);
  }

  function getUserPolicyDetail(user_id,policy_id) {

    let query = `SELECT t1.id,t1.sum_assured,t1.annual_premium,t2.category as policy_category,
    t1.client_id,t1.premium_per_freq,t1.premium_freq,t1.last_premium_date,
    t1.final_premium_date,t1.maturity_date,t1.risk_commencement_date,t1.policy_number,
    t1.ph_name,t1.ph_address,t1.ph_dob,t1.policy_term,t1.ppt,
    t3.name as insurer,t3.premium_url,
    t3.logo as logo,t2.uin as uin,t2.name as product_name from
     user_policies t1 
     join policies t2
     on t1.policies_id=t2.id 
     join companies t3 on t3.id=t2.companies_id where t1.user_id=$1 and t1.id=$2`;
      
    return pg.query(query,[user_id,policy_id]);
  }

  function getUserPolicyBenefits(user_id,policy_id) {

    let query = `SELECT t1.id,t2.category,t5.text as maturity_benefit,
    t6.text as surrender_benefit,t4.text as death_benefit,
    t3.name as insurer,t3.premium_url,
    t3.logo as logo,t2.uin as uin,t2.name as product_name from
     user_policies t1 
     join policies t2
     on t1.policies_id=t2.id 
     join companies t3 on t3.id=t2.companies_id
     join death_type t4 
     on t2.death_benefit=t4.name
     join maturity_type t5 
     on t2.maturity_benefit=t5.name
     join surrender_type t6 
     on t2.surrender_benefit=t6.name where t1.user_id=$1 and t1.id=$2`;
      
    return pg.query(query,[user_id,policy_id]);
  }


  function getUserPolicyNominee(policy_id) {

    let query = `SELECT nominee_name,nominee_address,nominee_dob,nominee_percentage from user_policies_nominee where user_policies_id=$1`;
      
    return pg.query(query,[policy_id]);
  }

  
  function getUserPolicyFunds(policy_id) {

    let query = `SELECT id,name,allocation,unit,fund_id from user_policy_fund where user_policies_id=$1 and deleted_on is null`;
      
    return pg.query(query,[policy_id]);
  }

  function getPolicyFunds(policy_id) {

    let query = `SELECT id,name from policy_funds where deleted_on is null`;
      
    return pg.query(query);
  }

  function getPolicyFundsByUIN(uin) {

    let query = `SELECT id,name from policy_funds where deleted_on is null`;
      
    return pg.query(query);
  }

  function getUserPolicyFundDetails(policy_id) {

    let query = `SELECT t1.id,t2.name,t1.allocation,
    t1.unit from 
    user_policy_fund t1 
    join policy_funds t2 on t1.fund_id=t2.id where t1.user_policies_id=$1 
    and t1.deleted_on is null order by t1.user_policies_id desc`;
      
    return pg.query(query,[policy_id]);
  }


  function getUserPoliciesByCategory(user_id) {

    let query = `SELECT t1.id,t1.sum_assured,t1.annual_premium,t2.category as policy_category,t3.name as insurer,
    t3.logo as logo,t2.uin as uin,t2.name as product_name,t1.policy_number from
     user_policies t1 
     join policies t2
     on t1.policies_id=t2.id 
     join companies t3 on t3.id=t2.companies_id where t1.user_id=$1 order by t1.created_on desc`;
      
    return pg.query(query,[user_id]);
  }

  function getUserPoliciesWithFunds(user_id) {

    let query = `SELECT t1.id,t1.sum_assured,t1.annual_premium,t2.category as policy_category,t3.name as insurer,
    t3.logo as logo,t2.uin as uin,t2.name as product_name,t1.policy_number from
     user_policies t1 
     join policies t2
     on t1.policies_id=t2.id 
     join companies t3 on t3.id=t2.companies_id where t1.user_id=$1 and t2.category=$2 
     order by t1.id desc`;
      
    return pg.query(query,[user_id,"Unit Linked Life"]);
  }

  function getPolicyAnalysisData(api_body) {

    let query = `SELECT * from policies where name=$1 or uin=$2`;
      
    return pg.query(query,[api_body.productName,api_body.uin]);
  }

  function checkPolicyOwnership(policy_id,user_id) {

    let query = `SELECT * from user_policies where id=$1 and user_id=$2`;
      
    return pg.query(query,[policy_id,user_id]);
  } 

  module.exports = {
    addPolicy,
    getInsurerList,
    getInsurerProductList,
    addPolicyNominee,
    getInsurerDetails,
    getUserPolicyDetail,
    getUserPolicyNominee,
    getUserPoliciesByCategory,
    getInsurerDetailsByUIN,
    getUserPolicyFunds,
    removePreviousPolicyFund,
    addPolicyFund,
    getUserPolicyBenefits,
    getPolicyAnalysisData,
    getUserPolicyFundDetails,
    getPolicyFunds,
    checkPolicyOwnership,
    getUserPoliciesWithFunds,
    getPolicyFundsByUIN
 }
  