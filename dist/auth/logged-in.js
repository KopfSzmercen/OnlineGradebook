"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedInStudent = exports.blockWhenLoggedInUser = exports.isLoggedInUser = exports.blockWhenLoggedInTeacher = exports.isLoggedInTeacher = void 0;
const isLoggedInTeacher = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(403).redirect("/teacher-main");
    }
    if (req.session.role === "teacher")
        return next();
};
exports.isLoggedInTeacher = isLoggedInTeacher;
const blockWhenLoggedInTeacher = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.role === "teacher") {
        return res.redirect("/teacher-dashboard");
    }
    return next();
};
exports.blockWhenLoggedInTeacher = blockWhenLoggedInTeacher;
const isLoggedInUser = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(403).redirect("/");
    }
    return next();
};
exports.isLoggedInUser = isLoggedInUser;
const blockWhenLoggedInUser = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.role === "teacher") {
        return res.redirect("/teacher-dashboard");
    }
    else if (req.session.isLoggedIn && req.session.role === "student") {
        return res.redirect("/student-dashboard");
    }
    return next();
};
exports.blockWhenLoggedInUser = blockWhenLoggedInUser;
const isLoggedInStudent = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.role === "student")
        return next();
    else
        res.redirect("/student");
};
exports.isLoggedInStudent = isLoggedInStudent;
