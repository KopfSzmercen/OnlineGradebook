"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.Grade = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
exports.Grade = mongoose_1.default.model("Grade", gradeSchema);
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
exports.Student = mongoose_1.default.model("Student", studentSchema);
