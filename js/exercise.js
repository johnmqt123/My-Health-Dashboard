// =====================================
// John's Assistant
// exercise.js
// Version 0.3.0a
// =====================================

// Load saved exercise data
let exerciseLog =
    JSON.parse(localStorage.getItem("exerciseLog")) || [];

let exerciseHistory =
    JSON.parse(localStorage.getItem("exerciseHistory")) || [];

// Get page elements
const exerciseButton =
    document.getElementById("exerciseButton");

const exerciseDisplay =
    document.getElementById("exerciseDisplay");

const exerciseHistoryButton =
    document.getElementById("exerciseHistoryButton");

const exerciseHistorySection =
    document.getElementById("exerciseHistorySection");

const exerciseHistoryDisplay =
    document.getElementById("exerciseHistoryDisplay");

const exerciseModal =
    document.getElementById("exerciseModal");

const stationaryBikeBtn =
    document.getElementById("stationaryBikeBtn");

const ebikeRideBtn =
    document.getElementById("ebikeRideBtn");

const cancelExerciseBtn =

    document.getElementById("cancelExerciseBtn");
    function saveExerciseData() {

    localStorage.setItem(
        "exerciseLog",
        JSON.stringify(exerciseLog)
    );

    localStorage.setItem(
        "exerciseHistory",
        JSON.stringify(exerciseHistory)
    );

}
function openExerciseModal() {

    exerciseModal.style.display = "block";

}

function closeExerciseModal() {

    exerciseModal.style.display = "none";

}
exerciseButton.addEventListener(
    "click",
    openExerciseModal
);

cancelExerciseBtn.addEventListener(
    "click",
    closeExerciseModal
);
// Display today's exercise entries
function displayExerciseLog() {

    exerciseDisplay.innerHTML = "";

    const today = new Date().toLocaleDateString();

    const todaysEntries = exerciseHistory.filter(function (entry) {
        return entry.date === today;
    });

    if (todaysEntries.length === 0) {

        exerciseDisplay.innerHTML = "No exercise logged today.";

        return;
    }

    todaysEntries.forEach(function (entry) {

        exerciseDisplay.innerHTML +=
            "🚴 " +
            entry.type +
            " - " +
            entry.amount +
            " " +
            entry.unit +
            "<br>";

    });

}

// Show today's exercise when the page loads
displayExerciseLog();
