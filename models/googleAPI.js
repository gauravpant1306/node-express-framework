const axios = require('axios');
const googleEndpoint=require("./../utils/googleEndpoints");
const https = require('https');

// constructor
const GoogleApi = function () {};

//for development only
//sample implementation to get data from google sheet api
const httpsAgent = new https.Agent({
   rejectUnauthorized: false,
});
axios.defaults.options = httpsAgent;

GoogleApi.getInsurerData = async function () {
   return new Promise((resolve, reject) => {
      let googleEngineLink=googleEndpoint.getInsurerData;

      axios
         .get(googleEngineLink)
         .then(res => {
            resolve(res);
         })
         .catch(error => {
            reject(error);
         });
   });
};


GoogleApi.getAnalysisData = async function (model) {
   return new Promise((resolve, reject) => {

      let googleEngineLink=googleEndpoint.getPolicyCalculationAnalysis;

      var body = {
         
         name:model.productName
      };

      axios
         .post(googleEngineLink,body)
         .then(res => {
            resolve(res);
         })
         .catch(error => {
            reject(error);
         });
   });
};

module.exports = GoogleApi;