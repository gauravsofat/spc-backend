const jwt = require('jsonwebtoken');

const User = require('../models/user');

const authenticateUser = (req, res, next) => {
  const token = req.get('x-access-token');
  const userData = jwt.verify(token, process.env.SECRET_KEY);

  User.findOne({ sid: userData.sid }).exec((queryError, user) => {
    if (queryError) console.log(queryError);
    else if (user == null) res.json({ message: 'Authentication failure. User does not exist.' });
    else {
      res.locals.sid = userData.sid;
      next();
    }
  });
};

module.exports = authenticateUser;
