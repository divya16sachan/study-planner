import { model, Schema } from "mongoose";

// Define a routine item schema
const routineItemSchema = new Schema({
  time: { type: String, required: true },       // start time
  endTime: { type: String, required: true },    // end time
  subject: { type: String, required: true },    // subject name
  description: { type: String }                 // optional description
});

// Define the weekly routine schema
const routineSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  Sun: [routineItemSchema],
  Mon: [routineItemSchema],
  Tue: [routineItemSchema],
  Wed: [routineItemSchema],
  Thu: [routineItemSchema],
  Fri: [routineItemSchema],
  Sat: [routineItemSchema]
}, { timestamps: true });

// Create the model
const Routine = model("Routine", routineSchema);

export default Routine;