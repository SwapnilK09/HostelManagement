import express from "express";
import Facility from "../models/facility.model.js";

const router = express.Router();

// Student: View facilities
router.get("/", async (req, res) => {
  const facilities = await Facility.find();
  res.render("facilities", { facilities });
});

// Admin: Add facility
router.post("/add", async (req, res) => {
  try {
    await Facility.create(req.body);
    res.redirect("/facilities");
  } catch (err) {
    res.send(err.message);
  }
});

export default router;
