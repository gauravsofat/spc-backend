const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user'); // Import model

const sendPasswordResetMail = require('../controllers/sendPasswordResetMail'); // Import Controllers

const forgotPassword = (req, res) => {
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

const resetPassword = (req, res) => {
  // Token verification and new password
  const decoded = jwt.verify(req.params.token, process.env.EMAIL_KEY);
  res.json({ sid: decoded.id });
};

const passwordUpdate = (req, res) => {
  // For updating password
  User.findOneAndUpdate(
    { sid: req.body.sid },
    { password: req.body.password },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        res.json({ message: 'Error. Could not update password.' });
      } else {
        res.json({
          message: 'Password has been updated successfully.',
          sid: user.sid,
        });
      }
    },
  );
};

const router = express.Router();
router.get('/:token', resetPassword);
router.put('/', passwordUpdate);
router.post('/', forgotPassword);
module.exports = router;
