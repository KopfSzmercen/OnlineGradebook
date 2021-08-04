"use strict";
const canvas = document.getElementById("grades-chart");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const grades = document.getElementById("grades-arr");
  const gradesArr = grades.value.split(",");
  const allGrades = gradesArr.length;
  const data = [0, 0, 0, 0, 0, 0];
  gradesArr.forEach((g) => {
    data[+g - 1]++;
  });
  for (let i = 0; i < data.length; i++) {
    data[i] = +((data[i] * 100) / allGrades).toFixed(2);
  }

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5", "6"],
      datasets: [
        {
          label: "% of grades",
          data: data,
          backgroundColor: "#FF2970"
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Percentage distribution of notes"
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
