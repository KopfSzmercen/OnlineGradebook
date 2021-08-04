import { Router } from "express";
import {
  getViewStudent,
  postAddNote,
  getViewNote,
  postEditNote,
  postDeleteGrade,
  getMainStudent,
  postLogInStudent,
  getStudentDashboard,
  postLogOutStudent,
  getViewStudentNote
} from "../controllers/student";
import {
  isLoggedInTeacher,
  isLoggedInUser,
  isLoggedInStudent,
  blockWhenLoggedInUser
} from "../auth/logged-in";

const router = Router();

router.get("/student", blockWhenLoggedInUser, getMainStudent);

router.post("/student-dashboard", blockWhenLoggedInUser, postLogInStudent);

router.get(
  "/student/:studId/dashboard",
  isLoggedInStudent,
  getStudentDashboard
);

router.get("/student/:studId/:classId", isLoggedInUser, getViewStudent);

router.get(
  "/student/:studId/grade/:gradeId",
  isLoggedInStudent,
  getViewStudentNote
);

router.post("/student/:studId/add-note", isLoggedInUser, postAddNote);

router.get("/notes/:studId/:noteId/:classId", isLoggedInUser, getViewNote);

router.post("/notes/:studId/:noteId/edit", isLoggedInTeacher, postEditNote);

router.post("/log-out-student", isLoggedInStudent, postLogOutStudent);

router.delete(
  "/notes/:studId/:gradeId/delete",
  isLoggedInTeacher,
  postDeleteGrade
);

export default router;
