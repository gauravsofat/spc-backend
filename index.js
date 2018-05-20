// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const busboyBodyParser = require('busboy-body-parser');
require('dotenv').config();

// Import routes
const signup = require('./routes/signup');
const login = require('./routes/login');
const forgotpassword = require('./routes/forgotpassword');
const profile = require('./routes/profile');
const resume = require('./routes/resume.js');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.LINK_TO_DB);
mongoose.set('debug', true);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

const app = express();

app.use(helmet()); // Sanitization of incoming requests
app.use(morgan('dev')); // Logging of incoming requests
app.use(express.json()); // Parse JSON encoded payloads in request
app.use(express.urlencoded({ extended: false })); // Parse URL encoded payload in requests

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
app.use(busboyBodyParser({ limit: '10mb' }));

app.use('/signup', signup);
app.use('/login', login);
app.use('/forgotpassword', forgotpassword);
app.use('/profile', profile);
app.use('/profile', resume);

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) next(err);
  res.send('Server Error. Something Broke!');
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port', port, '...'));
