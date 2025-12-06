import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  category: String,
  description: String,
  images: [String]
});

export default mongoose.model("Facility", facilitySchema);
