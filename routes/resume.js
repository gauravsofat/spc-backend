const router = require('express').Router();
const mongoose = require("mongoose");
const fs = require('fs');

let Grid = require("gridfs-stream");
let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

// Already tested all the functionalities in a local Database, works just filename
// Test it on your end as well
// I know you dont like this format, but its working (i hope), so i dont see any point in changing it

conn.once("open", () => {
    gfs = Grid(conn.db);

    // A test route to be deleted later, as to how i imagine this being used.
    router.get('/resumeDownload/:studentid', (req, res) => {
      // Sends a link for download of resume in one click
      res.send(`<a href="/profile/resume/${req.params.studentid}" download> Click to download. </a>`);
    });

    // To display the resume according to student id.
    // studentid == 201601067.pdf (example parameter)
    router.get('/resume/:studentid', (req, res) => {
      let sid = req.params.studentid;
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
                // let img = 'data:application/pdf;base64,' + Buffer(data).toString('base64');
                // res.end(img);
            });

            readstream.on('error', (err) => {
              // if theres an error, respond with a status of 500
              // responds should be sent, otherwise the users will be kept waiting
              // until Connection Time out
                res.status(500).send(err);
                console.log('An error occurred!', err);
            });
        });
    });

    // To upload the resume, tested it via postman, works
    router.post('/resume', (req, res) => {
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
          // using callbacks is important !
          // writeStream should end the operation once all data is written to the DB
          writeStream.write(part.data, () => {
            writeStream.end();
          });
        } else {
          res.json({ message: "The file type was incorrect." });
        }
    });
});

module.exports = router;
