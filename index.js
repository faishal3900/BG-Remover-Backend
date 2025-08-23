// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import fs from "fs";
// import { exec } from "child_process";
// import path from "path";
// import mongoose from "mongoose";
// import { MONGOURL, PORT } from "./key.js";

// // const express = require("express");
// // const multer = require("multer");
// // const cors = require("cors");
// // const fs = require("fs");
// // const { exec } = require("child_process");
// // const path = require("path");
// // const mongoose = require ("mongoose")

// const app = express();
// app.get("/api/health", (req, res) => {
//   res.send("Hello World");
// });

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//        "https://bg-remover-frontend-seven.vercel.app",
//         "http://localhost:5173",
//         "http://localhost:5174",
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// const upload = multer({ dest: "uploads/" });

// app.post("/remove-bg", upload.single("image"), (req, res) => {
//   const inputPath = req.file.path;
//   const outputPath = `outputs/${req.file.filename}.png`;

//   // Make sure output dir exists
//   if (!fs.existsSync("outputs")) {
//     fs.mkdirSync("outputs");
//   }

//   const command = `python3 remove_bg.py ${inputPath} ${outputPath}`;

//   exec(command, (err, stdout, stderr) => {
//     if (err) {
//       console.error(stderr);
//       return res.status(500).send("Error processing image");
//     }

//     res.sendFile(path.resolve(outputPath), () => {
//       // Clean up files after response
//       fs.unlinkSync(inputPath);
//       fs.unlinkSync(outputPath);
//     });
//   });
// });

// mongoose
//   .connect(MONGOURL)
//   .then(() => console.log("Database connected successfully"))
//   .catch((err) => console.log("something wrong", err));

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import mongoose from "mongoose";
import { MONGOURL, PORT } from "./key.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ Fix CORS (removed slash)
// const allowedOrigins = [
//   "https://bg-remover-frontend-seven.vercel.app", // no trailing slash!
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

app.use(
  cors({
    origin: [
      "https://bg-remover-frontend-seven.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
const upload = multer({ dest: "uploads/" });

app.post("/remove-bg", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `outputs/${req.file.filename}.png`;

  if (!fs.existsSync("outputs")) {
    fs.mkdirSync("outputs");
  }

  const command = `python3 remove_bg.py ${inputPath} ${outputPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error running Python:", stderr);
      return res.status(500).send("Error processing image");
    }

    res.sendFile(path.resolve(outputPath), () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

// MongoDB (if used)
mongoose
  .connect(MONGOURL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Mongo error:", err));

app.listen(PORT || 5000, () => {
  console.log(`Server running at http://localhost:${PORT || 5000}`);
});
