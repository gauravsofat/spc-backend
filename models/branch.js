const mongoose = require('mongoose');

const { Schema } = mongoose;

const branchSchema = new Schema(
  {
    branch: String, // One out of [B.Tech(ICT), B.Tech(CS), M.Tech, M.Sc(IT), M.Des, Ph.D]
    studentList: [String] // Students in that particular branch
  },
  { collection: '' },   // Is there one?
);

module.exports = mongoose.model('Branch', branchSchema);
