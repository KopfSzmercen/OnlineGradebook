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
const addNoteModal = document.getElementById("add-note-modal");
const grade = document.getElementById("grade");
const date = document.getElementById("date");
const addNotes = document.getElementById("add-notes");
const gradeError = document.getElementById("grade-error");
const dateError = document.getElementById("date-error");
const addNotesError = document.getElementById("add-notes-error");
const subject = document.getElementById("subject-name");
const subjectError = document.getElementById("subject-name-error");
const addNoteButton = document.getElementById("add-note-btn");
grade.addEventListener("input", (e) => {
    const input = e.target;
    if (+input.value < 1 || +input.value > 6) {
        grade.classList.remove("is-valid");
        grade.classList.add("is-invalid");
        gradeError.classList.add("d-block");
        gradeError.classList.remove("d-none");
        gradeError.innerText = "Grades should be between 0 and 6.";
        addNoteButton.classList.add("disabled");
    }
    else {
        grade.classList.add("is-valid");
        grade.classList.remove("is-invalid");
        gradeError.classList.remove("d-block");
        gradeError.classList.add("d-none");
        addNoteButton.classList.remove("disabled");
    }
});
subject.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length < 2) {
        subject.classList.add("is-invalid");
        subject.classList.remove("is-valid");
        subjectError.classList.add("d-block");
        subjectError.classList.remove("d-none");
        subjectError.innerText =
            "Subject name has to be at least 2 characters long.";
        addNoteButton.classList.add("disabled");
    }
    else {
        subject.classList.remove("is-invalid");
        subject.classList.add("is-valid");
        subjectError.classList.remove("d-block");
        subjectError.classList.add("d-none");
        addNoteButton.classList.remove("disabled");
    }
});
date.addEventListener("input", (e) => {
    const input = e.target;
    const d = new Date(input.value);
    const currYear = new Date(Date.now()).getFullYear();
    const dateDiff = Math.abs(currYear - d.getFullYear());
    if (dateDiff > 1 || d.toString() === "Invalid Date") {
        date.classList.add("is-invalid");
        date.classList.remove("is-valid");
        addNoteButton.classList.add("disabled");
        dateError.classList.add("d-block");
        dateError.classList.remove("d-none");
        dateError.innerText = "Invalid value";
    }
    else {
        date.classList.remove("is-invalid");
        date.classList.add("is-valid");
        addNoteButton.classList.remove("disabled");
        dateError.classList.remove("d-block");
        dateError.classList.add("d-none");
    }
});
const studentId = document.getElementById("student-id");
const csrfToken = document.getElementById("csrf-token");
const mode = document.getElementById("mode");
if (mode.value === "add") {
    const classId = document.getElementById("class-id");
    addNoteButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            grade: grade.value,
            subjectName: subject.value,
            date: date.value,
            additionalNotes: addNotes.value,
            classId: classId.value
        };
        const res = yield fetch(`/student/${studentId.value}/add-note`, {
            method: "POST",
            headers: {
                "csrf-token": csrfToken.value,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            redirect: "follow"
        });
        if (res.redirected) {
            return (window.location.href = res.url);
        }
        const response = yield res.json();
        if (response.success) {
            const tableBody = document.getElementById("tableBody");
            const newGradeElement = `<tr>
    <th scope="row">${grade.value}</th>
    <td> ${subject.value} </td>
    <td> ${date.value.toLocaleString()} </td>
    <td><a class="btn btn-success" href="/grades/${response.gradeId}">Details</button></td>
  </tr>`;
            tableBody.insertAdjacentHTML("afterbegin", newGradeElement);
            const body = document.querySelector("body");
            body.classList.remove("modal-open");
            body.setAttribute("style", "");
            const modal = document.getElementById("add-note-modal");
            modal.style.display = "none";
            modal.classList.remove("show");
            const modalBackdrop = document.querySelector(".modal-backdrop");
            modalBackdrop.remove();
            grade.value = "";
            grade.classList.remove("is-valid");
            subject.value = "";
            subject.classList.remove("is-valid");
            date.value = "";
            date.classList.remove("is-valid");
            addNotes.value = "";
            const toggleModalBtn = document.getElementById("toggle-modal");
            toggleModalBtn.dispatchEvent(new Event("click"));
        }
        if (response.errors) {
            response.errors.forEach((e) => {
                if (e.params === "grade") {
                    grade.classList.remove("is-valid");
                    grade.classList.add("is-invalid");
                    gradeError.classList.add("d-block");
                    gradeError.classList.remove("d-none");
                    gradeError.innerText = "Invalid value";
                    addNoteButton.classList.add("disabled");
                }
                if (e.params === "subject") {
                    subject.classList.add("is-invalid");
                    subject.classList.remove("is-valid");
                    subjectError.classList.add("d-block");
                    subjectError.classList.remove("d-none");
                    subjectError.innerText = "Invalid value";
                    addNoteButton.classList.add("disabled");
                }
                if (e.params === "date") {
                    date.classList.add("is-invalid");
                    date.classList.remove("is-valid");
                    addNoteButton.classList.add("disabled");
                    dateError.classList.add("d-block");
                    dateError.classList.remove("d-none");
                    dateError.innerText = "Invalid value";
                }
            });
        }
    }));
}
else if (mode.value === "edit") {
    addNoteButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            grade: grade.value,
            subjectName: subject.value,
            date: date.value,
            additionalNotes: addNotes.value
        };
        const studentId = document.getElementById("studId");
        const gradeId = document.getElementById("gradeId");
        const res = yield fetch(`/notes/${studentId.value}/${gradeId.value}/edit`, {
            method: "POST",
            headers: {
                "csrf-token": csrfToken.value,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            redirect: "follow"
        });
        if (res.redirected)
            window.location.href = res.url;
        const response = yield res.json();
        if (response.success) {
            const body = document.querySelector("body");
            body.classList.remove("modal-open");
            body.setAttribute("style", "");
            const modal = document.getElementById("add-note-modal");
            modal.style.display = "none";
            modal.classList.remove("show");
            const modalBackdrop = document.querySelector(".modal-backdrop");
            modalBackdrop.remove();
            grade.classList.remove("is-valid");
            subject.classList.remove("is-valid");
            date.classList.remove("is-valid");
            const toggleModalBtn = document.getElementById("toggle-modal");
            toggleModalBtn.dispatchEvent(new Event("click"));
            const newGradeValue = grade.value;
            const newSubject = subject.value;
            const newDate = date.value.toLocaleString();
            const newAdditionalNotes = addNotes.value;
            const gradeVal = document.getElementById("grade-val");
            const subjectVal = document.getElementById("subject-val");
            const dateVal = document.getElementById("date-val");
            const notesVal = document.getElementById("notes-val");
            gradeVal.innerText = newGradeValue;
            subjectVal.innerHTML =
                '<span class="text-primary lead">Subject: </span>' + newSubject;
            dateVal.innerHTML =
                '<span class="text-primary lead">Date: </span>' + newDate;
            notesVal.innerHTML =
                '<span class="text-primary lead">Additional notes: </span>' +
                    newAdditionalNotes;
            gradeVal.setAttribute("class", "");
            gradeVal.classList.add("card-title");
            if (+newGradeValue <= 2)
                gradeVal.classList.add("text-danger");
            else if (+newGradeValue >= 3 && +newGradeValue < 5)
                gradeVal.classList.add("text-warning");
            else
                gradeVal.classList.add("text-success");
        }
    }));
    const confirmDeleteGrade = document.getElementById("confirm-delete-grade");
    confirmDeleteGrade.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        const gradeId = document.getElementById("gradeId");
        const studId = document.getElementById("studId");
        const redirectUrl = document
            .getElementById("redirect-btn")
            .getAttribute("href");
        const res = yield fetch(`/notes/${studId.value}/${gradeId.value}/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "csrf-token": csrfToken.value
            },
            body: JSON.stringify({ redirectUrl: redirectUrl }),
            redirect: "follow"
        });
        if (res.redirected)
            window.location.href = res.url;
    }));
}
