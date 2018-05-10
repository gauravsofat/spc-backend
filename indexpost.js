'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
//const jwt = require('jwt-simple');
const mailer = require('./mailer-test.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/forgotpassword', function (req, res) {
    res.send('<form action="/passwordreset" method="POST">' +
        '<input type="number" name="studentid" value="" placeholder="Enter your id..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');
});

app.post('/passwordreset', function (req, res) {
    if (req.body.studentid !== undefined) {
        var sid = req.body.studentid;

        // Using id, find user from your database.
        // var payload = {
        //     id: sid,        // User ID from database
        // };

        // Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        //var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

        //var token = jwt.encode(payload, secret);

        // Send email containing link to reset password.
        // In our case, will just return a link to click.
        //res.send('<a href="/resetpassword/' + payload.id + '/' + token + '">Reset password</a>');
        mailer.forgotPassword(sid);
        res.json({ message: 'Reset Password mail sent.' });
    } else {
        res.json({ message: 'Email address is missing.' });
    }
});

app.get('/resetpassword/:token', function(req, res) {
    // Fetch user from database using
    // req.params.id
    // Decrypt one-time-use token using the user's
    // current password hash from the database and combine it
    // with the user's created date to make a very unique secret key!
    // For example,
    // var secret = user.password + ‘-' + user.created.getTime();
    //var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
    //var payload = jwt.decode(req.params.token, secret);

    // Gracefully handle decoding issues.
    // Create form to reset password.
    var decoded = jwt.verify(req.params.token, 'shhhhh');
    console.log(decoded.id);

    res.send('<form action="/resetpassword" method="POST">' +
        '<input type="hidden" name="id" value="' + decoded.id + '" />' +
        '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');

    //res.json({ sid: decoded.id });
});

app.post('/resetpassword', function (req, res) {
  res.json({
    message: 'Reached the update post.',
    sid: req.body.id,
    password: req.body.password
 });
});

app.listen(3000, function () {
  console.log('App listening to port 3000!');
});
