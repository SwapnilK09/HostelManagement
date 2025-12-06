import express from "express";
import Complaint from "../models/complaint.model.js";
import { requireStudent, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// -----------------------------
// STUDENT ONLY
// -----------------------------
router.get("/", requireStudent, async (req, res) => {
  const complaints = await Complaint.find({ user: req.session.user._id });
  res.render("complaints", { complaints });
});

router.post("/add", requireStudent, async (req, res) => {
  try {
    await Complaint.create({
      user: req.session.user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.body.imageUrl
    });

    req.flash("success_msg", "Complaint submitted!");
    res.redirect("/complaints");
  } catch (err) {
    req.flash("error_msg", err.message);
    res.redirect("/complaints");
  }
});

// -----------------------------
// ADMIN ONLY
// -----------------------------
router.get("/admin", requireAdmin, async (req, res) => {
  const complaints = await Complaint.find().populate("user");
  res.render("complaints_admin", { complaints });
});

router.post("/status/:id", requireAdmin, async (req, res) => {
  await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect("/complaints/admin");
});

// ADMIN: UPDATE STATUS
router.post("/status/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    req.flash("success_msg", "Status updated!");
    res.redirect("/complaints/admin");

  } catch (err) {
    req.flash("error_msg", "Failed to update status!");
    res.redirect("/complaints/admin");
  }
});

export default router;
