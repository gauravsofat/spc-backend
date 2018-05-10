// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const signup = require('./routes/signup');
const login = require('./routes/login');
const forgotPassword = require('./routes/forgotPassword');

// Import model
const User = require('./models/user');

// Connect to database
mongoose.connect(process.env.LINK_TO_DB);
mongoose.set('debug', true);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

const app = express();

app.use(helmet()); // Sanitization of requests
app.use(morgan('tiny')); // HTTP request logging
app.use(express.json()); // Parsing requests as in JSON format
app.use(bodyParser.urlencoded({ extended: false }));  // For using body parser

// Set custom HTTP response headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token',
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/signup', signup);
app.use('/login', login);
app.use('/forgotPassword', forgotPassword);

// Email verification and redirection
app.get('/login/:token', (req, res) => {
  try {
    // Extract user details from token
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_KEY);

    // Find and Update
    User.findOneAndUpdate({ sid: decoded.id }, { isUserVerified: true }, { new: true }, function (err, user) {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({
        message: 'User has been verified.',
        sid: req.body.id
     });
    });
  } catch (e) {
    res.json({ message: 'User could not be verified.'});
  }
  return res.redirect('/login'); // Redirect to login page
});

// Forgot Password section - token verification and new password
app.get('/resetPassword/:token', function (req, res) {
  var decoded = jwt.verify(req.params.token, process.env.EMAIL_KEY);

  // Still not sure how this section should work
  // Sample form created for testing - student id passed as a hidden input
  // Can add additional id field to confirm whether the student id we sent and the id he entered are same
  // res.send('<form action="/passwordUpdate" method="POST">' +
  //     '<input type="hidden" name="id" value="' + decoded.id + '" />' +
  //     '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
  //     '<input type="submit" value="Reset Password" />' +
  // '</form>');

  // If a form file is to be rendered
  // res.render('<file_name>', { id: decoded.id});

  res.json({ sid: decoded.id });  // Display, just for formality - remove
});

// Still forgot password section - for updating password
app.post('/passwordUpdate', function (req, res) {
  // Assuming only one input field for password and no confirm password - can be added later
  if (req.body.password !== undefined) {
    User.findOneAndUpdate({ sid: req.body.id }, { password: req.body.password }, { new: true } function (err, user) {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({
        message: 'Password has been successfully changed.',
        sid: req.body.id
     });
    });
  } else {
    res.json({
      message: 'Password is missing.',
      sid: req.body.id
   });
  }
});


// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error, Something Broke' });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port, '...'));
