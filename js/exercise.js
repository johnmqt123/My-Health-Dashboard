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
    const exerciseCard = document.getElementById("exerciseCard");
    const exerciseHistoryButton = document.getElementById("exerciseHistoryButton");
    const exerciseHistorySection = document.getElementById("exerciseHistorySection");
    const exerciseHistoryDisplay = document.getElementById("exerciseHistoryDisplay");
    const exerciseModal = document.getElementById("exerciseModal");
    const exerciseModalContent = exerciseModal ? exerciseModal.querySelector(".modal-content") : null;
    const exerciseModalTitle = exerciseModal ? exerciseModal.querySelector("h2") : null;
    const exerciseAmountInput = document.getElementById("exerciseAmountInput");
    const exerciseAmountLabel = document.getElementById("exerciseAmountLabel");
    const exerciseDateTimeFields = document.getElementById("exerciseDateTimeFields");
    const exerciseDateInput = document.getElementById("exerciseDateInput");
    const exerciseTimeInput = document.getElementById("exerciseTimeInput");
    const exerciseNoteInput = document.getElementById("exerciseNoteInput");
    const saveExerciseBtn = document.getElementById("saveExerciseBtn");
    const exerciseTypeList = document.getElementById("exerciseTypeList");
    const manageExerciseTypesBtn = document.getElementById("manageExerciseTypesBtn");
    const exerciseTypeManager = document.getElementById("exerciseTypeManager");
    const newExerciseTypeInput = document.getElementById("newExerciseTypeInput");
    const addExerciseTypeBtn = document.getElementById("addExerciseTypeBtn");
    const exerciseTypeManagerList = document.getElementById("exerciseTypeManagerList");
    const cancelExerciseBtn = document.getElementById("cancelExerciseBtn");
    const deleteExerciseBtn = document.getElementById("deleteExerciseBtn");
    const exerciseDetailModal = document.getElementById("exerciseDetailModal");
    const exerciseDetailContent = document.getElementById("exerciseDetailContent");
    const exerciseDetailEditBtn = document.getElementById("exerciseDetailEditBtn");
    const exerciseDetailDeleteBtn = document.getElementById("exerciseDetailDeleteBtn");
    const exerciseDetailCloseBtn = document.getElementById("exerciseDetailCloseBtn");
    let activeExerciseType = "Stationary Bike";
    let activeExerciseUnit = "minutes";
    let editingExerciseIndex = null;
    let activeDetailIndex = null;
    let lockedScrollTop = 0;
    const EXERCISE_TYPES_STORAGE_KEY = "exerciseTypes";
    const DEFAULT_EXERCISE_TYPES = [
        "Stationary Bike",
        "E-Bike Ride",
        "Walking",
        "Running",
        "Swimming",
        "Strength Training",
        "Hiking"
    ];
    let exerciseTypes = loadData(EXERCISE_TYPES_STORAGE_KEY, null);

    if (!Array.isArray(exerciseTypes)) {
        exerciseTypes = DEFAULT_EXERCISE_TYPES.slice();
    }

    function saveExerciseTypes() {
        saveData(EXERCISE_TYPES_STORAGE_KEY, exerciseTypes);
    }

    function getExerciseUnit(type) {
        return type === "E-Bike Ride" ? "miles" : "minutes";
    }

    function renderExerciseTypeButtons() {
        if (!exerciseTypeList) {
            return;
        }

        exerciseTypeList.innerHTML = "";
        exerciseTypes.forEach(function (type) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "exercise-type-btn";
            button.dataset.exerciseType = type;
            button.textContent = type;
            button.classList.toggle("selected", type === activeExerciseType);
            exerciseTypeList.appendChild(button);
        });
    }

    function renderExerciseTypeManager() {
        if (!exerciseTypeManagerList) {
            return;
        }

        exerciseTypeManagerList.innerHTML = "";
        exerciseTypes.forEach(function (type) {
            const row = document.createElement("div");
            row.className = "exercise-type-manager-row";
            const label = document.createElement("span");
            label.textContent = type;
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.dataset.exerciseType = type;
            removeButton.disabled = exerciseTypes.length <= 1;
            row.appendChild(label);
            row.appendChild(removeButton);
            exerciseTypeManagerList.appendChild(row);
        });
    }

    function parseHistoryDate(entry) {
        if (!entry || !entry.date) return null;

        const dateText = String(entry.date).trim();
        const timeText = entry.time ? String(entry.time).trim() : "";

        const usParts = dateText.split("/");
        if (usParts.length === 3) {
            const month = Number(usParts[0]);
            const day = Number(usParts[1]);
            const year = Number(usParts[2]);
            if (!Number.isNaN(month) && !Number.isNaN(day) && !Number.isNaN(year)) {
                const usDate = new Date(year, month - 1, day);
                if (timeText) {
                    const timeParts = timeText.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
                    if (timeParts) {
                        let hours = Number(timeParts[1]);
                        const minutes = Number(timeParts[2]);
                        const meridian = timeParts[3] ? timeParts[3].toUpperCase() : "";
                        if (meridian === "PM" && hours < 12) hours += 12;
                        if (meridian === "AM" && hours === 12) hours = 0;
                        if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
                            usDate.setHours(hours, minutes, 0, 0);
                        }
                    }
                }
                if (!Number.isNaN(usDate.getTime())) {
                    return usDate;
                }
            }
        }

        const isoParts = dateText.split("-");
        if (isoParts.length === 3) {
            const year = Number(isoParts[0]);
            const month = Number(isoParts[1]);
            const day = Number(isoParts[2]);
            if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
                const isoDate = new Date(year, month - 1, day);
                if (timeText) {
                    const hmMatch = timeText.match(/^(\d{2}):(\d{2})$/);
                    if (hmMatch) {
                        const hours = Number(hmMatch[1]);
                        const minutes = Number(hmMatch[2]);
                        if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
                            isoDate.setHours(hours, minutes, 0, 0);
                        }
                    }
                }
                if (!Number.isNaN(isoDate.getTime())) {
                    return isoDate;
                }
            }
        }

        const fallback = timeText ? new Date(dateText + " " + timeText) : new Date(dateText);
        if (!Number.isNaN(fallback.getTime())) {
            return fallback;
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

    function getCurrentDateInputValue() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return now.getFullYear() + "-" + month + "-" + day;
    }

    function getCurrentTimeInputValue() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return hours + ":" + minutes;
    }

    function getDateInputValueFromEntry(entry) {
        const parsed = parseHistoryDate(entry);
        if (!parsed) return "";

        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return parsed.getFullYear() + "-" + month + "-" + day;
    }

    function getTimeInputValueFromEntry(entry) {
        if (!entry || !entry.time) return "";

        const rawTime = String(entry.time).trim();
        if (/^\d{2}:\d{2}$/.test(rawTime)) {
            return rawTime;
        }

        const parsed = parseHistoryDate(entry);
        if (!parsed) return "";

        const hours = String(parsed.getHours()).padStart(2, "0");
        const minutes = String(parsed.getMinutes()).padStart(2, "0");
        return hours + ":" + minutes;
    }

    function clearExerciseInputs() {
        if (exerciseAmountInput) {
            exerciseAmountInput.value = "";
        }
        if (exerciseDateInput) {
            exerciseDateInput.value = "";
        }
        if (exerciseTimeInput) {
            exerciseTimeInput.value = "";
        }
        if (exerciseNoteInput) {
            exerciseNoteInput.value = "";
        }
    }

    function selectExerciseType(type) {
        if (type && exerciseTypes.indexOf(type) < 0) {
            exerciseTypes.push(type);
        }
        activeExerciseType = type && exerciseTypes.indexOf(type) >= 0
            ? type
            : exerciseTypes[0] || "Stationary Bike";
        activeExerciseUnit = getExerciseUnit(activeExerciseType);

        if (exerciseAmountLabel) {
            exerciseAmountLabel.textContent = activeExerciseUnit === "miles" ? "Miles" : "Minutes";
        }
        if (exerciseAmountInput) {
            exerciseAmountInput.type = "number";
            exerciseAmountInput.step = activeExerciseUnit === "miles" ? "0.1" : "1";
            exerciseAmountInput.setAttribute("inputmode", activeExerciseUnit === "miles" ? "decimal" : "numeric");
        }
        renderExerciseTypeButtons();
    }

    function setExerciseModalMode(isEditMode, entry) {
        if (exerciseDateTimeFields) {
            exerciseDateTimeFields.style.display = isEditMode ? "block" : "none";
        }

        if (!isEditMode) {
            if (exerciseDateInput) exerciseDateInput.value = "";
            if (exerciseTimeInput) exerciseTimeInput.value = "";
            if (exerciseNoteInput) exerciseNoteInput.value = "";
            if (deleteExerciseBtn) {
                deleteExerciseBtn.style.display = "none";
            }
            return;
        }

        if (exerciseDateInput) {
            exerciseDateInput.value = getDateInputValueFromEntry(entry) || getCurrentDateInputValue();
        }
        if (exerciseTimeInput) {
            exerciseTimeInput.value = getTimeInputValueFromEntry(entry) || getCurrentTimeInputValue();
        }
        if (exerciseNoteInput) {
            exerciseNoteInput.value = entry && entry.note ? entry.note : "";
        }
        if (deleteExerciseBtn) {
            deleteExerciseBtn.style.display = "block";
        }
    }

    function lockExerciseModalBackgroundScroll() {
        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("exercise-modal-open");
        document.body.classList.add("exercise-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
    }

    function unlockExerciseModalBackgroundScroll() {
        document.documentElement.classList.remove("exercise-modal-open");
        document.body.classList.remove("exercise-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function openExerciseModal() {
        if (!exerciseModal) return;
        exerciseModal.style.display = "block";
        lockExerciseModalBackgroundScroll();
    }

    function closeExerciseModal() {
        if (!exerciseModal) return;
        exerciseModal.style.display = "none";
        unlockExerciseModalBackgroundScroll();
    }

    function closeExerciseDetailModal() {
        if (exerciseDetailModal) {
            exerciseDetailModal.style.display = "none";
        }
    }

    function openExerciseDetailModal(index) {
        const entry = exerciseHistory[index];
        if (!entry || !exerciseDetailModal || !exerciseDetailContent) return;

        activeDetailIndex = index;

        const safeType = escapeHtml(entry.type || "--");
        const safeAmount = escapeHtml(entry.amount || "--");
        const safeUnit = escapeHtml(entry.unit || "--");
        const safeDate = escapeHtml(entry.date || "--");
        const safeTime = escapeHtml(entry.time || "--");
        const safeNote = entry.note ? escapeHtml(entry.note) : "None";

        exerciseDetailContent.innerHTML =
            '<div class="exercise-detail-row"><span class="exercise-detail-label">Type</span><span>' + safeType + "</span></div>" +
            '<div class="exercise-detail-row"><span class="exercise-detail-label">Amount</span><span>' + safeAmount + " " + safeUnit + "</span></div>" +
            '<div class="exercise-detail-row"><span class="exercise-detail-label">Date</span><span>' + safeDate + "</span></div>" +
            '<div class="exercise-detail-row"><span class="exercise-detail-label">Time</span><span>' + safeTime + "</span></div>" +
            '<div class="exercise-detail-row"><span class="exercise-detail-label">Notes</span><span>' + safeNote + "</span></div>";

        exerciseDetailModal.style.display = "flex";
    }

    function openExerciseEditModal(index) {
        const entry = exerciseHistory[index];
        if (!entry) return;

        editingExerciseIndex = index;
        if (exerciseModalTitle) {
            exerciseModalTitle.textContent = "Edit Exercise";
        }

        selectExerciseType(entry.type);
        showExerciseAmountField(entry.amount);
        setExerciseModalMode(true, entry);
        openExerciseModal();
    }

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
        if (exerciseTypeList) {
            exerciseTypeList.querySelectorAll(".exercise-type-btn").forEach(function (button) {
                button.classList.remove("selected");
            });
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

    function addExerciseEntry(type, amount, unit, note) {
        exerciseLog.push({
            type: type,
            amount: amount,
            unit: unit
        });

        const entry = {
            type: type,
            amount: amount,
            unit: unit,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            })
        };

        if (note) {
            entry.note = note;
        }

        exerciseHistory.push(entry);

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
        exerciseHistoryDisplay.classList.add("exercise-history-list");

        if (exerciseHistory.length === 0) {
            exerciseHistoryDisplay.textContent = "No exercise entries yet.";
            return;
        }

        const grouped = {};
        const orderedMonths = [];

        exerciseHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = exerciseHistory.length - 1 - index;
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
            group.className = "exercise-month-group";

            const header = document.createElement("div");
            header.className = "exercise-month-header";
            header.textContent = monthKey;
            group.appendChild(header);

            grouped[monthKey].forEach(function (item) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "exercise-history-row";
                row.setAttribute("data-index", String(item.index));
                row.innerHTML =
                    '<span class="exercise-history-main">' +
                        '<span class="exercise-history-reading">' +
                            escapeHtml(item.entry.type || "Exercise") + " · " +
                            escapeHtml(String(item.entry.amount || "--")) + " " +
                            escapeHtml(item.entry.unit || "") +
                        "</span>" +
                        '<span class="exercise-history-meta">' + escapeHtml(formatRowDate(item.entry)) + "</span>" +
                    "</span>" +
                    '<span class="exercise-history-chevron" aria-hidden="true">&gt;</span>';
                group.appendChild(row);
            });

            exerciseHistoryDisplay.appendChild(group);
        });
    }

    function initExerciseCenter() {
        hideExerciseAmountField();

        if (exerciseButton) {
            exerciseButton.addEventListener("click", function () {
                editingExerciseIndex = null;
                activeDetailIndex = null;
                if (exerciseModalTitle) {
                    exerciseModalTitle.textContent = "Log Exercise";
                }
                setExerciseModalMode(false);
                clearExerciseInputs();
                hideExerciseAmountField();
                openExerciseModal();
            });
        }

        if (cancelExerciseBtn) {
            cancelExerciseBtn.addEventListener("click", function () {
                editingExerciseIndex = null;
                setExerciseModalMode(false);
                clearExerciseInputs();
                hideExerciseAmountField();
                closeExerciseModal();
            });
        }

        if (exerciseTypeList) {
            exerciseTypeList.addEventListener("click", function (event) {
                const button = event.target.closest(".exercise-type-btn");
                if (!button || !exerciseTypeList.contains(button)) {
                    return;
                }

                selectExerciseType(button.dataset.exerciseType || "");
                if (exerciseAmountInput && editingExerciseIndex === null) {
                    exerciseAmountInput.value = "";
                }
                showExerciseAmountField();
            });
        }

        if (manageExerciseTypesBtn) {
            manageExerciseTypesBtn.addEventListener("click", function () {
                const isVisible = exerciseTypeManager && exerciseTypeManager.style.display !== "none";
                if (exerciseTypeManager) {
                    exerciseTypeManager.style.display = isVisible ? "none" : "block";
                }
                if (!isVisible) {
                    renderExerciseTypeManager();
                }
            });
        }

        if (addExerciseTypeBtn) {
            addExerciseTypeBtn.addEventListener("click", function () {
                const type = newExerciseTypeInput ? newExerciseTypeInput.value.replace(/\s+/g, " ").trim() : "";
                if (!type) {
                    alert("Please enter an exercise type.");
                    return;
                }
                if (exerciseTypes.some(function (existing) {
                    return existing.toLowerCase() === type.toLowerCase();
                })) {
                    alert("That exercise type already exists.");
                    return;
                }
                exerciseTypes.push(type);
                saveExerciseTypes();
                renderExerciseTypeButtons();
                renderExerciseTypeManager();
                newExerciseTypeInput.value = "";
            });
        }

        if (exerciseTypeManagerList) {
            exerciseTypeManagerList.addEventListener("click", function (event) {
                const removeButton = event.target.closest("button[data-exercise-type]");
                if (!removeButton || !exerciseTypeManagerList.contains(removeButton)) {
                    return;
                }
                const type = removeButton.dataset.exerciseType;
                if (exerciseTypes.length <= 1) {
                    return;
                }
                exerciseTypes = exerciseTypes.filter(function (existing) {
                    return existing !== type;
                });
                saveExerciseTypes();
                if (activeExerciseType === type) {
                    activeExerciseType = exerciseTypes[0];
                    activeExerciseUnit = getExerciseUnit(activeExerciseType);
                }
                renderExerciseTypeButtons();
                renderExerciseTypeManager();
            });
        }

        if (saveExerciseBtn) {
            saveExerciseBtn.addEventListener("click", function () {
                if (!exerciseAmountInput) return;

                const value = exerciseAmountInput.value.trim();
                const note = exerciseNoteInput ? exerciseNoteInput.value.trim() : "";
                const wasEditing = editingExerciseIndex !== null && !!exerciseHistory[editingExerciseIndex];

                if (!value) {
                    alert("Please enter the exercise amount.");
                    return;
                }

                if (editingExerciseIndex !== null && exerciseHistory[editingExerciseIndex]) {
                    const existing = exerciseHistory[editingExerciseIndex];
                    existing.type = activeExerciseType;
                    existing.amount = value;
                    existing.unit = activeExerciseUnit;
                    if (exerciseDateInput && exerciseDateInput.value) {
                        existing.date = exerciseDateInput.value;
                    }
                    if (exerciseTimeInput && exerciseTimeInput.value) {
                        existing.time = exerciseTimeInput.value;
                    }
                    if (note) {
                        existing.note = note;
                    } else {
                        delete existing.note;
                    }
                } else {
                    activeDetailIndex = null;
                    closeExerciseDetailModal();
                    addExerciseEntry(activeExerciseType, value, activeExerciseUnit, note);
                }

                editingExerciseIndex = null;
                setExerciseModalMode(false);
                clearExerciseInputs();
                hideExerciseAmountField();
                closeExerciseModal();
                refreshExerciseData();

                if (wasEditing && activeDetailIndex !== null) {
                    const normalizedIndex = Number(activeDetailIndex);
                    if (!Number.isNaN(normalizedIndex) && exerciseHistory[normalizedIndex]) {
                        openExerciseDetailModal(normalizedIndex);
                    }
                }
            });
        }

        if (deleteExerciseBtn) {
            deleteExerciseBtn.addEventListener("click", function () {
                if (editingExerciseIndex === null) return;
                const index = Number(editingExerciseIndex);
                if (Number.isNaN(index) || !exerciseHistory[index]) return;

                if (!confirmHistoryDelete()) return;
                removeHistoryEntry(exerciseHistory, index);

                editingExerciseIndex = null;
                activeDetailIndex = null;
                setExerciseModalMode(false);
                clearExerciseInputs();
                hideExerciseAmountField();
                closeExerciseModal();
                closeExerciseDetailModal();
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

                    if (typeof window.scrollMedicationCenterTo === "function" && exerciseCard) {
                        window.scrollMedicationCenterTo(exerciseCard);
                        return;
                    }

                    if (exerciseCard) {
                        exerciseCard.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }

                    return;
                }

                renderExerciseHistory();

                exerciseHistorySection.style.display = "block";
                exerciseHistoryButton.textContent = "📊 Hide History";

                if (typeof window.scrollMedicationCenterTo === "function") {
                    window.scrollMedicationCenterTo(exerciseHistoryButton);
                    return;
                }

                exerciseHistoryButton.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }

        if (exerciseDetailCloseBtn) {
            exerciseDetailCloseBtn.addEventListener("click", function () {
                closeExerciseDetailModal();
            });
        }

        if (exerciseDetailEditBtn) {
            exerciseDetailEditBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !exerciseHistory[index]) return;

                closeExerciseDetailModal();
                openExerciseEditModal(index);
            });
        }

        if (exerciseDetailDeleteBtn) {
            exerciseDetailDeleteBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !exerciseHistory[index]) return;

                if (!confirmHistoryDelete()) return;
                removeHistoryEntry(exerciseHistory, index);
                activeDetailIndex = null;
                closeExerciseDetailModal();
                refreshExerciseData();
            });
        }

        if (exerciseModal) {
            exerciseModal.addEventListener("touchmove", function (event) {
                if (!exerciseModalContent) return;
                if (!exerciseModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
            });
        }

        if (exerciseHistoryDisplay) {
            exerciseHistoryDisplay.addEventListener("click", function (event) {
                const row = event.target.closest(".exercise-history-row");
                if (!row) return;

                const index = Number(row.getAttribute("data-index"));
                if (Number.isNaN(index) || !exerciseHistory[index]) return;

                row.classList.add("is-tapped");
                window.setTimeout(function () {
                    row.classList.remove("is-tapped");
                    openExerciseDetailModal(index);
                }, 120);
            });
        }

        renderExerciseTypeButtons();

        displayExerciseLog();
    }

    window.initExerciseCenter = initExerciseCenter;
    window.displayExerciseLog = displayExerciseLog;
})();
