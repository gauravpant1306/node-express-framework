const {
  isValidEmail,
  validatePassword,
  isEmpty  
} =require('../../utils/validations');

const {
  sendValidateResponse, status,
} = require('../../utils/response');
let message,error;

/**
   * Validate a User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const addCompany = async (req) => {
  const {
    name
  } = req.body;

  if (isEmpty(name)) {
    
    message = 'Name field cannot be empty';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);
  }
  else
  {
    const input={
      name
    }
    return sendValidateResponse({result:true,input:input});
  }
};


module.exports={
  addCompany
}