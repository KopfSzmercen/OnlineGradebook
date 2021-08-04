import express from "express";

export const isLoggedInTeacher = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.session.isLoggedIn) {
    return res.status(403).redirect("/teacher-main");
  }

  if (req.session.role === "teacher") return next();
};

export const blockWhenLoggedInTeacher = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.isLoggedIn && req.session.role === "teacher") {
    return res.redirect("/teacher-dashboard");
  }
  return next();
};

export const isLoggedInUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.session.isLoggedIn) {
    return res.status(403).redirect("/");
  }
  return next();
};

export const blockWhenLoggedInUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.isLoggedIn && req.session.role === "teacher") {
    return res.redirect("/teacher-dashboard");
  } else if (req.session.isLoggedIn && req.session.role === "student") {
    return res.redirect("/student-dashboard");
  }
  return next();
};

export const isLoggedInStudent = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.isLoggedIn && req.session.role === "student") return next();
  else res.redirect("/student");
};
