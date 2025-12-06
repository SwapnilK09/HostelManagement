import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/* -----------------------------------
   LOGIN PAGE
----------------------------------- */
router.get("/login", (req, res) => {
  res.render("login");
});

/* -----------------------------------
   REGISTER PAGE
----------------------------------- */
router.get("/register", (req, res) => {
  res.render("register");
});

/* -----------------------------------
   REGISTER USER
----------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields check
    if (!name || !email || !password) {
      req.flash("error_msg", "All fields are required!");
      return res.redirect("/users/register");
    }

    // Check if email exists
    const exists = await User.findOne({ email });
    if (exists) {
      req.flash("error_msg", "Email already registered!");
      return res.redirect("/users/register");
    }

    // Create user
    const user = new User({ name, email, password, role });
    await user.save();

    req.flash("success_msg", "Registration successful!");
    return res.redirect("/users/login");

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    req.flash("error_msg", "Registration failed! Try again.");
    return res.redirect("/users/register");
  }
});

/* -----------------------------------
   LOGIN USER
----------------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(" Login Attempt:", email);

  // User exists?
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error_msg", "No account found! Please register.");
    return res.redirect("/users/login");
  }

  // Password match?
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash("error_msg", "Incorrect password!");
    return res.redirect("/users/login");
  }

  // Save session
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  console.log("✅ LOGIN SUCCESS:", req.session.user);

  req.flash("success_msg", "Login successful!");

  // Redirect by role
  if (user.role === "admin") {
    return res.redirect("/complaints/admin");
  }

  return res.redirect("/");
});

/* -----------------------------------
   LOGOUT
----------------------------------- */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
});

export default router;
