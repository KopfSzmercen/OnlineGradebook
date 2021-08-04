import mongoose from "mongoose";

const { Schema } = mongoose;

const teacherSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  classes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Class"
    }
  ]
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
