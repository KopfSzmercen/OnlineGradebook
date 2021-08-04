const studentCode = document.getElementById(
  "student-code"
)! as HTMLInputElement;

const studentCodeError = document.getElementById(
  "student-code-error"
)! as HTMLDivElement;
const logInStudentButton = document.getElementById(
  "log-in-btn"
)! as HTMLInputElement;

studentCode.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.value.trim().length !== 10) {
    studentCode.classList.add("is-invalid");
    studentCode.classList.remove("is-valid");
    studentCodeError.classList.add("d-block");
    studentCodeError.classList.remove("d-none");
    studentCodeError.innerText = "The code has to be 10 characters long";
    logInStudentButton.classList.add("disabled");
  } else {
    studentCode.classList.remove("is-invalid");
    studentCode.classList.add("is-valid");
    studentCodeError.classList.remove("d-block");
    studentCodeError.classList.add("d-none");
    logInStudentButton.classList.remove("disabled");
  }
});

logInStudentButton.addEventListener("click", async (e) => {
  const csrfToken = document.getElementById("csrf-token")! as HTMLInputElement;
  const res = await fetch("/student-dashboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken.value
    },
    redirect: "follow",
    body: JSON.stringify({ studCode: studentCode.value })
  });
  if (res.redirected) window.location.href = res.url;
  else {
    studentCode.classList.add("is-invalid");
    studentCode.classList.remove("is-valid");
    studentCodeError.classList.add("d-block");
    studentCodeError.classList.remove("d-none");
    studentCodeError.innerText = "Invalid code. Please try again.";
    logInStudentButton.classList.add("disabled");
  }
});
