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

            html += ` <button type="button" class="history-delete-btn" data-index="${originalIndex}" aria-label="Delete blood pressure entry">🗑️</button><br>`;
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
            bpModal.style.display = "block";
            if (systolicInput) systolicInput.focus();
        }
    }

    function closeModal() {
        if (bpModal) {
            bpModal.style.display = "none";
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
            bpButton.addEventListener("click", openModal);
        }

        if (cancelBpBtn) {
            cancelBpBtn.addEventListener("click", closeModal);
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
                closeModal();

                if (systolicInput) systolicInput.value = "";
                if (diastolicInput) diastolicInput.value = "";
                if (pulseInput) pulseInput.value = "";
                if (bpNoteInput) bpNoteInput.value = "";
            });
        }

        if (bpHistoryDisplay) {
            bpHistoryDisplay.addEventListener("click", function (event) {
                const deleteButton = event.target.closest(".history-delete-btn");
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
