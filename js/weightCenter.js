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
    const weightModalTitle = weightModal ? weightModal.querySelector("h2") : null;
    const weightInput = document.getElementById("weightInput");
    const weightNoteInput = document.getElementById("weightNoteInput");
    const saveWeightBtn = document.getElementById("saveWeightBtn");
    const cancelWeightBtn = document.getElementById("cancelWeightBtn");
    let editingWeightIndex = null;

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

            html += `
                <div class="history-action-row">
                    <button type="button" class="history-action-btn edit history-edit-btn" data-index="${originalIndex}">Edit</button>
                    <button type="button" class="history-action-btn delete history-delete-btn" data-index="${originalIndex}">Delete</button>
                </div><br>`;
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

        if (typeof window.updateAtAGlanceStatus === "function") {
            window.updateAtAGlanceStatus();
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

        if (typeof window.scrollMedicationCenterTo === "function") {
            window.scrollMedicationCenterTo(weightHistoryButton);
            return;
        }

        weightHistoryButton.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
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
                editingWeightIndex = null;
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

                if (editingWeightIndex !== null && weightHistory[editingWeightIndex]) {
                    const entry = weightHistory[editingWeightIndex];
                    entry.weight = weight;
                    if (note) {
                        entry.note = note;
                    } else {
                        delete entry.note;
                    }
                    weightLog.current = weight;
                } else {
                    addWeightEntry(weight, note);
                }

                editingWeightIndex = null;
                weightInput.value = "";
                if (weightNoteInput) weightNoteInput.value = "";
                if (weightModal) weightModal.style.display = "none";
                refreshWeightData();
            });
        }

        if (weightButton) {
            weightButton.addEventListener("click", function () {
                editingWeightIndex = null;
                if (weightModalTitle) {
                    weightModalTitle.textContent = "Log Weight";
                }
                if (weightModal) {
                    weightModal.style.display = "block";
                    if (weightInput) weightInput.focus();
                }
            });
        }

        if (weightHistoryDisplay) {
            weightHistoryDisplay.addEventListener("click", function (event) {
                const editButton = event.target.closest(".history-edit-btn");
                const deleteButton = event.target.closest(".history-delete-btn");

                if (editButton) {
                    const index = Number(editButton.getAttribute("data-index"));
                    const entry = weightHistory[index];
                    if (!entry) return;

                    editingWeightIndex = index;
                    if (weightModalTitle) {
                        weightModalTitle.textContent = "Edit Weight";
                    }
                    if (weightModal) {
                        weightModal.style.display = "block";
                    }
                    if (weightInput) {
                        weightInput.value = entry.weight;
                    }
                    if (weightNoteInput) {
                        weightNoteInput.value = entry.note || "";
                    }
                    if (weightInput) {
                        weightInput.focus();
                    }
                    return;
                }

                if (deleteButton) {
                    const index = Number(deleteButton.getAttribute("data-index"));
                    if (!confirmHistoryDelete()) return;

                    removeHistoryEntry(weightHistory, index);
                    refreshWeightData();
                }
            });
        }
    }

    window.initWeightCenter = initWeightCenter;
})();
