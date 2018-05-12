// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const signup = require('./routes/signup');
const login = require('./routes/login');
const forgotPassword = require('./routes/forgotPassword');

// Connect to database
mongoose.connect(process.env.LINK_TO_DB);
mongoose.set('debug', true);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

const app = express();

app.use(helmet()); // Sanitization of incoming requests
app.use(morgan('tiny')); // Logging of incoming requests
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

app.use('/signup', signup);
app.use('/login', login);
app.use('/forgotpassword', forgotPassword);

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.json({ message: 'Server Error, Something Broke' });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port, '...'));
