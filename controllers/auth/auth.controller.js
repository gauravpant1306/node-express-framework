const authModel=require("../../models/auth/auth");
const notification=require("../../utils/notification");

/* eslint-disable camelcase */
const moment =require('moment');

const { hashPassword,generateOTP} =require('../../utils/validations');

const validate=require("./auth.validate");
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
const createUser = async (req, res) => {
  const {
    email, first_name, last_name, password,mobile
  } = req.body;

  let validateRequest=await validate.createUser(req);

  if (validateRequest.result) {

  const hashedPassword = hashPassword(password);
  
  try {
    const {rows} = await authModel.createUser(email, first_name, last_name, hashedPassword,mobile);
    const dbResponse = rows[0];
    delete dbResponse.password;

    data = dbResponse;
    message = 'Registered successfully';
    return sendResponse(res,message,error,status.created,data);   
    
  } catch (error) {        
    if (error.routine === '_bt_check_unique') {
        message = 'User with this Email or Mobile already exist';
        return sendResponse(res,message,error,status.conflict);   
    }
    message = 'Operation was not successful';
    return sendResponse(res,message,error,status.error,{logError:true});  
  }
}
else{
  
  return sendResponse(res,validateRequest.message,validateRequest.error,validateRequest.status);
}
};

/**
   * Forgot Password
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
 const forgotPassword = async (req, res) => {
  const {
    email
  } = req.body;

  let validateRequest=await validate.forgotPassword(req);

  if (validateRequest.result) {

  const randomOTP=generateOTP();
  
  const hashedOTP = hashPassword(randomOTP);
  
  try {
    const {rows} = await authModel.forgotPassword(email, hashedOTP);
    const dbResponse = rows[0];

    message = 'OTP sent successfully';

    notification.notifyByEmail("Password reset OTP","forgot_pass_otp",randomOTP,dbResponse.email);
    notification.notifyBySMS(dbResponse.mobile,"forgot_pass_otp",randomOTP);
    
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

/**
   * Reset Password
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
 const resetPassword = async (req, res) => {
  const {
    email, otp,password
  } = req.body;

  let validateRequest=await validate.resetPassword(req);

  if (validateRequest.result) {

  const hashedPassword = hashPassword(password);
  
  try {
    let userResult=await  authModel.getUserFromEmail(email);
            user=userResult.rows[0];
     let otpCheck=comparePassword(user.otp_password_reset,otp);
    if(!otpCheck)
    {
      message = 'OTP cannot be verified. Please check again';
      return sendResponse(res,message,error,status.conflict);   
    }
    const {rows} = await authModel.changePassword(email, hashedPassword);
    const dbResponse = rows[0];

    message = 'Password changed successfully';

    notification.notifyByEmail("Password change","change_pass",dbResponse,dbResponse.email);
    notification.notifyBySMS(dbResponse.mobile,"change_pass",dbResponse);
    
    return sendResponse(res,message,error,status.created,dbResponse);   
    
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
    createUser,
    forgotPassword,
    resetPassword
}