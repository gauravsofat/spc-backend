const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'spc.daiict.noreply@gmail.com',
        pass: process.env.SPC_PASS
    }
});
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// create reusable transporter object using the default SMTP transport

// setup email data with unicode symbols
function welcomeSender(sid) {
  var token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '30d' }); // Expires in 30 days
  const url = `http://localhost:3000/login/${token}`;   // Temporary
  let mailOptions = {
      from: '"SPC DAIICT No Reply" <SPC.DAIICT.noReply@gmail.com>', // sender address
      to: String(sid) + '@daiict.ac.in',          // list of receivers
      subject: 'Placement Account Confirmation',  // Subject line
      text: 'Please click the given link to activate your placement account: ', // plain text body
      html: `<a href="${url}">${url}</a>`         // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
  return sid;
}

// Temporary function
function forgotPassword(sid) {
  var token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '1d' });  // Expires in 1 day
  const url = `http://localhost:3000/forgPass/${token}`;   // Temporary
  let mailOptions = {
      from: '"SPC DAIICT No Reply" <SPC.DAIICT.noReply@gmail.com>', // sender address
      to: String(sid) + '@daiict.ac.in',          // list of receivers
      subject: 'Placement Account New Password',  // Subject line
      text: 'Please click the given link to activate your placement account: ',       // plain text body
      html: `<a href="${url}">${url}</a>`         // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  });
  return sid;
}

module.exports = {
  welcomeSender,
  forgotPassword
}
