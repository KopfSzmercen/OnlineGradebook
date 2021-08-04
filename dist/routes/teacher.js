"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_1 = require("../controllers/teacher");
const express_validator_1 = require("express-validator");
const logged_in_1 = require("../auth/logged-in");
const router = express_1.Router();
router.get("/teacher-main", logged_in_1.blockWhenLoggedInTeacher, teacher_1.getTeacherMain);
router.post("/teacher-sign-up", logged_in_1.blockWhenLoggedInUser, [
    express_validator_1.body("username").isLength({ min: 5 }),
    express_validator_1.body("email").isEmail(),
    express_validator_1.body("password").isLength({ min: 5 })
], teacher_1.postSignUp);
router.post("/teacher-log-in", logged_in_1.blockWhenLoggedInTeacher, [express_validator_1.body("email").isEmail(), express_validator_1.body("password").isLength({ min: 5 })], teacher_1.postLogIn);
router.get("/teacher-dashboard", logged_in_1.isLoggedInTeacher, teacher_1.getTeacherDashboard);
router.post("/add-class", logged_in_1.isLoggedInTeacher, [express_validator_1.body("className").isLength({ min: 1 }), express_validator_1.body("studentsNumber").isNumeric()], teacher_1.postAddClass);
router.delete("/delete-class", logged_in_1.isLoggedInTeacher, teacher_1.postDeleteClass);
router.post("/log-out-teacher", logged_in_1.isLoggedInTeacher, teacher_1.postLogOutTeacher);
exports.default = router;
