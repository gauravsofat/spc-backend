const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, enum: ['A1', 'A'] },
    employerList: [String], // List of employers in this category
  },
  { collection: 'categories' },
);

module.exports = mongoose.model('Category', categorySchema);
