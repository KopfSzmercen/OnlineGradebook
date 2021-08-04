"use strict";
const canvas = document.getElementById("grades-chart");
const ctx = canvas.getContext("2d");
const grades = document.getElementById("grades-arr");
const gradesArr = grades.value.split(",");
const allGrades = gradesArr.length;
const gradesSet = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};
gradesArr.forEach((g) => {
    switch (g) {
        case "1":
            gradesSet[1]++;
            break;
        case "2":
            gradesSet[2]++;
            break;
        case "3":
            gradesSet[3]++;
            break;
        case "4":
            gradesSet[4]++;
            break;
        case "5":
            gradesSet[5]++;
            break;
        case "6":
            gradesSet[6]++;
            break;
        default:
            break;
    }
});
const config = {
    type: "bar",
    data: {
        labels: ["1", "2", "3", "4", "5"]
    }
};
