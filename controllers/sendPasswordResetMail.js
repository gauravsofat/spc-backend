const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Transporter object to send mail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'spc.daiict.noreply@gmail.com',
    pass: process.env.SPC_PASS,
  },
});

const sendPasswordResetMail = (sid) => {
  const token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '1h' });
  const url = `http://localhost:3000/forgotpassword/${token}`; // Temporary
  const mailOptions = {
    from: '"SPC DAIICT No Reply" <SPC.DAIICT.noReply@gmail.com>',
    to: `${String(sid)}@daiict.ac.in`,
    subject: 'Placement Account New Password',
    text: 'Please click the given link to reset your SPC student account password: \n',
    html: `<a href="${url}">${url}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log('Message sent: %s', info.messageId);
  });
  return sid;
};

module.exports = sendPasswordResetMail;
