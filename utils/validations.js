/* eslint-disable camelcase */
const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require("dotenv");
const moment=require('moment');
dotenv.config();
/**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const saltRounds = 10;

const hashPassword = password => {
  return new Promise((resolve, reject) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if(err)
      {
        reject(err);
      }
      else{
        resolve(hash);}
    });
});
  });
}

const isNumber=(n)=> { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 
/**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
const comparePassword = (hashedPassword, password) => {
  return new Promise((resolve, reject) => {
   bcrypt.compare(password, hashedPassword, function(err, res) {
    if(err)
      {
        reject(err);
      }
      else{
        resolve(res);}
    });
  });
};

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

const isValidMobile = (mobile) => {
  const regEx = /^(\+[0-9]+)*([6-9]{1})([0-9]{9})$/;
  return regEx.test(mobile);
};

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  } return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.toString().replace(/\s/g, '').length) {
    return false;
  } return true;
};
/**
   * isEmptyArray helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
 const isEmptyArray = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if(!isArray(input))
  {
    return true;
  }
  input.forEach(element => {
    if(isObject(element))
    {
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          const item = element[key];
          if (!item.toString().replace(/\s/g, '').length) {
            return true;
          }
        }
      }
    }
    else{
    if (!element.toString().replace(/\s/g, '').length) {
      return true;
    }
  }
  });
   return false;
};

/**
   * isEmptyArray helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
 const isValidDateInObjectArray = (input,elementKey) => {
  if (input === undefined || input === '') {
    return true;
  }
  if(!isArray(input))
  {
    return true;
  }
  
    if(isObject(input))
    {
      for (const key in input) {
        if(key==elementKey)
        {
        if (Object.hasOwnProperty.call(input, key)) {
          const item = input[key];
         return isValidDate(item);
        }
      }
      }
    }
    return true;
};

let isArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

let isObject = function(a) {
  return (!!a) && (a.constructor === Object);
};

/**
   * Generate Token
   * @param {string} id
   * @returns {string} token
   */
const generateUserToken = (email, id, is_admin, first_name, last_name) => {
  const token = jwt.sign({
    email,
    user_id: id,
    is_admin,
    first_name,
    last_name,
  },
  process.env.SECRET, { expiresIn: '3d' });
  return token;
};

const generateOTP=()=> {
          
  // Declare a digits variable 
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const isValidDate=(input)=> {
          
  return moment(input, "DD/MM/YYYY", true).isValid(); 
}

const isValidDateIfNotEmpty=(input)=> {
  if (input === undefined || input === '') {
    return false;
  }
  return moment(input, "DD/MM/YYYY", true).isValid(); 
}

const isValidNumber=(input)=>{
  return !isNaN(input);
}

module.exports ={
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
  isNumber,
  generateOTP,
  isValidMobile,
  isValidDate,
  isValidDateIfNotEmpty,
  isValidNumber,
  isEmptyArray,
  isValidDateInObjectArray
};