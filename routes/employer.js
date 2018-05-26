const express = require('express');

const Employer = require('../models/employer');

const utils = require('../controllers/utils');
const authenticateUser = require('../controllers/authenticateUser');

const addEmployer = (req, res) => {
  Employer.create({
    name: req.body.name,
    category: req.body.category,
    ctc: req.body.ctc,
    description: req.body.description,
    profile: req.body.profile,
    jobType: req.body.jobType,
    batch: req.body.batch,
  }).then((err) => {
    if (err) {
      console.log(err);
      res.json({ message: 'Database error. Failed to add new event' });
    } else res.json({ message: 'Successfully added new event' });
  });
};

const getEmployerList = (req, res) => {
  Employer.find(null, 'name category jobType').exec((err, companyList) => {
    if (err) {
      console.log(err);
      res.json({ message: 'Database error. Failed to get company list.' });
    } else res.json({ message: 'Successfully obtained company list', companyList });
  });
};

const getEmployerDetails = (req, res) => {
  const fieldSpecifier = res.locals.isAdmin ? ' ' : '-studentList'; // Ensure only admin can view list of student list for an employer
  Employer.findOne({ name: req.params.employerName }, fieldSpecifier).exec((err, employer) => {
    if (err) {
      console.log(err);
      res.json({ message: 'Database error. Failed to get company details.' });
    } else res.json({ message: 'Successfully obtained employer details', employer });
  });
};

const registerStudent = (req, res) => {
  Employer.update(
    { name: req.body.name, jobType: req.body.jobType, batch: req.body.batch },
    { $push: { studentList: res.locals.sid } },
  ).exec((err) => {
    if (err) {
      console.log(err);
      res.json({ message: 'Database error. Failed to register student.' });
    } else res.json({ message: 'Successfully registered student' });
  });
};

const router = express.Router();

router.use(authenticateUser);

router.post('/add', utils.isAdmin, addEmployer);
router.post('/register', registerStudent);
router.get('/list', getEmployerList);
router.get('/:employerName', getEmployerDetails);

module.exports = router;
