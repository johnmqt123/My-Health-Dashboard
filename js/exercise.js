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
    const exerciseAmountInput = document.getElementById("exerciseAmountInput");
    const exerciseAmountLabel = document.getElementById("exerciseAmountLabel");
    const saveExerciseBtn = document.getElementById("saveExerciseBtn");
    const stationaryBikeBtn = document.getElementById("stationaryBikeBtn");
    const ebikeRideBtn = document.getElementById("ebikeRideBtn");
    const cancelExerciseBtn = document.getElementById("cancelExerciseBtn");
    let activeExerciseType = "Stationary Bike";
    let activeExerciseUnit = "minutes";

    function saveExerciseData() {
        saveData("exerciseHistory", exerciseHistory);
        saveData("exerciseLog", exerciseLog);
    }

    function hideExerciseAmountField() {
        if (exerciseAmountLabel) {
            exerciseAmountLabel.style.display = "none";
        }
        if (exerciseAmountInput) {
            exerciseAmountInput.style.display = "none";
            exerciseAmountInput.value = "";
        }
        if (saveExerciseBtn) {
            saveExerciseBtn.style.display = "none";
        }
    }

    function showExerciseAmountField() {
        if (exerciseAmountLabel) {
            exerciseAmountLabel.style.display = "block";
        }
        if (exerciseAmountInput) {
            exerciseAmountInput.style.display = "block";
            exerciseAmountInput.value = "";
            exerciseAmountInput.focus();
        }
        if (saveExerciseBtn) {
            saveExerciseBtn.style.display = "block";
        }
    }

    function openExerciseModal() {
        if (exerciseModal) {
            exerciseModal.style.display = "block";
            hideExerciseAmountField();
        }
    }

    function closeExerciseModal() {
        if (exerciseModal) {
            exerciseModal.style.display = "none";
        }
        hideExerciseAmountField();
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
        hideExerciseAmountField();

        if (exerciseButton) {
            exerciseButton.addEventListener("click", openExerciseModal);
        }

        if (cancelExerciseBtn) {
            cancelExerciseBtn.addEventListener("click", closeExerciseModal);
        }

        if (stationaryBikeBtn) {
            stationaryBikeBtn.addEventListener("click", function () {
                activeExerciseType = "Stationary Bike";
                activeExerciseUnit = "minutes";
                if (exerciseAmountLabel) {
                    exerciseAmountLabel.textContent = "Minutes";
                }
                if (exerciseAmountInput) {
                    exerciseAmountInput.type = "number";
                    exerciseAmountInput.step = "1";
                    exerciseAmountInput.setAttribute("inputmode", "numeric");
                    exerciseAmountInput.value = "";
                }
                showExerciseAmountField();
            });
        }

        if (ebikeRideBtn) {
            ebikeRideBtn.addEventListener("click", function () {
                activeExerciseType = "E-Bike Ride";
                activeExerciseUnit = "miles";
                if (exerciseAmountLabel) {
                    exerciseAmountLabel.textContent = "Miles";
                }
                if (exerciseAmountInput) {
                    exerciseAmountInput.type = "number";
                    exerciseAmountInput.step = "0.1";
                    exerciseAmountInput.setAttribute("inputmode", "decimal");
                    exerciseAmountInput.value = "";
                }
                showExerciseAmountField();
            });
        }

        if (saveExerciseBtn) {
            saveExerciseBtn.addEventListener("click", function () {
                if (!exerciseAmountInput) return;

                const value = exerciseAmountInput.value.trim();

                if (!value) {
                    alert("Please enter the exercise amount.");
                    return;
                }

                addExerciseEntry(activeExerciseType, value, activeExerciseUnit);
                closeExerciseModal();
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
