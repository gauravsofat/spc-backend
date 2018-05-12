const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    jobType: { type: String, required: true }, // One out of [I, J, I+J]
    studentList: [String] // Students in that particular job type
  },
  { collection: '' },   // Is there one?
);

module.exports = mongoose.model('Job', jobSchema);
