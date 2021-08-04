const addNoteModal = document.getElementById(
  "add-note-modal"
)! as HTMLDivElement;
const grade = document.getElementById("grade")! as HTMLInputElement;
const date = document.getElementById("date")! as HTMLInputElement;
const addNotes = document.getElementById("add-notes")! as HTMLInputElement;

const gradeError = document.getElementById("grade-error")! as HTMLDivElement;
const dateError = document.getElementById("date-error")! as HTMLDivElement;
const addNotesError = document.getElementById(
  "add-notes-error"
)! as HTMLDivElement;

const subject = document.getElementById("subject-name")! as HTMLInputElement;
const subjectError = document.getElementById(
  "subject-name-error"
)! as HTMLDivElement;

const addNoteButton = document.getElementById(
  "add-note-btn"
)! as HTMLButtonElement;

grade.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;

  if (+input.value < 1 || +input.value > 6) {
    grade.classList.remove("is-valid");
    grade.classList.add("is-invalid");
    gradeError.classList.add("d-block");
    gradeError.classList.remove("d-none");
    gradeError.innerText = "Grades should be between 0 and 6.";
    addNoteButton.classList.add("disabled");
  } else {
    grade.classList.add("is-valid");
    grade.classList.remove("is-invalid");
    gradeError.classList.remove("d-block");
    gradeError.classList.add("d-none");
    addNoteButton.classList.remove("disabled");
  }
});

subject.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;

  if (input.value.trim().length < 2) {
    subject.classList.add("is-invalid");
    subject.classList.remove("is-valid");
    subjectError.classList.add("d-block");
    subjectError.classList.remove("d-none");
    subjectError.innerText =
      "Subject name has to be at least 2 characters long.";
    addNoteButton.classList.add("disabled");
  } else {
    subject.classList.remove("is-invalid");
    subject.classList.add("is-valid");
    subjectError.classList.remove("d-block");
    subjectError.classList.add("d-none");
    addNoteButton.classList.remove("disabled");
  }
});

date.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
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
  } else {
    date.classList.remove("is-invalid");
    date.classList.add("is-valid");
    addNoteButton.classList.remove("disabled");
    dateError.classList.remove("d-block");
    dateError.classList.add("d-none");
  }
});
const studentId = document.getElementById("student-id")! as HTMLInputElement;
const csrfToken = document.getElementById("csrf-token")! as HTMLInputElement;

const mode = document.getElementById("mode")! as HTMLInputElement;

if (mode.value === "add") {
  const classId = document.getElementById("class-id")! as HTMLInputElement;
  addNoteButton.addEventListener("click", async (e) => {
    const data = {
      grade: grade.value,
      subjectName: subject.value,
      date: date.value,
      additionalNotes: addNotes.value,
      classId: classId.value
    };

    const res = await fetch(`/student/${studentId.value}/add-note`, {
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

    const response = await res.json();

    if (response.success) {
      const tableBody = document.getElementById(
        "tableBody"
      )! as HTMLTableSectionElement;
      const newGradeElement = `<tr>
    <th scope="row">${grade.value}</th>
    <td> ${subject.value} </td>
    <td> ${date.value.toLocaleString()} </td>
    <td><a class="btn btn-success" href="/grades/${
      response.gradeId
    }">Details</button></td>
  </tr>`;
      tableBody.insertAdjacentHTML("afterbegin", newGradeElement);

      const body = document.querySelector("body")! as HTMLBodyElement;
      body.classList.remove("modal-open");
      body.setAttribute("style", "");
      const modal = document.getElementById("add-note-modal") as HTMLDivElement;
      modal.style.display = "none";
      modal.classList.remove("show");
      const modalBackdrop = document.querySelector(
        ".modal-backdrop"
      )! as HTMLDivElement;
      modalBackdrop.remove();

      grade.value = "";
      grade.classList.remove("is-valid");
      subject.value = "";
      subject.classList.remove("is-valid");
      date.value = "";
      date.classList.remove("is-valid");
      addNotes.value = "";

      const toggleModalBtn = document.getElementById(
        "toggle-modal"
      )! as HTMLButtonElement;
      toggleModalBtn.dispatchEvent(new Event("click"));
    }

    if (response.errors) {
      response.errors.forEach((e: any) => {
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
  });
} else if (mode.value === "edit") {
  addNoteButton.addEventListener("click", async (e) => {
    const data = {
      grade: grade.value,
      subjectName: subject.value,
      date: date.value,
      additionalNotes: addNotes.value
    };

    const studentId = document.getElementById("studId")! as HTMLInputElement;
    const gradeId = document.getElementById("gradeId")! as HTMLInputElement;

    const res = await fetch(`/notes/${studentId.value}/${gradeId.value}/edit`, {
      method: "POST",
      headers: {
        "csrf-token": csrfToken.value,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      redirect: "follow"
    });

    if (res.redirected) window.location.href = res.url;

    const response = await res.json();

    if (response.success) {
      const body = document.querySelector("body")! as HTMLBodyElement;
      body.classList.remove("modal-open");
      body.setAttribute("style", "");
      const modal = document.getElementById("add-note-modal") as HTMLDivElement;
      modal.style.display = "none";
      modal.classList.remove("show");
      const modalBackdrop = document.querySelector(
        ".modal-backdrop"
      )! as HTMLDivElement;
      modalBackdrop.remove();

      grade.classList.remove("is-valid");
      subject.classList.remove("is-valid");
      date.classList.remove("is-valid");

      const toggleModalBtn = document.getElementById(
        "toggle-modal"
      )! as HTMLButtonElement;
      toggleModalBtn.dispatchEvent(new Event("click"));

      const newGradeValue = grade.value;
      const newSubject = subject.value;
      const newDate = date.value.toLocaleString();
      const newAdditionalNotes = addNotes.value;

      const gradeVal = document.getElementById(
        "grade-val"
      )! as HTMLHeadingElement;
      const subjectVal = document.getElementById(
        "subject-val"
      )! as HTMLHeadingElement;
      const dateVal = document.getElementById(
        "date-val"
      )! as HTMLHeadingElement;
      const notesVal = document.getElementById(
        "notes-val"
      )! as HTMLHeadingElement;

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
      if (+newGradeValue <= 2) gradeVal.classList.add("text-danger");
      else if (+newGradeValue >= 3 && +newGradeValue < 5)
        gradeVal.classList.add("text-warning");
      else gradeVal.classList.add("text-success");
    }
  });

  const confirmDeleteGrade = document.getElementById(
    "confirm-delete-grade"
  )! as HTMLButtonElement;
  confirmDeleteGrade.addEventListener("click", async (e) => {
    const gradeId = document.getElementById("gradeId")! as HTMLInputElement;
    const studId = document.getElementById("studId")! as HTMLInputElement;
    const redirectUrl = document
      .getElementById("redirect-btn")!
      .getAttribute("href");

    const res = await fetch(`/notes/${studId.value}/${gradeId.value}/delete`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "csrf-token": csrfToken.value
      },
      body: JSON.stringify({ redirectUrl: redirectUrl }),
      redirect: "follow"
    });

    if (res.redirected) window.location.href = res.url;
  });
}
