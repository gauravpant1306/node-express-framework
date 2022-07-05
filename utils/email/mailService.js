const dotenv=require("dotenv");
dotenv.config();
const nodemailer = require('nodemailer');

class MailService {
    /**
     * @description Create an instance of MailService
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    async sendMail(mailOptions) {
        try {
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }
    
}

module.exports = MailService;