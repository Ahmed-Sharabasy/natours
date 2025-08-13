const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, //sandbox.smtp.mailtrap.io
    port: process.env.EMAIL_PORT, // 465
    secure: false, // for port
    auth: {
      user: process.env.EMAIL_USERNAME, //2f57314f60ef88
      pass: process.env.EMAIL_PASSWORD, // 2063e76571ea20
    },
  });
  //2) Define email options
  const mailOptions = {
    from: 'ahmed <a@email.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
    // html:
  };
  //3) Send mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
