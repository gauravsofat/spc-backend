import mongoose from "mongoose";
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    name: String,
    category: String,
    description: String,
    profile: String,
    event: String,
    studentList: [String] // Students selected for the profile
  },
  { collection: "companies" }
);

export default mongoose.model("Company", companySchema);
