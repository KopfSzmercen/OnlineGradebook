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
const studentNameInput = document.getElementById("student-name");
const studentNameError = document.getElementById("student-name-error");
const addStudentButton = document.getElementById("add-student-btn");
const classId = document.getElementById("class-id");
studentNameInput.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length < 5) {
        studentNameInput.classList.add("is-invalid");
        studentNameInput.classList.remove("is-valid");
        studentNameError.classList.remove("d-none");
        studentNameError.classList.add("d-block");
        studentNameError.innerText =
            "Student name has to be at least 5 characters long";
        addStudentButton.classList.add("disabled");
    }
    else {
        studentNameInput.classList.remove("is-invalid");
        studentNameInput.classList.add("is-valid");
        studentNameError.classList.add("d-none");
        studentNameError.classList.remove("d-block");
        addStudentButton.classList.remove("disabled");
    }
});
addStudentButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.getElementById("csrfToken");
    const data = {
        studentName: studentNameInput.value,
        classId: classId.value
    };
    const res = yield fetch("/add-student", {
        method: "POST",
        headers: {
            "csrf-token": csrfToken.value,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (res.redirected) {
        return (window.location.href = res.url);
    }
    const response = yield res.json();
}));
