// Import Dependencies
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const busboyBodyParser = require('busboy-body-parser');
const Grid = require('gridfs-stream');
const fs = require('fs')

// Import routes
const signup = require('./routes/signup');
const login = require('./routes/login');
const forgotpassword = require('./routes/forgotpassword');
const profile = require('./routes/profile');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.LINK_TO_DB);
mongoose.set('debug', true);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'MongoDB Error: '));
conn.on('connected', () => {
  console.log('Connected To Database...');
});

Grid.mongo = mongoose.mongo;
let gfs;

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

// Will create a separate route later for all this code, have a look at it and test it
// At present it only displays the pdf, it can be downloaded using front end
// HTML <a> download attribute

// Once you review this we can start with its route

// Usage format for mongoose gridfs-stream (only gridfs no multer)
conn.once("open", () => {
    gfs = Grid(conn.db);
    // Sample download testing
    app.get('/resumeDownload/:studentid', (req, res) => {
      res.send(`<a href="/resume/${req.params.studentid}" download> Click to download. </a>`);
    });
    // To display data according to sid.pdf
    app.get('/resume/:studentid', (req, res) => {
      let sid = req.params.studentid; // Should be of the form 201601067.pdf
        gfs.files.find({
            filename: sid
        }).toArray((err, files) => {

            if (files.length === 0) {
                return res.status(404).send({
                    message: 'File not found'
                });
            }
            let data = [];
            let readstream = gfs.createReadStream({
                filename: files[0].filename
            });

            readstream.on('data', (chunk) => {
                data.push(chunk);
            });

            readstream.on('end', () => {
                data = Buffer.concat(data);
                res.end(data);
            });

            readstream.on('error', (err) => {
                res.send(err);
                console.log('An error occurred!', err);
            });
        });
    });
    // To upload files - pdf
    app.post('/resume', (req, res) => {
        let part = req.files.file;
        if (part.name.endsWith('.pdf')) {
          let writeStream = gfs.createWriteStream({
              filename: part.name,
              mode: 'w',
              content_type: part.mimetype
          });

          writeStream.on('close', (file) => {
            // checking for file
            if(!file) {
              res.status(400).send('No file received');
            }
              return res.status(200).send({
                  message: 'Success',
                  file: file
              });
          });
          // writeStream should end the operation once all data is written to the DB
          writeStream.write(part.data, () => {
            writeStream.end();
          });
        } else {
          res.json({ message: "The file type was incorrect." });
        }
    });
});


// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) next(err);
  res.send('Server Error. Something Broke!');
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on port', port, '...'));
