const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());

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

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
