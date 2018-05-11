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

const sendConfirmationMail = (sid) => {
  const token = jwt.sign({ id: sid }, process.env.EMAIL_KEY, { expiresIn: '30d' }); // Expires in 30 days
  const url = `http://localhost:3000/login/${token}`; // Temporary
  const mailOptions = {
    from: '"SPC DAIICT No Reply" <spc.daiict.noreply@gmail.com>',
    to: `${String(sid)}@daiict.ac.in`,
    subject: 'SPC Student Account Confirmation',
    text: 'Please click the given link to activate your student account: ',
    html: `<a href="${url}">${url}</a>`,
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = sendConfirmationMail;
