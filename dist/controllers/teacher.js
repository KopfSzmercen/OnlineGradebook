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
exports.postDeleteClass = exports.postAddClass = exports.postLogOutTeacher = exports.getTeacherDashboard = exports.postLogIn = exports.postSignUp = exports.getTeacherMain = void 0;
const express_validator_1 = require("express-validator");
const teacher_1 = require("../models/teacher");
const bcrypt_1 = __importDefault(require("bcrypt"));
const class_1 = require("../models/class");
const getTeacherMain = (req, res) => {
    res.render("teacher-main", {
        path: "forTeachers",
        csrfToken: req.csrfToken()
    });
};
exports.getTeacherMain = getTeacherMain;
const postSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .contentType("application/json")
            .json({ errors: errors.array() });
    }
    try {
        const fetchedTeacher = yield teacher_1.Teacher.findOne({ email: email });
        if (fetchedTeacher) {
            return res.json({ theSameEmail: true });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newTeacher = new teacher_1.Teacher({
            name: username,
            email: email,
            password: hashedPassword,
            classes: []
        });
        yield newTeacher.save();
    }
    catch (error) {
        console.log(error);
    }
    return res.status(200).json({ userSignedUp: true });
});
exports.postSignUp = postSignUp;
const postLogIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const fetchedTeacher = yield teacher_1.Teacher.findOne({ email: email });
        if (!fetchedTeacher) {
            return res.status(400).json({ invalidData: true });
        }
        const matchedPasswords = yield bcrypt_1.default.compare(password, fetchedTeacher.password);
        if (matchedPasswords) {
            req.session.isLoggedIn = true;
            req.session.userId = fetchedTeacher._id;
            req.session.role = "teacher";
            return res.redirect("/teacher-dashboard");
        }
        return res.status(400).json({ invalidData: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogIn = postLogIn;
const getTeacherDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fetchedTeacher;
    try {
        fetchedTeacher = yield teacher_1.Teacher.findOne({
            _id: req.session.userId
        }).populate({ path: "classes" });
        if (!fetchedTeacher)
            throw new Error("Teacher fetching failed");
        res.render("teacher-dashboard", {
            csrfToken: req.csrfToken(),
            classes: fetchedTeacher.classes,
            path: "dashboard"
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getTeacherDashboard = getTeacherDashboard;
const postLogOutTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((error) => {
            if (error)
                throw new Error("Session destroy failed.");
            return res.redirect("/");
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postLogOutTeacher = postLogOutTeacher;
const postAddClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const className = req.body.className;
    const studentsNumber = req.body.studentsNumber;
    try {
        const fetchedTeacher = yield teacher_1.Teacher.findOne({
            _id: req.session.userId
        }).populate({ path: "classes" });
        if (!fetchedTeacher)
            throw new Error("Teacher not found");
        fetchedTeacher.classes.forEach((c) => {
            if (c.className === className) {
                return res.status(400).json({ theSameClassName: true });
            }
        });
        const newClass = new class_1.Class({
            className: className,
            studentsNumber: studentsNumber,
            students: []
        });
        fetchedTeacher.classes.push(newClass._id);
        yield fetchedTeacher.save();
        yield newClass.save();
        return res.redirect("/teacher-dashboard");
    }
    catch (error) {
        console.log(error);
    }
    return res.redirect("/teacher-dashboard");
});
exports.postAddClass = postAddClass;
const postDeleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classId = req.body.classId;
    try {
        const fetchedTeacher = yield teacher_1.Teacher.findOne({ _id: req.session.userId });
        if (!fetchedTeacher)
            throw new Error("Teacher not found");
        const findClass = fetchedTeacher.classes.findIndex((c) => {
            return c._id == classId;
        });
        if (findClass === -1) {
            return res.status(403).redirect("/invalid-credentials");
        }
        fetchedTeacher.classes = fetchedTeacher.classes.filter((c) => {
            return c._id != classId;
        });
        yield fetchedTeacher.save();
        yield class_1.Class.deleteOne({ _id: classId });
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postDeleteClass = postDeleteClass;
