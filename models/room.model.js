import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  type: String,
  capacity: Number,
  amenities: [String],
  images: [String]
});

export default mongoose.model("Room", roomSchema);
