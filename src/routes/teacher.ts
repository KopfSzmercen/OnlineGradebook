import { Router } from "express";
import {
  getTeacherMain,
  postSignUp,
  postLogIn,
  getTeacherDashboard,
  postLogOutTeacher,
  postAddClass,
  postDeleteClass
} from "../controllers/teacher";
import { body } from "express-validator";

import {
  isLoggedInTeacher,
  blockWhenLoggedInTeacher,
  blockWhenLoggedInUser
} from "../auth/logged-in";

const router = Router();

router.get("/teacher-main", blockWhenLoggedInTeacher, getTeacherMain);
router.post(
  "/teacher-sign-up",
  blockWhenLoggedInUser,
  [
    body("username").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 })
  ],
  postSignUp
);

router.post(
  "/teacher-log-in",
  blockWhenLoggedInTeacher,
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  postLogIn
);

router.get("/teacher-dashboard", isLoggedInTeacher, getTeacherDashboard);

router.post(
  "/add-class",
  isLoggedInTeacher,
  [body("className").isLength({ min: 1 }), body("studentsNumber").isNumeric()],
  postAddClass
);

router.delete("/delete-class", isLoggedInTeacher, postDeleteClass);

router.post("/log-out-teacher", isLoggedInTeacher, postLogOutTeacher);

export default router;
