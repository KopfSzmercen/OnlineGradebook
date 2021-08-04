"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
            type: mongoose_1.default.Types.ObjectId,
            ref: "Student"
        }
    ]
});
exports.Class = mongoose_1.default.model("Class", classSchema);
