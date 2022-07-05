const {
  isEmptyArray,
  isEmpty ,
  isValidDate,
  isValidDateIfNotEmpty,
  isValidNumber,
  isValidDateInObjectArray
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
const addData = async (req) => {
  const {
        name
  } = req.body;

  
  error="validation_failure";

  if (isEmpty(name)) {
    
    message = 'name cannot be empty';
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
  addData
}