const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobTypeSchema = new Schema(
  {
    name: { type: String, required: true, enum: ['I2', 'I6', 'J', 'I+J'] },
    employerList: [String], // List of employers for this jobType
  },
  { collection: 'jobTypes' },
);

module.exports = mongoose.model('JobType', jobTypeSchema);
