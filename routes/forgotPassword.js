const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user'); // Import model

const mailer = require('../mailer.js'); // Import Controllers

const forgPass = (req, res) => {
  // forgotPassword - forgPass
  User.findOne({ sid: req.body.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    else if (user == null) res.json({ message: 'User does not exist.' });
    else {
      mailer.forgotPassword(user.sid);
      res.json({
        message: 'Reset password mail sent.',
        id: user.sid,
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
  if (req.body.password !== undefined) {
    User.findOneAndUpdate(
      { sid: req.body.id },
      { password: req.body.password },
      { new: true },
      (err, user) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({
          message: 'Password has been successfully changed.',
          sid: req.body.id,
        });
      },
    );
  } else {
    res.json({
      message: 'Password is missing.',
      sid: req.body.id,
    });
  }
};

const router = express.Router();
router.post('/', forgPass);
router.get('/:token', resetPassword);
router.put('/', passwordUpdate);
module.exports = router;
