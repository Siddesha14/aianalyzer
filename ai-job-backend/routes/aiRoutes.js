const express = require("express");
const multer = require("multer");

const {
  analyzeResume,
  analyzeResumePDF,
  analyzeJD,
  analyzeJDPDF,
  matchResumeJD,
  matchResumeJDPDF,
  generateBullets,
  generateBulletsPDF,
} = require("../controllers/aiController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Resume
router.post("/resume", analyzeResume);
router.post("/resume/pdf", upload.single("file"), analyzeResumePDF);

// JD
router.post("/jd", analyzeJD);
router.post("/jd/pdf", upload.single("jd"), analyzeJDPDF);

// Match
router.post("/match", matchResumeJD);
router.post(
  "/match/pdf",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jd", maxCount: 1 },
  ]),
  matchResumeJDPDF
);

// Bullets
router.post("/bullets", generateBullets);
router.post("/bullets/pdf", upload.single("file"), generateBulletsPDF);

module.exports = router;
