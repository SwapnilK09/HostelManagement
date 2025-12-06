import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const bucket = process.env.SUPABASE_BUCKET;  // ← load from .env

    if (!bucket) {
      return res.json({ error: "Bucket name missing in .env!" });
    }

    const fileName = `complaints/${Date.now()}-${req.file.originalname}`;

    // Upload file to bucket
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Generate Public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    res.json({ url: data.publicUrl });

  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
