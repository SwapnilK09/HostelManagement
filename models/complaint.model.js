import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  image: String,
  status: { type: String, default: "pending" }
});

export default mongoose.model("Complaint", complaintSchema);
