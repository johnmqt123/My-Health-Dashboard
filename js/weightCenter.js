// =====================================
// John's Assistant
// weightCenter.js
// =====================================

(function () {
    function getNumberOrNull(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : null;
    }

    function getObjectData(key) {
        const data = loadData(key, null);
        return data && typeof data === "object" ? data : null;
    }

    function getHeightInchesFromObject(source) {
        if (!source || typeof source !== "object") {
            return null;
        }

        const directHeight =
            getNumberOrNull(source.heightInches) ??
            getNumberOrNull(source.heightIn) ??
            getNumberOrNull(source.height_inches) ??
            getNumberOrNull(source.height);

        if (directHeight !== null && directHeight > 0) {
            return directHeight;
        }

        const feet =
            getNumberOrNull(source.heightFeet) ??
            getNumberOrNull(source.height_ft) ??
            getNumberOrNull(source.feet);
        const inches =
            getNumberOrNull(source.heightOnlyInches) ??
            getNumberOrNull(source.heightInchesRemainder) ??
            getNumberOrNull(source.height_in) ??
            getNumberOrNull(source.inches);

        if (feet !== null && feet >= 0) {
            return feet * 12 + (inches !== null && inches >= 0 ? inches : 0);
        }

        return null;
    }

    function getWeightCenterHeightInches() {
        const profileKeys = [
            "weightProfile",
            "userHealthProfile",
            "healthProfile",
            "bodyMetrics",
            "userProfile",
            "weightLog"
        ];

        for (let i = 0; i < profileKeys.length; i += 1) {
            const profile = getObjectData(profileKeys[i]);
            const heightInches = getHeightInchesFromObject(profile);
            if (heightInches !== null && heightInches > 0) {
                return heightInches;
            }
        }

        return null;
    }

    function calculateWeightCenterBmi(weightLb, heightInches) {
        const safeWeight = getNumberOrNull(weightLb);
        const safeHeight = getNumberOrNull(heightInches);
        if (safeWeight === null || safeHeight === null || safeHeight <= 0) {
            return null;
        }

        const bmi = (safeWeight / (safeHeight * safeHeight)) * 703;
        if (!Number.isFinite(bmi)) {
            return null;
        }

        return Math.round(bmi * 10) / 10;
    }

    function getWeightCenterBmiCategory(bmiValue) {
        const bmi = getNumberOrNull(bmiValue);
        if (bmi === null) {
            return "";
        }

        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Healthy Weight";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obesity (Class I)";
        if (bmi < 40) return "Obesity (Class II)";
        return "Obesity (Class III)";
    }

    function getWeightCenterCurrentWeightLb() {
        const latestWeightLog = getObjectData("weightLog") || {};
        const fromWeightLog = getNumberOrNull(latestWeightLog.current);
        if (fromWeightLog !== null) {
            return fromWeightLog;
        }

        const latestWeightHistory = loadData("weightHistory", []);
        if (!Array.isArray(latestWeightHistory) || !latestWeightHistory.length) {
            return null;
        }

        const latestEntry = latestWeightHistory[latestWeightHistory.length - 1] || {};
        return getNumberOrNull(latestEntry.weight);
    }

    function getWeightCenterCurrentMetrics() {
        const currentWeightLb = getWeightCenterCurrentWeightLb();
        const heightInches = getWeightCenterHeightInches();
        const currentBmi = calculateWeightCenterBmi(currentWeightLb, heightInches);

        return {
            currentWeightLb: currentWeightLb,
            currentBmi: currentBmi,
            category: getWeightCenterBmiCategory(currentBmi),
            heightInches: heightInches
        };
    }

    window.weightCenterMetrics = {
        getCurrentWeightLb: getWeightCenterCurrentWeightLb,
        getHeightInches: getWeightCenterHeightInches,
        calculateBmiFromWeight: calculateWeightCenterBmi,
        getBmiCategory: getWeightCenterBmiCategory,
        getCurrentWeightAndBmi: getWeightCenterCurrentMetrics
    };

    let weightLog = loadData("weightLog", {});
    let weightHistory = loadData("weightHistory", []);

    const weightButton = document.getElementById("weightButton");
    const weightDisplay = document.getElementById("weightDisplay");
    const summaryWeight = document.getElementById("summaryWeight");
    const weightHistoryButton = document.getElementById("weightHistoryButton");
    const weightHistorySection = document.getElementById("weightHistorySection");
    const weightHistoryDisplay = document.getElementById("weightHistoryDisplay");
    const weightModal = document.getElementById("weightModal");
    const weightModalContent = weightModal ? weightModal.querySelector(".modal-content") : null;
    const weightModalTitle = weightModal ? weightModal.querySelector("h2") : null;
    const weightInput = document.getElementById("weightInput");
    const weightDateTimeFields = document.getElementById("weightDateTimeFields");
    const weightDateInput = document.getElementById("weightDateInput");
    const weightTimeInput = document.getElementById("weightTimeInput");
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
    let lockedScrollTop = 0;

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

    function lockWeightModalBackgroundScroll() {
        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("weight-modal-open");
        document.body.classList.add("weight-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
    }

    function unlockWeightModalBackgroundScroll() {
        document.documentElement.classList.remove("weight-modal-open");
        document.body.classList.remove("weight-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function showWeightModal() {
        if (!weightModal) return;
        weightModal.style.display = "flex";
        lockWeightModalBackgroundScroll();
    }

    function hideWeightModal() {
        if (!weightModal) return;
        weightModal.style.display = "none";
        unlockWeightModalBackgroundScroll();
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

    function resetWeightEditFields() {
        if (weightInput) weightInput.value = "";
        if (weightNoteInput) weightNoteInput.value = "";
        if (weightDateInput) weightDateInput.value = "";
        if (weightTimeInput) weightTimeInput.value = "";
    }

    function setWeightModalMode(isEditMode, entry) {
        if (weightDateTimeFields) {
            weightDateTimeFields.style.display = isEditMode ? "block" : "none";
        }

        if (!isEditMode) {
            if (weightDateInput) {
                weightDateInput.value = "";
            }
            if (weightTimeInput) {
                weightTimeInput.value = "";
            }
            if (deleteWeightBtn) {
                deleteWeightBtn.style.display = "none";
            }
            return;
        }

        if (weightDateInput) {
            weightDateInput.value = getDateInputValueFromEntry(entry) || getCurrentDateInputValue();
        }
        if (weightTimeInput) {
            weightTimeInput.value = getTimeInputValueFromEntry(entry) || getCurrentTimeInputValue();
        }
        if (deleteWeightBtn) {
            deleteWeightBtn.style.display = "block";
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
        setWeightModalMode(true, entry);
        showWeightModal();
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
        const now = new Date();
        const entry = {
            weight: weightValue,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString([], {
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
                hideWeightModal();
                editingWeightIndex = null;
                resetWeightEditFields();
                setWeightModalMode(false);
            });
        }

        if (saveWeightBtn) {
            saveWeightBtn.addEventListener("click", function () {
                if (!weightInput) return;

                const wasEditing = editingWeightIndex !== null && !!weightHistory[editingWeightIndex];

                const weight = weightInput.value.trim();

                if (!weight) {
                    alert("Please enter your current weight.");
                    return;
                }

                const note = weightNoteInput ? weightNoteInput.value.trim() : "";

                if (editingWeightIndex !== null && weightHistory[editingWeightIndex]) {
                    const entry = weightHistory[editingWeightIndex];
                    entry.weight = weight;
                    if (weightDateInput && weightDateInput.value) {
                        entry.date = weightDateInput.value;
                    }
                    if (weightTimeInput && weightTimeInput.value) {
                        entry.time = weightTimeInput.value;
                    }
                    if (note) {
                        entry.note = note;
                    } else {
                        delete entry.note;
                    }
                    weightLog.current = weight;
                } else {
                    // New entry flow: clear stale selection so no old detail screen can reopen.
                    activeDetailIndex = null;
                    closeWeightDetailModal();
                    addWeightEntry(weight, note);
                }

                editingWeightIndex = null;
                resetWeightEditFields();
                hideWeightModal();
                setWeightModalMode(false);
                refreshWeightData();

                if (wasEditing && activeDetailIndex !== null) {
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
                resetWeightEditFields();
                setWeightModalMode(false);
                hideWeightModal();
                activeDetailIndex = null;
                closeWeightDetailModal();
                refreshWeightData();
            });
        }

        if (weightButton) {
            weightButton.addEventListener("click", function () {
                editingWeightIndex = null;
                activeDetailIndex = null;
                if (weightModalTitle) {
                    weightModalTitle.textContent = "Log Weight";
                }
                setWeightModalMode(false);
                if (weightModal) {
                    showWeightModal();
                    if (weightInput) weightInput.focus();
                }
            });
        }

        if (weightModal) {
            weightModal.addEventListener("touchmove", function (event) {
                if (!weightModalContent) return;
                if (!weightModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
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
