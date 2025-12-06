import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";

import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import facilityRoutes from "./routes/facility.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session + Flash messages
app.use(
  session({
    secret: "hostel_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/facilities", facilityRoutes);
app.use("/complaints", complaintRoutes);
app.use("/upload", uploadRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Server Start
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
