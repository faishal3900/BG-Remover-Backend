const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.get("/api/health", (req, res) => {
  res.send("Hello World");
});

app.use(
  cors({
    origin: [
      "https://bg-remover-frontend-seven.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const upload = multer({ dest: "uploads/" });

app.post("/remove-bg", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `outputs/${req.file.filename}.png`;

  // Make sure output dir exists
  if (!fs.existsSync("outputs")) {
    fs.mkdirSync("outputs");
  }

  const command = `python3 remove_bg.py ${inputPath} ${outputPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send("Error processing image");
    }

    res.sendFile(path.resolve(outputPath), () => {
      // Clean up files after response
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
