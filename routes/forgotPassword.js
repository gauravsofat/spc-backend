const express = require('express');

const User = require('../models/user'); // Import model

const mailer = require('../mailer.js'); // Import Controllers

const forgPass = (req, res) => {        // forgotPassword - forgPass
  User.findOne({ sid: req.body.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    else if (user == null) res.json({ message: 'User does not exist.' });
    else {
      mailer.forgotPassword(user.sid);
      res.json({
        message: 'Reset password mail sent.',
        id: user.sid
      });
    }
  });
};

const router = express.Router();
router.post('/', forgPass);
module.exports = router;
