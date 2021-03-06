const mongoose = require('mongoose');

const { Schema } = mongoose;

const employerSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ['A1', 'A'] },
    ctc: { type: Number, required: true }, // In LPA
    description: { type: String, required: true },
    profile: { type: String, required: true },
    jobType: { type: String, required: true, enum: ['I2', 'I6', 'J', 'I+J'] },
    studentList: [String], // List of registered students
    batch: { type: String, required: true },
  },
  { collection: 'employers' },
);

module.exports = mongoose.model('Employer', employerSchema);
