const dotenv=require("dotenv");
dotenv.config();
const twilio=require('twilio')(process.env.SMS_SID_TWILIO, process.env.SMS_AUTH_TOKEN_TWILIO);

sendSms :(phone, type, messageParam) => {
    let messageBody;
    if(type=="new_reg")
    {
        messageBody=require("./smsTemplate/auth").newRegistration(messageParam);
    }
    else if(type=="pass_otp")
    {
        messageBody=require("./smsTemplate/auth").forgotPasswordOTP(messageParam);
    }
    else if(type=="pass_change")
    {
        messageBody=require("./smsTemplate/auth").passwordChange(messageParam);
    }
    console.log(phone,"phone")
    twilio.messages
       .create({
          body: messageBody,
          from:process.env.SMS_FROM_TWILIO,
          to: phone
        })
       .finally((e) =>{
           return 0
       });
   }