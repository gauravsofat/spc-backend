const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'spc.daiict.noreply@gmail.com',
    pass: process.env.SPC_PASS,
  },
});

// Setup email data with unicode symbols
function welcomeSender(sid) {
  const token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '30d' }); // Expires in 30 days
  const url = `http://localhost:3000/login/${token}`; // Temporary
  const mailOptions = {
    from: '"SPC DAIICT No Reply" <SPC.DAIICT.noReply@gmail.com>',
    to: `${String(sid)}@daiict.ac.in`,
    subject: 'SPC Student Account Confirmation',
    text: 'Please click the given link to activate your student account: ',
    html: `<a href="${url}">${url}</a>`,
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log('Message sent: %s', info.messageId);
  });
  return sid;
}

// Temporary function
function forgotPassword(sid) {
  const token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '1h' }); // Expires in 1 hour
  const url = `http://localhost:3000/resetPassword/${token}`; // Temporary
  const mailOptions = {
    from: '"SPC DAIICT No Reply" <SPC.DAIICT.noReply@gmail.com>', // sender address
    to: `${String(sid)}@daiict.ac.in`, // list of receivers
    subject: 'Placement Account New Password', // Subject line
    text: 'Please click the given link to reset your placement account password: ', // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log('Message sent: %s', info.messageId);
  });
  return sid;
}

module.exports = {
  welcomeSender,
  forgotPassword,
};
