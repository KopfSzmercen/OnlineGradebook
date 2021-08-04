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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDeleteStudent = exports.postAddStudent = exports.getStudents = exports.getSingleClass = void 0;
const express_validator_1 = require("express-validator");
const class_1 = require("../models/class");
const student_1 = require("../models/student");
const teacher_1 = require("../models/teacher");
const credentials_1 = require("../auth/credentials");
const crypto_1 = __importDefault(require("crypto"));
const getSingleClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classId = req.params.id;
    try {
        const fetchedClass = yield class_1.Class.findOne({ _id: classId }).populate({
            path: "students"
        });
        if (!fetchedClass)
            throw new Error("Class not found");
        const fetchedTeacher = yield teacher_1.Teacher.findOne({ _id: req.session.userId });
        const findClass = fetchedTeacher.classes.findIndex((c) => {
            return c._id == classId;
        });
        if (findClass === -1) {
            return res.status(403).redirect("/invalid-credentials");
        }
        const grades = [];
        fetchedClass.students.forEach((s) => {
            s.grades.forEach((g) => {
                grades.push(g.grade);
            });
        });
        let avGrades = 0;
        let counter = 0;
        grades.forEach((g) => {
            avGrades += g;
            counter++;
        });
        avGrades /= counter;
        avGrades = Number(avGrades.toFixed(2));
        res.render("class-view", {
            thisClass: fetchedClass,
            studentsNumber: fetchedClass.students.length,
            avGrades: avGrades,
            grades: grades,
            path: "class-view"
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getSingleClass = getSingleClass;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedClass = yield class_1.Class.findOne({ _id: req.params.id }).populate({
            path: "students"
        });
        if (!fetchedClass)
            throw new Error("Class not found");
        const students = fetchedClass.students;
        res.render("students", {
            thisClass: fetchedClass,
            csrfToken: req.csrfToken(),
            students: students,
            path: "students"
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getStudents = getStudents;
const postAddStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid value" });
    }
    const studentName = req.body.studentName;
    const classId = req.body.classId;
    const code = crypto_1.default.randomBytes(5).toString("hex");
    try {
        let isFullClass = true;
        const newStudent = new student_1.Student({
            name: studentName,
            grades: [],
            code: code
        });
        const fetchedClass = yield class_1.Class.findOne({ _id: classId });
        if (!fetchedClass)
            throw new Error("Class not found");
        if (fetchedClass.studentsNumber <= fetchedClass.students.length) {
            return res.json({ isFullClass: isFullClass });
        }
        else if (fetchedClass.studentsNumber ===
            fetchedClass.students.length + 1) {
            isFullClass = true;
        }
        else {
            isFullClass = false;
        }
        yield newStudent.save();
        fetchedClass.students.push(newStudent._id);
        yield fetchedClass.save();
        return res.json({ isFullClass: isFullClass, studId: newStudent._id });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postAddStudent = postAddStudent;
const postDeleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.params.id;
    const classId = req.body.classId;
    let validCredentials = yield credentials_1.teacherHasStudent(req.session.userId, studentId);
    if (!validCredentials)
        return res.status(403).redirect("/invalid-credentials");
    let isFullClass = false;
    try {
        const fetchedClass = yield class_1.Class.findOne({ _id: classId });
        if (!fetchedClass)
            throw new Error("Class not found");
        const newStudentsArray = fetchedClass.students.filter((id) => {
            return id != studentId;
        });
        fetchedClass.students = newStudentsArray;
        if (fetchedClass.students.length < fetchedClass.studentsNumber) {
            isFullClass = false;
        }
        else {
            isFullClass = true;
        }
        yield fetchedClass.save();
        yield student_1.Student.deleteOne({ _id: studentId });
        // if (isFullClass)
        //   return res.status(200).redirect(`/class/${classId}/students`);
        if (fetchedClass.students.length === 0) {
            return res.json({
                success: true,
                isFullClass: isFullClass,
                classEmpty: true
            });
        }
        return res.json({ success: true, isFullClass: isFullClass });
    }
    catch (error) {
        console.log(error);
        return res.redirect("/500");
    }
});
exports.postDeleteStudent = postDeleteStudent;
