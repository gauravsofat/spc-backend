const express = require('express');

const User = require('../models/user');

const authenticateUser = require('../controllers/authenticateUser');
const utils = require('../controllers/utils');

const viewProfile = (req, res) => {
  if (res.locals.isAdmin) res.locals.sid = req.params.sid;
  User.findOne({ sid: res.locals.sid }).exec((queryError, user) => {
    if (queryError) {
      console.log(queryError);
      res.json({ message: 'Database query error. Requested document could not be found' });
    } else if (user === null) {
      res.json({ message: 'Invalid request parameter. Document does not exist.' });
    } else res.json({ message: 'User profile successfully found', user });
  });
};

const updateProfile = (req, res) => {
  User.update({ sid: res.locals.sid }, utils.getUpdatedProps(req.body), (updateError) => {
    if (updateError) {
      console.log(updateError);
      res.json({ message: 'Failed to update user profile' });
    } else res.json({ message: 'Successfully updated user profile' });
  });
};

const approveProfile = (req, res) => {
  User.findOneAndUpdate(
    { sid: req.params.sid },
    { isAdminVerified: true },
    { new: true },
    (updateError, user) => {
      if (updateError) {
        console.log(updateError);
        res.json({ message: 'Database query error. Failed to complete request.' });
      } else if (user == null) {
        res.json({ message: 'Invalid parameter. Requested document does not exist.' });
      } else res.json({ message: 'Successfully completed request' });
    },
  );
};

const getProfileList = (req, res) => {
  User.find(null, 'sid firstName lastName cpi').exec((queryError, userList) => {
    if (queryError) {
      console.log(queryError);
      res.json({ message: 'Database query error. Failed to complete request' });
    } else res.json({ message: 'Successfully obtained profile list', userList });
  });
};

const router = express.Router();

router.use(authenticateUser); // Authentication Middleware

router.get('/', viewProfile);
router.get('/list', utils.isAdmin, getProfileList);
router.get('/:sid', utils.isAdmin, viewProfile);
router.post('/', updateProfile);
router.put('/:sid', utils.isAdmin, approveProfile);

module.exports = router;
