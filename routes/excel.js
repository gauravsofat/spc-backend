const express = require('express');
const XLSX = require('xlsx');

const User = require('../models/user');
const Employer = require('../models/employer');

const excel = (req, res) => {
  var employer = req.params.employer;
  // event is already a keyword ? Why is it event anyway, it should have been job type to begin with
  var eventType = req.params.eventType;
  // var ws_data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]

  Employer.findOne({
    name: employer,
    jobType: eventType
  }, {
    studentList: true
  }, (err, employer) => {
    if (err) {
      console.log(err);
      res.json({ message: 'Database query error. Requested document could not be found' });
    } else if (employer === null) {
      res.json({ message: 'Invalid request parameter. Document does not exist.' });
    } else {

      var fileName = `${employer}_${eventType}`;

      // Testing
      console.log(employer.studentList);

      // Auto set and other styling features are in the pro, paid version
      var wscols = [
        { wch: 11 },  // Student ID
        { wch: 22 },  // Full Name
        { wch: 22 },  // email id
        { wch: 8 },   // Gender
        { wch: 12 },  // Mobile number
        { wch: 5 },   // CPI
        { wch: 13 },  // Branch
        { wch: 3 }   // Total backlogs
      ];

      var ws_data = [['Student ID', 'Name', 'E-Mail', 'Sex', 'Contact', 'CPI', 'Branch', 'Backlogs']];

      employer.studentList.forEach((item, index, array) => {
        var row = [];
        User.findOne({
          sid: item
        }, {
          sid: true,
          firstName: true,
          lastName: true,
          email: true,
          gender: true,
          mobileNumber: true,
          cpi: true,
          branch: true,
          totalBacklogs: true
        }, (err, user) => {
          if (err) {
            console.log('Database query error. Requested user could not be found');
          } else if (user == null) {
            console.log('Invalid request parameter. User does not exist.');
          } else {
            row.push(user.sid);
            var name = user.firstName + " " + user.lastName;
            row.push(name);
            row.push(user.email);
            row.push(user.gender);
            row.push(user.mobileNumber);
            row.push(String(user.cpi));
            row.push(user.branch);
            row.push(String(user.totalBacklogs));
            ws_data.push(row);
          }
        });
      });

      var wb = XLSX.utils.book_new();

      wb.Props = {
        Title: `${employer}`,
        Subject: `${eventType}`,
        Author: "SPC DAIICT",
        CreatedDate: new Date()
      };

      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws);
      XLSX.writeFile(wb, fileName);
      // res.download(fileName);
      // res.json({ message: 'Employer with given event successfully found.' });
      res.sendFile(fileName, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Sent: ', fileName);
        }
      });
    }
  });
};

const router = express.Router();
// Employer - company name, eventType - job type (I, J, I+J)
router.get('/:employer/:eventType', excel);
module.exports = router;
