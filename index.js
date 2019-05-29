"use strict";
const nodemailer = require("nodemailer");
const inquirer = require('inquirer')


// async..await is not allowed in global scope, must use a wrapper
async function main() {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  var questions = [{
    type: 'input',
    name: 'receiver_email',
    message: "What's receiver email?",
  }]

  inquirer.prompt(questions).then(async (answers) => {
    // create reusable transporter object using the default SMTP transport
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: testAccount.user, // sender address
      to: answers['receiver_email'], // list of receivers
      subject: "Hello ", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}

main().catch(console.error);