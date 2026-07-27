// =====================================
// John's Assistant
// exercise.js
// Version 0.3.0a
// =====================================

(function () {
    let exerciseLog = loadData("exerciseLog", []);
    let exerciseHistory = loadData("exerciseHistory", []);

    const exerciseButton = document.getElementById("exerciseButton");
    const exerciseDisplay = document.getElementById("exerciseDisplay");
    const exerciseHistoryButton = document.getElementById("exerciseHistoryButton");
    const exerciseHistorySection = document.getElementById("exerciseHistorySection");
    const exerciseHistoryDisplay = document.getElementById("exerciseHistoryDisplay");
    const exerciseModal = document.getElementById("exerciseModal");
    const stationaryBikeBtn = document.getElementById("stationaryBikeBtn");
    const ebikeRideBtn = document.getElementById("ebikeRideBtn");
    const cancelExerciseBtn = document.getElementById("cancelExerciseBtn");

    function saveExerciseData() {
        saveData("exerciseHistory", exerciseHistory);
        saveData("exerciseLog", exerciseLog);
    }

    function openExerciseModal() {
        if (exerciseModal) {
            exerciseModal.style.display = "block";
        }
    }

    function closeExerciseModal() {
        if (exerciseModal) {
            exerciseModal.style.display = "none";
        }
    }

    function addExerciseEntry(type, amount, unit) {
        exerciseLog.push({
            type: type,
            amount: amount,
            unit: unit
        });

        exerciseHistory.push({
            type: type,
            amount: amount,
            unit: unit,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            })
        });

        saveExerciseData();
        displayExerciseLog();
    }

    function displayExerciseLog() {
        if (!exerciseDisplay) return;
        if (exerciseLog.length === 0) {
            exerciseDisplay.textContent = "No exercise logged yet.";
            return;
        }

        const latest = exerciseLog[exerciseLog.length - 1];
        exerciseDisplay.innerHTML =
            "Last Exercise: <strong>" + latest.type + "</strong> - " +
            latest.amount + " " + latest.unit;
    }

    function initExerciseCenter() {
        if (exerciseButton) {
            exerciseButton.addEventListener("click", openExerciseModal);
        }

        if (cancelExerciseBtn) {
            cancelExerciseBtn.addEventListener("click", closeExerciseModal);
        }

        if (stationaryBikeBtn) {
            stationaryBikeBtn.addEventListener("click", function () {
                if (exerciseModal) {
                    exerciseModal.style.display = "none";
                }

                const minutes = prompt("How many minutes did you ride the stationary bike?");

                if (!minutes) return;

                addExerciseEntry("Stationary Bike", minutes, "minutes");
            });
        }

        if (ebikeRideBtn) {
            ebikeRideBtn.addEventListener("click", function () {
                if (exerciseModal) {
                    exerciseModal.style.display = "none";
                }

                const miles = prompt("How many miles did you ride your e-bike?");

                if (!miles) return;

                addExerciseEntry("E-Bike Ride", miles, "miles");
            });
        }

        if (exerciseHistorySection) {
            exerciseHistorySection.style.display = "none";
            if (exerciseHistoryButton) {
                exerciseHistoryButton.textContent = "📊 History";
            }
        }

        if (exerciseHistoryButton) {
            exerciseHistoryButton.addEventListener("click", function () {
                if (!exerciseHistorySection || !exerciseHistoryDisplay) return;

                if (exerciseHistorySection.style.display === "block") {
                    exerciseHistorySection.style.display = "none";
                    exerciseHistoryButton.textContent = "📊 History";
                    return;
                }

                exerciseHistoryDisplay.innerHTML = "";

                if (exerciseHistory.length === 0) {
                    exerciseHistoryDisplay.textContent = "No exercise entries yet.";
                } else {
                    exerciseHistory.slice().reverse().forEach(function (entry) {
                        exerciseHistoryDisplay.innerHTML +=
                            entry.date + " • " + entry.time +
                            " — <strong>" + entry.type +
                            "</strong> - " + entry.amount + " " + entry.unit + "<br>";
                    });
                }

                exerciseHistorySection.style.display = "block";
                exerciseHistoryButton.textContent = "📊 Hide History";
            });
        }

        displayExerciseLog();
    }

    window.initExerciseCenter = initExerciseCenter;
    window.displayExerciseLog = displayExerciseLog;
})();
