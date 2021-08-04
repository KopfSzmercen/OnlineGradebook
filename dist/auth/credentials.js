"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherHasStudent = void 0;
const teacher_1 = require("../models/teacher");
const teacherHasStudent = (teacherId, studId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTeacher = yield teacher_1.Teacher.findOne({
        _id: teacherId
    }).populate({ path: "classes" });
    let validCredentials = false;
    currentTeacher.classes.forEach((c) => {
        c.students.forEach((s) => {
            if (s == studId) {
                validCredentials = true;
            }
        });
    });
    return validCredentials;
});
exports.teacherHasStudent = teacherHasStudent;
