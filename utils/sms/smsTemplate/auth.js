const dotenv=require("dotenv");
dotenv.config();

const newRegistration=(messageParam)=>{
    return `Welcome {$messageParam.username}, you have been succesfully registered with Actecal. 
    Regards,
    ACTECAL Team`;
};

const passwordChange=(messageParam)=>{
    return `Hi {$messageParam.username}, your password is successfully changed
    Regards,
    ACTECAL Team`;
};

const forgotPasswordOTP=(messageParam)=>{
    return `Hi {$messageParam.username}, your OTP for new password is: {$messageParam.OTP}
    Regards,
    ACTECAL Team`;
};

module.exports={
    newRegistration,
    passwordChange,
    forgotPasswordOTP
};