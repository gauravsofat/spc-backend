// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const signup = require('./routes/signup');
const login = require('./routes/login');

// Import model for user verification - Not Gaurav
const User = require('./models/user');
// Not Gaurav ended

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

// Email verification and redirection - Not Gaurav
app.get('/login/:token', function (req, res) {
  try {
    //const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
    var decoded = jwt.verify(req.params.token, process.env.EMAIL_KEY); // decoded.id = student id
    //await models.User.update({ confirmed: true }, { where: { id } });
    User.findOneAndUpdate({ sid: decoded.id }, { isUserVerified: true }); // Find and Update
  } catch (e) {
    res.send('error');
  }
  return res.redirect('/login');  // Redirect to login page
});
// Not Gaurav Ended

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error, Something Broke' });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port, '...'));
