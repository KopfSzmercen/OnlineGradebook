"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
require("dotenv").config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const path_1 = __importDefault(require("path"));
const logged_in_1 = require("./auth/logged-in");
//routers
const teacher_1 = __importDefault(require("./routes/teacher"));
const classes_1 = __importDefault(require("./routes/classes"));
const student_1 = __importDefault(require("./routes/student"));
const DB_URL = `mongodb+srv://Admin:${process.env.DB_PASSWORD}@cluster0.fnkgi.mongodb.net/Online-Gradebook?retryWrites=true`;
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(cookie_parser_1.default());
const store = new connect_mongo_1.default({
    mongoUrl: DB_URL,
    collectionName: "Sessions",
    ttl: 60 * 60
});
//set view engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../src/", "views"));
//static files
app.use(express_1.default.static(path_1.default.join(__dirname, "../dist/", "public")));
//session storage
app.use(express_session_1.default({
    secret: `${process.env.SECRET}`,
    store: store,
    saveUninitialized: false,
    resave: false
}));
store.on("error", (error) => {
    console.log(error);
});
//csfr protection
const csrfProtection = csurf_1.default();
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
//ROUTES
app.get("/", logged_in_1.blockWhenLoggedInUser, (req, res, next) => {
    res.render("main-page", {
        path: "mainPage"
    });
});
//teacher routes
app.use(teacher_1.default);
//classes routes
app.use(classes_1.default);
//student router
app.use(student_1.default);
app.get("/invalid-credentials", (req, res) => {
    res.render("invalid-credentials", {
        path: ""
    });
});
app.use((req, res) => {
    res.status(404);
    res.render("404", {
        path: ""
    });
    return;
});
app.use((error, req, res) => {
    res.status(500);
    res.render("500", {
        path: ""
    });
});
const PORT = process.env.PORT || 3000;
function listen() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose_1.default.set("useNewUrlParser", true);
            mongoose_1.default.set("useUnifiedTopology", true);
            yield mongoose_1.default.connect(DB_URL);
            app.listen(PORT);
        }
        catch (error) {
            console.log(error);
        }
    });
}
listen();
