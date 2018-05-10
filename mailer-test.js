const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'chaku98rohit@gmail.com',
        pass: 'mjain212'
    }
});
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// create reusable transporter object using the default SMTP transport

// setup email data with unicode symbols
function forgotPassword(sid) {
  var token = jwt.sign({ id: sid }, 'shhhhh');
  const url = `http://localhost:3000/resetpassword/${token}`;
  let mailOptions = {
      from: '"SPC Backend" <chaku98rohit@gmail.com>', // sender address
      to: String(sid) + '@daiict.ac.in', // list of receivers
      subject: 'Forgot Password Testing', // Subject line
      text: 'Click url for redirection and verificatiom.', // plain text body
      html: `<a href="${url}">${url}</a>` // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          return ;
      }
      console.log('Message sent: %s', info.messageId);
  });
  return sid;
}

module.exports = {
  forgotPassword
}
