const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sid: { type: String, required: true, match: /\d{9}/ }, // Institute student ID
    firstName: String,
    middleName: String,
    lastName: String,
    email: { type: String, required: true }, // Alternate e-mail address
    dob: Date, // Date of birth
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    mobileNumber: String,
    altMobileNumber: String, // Alternate contact
    fatherName: String,
    fatherMobile: String,
    motherName: String,
    motherMobile: String,
    permanentAddress: String,
    currentAddress: String,
    class10grade: Number,
    class12grade: Number,
    cpi: Number,
    branch: {
      type: String,
      enum: ['ICT', 'ICT+CS', 'M.Tech', 'M.Sc(IT)', 'M.Sc(ICT-ARD)', 'M.Des', 'Ph.D'],
    },
    currentBacklogs: { type: Number, min: 0 },
    totalBacklogs: { type: Number, min: 0 },
    areaOfInterest: String,
    regList: [String], // Companies that the student has registered for
    offerList: [String], // Companies that the student has received an offer from
    password: { type: String, required: true, minlength: 8 },
    isUserVerified: { type: Boolean, default: false },
    isAdminVerified: { type: Boolean, default: false },
    interestedInPlacement: Boolean,
  },
  { collection: 'users' },
);

module.exports = mongoose.model('User', userSchema);
