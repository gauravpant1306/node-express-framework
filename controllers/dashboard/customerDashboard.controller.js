const formidable = require('formidable')
const hummus = require('hummus')
const  _ = require('lodash');
const AWS = require('aws-sdk')
const fs = require('fs')
const textract = require('./../../utils/textract')
const os = require('os')
var path = require('path')
const customerDashboard = require("../../models/customerDashboard")
const modelMaster = require("./../../utils/policyModel")

const moment = require('moment');
const helper = require("../../utils/helper")
const { hashPassword } = require('../../utils/validations');
var qpdf = require('qpdf-wrapper');
const validate = require("./customerDashboard.validate");
const { JWK, JWE, parse } = require('node-jose');
const jose = require('node-jose');
const {
  sendResponse, status,
} = require('../../utils/response');
const { exec } = require('child_process')

let message, error, data;


const addData = async (req, res) => {

  let validateRequest = await validate.addData(req);

  if (validateRequest.result) {

    const {
      name
    } = validateRequest.parsedInput;

    try {
      const user_id = res.userid;

      //implement your logic here

      const { rows: rows_policy } = await customerDashboard.addData(name);
      const dbResponsePolicy = rows_policy[0];
      data = dbResponsePolicy;
      message = 'Registered successfully';
      return sendResponse(res, message, error, partialError ? status.created_partial : status.created, { data });

    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        message = 'User with that name already exist';
        return sendResponse(res, message, error, status.conflict);
      }
      message = 'Operation was not successful';
      return sendResponse(res, message, error, status.error, { logError: true });
    }
  }
  else {

    return sendResponse(res, validateRequest.message, validateRequest.error, validateRequest.status);
  }
};

const viewCustomerDashboard= async (req, res) => {


    try {
      const user_id = res.userid;

      //implement your logic here

      data = null;
      message = 'Data captured successfully';
      return sendResponse(res, message, error, partialError ? status.created_partial : status.created, { data });

    } catch (error) {
      message = 'Operation was not successful';
      return sendResponse(res, message, error, status.error, { logError: true });
    }

};

//This is ample implementation for AWS textract and 
//qpdf (decoding password encoded pdf with password provided in user input)
const decodePDFAndReadWithTextract = async (req, res) => {
  try {
    let validateRequest = await validate.uploadFundUnitStatement(req);

    if (validateRequest.result) {
      // Upload logic
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err)
        }

        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), process.env.APP_NAME));

        const params = {
          input: files.filetoupload.filepath,
          password: fields.password,
          outputPath: path.join(tmpDir, files.filetoupload.newFilename + "_nopass.pdf"),
          exePath: `D:\\Softwares\\qpdf-10.6.3-bin-mingw32\\qpdf-10.6.3\\bin\\qpdf.exe`,
          waitForExit: true
        }

        qpdf.decrypt(params, async (err, resp) => {
          if (err) {
            const pino = require('pino');

            const logger = pino({ level: 'debug', });

            logger.info(String(err));
            error = "file_read_error";
            message = "Please check password";
            return sendResponse(res, message, error, status.error);
          }

          let pdfReader = hummus.createReader(path.join(tmpDir, files.filetoupload.newFilename + "_nopass.pdf"))
          let pageCnt = pdfReader.getPagesCount()
          formData = {};

          try {


            for (var i = 0; i < Math.min(pageCnt, 1); i++) {
              pdfWriter = hummus.createWriter(path.join(tmpDir, files.filetoupload.newFilename + (i + 1)))
              pdfWriter.createPDFCopyingContext(pdfReader).appendPDFPageFromPDF(i);
              pdfWriter.end();
              const fileContent = fs.readFileSync(path.join(tmpDir, files.filetoupload.newFilename + (i + 1)))
              const s3Params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${Date.now().toString()}-${files.filetoupload.originalFilename}-${i + 1}`,
                Body: fileContent,
                ContentType: files.filetoupload.mimetype,
                ACL: 'public-read'
              }
              const s3Content = await s3Upload(s3Params)
              const textractData = await documentExtract(s3Content.Key)
              formData = { ...formData, ...textract.createTables(textractData, { trimChars: [':', ' '] }) }

            }
    
            //for deep cloning of object
            let model=_.cloneDeep(policyModelMaster);
           

            message = 'Uploaded successfully';
            return sendResponse(res, message, error, status.success, { data: policyModel.fundUnitModel });
          }
          catch (error) {
            console.log(error)
            message = 'Cannot parse file';
            return sendResponse(res, message, error, status.error);
          }
          finally {
            try {
              if (tmpDir) {
                fs.rmSync(tmpDir, { recursive: true });
              }
            }
            catch (e) {
              console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
            }

          }
        });
      })
    }
    else {

      return sendResponse(res, validateRequest.message, validateRequest.error, validateRequest.status);
    }
  }
  catch (error) {
    console.log(error)
    message = 'Parameter error';
    return sendResponse(res, message, error, status.error);
  }
};

async function s3Upload(params) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })
  return new Promise(resolve => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err)
        resolve(err)
      } else {
        resolve(data)
      }
    })
  })
};

async function documentExtract(key) {
  return new Promise(resolve => {
    var textract = new AWS.Textract({
      region: process.env.AWS_REGION,
      endpoint: `https://textract.${process.env.AWS_REGION}.amazonaws.com/`,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    })
    var params = {
      Document: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET,
          Name: key
        }
      },
      FeatureTypes: ['FORMS']
    }

    textract.analyzeDocument(params, (err, data) => {
      if (err) {
        return resolve(err)
      } else {
        resolve(data)
      }
    })
  })
};

const testJose = async (req, res) => {

  try {
    let { rows: rows_1 } = await customerDashboard.getInsurerList();

    let { rows: rows_2 } = await customerDashboard.getInsurerProductList();

    data = { insurers: rows_1, products: rows_2 };
    message = 'Retrieved successfully';
    return sendResponse(res, message, error, status.created, { data });

  } catch (error) {
    message = 'Operation was not successful';
    return sendResponse(res, message, error, status.error, { logError: true });
  }

};

const RSAPublicKey = "";

const RSAPrivateKey = "";

const enc = async function JWEencrypt(payload, format = 'compact', contentAlg = "A256GCM", alg = "RSA-OAEP-256") {

  let publicKey = await JWK.asKey(this.RSAPublickey, "pem");
  const buffer = Buffer.from(JSON.stringify(payload))
  const encrypted = await JWE.createEncrypt({ format: format, contentAlg: contentAlg, fields: { alg: alg } }, publicKey)
    .update(buffer).final();
  return encrypted;
}

const sign = async function JWEsign(payload) {

  let publicKey = await JWK.asKey(this.RSAPrivateKey, "pem");
  const buffer = Buffer.from(JSON.stringify(payload))
  const encrypted = await JWE.createEncrypt({ format: format, contentAlg: contentAlg, fields: { alg: alg } }, publicKey)
    .update(buffer).final();
  return encrypted;
}

const dec = async function JWEdecrypt(encryptedBody) {
  let decryptionKey = await jose.JWK.asKey(this.RSAPrivateKey, "pem", { alg: "RSA-OAEP-256", enc: "A256GCM", use: 'enc' });
  const decryptedData = await jose.JWE.createDecrypt(decryptionKey).decrypt(encryptedBody);
  return decryptedData.plaintext.toString();
}


module.exports = {
  addData,
  decodePDFAndReadWithTextract,
  viewCustomerDashboard
}