// sorting
const classesContainer = document.getElementById(
  "classes-container"
)! as HTMLDivElement;
const classesCards = Array.from(classesContainer.children);

if (classesCards.length > 0) {
  classesCards.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });

  classesCards.forEach((card) => {
    classesContainer.insertAdjacentElement("afterbegin", card);
  });
}

const addClassForm = document.getElementById(
  "add-class-form"
)! as HTMLDivElement;
const className = addClassForm.querySelector(
  "#class-name"
)! as HTMLInputElement;
const classNameError = addClassForm.querySelector(
  "#class-name-error"
)! as HTMLDivElement;
const studentsNumber = addClassForm.querySelector(
  "#students-number"
)! as HTMLInputElement;
const addButton = document.getElementById(
  "add-class-btn"
)! as HTMLButtonElement;
const studentsNumberError = document.getElementById(
  "students-number-error"
)! as HTMLDivElement;

className.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;

  if (input.value.trim().length < 1) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    classNameError.classList.remove("d-none");
    classNameError.classList.add("d-block");
    classNameError.innerText = "Class name has to be at least 1 character long";
    addButton.classList.add("disabled");
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    classNameError.classList.add("d-none");
    classNameError.classList.remove("d-block");
    addButton.classList.remove("disabled");
  }
});

studentsNumber.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;

  if (+input.value <= 0 || isNaN(+input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    studentsNumberError.classList.add("d-block");
    studentsNumberError.classList.remove("d-none");
    studentsNumberError.innerText = "Students number has to be positive";
    addButton.classList.add("disabled");
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    studentsNumberError.classList.remove("d-block");
    studentsNumberError.classList.add("d-none");
    addButton.classList.remove("disabled");
  }
});

addButton.addEventListener("click", async (e) => {
  const csrfToken = document.getElementById(
    "csrfToken-add-class"
  )! as HTMLInputElement;

  const data = {
    className: className.value,
    studentsNumber: studentsNumber.value
  };

  const res = await fetch("/add-class", {
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

  const response = await res.json();

  const errors = response.errors;
  if (errors) {
    errors.forEach((error: any) => {
      if (error.param === "className") {
        className.classList.add("is-invalid");
        className.classList.remove("is-valid");
        classNameError.classList.remove("d-none");
        classNameError.classList.add("d-block");
        classNameError.innerText = "Invalid value";
        addButton.classList.add("disabled");
      } else if (error.param === "studentsNumber") {
        studentsNumber.classList.add("is-invalid");
        studentsNumber.classList.remove("is-valid");
        studentsNumberError.classList.add("d-block");
        studentsNumberError.classList.remove("d-none");
        studentsNumberError.innerText = "Invalid value";
        addButton.classList.add("disabled");
      }
    });
  }
});

const deleteClassBtns = Array.from(
  document.querySelectorAll("[data-delete-btn]")!
);

const confirmDeleteBtn = document.getElementById(
  "confirm-delete-btn"
)! as HTMLButtonElement;

deleteClassBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const button = e.target as HTMLButtonElement;

    confirmDeleteBtn.addEventListener("click", async (e) => {
      const csrfToken = document.getElementById(
        "csrfToken-add-class"
      )! as HTMLInputElement;

      const res = await fetch(`/delete-class`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken.value
        },
        body: JSON.stringify({ classId: button.value }),
        redirect: "follow"
      });

      if (res.redirected) return (window.location.href = res.url);

      const parsedResponse = await res.json();
      if (parsedResponse.success) {
        const classCard = document.getElementById(
          button.value
        )! as HTMLDivElement;
        classCard.remove();
        const removeDeleteModal = document.getElementById(
          "remove-delete-modal"
        )! as HTMLButtonElement;
        removeDeleteModal.dispatchEvent(new Event("click"));
      }
    });
  });
});
