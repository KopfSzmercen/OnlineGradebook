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
exports.getViewStudentNote = exports.postLogOutStudent = exports.getStudentDashboard = exports.postLogInStudent = exports.getMainStudent = exports.postDeleteGrade = exports.postEditNote = exports.getViewNote = exports.postAddNote = exports.getViewStudent = void 0;
const student_1 = require("../models/student");
const credentials_1 = require("../auth/credentials");
const getViewStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.params.studId;
    try {
        const fetchedStudent = yield student_1.Student.findOne({ _id: studentId });
        if (!fetchedStudent) {
            throw new Error("Student not found");
        }
        res.render("student-view", {
            grades: fetchedStudent.grades,
            studId: fetchedStudent._id,
            csrfToken: req.csrfToken(),
            studentName: fetchedStudent.name,
            mode: "add",
            path: "student-view",
            classId: req.params.classId,
            studCode: fetchedStudent.code
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getViewStudent = getViewStudent;
const postAddNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grade = req.body.grade;
    const subject = req.body.subjectName;
    const date = req.body.date.toLocaleString();
    const additionalNotes = req.body.additionalNotes;
    const studId = req.params.studId;
    const classId = req.body.classId;
    const newGrade = new student_1.Grade({
        grade: grade,
        subjectName: subject,
        date: date,
        additionalNotes: additionalNotes
    });
    try {
        let validCredentials = yield credentials_1.teacherHasStudent(req.session.userId, studId);
        if (!validCredentials)
            return res.status(403).redirect("/invalid-credentials");
        const fetchedStudent = yield student_1.Student.findOne({ _id: studId });
        if (!fetchedStudent)
            throw new Error("Student not found.");
        fetchedStudent.grades.push(newGrade);
        yield fetchedStudent.save();
        console.log(classId);
        return res.redirect(`/student/${studId}/${classId}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postAddNote = postAddNote;
const getViewNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchedStudent = yield student_1.Student.findOne({ _id: req.params.studId });
        if (!fetchedStudent)
            throw new Error("No student found");
        const grade = fetchedStudent.grades.find((g) => g._id == req.params.noteId);
        if (grade === undefined)
            throw new Error("No note found");
        res.render("grade-detail", {
            role: "teacher",
            grade: grade,
            mode: "edit",
            csrfToken: req.csrfToken(),
            studId: req.params.studId,
            path: "grade-detail",
            classId: req.params.classId
        });
    }
    catch (error) {
        console.log(error);
        res.send("<h2> dsd </h2>");
    }
});
exports.getViewNote = getViewNote;
const postEditNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studId = req.params.studId;
    const gradeId = req.params.noteId;
    const grade = req.body.grade;
    const subject = req.body.subjectName;
    const date = req.body.date.toLocaleString();
    const additionalNotes = req.body.additionalNotes;
    const newGrade = new student_1.Grade({
        grade: grade,
        subjectName: subject,
        date: date,
        additionalNotes: additionalNotes
    });
    try {
        let validCredentials = yield credentials_1.teacherHasStudent(req.session.userId, studId);
        if (!validCredentials)
            return res.status(403).redirect("/invalid-credentials");
        const fetchedStudent = yield student_1.Student.findOne({ _id: studId });
        if (!fetchedStudent)
            throw new Error("No student found");
        const gradeIndex = fetchedStudent.grades.findIndex((g) => g._id == gradeId);
        if (gradeIndex === -1)
            throw new Error("No grade found");
        const oldId = fetchedStudent.grades[gradeIndex]._id;
        fetchedStudent.grades[gradeIndex] = newGrade;
        fetchedStudent.grades[gradeIndex]._id = oldId;
        yield fetchedStudent.save();
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postEditNote = postEditNote;
const postDeleteGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studId = req.params.studId;
    const gradeId = req.params.gradeId;
    const redirectUrl = req.body.redirectUrl;
    try {
        let validCredentials = yield credentials_1.teacherHasStudent(req.session.userId, studId);
        if (!validCredentials)
            return res.status(403).redirect("/invalid-credentials");
        const fetchedStudent = yield student_1.Student.findOne({ _id: studId });
        if (!fetchedStudent)
            throw new Error("Student not found");
        fetchedStudent.grades = fetchedStudent.grades.filter((g) => {
            return g._id != gradeId;
        });
        yield fetchedStudent.save();
        return res.redirect(redirectUrl);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postDeleteGrade = postDeleteGrade;
const getMainStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("student-main", {
        path: "forStudents",
        csrfToken: req.csrfToken()
    });
});
exports.getMainStudent = getMainStudent;
const postLogInStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studCode = req.body.studCode;
    try {
        const fetchedStudent = yield student_1.Student.findOne({ code: studCode });
        if (!fetchedStudent)
            return res.json({ error: "invalid code" });
        req.session.isLoggedIn = true;
        req.session.role = "student";
        req.session.userId = fetchedStudent._id;
        res.redirect(`/student/${fetchedStudent._id}/dashboard`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogInStudent = postLogInStudent;
const getStudentDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studId = req.params.studId;
    try {
        const fetchedStudent = yield student_1.Student.findOne({ _id: studId });
        if (!fetchedStudent)
            throw new Error("Student not found");
        res.render("student-dashboard", {
            csrfToken: req.csrfToken(),
            grades: fetchedStudent.grades,
            studName: fetchedStudent.name,
            studId: studId
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getStudentDashboard = getStudentDashboard;
const postLogOutStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((error) => {
            if (error)
                throw new Error("Session destruction failed.");
            return res.redirect("/");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogOutStudent = postLogOutStudent;
const getViewStudentNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studId = req.params.studId;
    const gradeId = req.params.gradeId;
    try {
        const fetchedStudent = yield student_1.Student.findOne({ _id: studId });
        if (!fetchedStudent)
            throw new Error("Student not found");
        const grade = fetchedStudent.grades.find((g) => {
            return g._id == gradeId;
        });
        if (!grade)
            throw new Error("Grade not found");
        res.render("grade-detail", {
            role: "student",
            grade: grade,
            studId: studId,
            mode: "view"
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getViewStudentNote = getViewStudentNote;
