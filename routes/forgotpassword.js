const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user'); // Import model

const sendPasswordResetMail = require('../controllers/sendPasswordResetMail'); // Import Controllers

const forgotPasswordRequest = (req, res) => {
  User.findOne({ sid: req.body.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    else if (user == null) res.json({ message: 'User does not exist.' });
    else {
      sendPasswordResetMail(user.sid);
      res.json({
        message: 'Reset password mail sent.',
        sid: user.sid,
      });
    }
  });
};

const passwordUpdate = (req, res) => {
  const userData = jwt.verify(req.body.token, process.env.EMAIL_KEY);
  User.findOneAndUpdate(
    { sid: userData.sid },
    { password: req.body.password },
    { new: true },
    (err) => {
      if (err) {
        console.log(err);
        res.json({ message: 'Error. Could not update password.' });
      } else res.redirect('http://localhost:3000/login');
    },
  );
};

const router = express.Router();
router.post('/', forgotPasswordRequest);
router.put('/', passwordUpdate);
module.exports = router;
