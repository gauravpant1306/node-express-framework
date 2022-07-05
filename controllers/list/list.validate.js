const {
  hashPassword,
  isValidEmail,
  validatePassword,
  isEmpty  
} =require('../../utils/validations');

const {
  sendValidateResponse, status,
} = require('../../utils/status');
let message,error;

/**
   * Validate a User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const viewList = async (req) => {

  //just a sample implementation
  const {
    email, first_name, last_name, password,
  } = req.body;

  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
    
    message = 'Email, password, first name and last name field cannot be empty';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);
  }
  else if (!isValidEmail(email)) {
    message = 'Please enter a valid Email';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);    
  }
  else if (!validatePassword(password)) {
    message = 'Password must be more than five(5) characters';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);    
  }
  else
  {
    return sendValidateResponse(true);
  }
};


module.exports={
  viewList
}