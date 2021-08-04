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
// sorting
const classesContainer = document.getElementById("classes-container");
const classesCards = Array.from(classesContainer.children);
if (classesCards.length > 0) {
    classesCards.sort((a, b) => {
        return a.id.localeCompare(b.id);
    });
    classesCards.forEach((card) => {
        classesContainer.insertAdjacentElement("afterbegin", card);
    });
}
const addClassForm = document.getElementById("add-class-form");
const className = addClassForm.querySelector("#class-name");
const classNameError = addClassForm.querySelector("#class-name-error");
const studentsNumber = addClassForm.querySelector("#students-number");
const addButton = document.getElementById("add-class-btn");
const studentsNumberError = document.getElementById("students-number-error");
className.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length < 1) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        classNameError.classList.remove("d-none");
        classNameError.classList.add("d-block");
        classNameError.innerText = "Class name has to be at least 1 character long";
        addButton.classList.add("disabled");
    }
    else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        classNameError.classList.add("d-none");
        classNameError.classList.remove("d-block");
        addButton.classList.remove("disabled");
    }
});
studentsNumber.addEventListener("input", (e) => {
    const input = e.target;
    if (+input.value <= 0 || isNaN(+input.value)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        studentsNumberError.classList.add("d-block");
        studentsNumberError.classList.remove("d-none");
        studentsNumberError.innerText = "Students number has to be positive";
        addButton.classList.add("disabled");
    }
    else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        studentsNumberError.classList.remove("d-block");
        studentsNumberError.classList.add("d-none");
        addButton.classList.remove("disabled");
    }
});
addButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.getElementById("csrfToken-add-class");
    const data = {
        className: className.value,
        studentsNumber: studentsNumber.value
    };
    const res = yield fetch("/add-class", {
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
    const errors = response.errors;
    if (errors) {
        errors.forEach((error) => {
            if (error.param === "className") {
                className.classList.add("is-invalid");
                className.classList.remove("is-valid");
                classNameError.classList.remove("d-none");
                classNameError.classList.add("d-block");
                classNameError.innerText = "Invalid value";
                addButton.classList.add("disabled");
            }
            else if (error.param === "studentsNumber") {
                studentsNumber.classList.add("is-invalid");
                studentsNumber.classList.remove("is-valid");
                studentsNumberError.classList.add("d-block");
                studentsNumberError.classList.remove("d-none");
                studentsNumberError.innerText = "Invalid value";
                addButton.classList.add("disabled");
            }
        });
    }
}));
const deleteClassBtns = Array.from(document.querySelectorAll("[data-delete-btn]"));
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
deleteClassBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const button = e.target;
        confirmDeleteBtn.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
            const csrfToken = document.getElementById("csrfToken-add-class");
            const res = yield fetch(`/delete-class`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "csrf-token": csrfToken.value
                },
                body: JSON.stringify({ classId: button.value }),
                redirect: "follow"
            });
            if (res.redirected)
                return (window.location.href = res.url);
            const parsedResponse = yield res.json();
            if (parsedResponse.success) {
                const classCard = document.getElementById(button.value);
                classCard.remove();
                const removeDeleteModal = document.getElementById("remove-delete-modal");
                removeDeleteModal.dispatchEvent(new Event("click"));
            }
        }));
    });
});
