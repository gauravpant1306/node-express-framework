const authModel=require("../../models/auth/auth")

/* eslint-disable camelcase */
const moment =require('moment');

const {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty  
} =require('../../utils/validations');


const {
    sendResponse, status,
} = require('../../utils/status');
const { Request,Response } = require('express-oauth-server');
let message,error,data;

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const viewList = async (req, res) => {

  message = 'Implement your code here';
    error="validation_failure";
    return sendResponse(res,message,error,status.bad);

};


module.exports={
  viewList
}