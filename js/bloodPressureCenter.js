// =====================================
// John's Assistant
// bloodPressureCenter.js
// =====================================

(function () {
    let bpLog = loadData("bpLog", {});
    let bpHistory = loadData("bpHistory", []);

    const bpButton = document.getElementById("bpButton");
    const bpDisplay = document.getElementById("bpDisplay");
    const heartRateDisplay = document.getElementById("heartRateDisplay");
    const summaryBP = document.getElementById("summaryBP");

    const bpModal = document.getElementById("bpModal");
    const cancelBpBtn = document.getElementById("cancelBpBtn");
    const saveBpBtn = document.getElementById("saveBpBtn");
    const systolicInput = document.getElementById("systolicInput");
    const diastolicInput = document.getElementById("diastolicInput");
    const pulseInput = document.getElementById("pulseInput");
    const bpNoteInput = document.getElementById("bpNoteInput");

    const bpHistoryButton = document.getElementById("bpHistoryButton");
    const bpHistorySection = document.getElementById("bpHistorySection");
    const bpHistoryDisplay = document.getElementById("bpHistoryDisplay");
    let editingBpIndex = null;

    function saveBloodPressureData() {
        saveData("bpLog", bpLog);
        saveData("bpHistory", bpHistory);
    }

    function renderCurrentReading() {
        if (!bpDisplay || !heartRateDisplay) return;

        if (bpLog.systolic && bpLog.diastolic) {
            const pulseValue = bpLog.pulse || bpLog.heartRate || "--";

            bpDisplay.textContent = "Last Reading: " + bpLog.systolic + " / " + bpLog.diastolic;
            heartRateDisplay.textContent = "Heart Rate: " + pulseValue + " bpm";
            if (summaryBP) {
                summaryBP.textContent = bpLog.systolic + " / " + bpLog.diastolic;
            }
        } else {
            bpDisplay.textContent = "Last Reading: -- / --";
            heartRateDisplay.textContent = "Heart Rate: -- bpm";
            if (summaryBP) {
                summaryBP.textContent = "Not Recorded";
            }
        }
    }

    function renderHistory() {
        if (!bpHistoryDisplay) return;

        bpHistoryDisplay.innerHTML = "";

        if (bpHistory.length === 0) {
            bpHistoryDisplay.textContent = "No blood pressure entries yet.";
            return;
        }

        bpHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = bpHistory.length - 1 - index;
            let html = entry.date + " • " + entry.time + " — <strong>" + entry.systolic + " / " + entry.diastolic + "</strong>";

            if (entry.pulse) {
                html += " — Pulse: " + entry.pulse;
            }

            if (entry.note) {
                html += " — " + entry.note;
            }

            html += `
                <div class="history-action-row">
                    <button type="button" class="history-action-btn edit history-edit-btn" data-index="${originalIndex}">Edit</button>
                    <button type="button" class="history-action-btn delete history-delete-btn" data-index="${originalIndex}">Delete</button>
                </div><br>`;
            bpHistoryDisplay.innerHTML += html;
        });
    }

    function refreshBpData() {
        const latestEntry = bpHistory.length ? bpHistory[bpHistory.length - 1] : null;

        if (latestEntry) {
            bpLog = {
                systolic: latestEntry.systolic,
                diastolic: latestEntry.diastolic,
                pulse: latestEntry.pulse
            };
        } else {
            bpLog = {};
        }

        saveBloodPressureData();
        renderCurrentReading();

        if (bpHistorySection && bpHistorySection.style.display === "block") {
            renderHistory();
        }
    }

    function toggleHistory() {
        if (!bpHistorySection || !bpHistoryButton || !bpHistoryDisplay) return;

        if (bpHistorySection.style.display === "block") {
            bpHistorySection.style.display = "none";
            bpHistoryButton.textContent = "📊 History";
            return;
        }

        renderHistory();
        bpHistorySection.style.display = "block";
        bpHistoryButton.textContent = "📊 Hide History";
    }

    function openModal() {
        if (bpModal) {
            bpModal.classList.add("is-open");
            if (systolicInput) {
                requestAnimationFrame(function () {
                    systolicInput.focus();
                });
            }
        }
    }

    function closeModal() {
        editingBpIndex = null;
        if (bpModal) {
            bpModal.classList.remove("is-open");
        }
    }

    function addReading(entry) {
        bpLog = {
            systolic: entry.systolic,
            diastolic: entry.diastolic,
            pulse: entry.pulse
        };

        bpHistory.push(entry);
        saveBloodPressureData();
        renderCurrentReading();
    }

    function initBloodPressureCenter() {
        renderCurrentReading();

        if (bpHistorySection) {
            bpHistorySection.style.display = "none";
        }

        if (bpHistoryButton) {
            bpHistoryButton.textContent = "📊 History";
            bpHistoryButton.addEventListener("click", toggleHistory);
        }

        if (bpButton) {
            bpButton.addEventListener("click", function () {
                editingBpIndex = null;
                openModal();
            });
        }

        if (cancelBpBtn) {
            cancelBpBtn.addEventListener("click", function () {
                if (systolicInput) systolicInput.value = "";
                if (diastolicInput) diastolicInput.value = "";
                if (pulseInput) pulseInput.value = "";
                if (bpNoteInput) bpNoteInput.value = "";
                closeModal();
            });
        }

        if (saveBpBtn) {
            saveBpBtn.addEventListener("click", function () {
                const systolic = systolicInput ? systolicInput.value.trim() : "";
                const diastolic = diastolicInput ? diastolicInput.value.trim() : "";
                const pulse = pulseInput ? pulseInput.value.trim() : "";
                const note = bpNoteInput ? bpNoteInput.value.trim() : "";

                if (!systolic || !diastolic || !pulse) {
                    alert("Please enter systolic, diastolic, and pulse values.");
                    return;
                }

                if (editingBpIndex !== null && bpHistory[editingBpIndex]) {
                    const existing = bpHistory[editingBpIndex];
                    existing.systolic = systolic;
                    existing.diastolic = diastolic;
                    existing.pulse = pulse;
                    if (note) {
                        existing.note = note;
                    } else {
                        delete existing.note;
                    }
                } else {
                    const entry = {
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        }),
                        systolic: systolic,
                        diastolic: diastolic,
                        pulse: pulse
                    };

                    if (note) {
                        entry.note = note;
                    }

                    addReading(entry);
                }

                closeModal();

                if (systolicInput) systolicInput.value = "";
                if (diastolicInput) diastolicInput.value = "";
                if (pulseInput) pulseInput.value = "";
                if (bpNoteInput) bpNoteInput.value = "";
                refreshBpData();
            });
        }

        if (bpHistoryDisplay) {
            bpHistoryDisplay.addEventListener("click", function (event) {
                const editButton = event.target.closest(".history-edit-btn");
                const deleteButton = event.target.closest(".history-delete-btn");

                if (editButton) {
                    const index = Number(editButton.getAttribute("data-index"));
                    const entry = bpHistory[index];
                    if (!entry) return;

                    editingBpIndex = index;
                    if (systolicInput) {
                        systolicInput.value = entry.systolic;
                    }
                    if (diastolicInput) {
                        diastolicInput.value = entry.diastolic;
                    }
                    if (pulseInput) {
                        pulseInput.value = entry.pulse;
                    }
                    if (bpNoteInput) {
                        bpNoteInput.value = entry.note || "";
                    }
                    openModal();
                    return;
                }

                if (!deleteButton) return;

                const index = Number(deleteButton.getAttribute("data-index"));
                if (!confirmHistoryDelete()) return;

                removeHistoryEntry(bpHistory, index);
                refreshBpData();
            });
        }
    }

    window.initBloodPressureCenter = initBloodPressureCenter;
})();
