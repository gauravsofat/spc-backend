const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const userAuth = (req, res) => {
  User.findOne({ sid: req.body.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    else if (user == null) res.json({ message: 'User does not exist.' });
    else if (user.isUserVerified === false) res.json({ message: 'Email Confirmation Pending' });
    else if (user.password !== req.body.password) res.json({ message: 'Incorrect Password' });
    else {
      const token = jwt.sign(
        { sid: user.sid, admin: user.sid === process.env.ADMIN_ID },
        process.env.SECRET_KEY,
        { expiresIn: 1440 },
      );
      res.json({
        message: 'Successful Authentication',
        token,
        admin: user.sid === process.env.ADMIN_ID,
      });
    }
  });
};

// User account verification via email
const verifyUser = (req, res) => {
  // Extract user data from token
  const userData = jwt.verify(req.params.token, process.env.EMAIL_KEY);

  User.findOneAndUpdate(
    { sid: userData.id },
    { isUserVerified: true },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.json({ message: 'Database error. User could not be verified' });
      } else res.json({ message: 'User has been verified.', sid: updatedUser.sid });
    },
  );
};

const router = express.Router();
router.post('/', userAuth);
router.get('/:token', verifyUser);
module.exports = router;
