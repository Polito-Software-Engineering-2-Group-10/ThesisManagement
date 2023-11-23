//const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';
nodemailer=nodemailer;

var myemail = "politonotification@gmail.com";
var mypassword = "vbql afhy mvyj afho";

function sendEmail(parameters/*{recipient_email, subject,message }*/) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myemail,
        pass: mypassword,
      },
    });

    const mail_configs = {
      from: myemail,
      to: "salvo.cav96@gmail.com", //parameters.recipient_email
      subject: "prova", //parameters.subject
      text: "try", //parameters.message
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}



/*  with GET
function sendEmail() {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'politonotification@gmail.com',
          pass: 'vbql afhy mvyj afho',
        }
      });
  
      const mail_configs = {
        from: "politonotification@gmail.com",
        to: "s317842@studenti.polito.it",
        subject: "Info proposta tesi",
        text:"proposta di tesi"
      };

      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }*/

  export default sendEmail;






