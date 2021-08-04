import { Router } from "express";
import {
  getSingleClass,
  getStudents,
  postAddStudent,
  postDeleteStudent
} from "../controllers/class";
import { body } from "express-validator";
import { isLoggedInTeacher } from "../auth/logged-in";

const router = Router();

router.get("/class/:id", isLoggedInTeacher, getSingleClass);

router.get("/class/:id/students", isLoggedInTeacher, getStudents);

router.delete("/student/delete/:id", isLoggedInTeacher, postDeleteStudent);

router.post(
  "/add-student",
  isLoggedInTeacher,
  body("studentName").isLength({ min: 5 }),
  postAddStudent
);

export default router;
