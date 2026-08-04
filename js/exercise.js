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
    const exerciseModalTitle = exerciseModal ? exerciseModal.querySelector("h2") : null;
    const exerciseAmountInput = document.getElementById("exerciseAmountInput");
    const exerciseAmountLabel = document.getElementById("exerciseAmountLabel");
    const saveExerciseBtn = document.getElementById("saveExerciseBtn");
    const stationaryBikeBtn = document.getElementById("stationaryBikeBtn");
    const ebikeRideBtn = document.getElementById("ebikeRideBtn");
    const cancelExerciseBtn = document.getElementById("cancelExerciseBtn");
    let activeExerciseType = "Stationary Bike";
    let activeExerciseUnit = "minutes";
    let editingExerciseIndex = null;

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

    function showExerciseAmountField(prefilledValue) {
        if (exerciseAmountLabel) {
            exerciseAmountLabel.style.display = "block";
        }
        if (exerciseAmountInput) {
            exerciseAmountInput.style.display = "block";
            exerciseAmountInput.value = prefilledValue !== undefined ? prefilledValue : "";
            exerciseAmountInput.focus();
        }
        if (saveExerciseBtn) {
            saveExerciseBtn.style.display = "block";
        }
    }

    function openExerciseModal() {
        editingExerciseIndex = null;
        if (exerciseModalTitle) {
            exerciseModalTitle.textContent = "Log Exercise";
        }
        if (exerciseModal) {
            exerciseModal.style.display = "block";
            hideExerciseAmountField();
        }
    }

    function closeExerciseModal() {
        editingExerciseIndex = null;
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

    function refreshExerciseData() {
        exerciseLog = exerciseHistory.map(function (entry) {
            return {
                type: entry.type,
                amount: entry.amount,
                unit: entry.unit
            };
        });

        saveExerciseData();
        displayExerciseLog();

        if (exerciseHistorySection && exerciseHistorySection.style.display === "block") {
            renderExerciseHistory();
        }
    }

    function renderExerciseHistory() {
        if (!exerciseHistoryDisplay) return;

        exerciseHistoryDisplay.innerHTML = "";

        if (exerciseHistory.length === 0) {
            exerciseHistoryDisplay.textContent = "No exercise entries yet.";
            return;
        }

        exerciseHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = exerciseHistory.length - 1 - index;
            exerciseHistoryDisplay.innerHTML +=
                entry.date + " • " + entry.time +
                " — <strong>" + entry.type + "</strong> - " +
                entry.amount + " " + entry.unit +
                `
                <div class="history-action-row">
                    <button type="button" class="history-action-btn edit history-edit-btn" data-index="${originalIndex}">Edit</button>
                    <button type="button" class="history-action-btn delete history-delete-btn" data-index="${originalIndex}">Delete</button>
                </div><br>`;
        });
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
                stationaryBikeBtn.classList.add("selected");
                if (ebikeRideBtn) {
                    ebikeRideBtn.classList.remove("selected");
                }
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
                ebikeRideBtn.classList.add("selected");
                if (stationaryBikeBtn) {
                    stationaryBikeBtn.classList.remove("selected");
                }
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

                if (editingExerciseIndex !== null && exerciseHistory[editingExerciseIndex]) {
                    const existing = exerciseHistory[editingExerciseIndex];
                    existing.type = activeExerciseType;
                    existing.amount = value;
                    existing.unit = activeExerciseUnit;
                } else {
                    addExerciseEntry(activeExerciseType, value, activeExerciseUnit);
                }

                closeExerciseModal();
                refreshExerciseData();
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

                renderExerciseHistory();

                exerciseHistorySection.style.display = "block";
                exerciseHistoryButton.textContent = "📊 Hide History";
            });
        }

        if (exerciseHistoryDisplay) {
            exerciseHistoryDisplay.addEventListener("click", function (event) {
                const editButton = event.target.closest(".history-edit-btn");
                const deleteButton = event.target.closest(".history-delete-btn");

                if (editButton) {
                    const index = Number(editButton.getAttribute("data-index"));
                    const entry = exerciseHistory[index];
                    if (!entry) return;

                    editingExerciseIndex = index;
                    activeExerciseType = entry.type;
                    activeExerciseUnit = entry.unit;
                    if (exerciseAmountLabel) {
                        exerciseAmountLabel.textContent = activeExerciseType === "E-Bike Ride" ? "Miles" : "Minutes";
                    }
                    if (exerciseAmountInput) {
                        exerciseAmountInput.type = "number";
                        exerciseAmountInput.step = activeExerciseUnit === "miles" ? "0.1" : "1";
                        exerciseAmountInput.setAttribute("inputmode", activeExerciseUnit === "miles" ? "decimal" : "numeric");
                    }
                    if (exerciseModal) {
                        exerciseModal.style.display = "block";
                    }
                    if (exerciseModalTitle) {
                        exerciseModalTitle.textContent = "Edit Exercise";
                    }
                    showExerciseAmountField(entry.amount);
                    return;
                }

                if (deleteButton) {
                    const index = Number(deleteButton.getAttribute("data-index"));
                    if (!confirmHistoryDelete()) return;

                    removeHistoryEntry(exerciseHistory, index);
                    refreshExerciseData();
                }
            });
        }

        displayExerciseLog();
    }

    window.initExerciseCenter = initExerciseCenter;
    window.displayExerciseLog = displayExerciseLog;
})();
