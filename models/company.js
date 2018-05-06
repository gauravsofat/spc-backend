const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    profile: { type: String, required: true },
    event: { type: String, required: true }, // One out of [I, J, I+J]
    studentList: [String], // Students selected for the profile
  },
  { collection: 'companies' },
);

module.exports = mongoose.model('Company', companySchema);
