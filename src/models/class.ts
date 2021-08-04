import mongoose from "mongoose";

const { Schema } = mongoose;

const classSchema = new Schema({
  className: {
    type: String,
    required: true
  },
  studentsNumber: {
    type: Number,
    required: true
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Student"
    }
  ]
});

export const Class = mongoose.model("Class", classSchema);
