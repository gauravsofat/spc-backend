const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    sid: { type: Number, required: true }, // Institute student ID
    firstName: String,
    middleName: String,
    lastName: String,
    email: { type: String, required: true }, // Alternate e-mail address
    dob: Date, // Date of birth
    gender: String, // One out of [Male, Female, Other]
    mobileNumber: String,
    altMobileNumber: String, // Alternate contact
    fatherName: String,
    fatherMobile: String,
    motherName: String,
    motherMobile: String,
    permanentAddress: String,
    currentAddress: String,
    class10grade: Number, // In terms of percentage
    class12grade: Number, // In terms of percentage
    cpi: Number,
    branch: String, // One out of [B.Tech(ICT), B.Tech(CS), M.Tech, M.Sc(IT), M.Des, Ph.D]
    currentBacklogs: Number,
    totalBacklogs: Number,
    areaOfInterest: String, // One out of [IT, EL, CT]
    regList: [String], // Companies that the student has registered for
    offerList: [String], // Companies that the student has received an offer from
    password: { type: String, required: true },
    isUserVerified: { type: Boolean, default: false },
    isAdminVerified: { type: Boolean, default: false },
    interestedInPlacement: Boolean,
  },
  { collection: 'users' },
);

module.exports = mongoose.model('User', userSchema);
