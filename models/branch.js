const mongoose = require('mongoose');

const { Schema } = mongoose;

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['ICT', 'ICT+CS', 'M.Tech', 'M.Sc(IT)', 'M.Sc(ICT-ARD)', 'M.Des', 'Ph.D'],
    },
    studentList: [String], // List of students in this branch
  },
  { collection: 'branches' },
);

module.exports = mongoose.model('Branch', branchSchema);
