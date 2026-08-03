// =====================================
// John's Assistant
// weightCenter.js
// =====================================

(function () {
    let weightLog = loadData("weightLog", {});
    let weightHistory = loadData("weightHistory", []);

    const weightButton = document.getElementById("weightButton");
    const weightDisplay = document.getElementById("weightDisplay");
    const summaryWeight = document.getElementById("summaryWeight");
    const weightHistoryButton = document.getElementById("weightHistoryButton");
    const weightHistorySection = document.getElementById("weightHistorySection");
    const weightHistoryDisplay = document.getElementById("weightHistoryDisplay");
    const weightModal = document.getElementById("weightModal");
    const weightInput = document.getElementById("weightInput");
    const weightNoteInput = document.getElementById("weightNoteInput");
    const saveWeightBtn = document.getElementById("saveWeightBtn");
    const cancelWeightBtn = document.getElementById("cancelWeightBtn");

    function saveWeightData() {
        saveData("weightHistory", weightHistory);
        saveData("weightLog", weightLog);
    }

    function renderCurrentWeight() {
        if (!weightDisplay) return;

        if (weightLog.current) {
            weightDisplay.textContent = "Last Weight: " + weightLog.current + " lb";
            if (summaryWeight) {
                summaryWeight.textContent = weightLog.current + " lb";
            }
        } else {
            weightDisplay.textContent = "Last Weight: --";
            if (summaryWeight) {
                summaryWeight.textContent = "Not Recorded";
            }
        }
    }

    function renderWeightHistory() {
        if (!weightHistoryDisplay) return;

        weightHistoryDisplay.innerHTML = "";

        if (weightHistory.length === 0) {
            weightHistoryDisplay.textContent = "No weight entries yet.";
            return;
        }

        weightHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = weightHistory.length - 1 - index;
            let html = entry.date + " • " + entry.time + " — <strong>" + entry.weight + " lb</strong>";

            if (entry.note) {
                html += " — " + entry.note;
            }

            html += ` <button type="button" class="history-delete-btn" data-index="${originalIndex}" aria-label="Delete weight entry">🗑️</button><br>`;
            weightHistoryDisplay.innerHTML += html;
        });
    }

    function refreshWeightData() {
        const latestEntry = weightHistory.length ? weightHistory[weightHistory.length - 1] : null;
        if (latestEntry) {
            weightLog.current = latestEntry.weight;
        } else {
            weightLog.current = null;
        }

        saveData("weightLog", weightLog);
        saveData("weightHistory", weightHistory);
        renderCurrentWeight();

        if (weightHistorySection && weightHistorySection.style.display === "block") {
            renderWeightHistory();
        }
    }

    function toggleWeightHistory() {
        if (!weightHistorySection || !weightHistoryButton || !weightHistoryDisplay) return;

        if (weightHistorySection.style.display === "block") {
            weightHistorySection.style.display = "none";
            weightHistoryButton.textContent = "📊 History";
            return;
        }

        renderWeightHistory();
        weightHistorySection.style.display = "block";
        weightHistoryButton.textContent = "📊 Hide History";
    }

    function addWeightEntry(weightValue, note) {
        const entry = {
            weight: weightValue,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            })
        };

        if (note) {
            entry.note = note;
        }

        weightLog.current = weightValue;
        weightHistory.push(entry);

        saveWeightData();
        renderCurrentWeight();
    }

    function initWeightCenter() {
        renderCurrentWeight();

        if (weightHistorySection) {
            weightHistorySection.style.display = "none";
        }

        if (weightHistoryButton) {
            weightHistoryButton.textContent = "📊 History";
            weightHistoryButton.addEventListener("click", toggleWeightHistory);
        }

        if (cancelWeightBtn) {
            cancelWeightBtn.addEventListener("click", function () {
                if (weightModal) {
                    weightModal.style.display = "none";
                }
                if (weightInput) weightInput.value = "";
                if (weightNoteInput) weightNoteInput.value = "";
            });
        }

        if (saveWeightBtn) {
            saveWeightBtn.addEventListener("click", function () {
                if (!weightInput) return;

                const weight = weightInput.value.trim();

                if (!weight) {
                    alert("Please enter your current weight.");
                    return;
                }

                const note = weightNoteInput ? weightNoteInput.value.trim() : "";
                addWeightEntry(weight, note);

                weightInput.value = "";
                if (weightNoteInput) weightNoteInput.value = "";
                if (weightModal) weightModal.style.display = "none";
            });
        }

        if (weightButton) {
            weightButton.addEventListener("click", function () {
                if (weightModal) {
                    weightModal.style.display = "block";
                    if (weightInput) weightInput.focus();
                }
            });
        }

        if (weightHistoryDisplay) {
            weightHistoryDisplay.addEventListener("click", function (event) {
                const deleteButton = event.target.closest(".history-delete-btn");
                if (!deleteButton) return;

                const index = Number(deleteButton.getAttribute("data-index"));
                if (!confirmHistoryDelete()) return;

                removeHistoryEntry(weightHistory, index);
                refreshWeightData();
            });
        }
    }

    window.initWeightCenter = initWeightCenter;
})();
