import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    sid: Number, // Institute student ID
    firstName: String,
    middleName: String,
    lastName: String,
    email: String, // Alternate e-mail address
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
    areaOfInterest: String,
    regList: [String], // Companies that the student has registered for
    offerList: [String], // Companies that the student has received an offer from
    password: String,
    isUserVerified: Boolean,
    isAdminVerified: Boolean,
    interestedInPlacement: Boolean
  },
  { collection: "users" }
);

export default mongoose.model("User", userSchema);
