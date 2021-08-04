declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    userId: string;
    role: string;
  }
}

import express from "express";
import { validationResult } from "express-validator";
import { Teacher } from "../models/teacher";
import bcrypt from "bcrypt";
import { Class } from "../models/class";

export const getTeacherMain = (req: express.Request, res: express.Response) => {
  res.render("teacher-main", {
    path: "forTeachers",
    csrfToken: req.csrfToken()
  });
};

export const postSignUp = async (
  req: express.Request,
  res: express.Response
) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .contentType("application/json")
      .json({ errors: errors.array() });
  }

  try {
    const fetchedTeacher = await Teacher.findOne({ email: email });
    if (fetchedTeacher) {
      return res.json({ theSameEmail: true });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      name: username,
      email: email,
      password: hashedPassword,
      classes: []
    });
    await newTeacher.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ userSignedUp: true });
};

export const postLogIn = async (
  req: express.Request,
  res: express.Response
) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const fetchedTeacher = await Teacher.findOne({ email: email });

    if (!fetchedTeacher) {
      return res.status(400).json({ invalidData: true });
    }

    const matchedPasswords = await bcrypt.compare(
      password,
      fetchedTeacher.password
    );

    if (matchedPasswords) {
      req.session.isLoggedIn = true;
      req.session.userId = fetchedTeacher._id;
      req.session.role = "teacher";

      return res.redirect("/teacher-dashboard");
    }

    return res.status(400).json({ invalidData: true });
  } catch (error) {
    console.log(error);
  }
};

export const getTeacherDashboard = async (
  req: express.Request,
  res: express.Response
) => {
  let fetchedTeacher: any;
  try {
    fetchedTeacher = await Teacher.findOne({
      _id: req.session.userId
    }).populate({ path: "classes" });

    if (!fetchedTeacher) throw new Error("Teacher fetching failed");

    res.render("teacher-dashboard", {
      csrfToken: req.csrfToken(),
      classes: fetchedTeacher.classes,
      path: "dashboard"
    });
  } catch (error) {
    console.log(error);
  }
};

export const postLogOutTeacher = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    req.session.destroy((error) => {
      if (error) throw new Error("Session destroy failed.");
      return res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
};

export const postAddClass = async (
  req: express.Request,
  res: express.Response
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const className = req.body.className;
  const studentsNumber = req.body.studentsNumber;

  try {
    const fetchedTeacher = await Teacher.findOne({
      _id: req.session.userId
    }).populate({ path: "classes" });

    if (!fetchedTeacher) throw new Error("Teacher not found");

    fetchedTeacher.classes.forEach((c: any) => {
      if (c.className === className) {
        return res.status(400).json({ theSameClassName: true });
      }
    });

    const newClass = new Class({
      className: className,
      studentsNumber: studentsNumber,
      students: []
    });
    fetchedTeacher.classes.push(newClass._id);
    await fetchedTeacher.save();
    await newClass.save();
    return res.redirect("/teacher-dashboard");
  } catch (error) {
    console.log(error);
  }

  return res.redirect("/teacher-dashboard");
};

export const postDeleteClass = async (
  req: express.Request,
  res: express.Response
) => {
  const classId = req.body.classId;

  try {
    const fetchedTeacher = await Teacher.findOne({ _id: req.session.userId });
    if (!fetchedTeacher) throw new Error("Teacher not found");

    const findClass = fetchedTeacher.classes.findIndex((c: any) => {
      return c._id == classId;
    });
    if (findClass === -1) {
      return res.status(403).redirect("/invalid-credentials");
    }
    fetchedTeacher.classes = fetchedTeacher.classes.filter((c: any) => {
      return c._id != classId;
    });

    await fetchedTeacher.save();
    await Class.deleteOne({ _id: classId });

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
