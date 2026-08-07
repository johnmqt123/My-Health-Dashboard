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
    const deleteWeightBtn = document.getElementById("deleteWeightBtn");
    const cancelWeightBtn = document.getElementById("cancelWeightBtn");
    const weightDetailModal = document.getElementById("weightDetailModal");
    const weightDetailContent = document.getElementById("weightDetailContent");
    const weightDetailEditBtn = document.getElementById("weightDetailEditBtn");
    const weightDetailDeleteBtn = document.getElementById("weightDetailDeleteBtn");
    const weightDetailCloseBtn = document.getElementById("weightDetailCloseBtn");
    let editingWeightIndex = null;
    let activeDetailIndex = null;

    function parseHistoryDate(entry) {
        if (!entry || !entry.date) return null;

        const withTime = entry.time ? new Date(entry.date + " " + entry.time) : new Date(entry.date);
        if (!Number.isNaN(withTime.getTime())) {
            return withTime;
        }

        const parts = String(entry.date).split("/");
        if (parts.length === 3) {
            const month = Number(parts[0]);
            const day = Number(parts[1]);
            const year = Number(parts[2]);
            if (!Number.isNaN(month) && !Number.isNaN(day) && !Number.isNaN(year)) {
                const parsed = new Date(year, month - 1, day);
                if (!Number.isNaN(parsed.getTime())) {
                    return parsed;
                }
            }
        }

        return null;
    }

    function formatMonthHeader(entry) {
        const parsed = parseHistoryDate(entry);
        if (!parsed) return "Unknown Month";
        return parsed.toLocaleDateString([], {
            month: "long",
            year: "numeric"
        });
    }

    function formatRowDate(entry) {
        const parsed = parseHistoryDate(entry);
        if (!parsed) return entry.date || "Unknown Date";
        return parsed.toLocaleDateString([], {
            month: "short",
            day: "numeric"
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function closeWeightDetailModal() {
        if (weightDetailModal) {
            weightDetailModal.style.display = "none";
        }
    }

    function openWeightDetailModal(index) {
        const entry = weightHistory[index];
        if (!entry || !weightDetailModal || !weightDetailContent) return;

        activeDetailIndex = index;

        const safeWeight = escapeHtml(entry.weight + " lb");
        const safeDate = escapeHtml(entry.date || "--");
        const safeTime = escapeHtml(entry.time || "--");
        const safeNote = entry.note ? escapeHtml(entry.note) : "None";

        weightDetailContent.innerHTML =
            '<div class="weight-detail-row"><span class="weight-detail-label">Weight</span><span>' + safeWeight + "</span></div>" +
            '<div class="weight-detail-row"><span class="weight-detail-label">Date</span><span>' + safeDate + "</span></div>" +
            '<div class="weight-detail-row"><span class="weight-detail-label">Time</span><span>' + safeTime + "</span></div>" +
            '<div class="weight-detail-row"><span class="weight-detail-label">Notes</span><span>' + safeNote + "</span></div>";

        weightDetailModal.style.display = "flex";
    }

    function openWeightEditModal(index) {
        const entry = weightHistory[index];
        if (!entry || !weightModal) return;

        editingWeightIndex = index;
        if (weightModalTitle) {
            weightModalTitle.textContent = "Edit Weight";
        }
        if (weightInput) {
            weightInput.value = entry.weight;
        }
        if (weightNoteInput) {
            weightNoteInput.value = entry.note || "";
        }
        if (deleteWeightBtn) {
            deleteWeightBtn.style.display = "block";
        }
        weightModal.style.display = "flex";
        if (weightInput) {
            weightInput.focus();
        }
    }

    function removeWeightEntryByIndex(index) {
        if (!confirmHistoryDelete()) return;

        removeHistoryEntry(weightHistory, index);
        activeDetailIndex = null;
        closeWeightDetailModal();
        refreshWeightData();
    }

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
        weightHistoryDisplay.classList.add("weight-history-list");

        if (weightHistory.length === 0) {
            weightHistoryDisplay.textContent = "No weight entries yet.";
            return;
        }

        const grouped = {};
        const orderedMonths = [];

        weightHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = weightHistory.length - 1 - index;
            const monthKey = formatMonthHeader(entry);

            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
                orderedMonths.push(monthKey);
            }

            grouped[monthKey].push({
                entry: entry,
                index: originalIndex
            });
        });

        orderedMonths.forEach(function (monthKey) {
            const group = document.createElement("div");
            group.className = "weight-month-group";

            const header = document.createElement("div");
            header.className = "weight-month-header";
            header.textContent = monthKey;
            group.appendChild(header);

            grouped[monthKey].forEach(function (item) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "weight-history-row";
                row.setAttribute("data-index", String(item.index));
                row.innerHTML =
                    '<span class="weight-history-main">' +
                        '<span class="weight-history-date">' + escapeHtml(formatRowDate(item.entry)) + "</span>" +
                        '<span class="weight-history-value">' + escapeHtml(item.entry.weight + " lb") + "</span>" +
                    "</span>" +
                    '<span class="weight-history-chevron" aria-hidden="true">&gt;</span>';
                group.appendChild(row);
            });

            weightHistoryDisplay.appendChild(group);
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
                if (deleteWeightBtn) {
                    deleteWeightBtn.style.display = "none";
                }
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
                if (deleteWeightBtn) {
                    deleteWeightBtn.style.display = "none";
                }
                refreshWeightData();

                if (activeDetailIndex !== null) {
                    const normalizedIndex = Number(activeDetailIndex);
                    if (!Number.isNaN(normalizedIndex) && weightHistory[normalizedIndex]) {
                        openWeightDetailModal(normalizedIndex);
                    }
                }
            });
        }

        if (deleteWeightBtn) {
            deleteWeightBtn.addEventListener("click", function () {
                if (editingWeightIndex === null) return;
                const index = Number(editingWeightIndex);
                if (Number.isNaN(index) || !weightHistory[index]) return;

                if (!confirmHistoryDelete()) return;
                removeHistoryEntry(weightHistory, index);

                editingWeightIndex = null;
                if (weightInput) weightInput.value = "";
                if (weightNoteInput) weightNoteInput.value = "";
                if (deleteWeightBtn) {
                    deleteWeightBtn.style.display = "none";
                }
                if (weightModal) {
                    weightModal.style.display = "none";
                }
                activeDetailIndex = null;
                closeWeightDetailModal();
                refreshWeightData();
            });
        }

        if (weightButton) {
            weightButton.addEventListener("click", function () {
                editingWeightIndex = null;
                if (weightModalTitle) {
                    weightModalTitle.textContent = "Log Weight";
                }
                if (deleteWeightBtn) {
                    deleteWeightBtn.style.display = "none";
                }
                if (weightModal) {
                    weightModal.style.display = "flex";
                    if (weightInput) weightInput.focus();
                }
            });
        }

        if (weightDetailCloseBtn) {
            weightDetailCloseBtn.addEventListener("click", function () {
                closeWeightDetailModal();
            });
        }

        if (weightDetailEditBtn) {
            weightDetailEditBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !weightHistory[index]) return;

                closeWeightDetailModal();
                openWeightEditModal(index);
            });
        }

        if (weightDetailDeleteBtn) {
            weightDetailDeleteBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !weightHistory[index]) return;

                removeWeightEntryByIndex(index);
            });
        }

        if (weightHistoryDisplay) {
            weightHistoryDisplay.addEventListener("click", function (event) {
                const row = event.target.closest(".weight-history-row");
                if (!row) return;

                const index = Number(row.getAttribute("data-index"));
                if (Number.isNaN(index) || !weightHistory[index]) return;

                row.classList.add("is-tapped");
                window.setTimeout(function () {
                    row.classList.remove("is-tapped");
                    openWeightDetailModal(index);
                }, 120);
            });
        }
    }

    window.initWeightCenter = initWeightCenter;
})();
