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
const studentCode = document.getElementById("student-code");
const studentCodeError = document.getElementById("student-code-error");
const logInStudentButton = document.getElementById("log-in-btn");
studentCode.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length !== 10) {
        studentCode.classList.add("is-invalid");
        studentCode.classList.remove("is-valid");
        studentCodeError.classList.add("d-block");
        studentCodeError.classList.remove("d-none");
        studentCodeError.innerText = "The code has to be 10 characters long";
        logInStudentButton.classList.add("disabled");
    }
    else {
        studentCode.classList.remove("is-invalid");
        studentCode.classList.add("is-valid");
        studentCodeError.classList.remove("d-block");
        studentCodeError.classList.add("d-none");
        logInStudentButton.classList.remove("disabled");
    }
});
logInStudentButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.getElementById("csrf-token");
    const res = yield fetch("/student-dashboard", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "csrf-token": csrfToken.value
        },
        redirect: "follow",
        body: JSON.stringify({ studCode: studentCode.value })
    });
    if (res.redirected)
        window.location.href = res.url;
    else {
        studentCode.classList.add("is-invalid");
        studentCode.classList.remove("is-valid");
        studentCodeError.classList.add("d-block");
        studentCodeError.classList.remove("d-none");
        studentCodeError.innerText = "Invalid code. Please try again.";
        logInStudentButton.classList.add("disabled");
    }
}));
