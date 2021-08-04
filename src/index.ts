import express, { response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
require("dotenv").config();
import cookieParser from "cookie-parser";
import csrf from "csurf";
import path from "path";

import { blockWhenLoggedInUser } from "./auth/logged-in";

//routers
import teacherRouter from "./routes/teacher";
import classRouter from "./routes/classes";
import studentRouter from "./routes/student";

const DB_URL = `mongodb+srv://Admin:${process.env.DB_PASSWORD}@cluster0.fnkgi.mongodb.net/Online-Gradebook?retryWrites=true`;

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cookieParser());

const store = new MongoStore({
  mongoUrl: DB_URL,
  collectionName: "Sessions",
  ttl: 60 * 60
});

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/", "views"));

//static files
app.use(express.static(path.join(__dirname, "../dist/", "public")));

//session storage
app.use(
  session({
    secret: `${process.env.SECRET}`,
    store: store,
    saveUninitialized: false,
    resave: false
  })
);

store.on("error", (error) => {
  console.log(error);
});

//csfr protection
const csrfProtection = csrf();
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//ROUTES
app.get("/", blockWhenLoggedInUser, (req, res, next) => {
  res.render("main-page", {
    path: "mainPage"
  });
});

//teacher routes
app.use(teacherRouter);
//classes routes
app.use(classRouter);
//student router
app.use(studentRouter);

app.get(
  "/invalid-credentials",
  (req: express.Request, res: express.Response) => {
    res.render("invalid-credentials", {
      path: ""
    });
  }
);

app.use((req: express.Request, res: express.Response) => {
  res.status(404);
  res.render("404", {
    path: ""
  });
  return;
});

app.use(
  (
    error: express.ErrorRequestHandler,
    req: express.Request,
    res: express.Response
  ) => {
    res.status(500);
    res.render("500", {
      path: ""
    });
  }
);

const PORT = process.env.PORT || 3000;

async function listen() {
  try {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useUnifiedTopology", true);
    await mongoose.connect(DB_URL);
    app.listen(PORT);
  } catch (error) {
    console.log(error);
  }
}

listen();
