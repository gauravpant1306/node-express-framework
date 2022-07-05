const sendEmail = require("./email/sendEmail");
const sendSMS = require("./sms/sendSMSTwilio");

const notifyByEmail = async function (subject, type, data, to) {

    await sendEmail(subject, type, data, to);
}

const notifyBySMS= async function (phone, type,messageParam) {

    await sendSMS(phone, type, messageParam);
}

module.exports ={
    notifyByEmail,
    notifyBySMS
};