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
const username = document.getElementById("username");
const sendButton = document.getElementById("send-button");
const usernameErrorDiv = document.getElementById("invalid-username");
username.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length >= 5) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        sendButton.classList.remove("disabled");
        usernameErrorDiv.classList.remove("d-block");
        usernameErrorDiv.innerText = ``;
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        sendButton.classList.add("disabled");
        usernameErrorDiv.classList.remove("d-none");
        usernameErrorDiv.classList.add("d-block");
        usernameErrorDiv.innerText = `Username has to be min. 5 characters long.`;
    }
});
const signUpEmail = document.getElementById("sign-up-email");
const signUpEmailErrorDiv = document.getElementById("sign-up-email-error");
signUpEmail.addEventListener("input", (e) => {
    const input = e.target;
    if (!validateEmail(input.value)) {
        signUpEmail.classList.add("is-invalid");
        signUpEmail.classList.remove("is-valid");
        sendButton.classList.add("disabled");
        signUpEmailErrorDiv.classList.remove("d-none");
        signUpEmailErrorDiv.classList.add("d-block");
        signUpEmailErrorDiv.innerText = `Invalid email`;
    }
    else {
        signUpEmail.classList.remove("is-invalid");
        signUpEmail.classList.add("is-valid");
        sendButton.classList.remove("disabled");
        signUpEmailErrorDiv.classList.add("d-none");
        signUpEmailErrorDiv.classList.remove("d-block");
        signUpEmailErrorDiv.innerText = ``;
    }
});
const signUpPassword = document.getElementById("sign-up-password");
const signUpPasswordError = document.getElementById("sign-up-password-error");
const confirmPassword = document.getElementById("confirm-password");
const confirmPasswordError = document.getElementById("confirm-password-error");
let startedWritingSecondPassword = false;
signUpPassword.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length >= 5) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        sendButton.classList.remove("disabled");
        signUpPasswordError.classList.remove("d-block");
        signUpPasswordError.innerText = ``;
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        sendButton.classList.add("disabled");
        signUpPasswordError.classList.remove("d-none");
        signUpPasswordError.classList.add("d-block");
        signUpPasswordError.innerText = `Password has to be at least 5 characters long.`;
    }
    if (input.value !== confirmPassword.value && startedWritingSecondPassword) {
        confirmPassword.classList.remove("is-valid");
        confirmPassword.classList.add("is-invalid");
        sendButton.classList.add("disabled");
        confirmPasswordError.classList.remove("d-none");
        confirmPasswordError.classList.add("d-block");
        confirmPasswordError.innerText = `Passwords do not match`;
    }
});
confirmPassword.addEventListener("input", (e) => {
    const input = e.target;
    startedWritingSecondPassword = true;
    if (input.value.trim().length >= 5 &&
        input.value.trim() === signUpPassword.value.trim()) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        sendButton.classList.remove("disabled");
        confirmPasswordError.classList.remove("d-block");
        confirmPasswordError.innerText = ``;
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        sendButton.classList.add("disabled");
        confirmPasswordError.classList.remove("d-none");
        confirmPasswordError.classList.add("d-block");
        confirmPasswordError.innerText = `Passwords do not match`;
    }
});
//sign up request
sendButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.getElementById("csrfToken-sign-up");
    const data = {
        username: username.value,
        email: signUpEmail.value,
        password: signUpPassword.value
    };
    const res = yield fetch("/teacher-sign-up", {
        method: "POST",
        headers: {
            "csrf-token": csrfToken.value,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        redirect: "follow"
    });
    if (res.redirected)
        return (window.location.href = res.url);
    const response = yield res.json();
    const parsedResult = response.errors;
    if (parsedResult) {
        parsedResult.forEach((error) => {
            if (error.param === "username") {
                username.classList.remove("is-valid");
                username.classList.add("is-invalid");
                sendButton.classList.add("disabled");
                usernameErrorDiv.classList.remove("d-none");
                usernameErrorDiv.innerText = `Invalid value`;
            }
            else if (error.param === "email") {
                signUpEmail.classList.add("is-invalid");
                signUpEmail.classList.remove("is-valid");
                sendButton.classList.add("disabled");
                signUpEmailErrorDiv.classList.remove("d-none");
                signUpEmailErrorDiv.classList.add("d-block");
                signUpEmailErrorDiv.innerText = `Invalid value.`;
            }
            else if (error.param === "password") {
                signUpPassword.classList.remove("is-valid");
                signUpPassword.classList.add("is-invalid");
                sendButton.classList.add("disabled");
                signUpPasswordError.classList.remove("d-none");
                signUpPasswordError.innerText = `Invalid value`;
                confirmPassword.classList.remove("is-valid");
                confirmPassword.classList.add("is-invalid");
                sendButton.classList.add("disabled");
                confirmPasswordError.classList.remove("d-none");
                confirmPasswordError.classList.add("d-block");
                confirmPasswordError.innerText = "Invalid value";
            }
            else {
                confirmPassword.classList.remove("is-valid");
                confirmPassword.classList.add("is-invalid");
                sendButton.classList.add("disabled");
                confirmPasswordError.classList.remove("d-none");
                confirmPasswordError.classList.add("d-block");
                confirmPasswordError.innerText = `Invalid value.`;
            }
        });
    }
    if (parsedResult && parsedResult.theSameEmail) {
        signUpEmail.classList.add("is-invalid");
        signUpEmail.classList.remove("is-valid");
        sendButton.classList.add("disabled");
        signUpEmailErrorDiv.classList.remove("d-none");
        signUpEmailErrorDiv.classList.add("d-block");
        signUpEmailErrorDiv.innerText =
            "This email already exists. Please try another one.";
    }
    const success = response.userSignedUp;
    if (success && success === true) {
        const body = document.querySelector("body");
        body.classList.remove("modal-open");
        body.setAttribute("style", "");
        const modal = document.getElementById("sign-up-modal");
        modal.style.display = "none";
        modal.classList.remove("show");
        const modalBackdrop = document.querySelector(".modal-backdrop");
        modalBackdrop.remove();
        const successMessage = document.getElementById("successfull-sign-up");
        successMessage.style.display = "block";
        signUpEmail.classList.remove("is-valid");
        signUpEmail.value = "";
        username.classList.remove("is-valid");
        username.value = "";
        signUpPassword.classList.remove("is-valid");
        signUpPassword.value = "";
        confirmPassword.classList.remove("is-valid");
        confirmPassword.value = "";
    }
    const theSameEmail = response.theSameEmail;
    if (theSameEmail && theSameEmail === true) {
        signUpEmail.classList.remove("is-valid");
        signUpEmail.classList.add("is-invalid");
        signUpEmailErrorDiv.classList.add("d-block");
        signUpEmailErrorDiv.classList.remove("d-none");
        signUpEmailErrorDiv.innerText =
            "This email already exists. Please try another one.";
    }
}));
//logging in
const logInForm = document.getElementById("log-in-form");
const logInEmailInput = logInForm.querySelector("#email-2");
const logInPasswordInput = logInForm.querySelector("#password");
const logInEmailError = logInForm.querySelector("#invalid-email-feedback");
const logInPasswordError = logInForm.querySelector("#invalid-password-feedback");
const logInButton = document.getElementById("log-in-button");
logInEmailInput.addEventListener("input", (e) => {
    const input = e.target;
    if (!validateEmail(input.value)) {
        logInEmailInput.classList.add("is-invalid");
        logInEmailInput.classList.remove("is-valid");
        logInButton.classList.add("disabled");
        logInEmailError.classList.remove("d-none");
        logInEmailError.classList.add("d-block");
        logInEmailError.innerText = "Invalid email";
    }
    else {
        logInEmailInput.classList.remove("is-invalid");
        logInEmailInput.classList.add("is-valid");
        logInButton.classList.remove("disabled");
        logInEmailError.classList.add("d-none");
        logInEmailError.classList.remove("d-block");
        logInEmailError.innerText = "";
    }
});
logInPasswordInput.addEventListener("input", (e) => {
    const input = e.target;
    if (input.value.trim().length >= 5) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        logInButton.classList.remove("disabled");
        logInPasswordError.classList.remove("d-block");
        logInPasswordError.innerText = "";
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        logInButton.classList.add("disabled");
        logInPasswordError.classList.remove("d-none");
        logInPasswordError.classList.add("d-block");
        logInPasswordError.innerText = `Password has to be at least 5 characters long`;
    }
});
logInButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const csrfToken = document.getElementById("csrfToken-log-in");
    const data = {
        email: logInEmailInput.value,
        password: logInPasswordInput.value
    };
    const res = yield fetch("/teacher-log-in", {
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
    const parsedResult = response.errors;
    if (parsedResult) {
        parsedResult.forEach((error) => {
            if (error.param === "email") {
                logInEmailInput.classList.add("is-invalid");
                logInEmailInput.classList.remove("is-valid");
                logInButton.classList.add("disabled");
                logInEmailError.classList.remove("d-none");
                logInEmailError.classList.add("d-block");
                logInEmailError.innerText = "Invalid email";
            }
            else if (error.param === "password") {
                logInPasswordInput.classList.remove("is-valid");
                logInPasswordInput.classList.add("is-invalid");
                logInButton.classList.add("disabled");
                logInPasswordError.classList.remove("d-none");
                logInPasswordError.classList.add("d-block");
                logInPasswordError.innerText = `Password has to be at least 5 characters long`;
            }
        });
    }
    const invalidData = response.invalidData;
    if (invalidData) {
        logInEmailInput.classList.add("is-invalid");
        logInEmailInput.classList.remove("is-valid");
        logInButton.classList.add("disabled");
        logInEmailError.classList.remove("d-none");
        logInEmailError.classList.add("d-block");
        logInEmailError.innerText = "Invalid email or password";
        logInPasswordInput.classList.remove("is-valid");
        logInPasswordInput.classList.add("is-invalid");
        logInButton.classList.add("disabled");
        logInPasswordError.classList.remove("d-none");
        logInPasswordError.classList.add("d-block");
        logInPasswordError.innerText = `Invalid email or password.`;
    }
}));
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
