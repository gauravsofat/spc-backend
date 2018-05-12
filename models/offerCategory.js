const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    category: { type: String, required: true }, // One out of [A, A1] A - <9, A1 - >9
    companyList: [{
      name: String,
      ctc: Number
    }],
    studentList: [String] // Students in that particular offer category
  },
  { collection: '' },   // Is there one?
);

module.exports = mongoose.model('Category', categorySchema);
