var url = require('url');
var dotenv=require('dotenv');
dotenv.config();

const fullUrl= (req,path)=> {
  return new url.URL(path,process.env.BASE_URL);
};

const removeDateText=(dateString)=>{
  return dateString.replace("st", "")
  .replace("nd", "")
  .replace("rd", "")
  .replace("th", "");
}

const extractNumberFromString=(string)=>{
  return  parseFloat(string.replace(/[^0-9\.]/g,''));
}

let isArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

let isObject = function(a) {
  return (!!a) && (a.constructor === Object);
};

module.exports={fullUrl,removeDateText,extractNumberFromString,isArray,isObject};