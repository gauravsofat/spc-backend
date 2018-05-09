const express = require('express');

const User = require('../models/user'); // Import model

const mailer = require('../mailer.js'); // For welcomeSender function - Not Gaurav

const createNewAccount = (req, res) => {
  User.findOne({ sid: req.body.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    // Create account after checking for duplicates
    else if (user == null) {
      User.create(
        { sid: req.body.sid, email: req.body.email, password: req.body.password },
        (errorInCreation) => {
          if (errorInCreation) console.log(errorInCreation);
          else {
            mailer.welcomeSender(req.body.sid);       // Sending mail confirmation - Not Gaurav
            res.json({ message: 'New user created Successfully' });
          }
        },
      );
    } else res.json({ message: 'Duplicate User Found.' });
  });
};

const router = express.Router();
router.post('/', createNewAccount);

module.exports = router;
