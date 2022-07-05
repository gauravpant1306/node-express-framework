var fs = require('fs');
var handlebars = require('handlebars');

const MailService = require("./mailService");

var sendEmail = async function (subject, type, data, user) {

  let readHTMLFile = function (path, callback) {
    fs.readFile(path, {
      encoding: 'utf-8'
    }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  readHTMLFile(file_path, function (err, html) {

    var template = handlebars.compile(html);
    var htmlToSend = template(data);
    console.log(htmlToSend);
    let mailService = new MailService();
    let userEmail = user === "admin" ? `arpit@singsys.com` : `${data.email}`
    //Send Mail Start
    var mailOptions = {
      from: "noreply@valuenable.in", // sender address
      to: userEmail,
      subject: subject,
      html: htmlToSend,
    };

    mailService.sendMail(mailOptions);
  })

}

module.exports = sendEmail