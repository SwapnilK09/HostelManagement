import express from "express";
import Room from "../models/room.model.js";

const router = express.Router();

// Student View Rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.render("rooms", { rooms });
});

// Admin View Rooms
router.get("/admin", async (req, res) => {
  const rooms = await Room.find();
  res.render("rooms_admin", { rooms });
});

// Admin Add Room
router.post("/add", async (req, res) => {
  await Room.create(req.body);
  res.redirect("/rooms/admin");
});

export default router;
