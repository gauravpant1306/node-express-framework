const model=require("../../models/adminDashboard")
/* eslint-disable camelcase */
const moment =require('moment');
const google =require('../../models/googleAPI');

const validate=require("./adminDashboard.validate");
const {
    sendResponse, status,
} = require('../../utils/response');
let message,error,data;

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const addCompany = async (req, res) => {
  const {
    name,logo
  } = req.body;

  let validateRequest=await validate.addCompany(req);

  if (validateRequest.result) {
  
  try {
    const {rows} = await model.addCompany(name);
    const dbResponse = rows[0];

    data = dbResponse;
    message = 'Registered successfully';
    return sendResponse(res,message,error,status.created,data);   
    
  } catch (error) { 
    message = 'Operation was not successful';
    return sendResponse(res,message,error,status.error,{logError:true});  
  }
}
else{
  
  return sendResponse(res,validateRequest.message,validateRequest.error,validateRequest.status);
}
};

module.exports={
  addCompany
}