const studentNameInput = document.getElementById(
  "student-name"
)! as HTMLInputElement;
const studentNameError = document.getElementById(
  "student-name-error"
) as HTMLDivElement;
const addStudentButton = document.getElementById(
  "add-student-btn"
)! as HTMLButtonElement;
const classId = document.getElementById("class-id")! as HTMLInputElement;
const addStudMainBtn = document.getElementById(
  "add-student-main"
)! as HTMLButtonElement;

const closeAddStudentModal = document.getElementById(
  "close-modal"
)! as HTMLButtonElement;

const cardGrid = document.getElementById("main-card-grid")! as HTMLDivElement;

const deleteBtns = document.querySelectorAll(
  "[data-delete-student]"
)! as NodeListOf<HTMLButtonElement>;

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    deleteStudent(btn.value);
  });
});

studentNameInput.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;

  if (input.value.trim().length < 5) {
    studentNameInput.classList.add("is-invalid");
    studentNameInput.classList.remove("is-valid");
    studentNameError.classList.remove("d-none");
    studentNameError.classList.add("d-block");
    studentNameError.innerText =
      "Student name has to be at least 5 characters long";
    addStudentButton.classList.add("disabled");
  } else {
    studentNameInput.classList.remove("is-invalid");
    studentNameInput.classList.add("is-valid");
    studentNameError.classList.add("d-none");
    studentNameError.classList.remove("d-block");
    addStudentButton.classList.remove("disabled");
  }
});

addStudentButton.addEventListener("click", async (e) => {
  const csrfToken = document.getElementById("csrfToken")! as HTMLInputElement;

  const data = {
    studentName: studentNameInput.value,
    classId: classId.value
  };

  const res = await fetch("/add-student", {
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
  if (response.error) {
    studentNameInput.classList.add("is-invalid");
    studentNameInput.classList.remove("is-valid");
    studentNameError.classList.remove("d-none");
    studentNameError.classList.add("d-block");
    studentNameError.innerText = "Invalid value";
    addStudentButton.classList.add("disabled");
  }
  if (response.isFullClass) {
    addStudMainBtn.classList.add("disabled");
  }
  if (response.studId) {
    document.getElementById("no-students-caption")!.classList.add("d-none");
    const newCard = createStudentCard(studentNameInput.value, response.studId);
    const mainGrid = document.getElementById(
      "main-card-grid"
    )! as HTMLInputElement;
    mainGrid.insertAdjacentHTML("afterbegin", newCard);
    document
      .getElementById(`card-${response.studId}`)!
      .querySelector("[data-delete-student]")!
      .addEventListener("click", (e) => {
        deleteStudent(response.studId);
      });
    closeAddStudentModal.dispatchEvent(new Event("click"));
    studentNameInput.value = "";
    studentNameInput.classList.remove("is-valid");
    sortStudents();
  }
});

async function deleteStudent(studentId: string) {
  const csrfToken = document.getElementById("csrfToken")! as HTMLInputElement;
  const classId = document.getElementById("class-id")! as HTMLInputElement;
  const data = { classId: classId.value };
  const res = await fetch(`/student/delete/${studentId}`, {
    method: "DELETE",
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
  const parsedResponse = await res.json();

  if (parsedResponse.success) {
    const cardDiv = document.getElementById(
      `card-${studentId}`
    )! as HTMLDivElement;
    cardDiv.remove();
    sortStudents();
  }
  if (!parsedResponse.isFullClass) {
    addStudMainBtn.classList.remove("disabled");
  }
  if (parsedResponse.classEmpty) {
    document.getElementById("no-students-caption")!.classList.remove("d-none");
  }
}

//sorting students
function sortStudents() {
  const cardGrid = document.getElementById("main-card-grid")! as HTMLDivElement;
  const studentsCards = Array.from(cardGrid.querySelectorAll(".hover-card"));
  if (studentsCards.length > 0) {
    studentsCards.sort((a, b) => {
      return a
        .getAttribute("data-student-name")!
        .localeCompare(b.getAttribute("data-student-name")!);
    });

    studentsCards.forEach((card) => {
      cardGrid.insertAdjacentElement("beforeend", card);
    });
  }
}
sortStudents();

//searching students
const searchInput = document.getElementById(
  "search-student-input"
)! as HTMLInputElement;
const noStudentsInfo = document.getElementById(
  "no-students-info"
)! as HTMLParagraphElement;

searchInput.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
  const currentValue = input.value;
  const studentsCards = cardGrid.querySelectorAll(".hover-card");
  let matchingCards = false;
  for (let i = 0; i < studentsCards.length; i++) {
    if (
      studentsCards[i]
        .getAttribute("data-student-name")!
        .toLocaleLowerCase()
        .includes(currentValue.toLocaleLowerCase()) === false
    ) {
      studentsCards[i].classList.add("d-none");
    } else {
      matchingCards = true;
      studentsCards[i].classList.remove("d-none");
    }
  }
  if (!matchingCards) {
    noStudentsInfo.style.display = "block";
  } else {
    noStudentsInfo.style.display = "none";
  }
});

const clearSearchBtn = document.getElementById(
  "clear-search-input"
)! as HTMLButtonElement;
clearSearchBtn.addEventListener("click", (e) => {
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
});

function createStudentCard(studName: string, studId: string): string {
  const newDiv = `  <div
  class="
    col-sm-6 col-lg-3
    d-flex
    align-items-center
    justify-content-around
    hover-card
  "
  id="card-${studId}"
  data-student-name="${studName}"
>
  <div
    class="card text-dark bg-light align-items-center"
    style="width: 15rem; height: 100%;"
  >
    <img
      src="/student.svg"
      class="card-img-top"
      alt="..."
      style="max-width: 80px"
    />
    <div class="card-body text-center">
      <h5 class="card-title">${studName}</h5>
    </div>
    <div class="card-footer w-100">
      <a href="/student/${studId}/${classId.value}" class="btn btn-primary mx-1">Details</a>
      <button type="button" class="btn btn-danger" value="${studId}" data-delete-student>Delete</button>
    </div>
  </div>
</div>`;

  return newDiv;
}
