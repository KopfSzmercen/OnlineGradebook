import express from "express";
import { validationResult } from "express-validator";
import { Class } from "../models/class";
import { Student } from "../models/student";
import { Teacher } from "../models/teacher";
import { teacherHasStudent } from "../auth/credentials";
import crypto from "crypto";

export const getSingleClass = async (
  req: express.Request,
  res: express.Response
) => {
  const classId = req.params.id;
  try {
    const fetchedClass = await Class.findOne({ _id: classId }).populate({
      path: "students"
    });
    if (!fetchedClass) throw new Error("Class not found");

    const fetchedTeacher = await Teacher.findOne({ _id: req.session.userId });

    const findClass = fetchedTeacher.classes.findIndex((c: any) => {
      return c._id == classId;
    });

    if (findClass === -1) {
      return res.status(403).redirect("/invalid-credentials");
    }

    const grades: number[] = [];

    fetchedClass.students.forEach((s: any) => {
      s.grades.forEach((g: any) => {
        grades.push(g.grade);
      });
    });

    let avGrades = 0;
    let counter = 0;

    grades.forEach((g: number) => {
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
  } catch (error) {
    console.log(error);
  }
};

export const getStudents = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const fetchedClass = await Class.findOne({ _id: req.params.id }).populate({
      path: "students"
    });

    if (!fetchedClass) throw new Error("Class not found");

    const students = fetchedClass.students;

    res.render("students", {
      thisClass: fetchedClass,
      csrfToken: req.csrfToken(),
      students: students,
      path: "students"
    });
  } catch (error) {
    console.log(error);
  }
};

export const postAddStudent = async (
  req: express.Request,
  res: express.Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Invalid value" });
  }

  const studentName = req.body.studentName;
  const classId = req.body.classId;
  const code = crypto.randomBytes(5).toString("hex");

  try {
    let isFullClass = true;
    const newStudent = new Student({
      name: studentName,
      grades: [],
      code: code
    });
    const fetchedClass = await Class.findOne({ _id: classId });
    if (!fetchedClass) throw new Error("Class not found");

    if (fetchedClass.studentsNumber <= fetchedClass.students.length) {
      return res.json({ isFullClass: isFullClass });
    } else if (
      fetchedClass.studentsNumber ===
      fetchedClass.students.length + 1
    ) {
      isFullClass = true;
    } else {
      isFullClass = false;
    }

    await newStudent.save();
    fetchedClass.students.push(newStudent._id);
    await fetchedClass.save();

    return res.json({ isFullClass: isFullClass, studId: newStudent._id });
  } catch (error) {
    console.log(error);
  }
};

export const postDeleteStudent = async (
  req: express.Request,
  res: express.Response
) => {
  const studentId = req.params.id;
  const classId = req.body.classId;

  let validCredentials = await teacherHasStudent(
    req.session.userId!,
    studentId
  );
  if (!validCredentials)
    return res.status(403).redirect("/invalid-credentials");

  let isFullClass = false;
  try {
    const fetchedClass = await Class.findOne({ _id: classId });
    if (!fetchedClass) throw new Error("Class not found");

    const newStudentsArray = fetchedClass.students.filter((id: string) => {
      return id != studentId;
    });

    fetchedClass.students = newStudentsArray;

    if (fetchedClass.students.length < fetchedClass.studentsNumber) {
      isFullClass = false;
    } else {
      isFullClass = true;
    }
    await fetchedClass.save();
    await Student.deleteOne({ _id: studentId });

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
  } catch (error) {
    console.log(error);
    return res.redirect("/500");
  }
};
