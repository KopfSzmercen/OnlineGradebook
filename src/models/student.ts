import mongoose from "mongoose";

const { Schema } = mongoose;

const gradeSchema = new Schema({
  subjectName: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  additionalNotes: {
    type: String,
    required: false
  }
});

export const Grade = mongoose.model("Grade", gradeSchema);

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  grades: [gradeSchema],
  code: {
    type: String,
    required: true
  }
});

export const Student = mongoose.model("Student", studentSchema);
