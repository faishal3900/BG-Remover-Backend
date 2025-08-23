import mongoose from "mongoose";
import { request } from "express";

const imgSchema = new mongoose.Schema({
  originalImagePath: {
    type: String,
    required: true,
  },
  outputImagePath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

export default imgSchema;
