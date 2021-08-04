import express from "express";
import { Student, Grade } from "../models/student";
import { Teacher } from "../models/teacher";
import { teacherHasStudent } from "../auth/credentials";

export const getViewStudent = async (
  req: express.Request,
  res: express.Response
) => {
  const studentId = req.params.studId;

  try {
    const fetchedStudent = await Student.findOne({ _id: studentId });
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
  } catch (error) {
    console.log(error);
    return res.redirect("/500");
  }
};

export const postAddNote = async (
  req: express.Request,
  res: express.Response
) => {
  const grade = req.body.grade;
  const subject = req.body.subjectName;
  const date = req.body.date.toLocaleString();
  const additionalNotes = req.body.additionalNotes;
  const studId = req.params.studId;
  const classId = req.body.classId;

  const newGrade = new Grade({
    grade: grade,
    subjectName: subject,
    date: date,
    additionalNotes: additionalNotes
  });

  try {
    let validCredentials = await teacherHasStudent(req.session.userId!, studId);

    if (!validCredentials)
      return res.status(403).redirect("/invalid-credentials");

    const fetchedStudent = await Student.findOne({ _id: studId });
    if (!fetchedStudent) throw new Error("Student not found.");

    fetchedStudent.grades.push(newGrade);
    await fetchedStudent.save();
    console.log(classId);

    return res.redirect(`/student/${studId}/${classId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getViewNote = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const fetchedStudent = await Student.findOne({ _id: req.params.studId });
    if (!fetchedStudent) throw new Error("No student found");

    const grade = fetchedStudent.grades.find(
      (g: any) => g._id == req.params.noteId
    );
    if (grade === undefined) throw new Error("No note found");

    res.render("grade-detail", {
      role: "teacher",
      grade: grade,
      mode: "edit",
      csrfToken: req.csrfToken(),
      studId: req.params.studId,
      path: "grade-detail",
      classId: req.params.classId
    });
  } catch (error) {
    console.log(error);
    res.redirect("/500");
  }
};

export const postEditNote = async (
  req: express.Request,
  res: express.Response
) => {
  const studId = req.params.studId;
  const gradeId = req.params.noteId;

  const grade = req.body.grade;
  const subject = req.body.subjectName;
  const date = req.body.date.toLocaleString();
  const additionalNotes = req.body.additionalNotes;

  const newGrade = new Grade({
    grade: grade,
    subjectName: subject,
    date: date,
    additionalNotes: additionalNotes
  });

  try {
    let validCredentials = await teacherHasStudent(req.session.userId!, studId);
    if (!validCredentials)
      return res.status(403).redirect("/invalid-credentials");

    const fetchedStudent = await Student.findOne({ _id: studId });
    if (!fetchedStudent) throw new Error("No student found");
    const gradeIndex = fetchedStudent.grades.findIndex(
      (g: any) => g._id == gradeId
    );
    if (gradeIndex === -1) throw new Error("No grade found");
    const oldId = fetchedStudent.grades[gradeIndex]._id;
    fetchedStudent.grades[gradeIndex] = newGrade;
    fetchedStudent.grades[gradeIndex]._id = oldId;

    await fetchedStudent.save();

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

export const postDeleteGrade = async (
  req: express.Request,
  res: express.Response
) => {
  const studId = req.params.studId;
  const gradeId = req.params.gradeId;
  const redirectUrl = req.body.redirectUrl;

  try {
    let validCredentials = await teacherHasStudent(req.session.userId!, studId);
    if (!validCredentials)
      return res.status(403).redirect("/invalid-credentials");

    const fetchedStudent = await Student.findOne({ _id: studId });

    if (!fetchedStudent) throw new Error("Student not found");

    fetchedStudent.grades = fetchedStudent.grades.filter((g: any) => {
      return g._id != gradeId;
    });

    await fetchedStudent.save();

    return res.redirect(redirectUrl);
  } catch (error) {
    console.log(error);
  }
};

export const getMainStudent = async (
  req: express.Request,
  res: express.Response
) => {
  res.render("student-main", {
    path: "forStudents",
    csrfToken: req.csrfToken()
  });
};

export const postLogInStudent = async (
  req: express.Request,
  res: express.Response
) => {
  const studCode = req.body.studCode;

  try {
    const fetchedStudent = await Student.findOne({ code: studCode });
    if (!fetchedStudent) return res.json({ error: "invalid code" });

    req.session.isLoggedIn = true;
    req.session.role = "student";
    req.session.userId = fetchedStudent._id;

    res.redirect(`/student/${fetchedStudent._id}/dashboard`);
  } catch (error) {
    console.log(error);
  }
};

export const getStudentDashboard = async (
  req: express.Request,
  res: express.Response
) => {
  const studId = req.params.studId;
  try {
    const fetchedStudent = await Student.findOne({ _id: studId });
    if (!fetchedStudent) throw new Error("Student not found");

    res.render("student-dashboard", {
      csrfToken: req.csrfToken(),
      grades: fetchedStudent.grades,
      studName: fetchedStudent.name,
      studId: studId
    });
  } catch (error) {
    console.log(error);
  }
};

export const postLogOutStudent = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    req.session.destroy((error) => {
      if (error) throw new Error("Session destruction failed.");
      return res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
};

export const getViewStudentNote = async (
  req: express.Request,
  res: express.Response
) => {
  const studId = req.params.studId;
  const gradeId = req.params.gradeId;

  try {
    const fetchedStudent = await Student.findOne({ _id: studId });
    if (!fetchedStudent) throw new Error("Student not found");
    const grade = fetchedStudent.grades.find((g: any) => {
      return g._id == gradeId;
    });
    if (!grade) throw new Error("Grade not found");

    res.render("grade-detail", {
      role: "student",
      grade: grade,
      studId: studId,
      mode: "view"
    });
  } catch (error) {
    console.log(error);
  }
};
