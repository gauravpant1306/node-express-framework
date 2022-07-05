const {
  isValidMobile,
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
const createUser = async (req) => {
  const {
    email, first_name, last_name, password,mobile
  } = req.body;

  if (isEmpty(email) || isEmpty(first_name)  || isEmpty(password)||isEmpty(mobile)) {
    
    message = `${isEmpty(email)?"Email,":""}${isEmpty(password)?"Password,":""}${isEmpty(first_name)?"Firstname,":""}${isEmpty(mobile)?"Mobile":""} field cannot be empty`;
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);
  }
  else if (!isValidEmail(email)) {
    message = 'Please enter a valid Email';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);    
  }
  else if (!isValidMobile(mobile)) {
    message = 'Please enter a valid mobile number';
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
    const input= {
      email, first_name, last_name, password,mobile
    }
    return sendValidateResponse({result:true,input:input});
  }
};

const forgotPassword = async (req) => {
  const {
    email
  } = req.body;

  if (isEmpty(email)) {
    
    message = 'Email, password, first name and last name field cannot be empty';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);
  }
  else if (!isValidEmail(email)) {
    message = 'Please enter a valid Email';
    error="validation_failure";
    return sendValidateResponse(false,message,error,status.bad);    
  }
  else
  {
    const input= {
      email
    }
    return sendValidateResponse({result:true,input:input});
  }
};

const resetPassword = async (req) => {
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
    const input= {
      email, first_name, last_name, password
    }
    return sendValidateResponse({result:true,input:input});
  }
};


module.exports={
    createUser,
    forgotPassword,
    resetPassword
}