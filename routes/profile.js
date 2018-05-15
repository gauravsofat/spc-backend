const express = require('express');

const User = require('../models/user');

const authenticateUser = require('../controllers/authenticateUser');

const viewProfile = (req, res) => {
  User.findOne({ sid: res.locals.sid }).exec((queryError, user) => {
    if (queryError) {
      console.log(queryError);
      res.json({ message: 'User profile could not be found' });
    } else res.json({ message: 'User profile successfully found', user });
  });
};

const router = express.Router();
router.use(authenticateUser);
router.get('/', viewProfile);

module.exports = router;
