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
    const bpModalContent = bpModal ? bpModal.querySelector(".modal-content") : null;
    const bpModalTitle = bpModal ? bpModal.querySelector("h2") : null;
    const cancelBpBtn = document.getElementById("cancelBpBtn");
    const saveBpBtn = document.getElementById("saveBpBtn");
    const deleteBpBtn = document.getElementById("deleteBpBtn");
    const systolicInput = document.getElementById("systolicInput");
    const diastolicInput = document.getElementById("diastolicInput");
    const pulseInput = document.getElementById("pulseInput");
    const bpDateTimeFields = document.getElementById("bpDateTimeFields");
    const bpDateInput = document.getElementById("bpDateInput");
    const bpTimeInput = document.getElementById("bpTimeInput");
    const bpNoteInput = document.getElementById("bpNoteInput");

    const bpCard = document.getElementById("bpCard");
    const bpHistoryButton = document.getElementById("bpHistoryButton");
    const bpHistorySection = document.getElementById("bpHistorySection");
    const bpFilterToggle = document.getElementById("bpFilterToggle");
    const bpFilterPanel = document.getElementById("bpFilterPanel");
    const bpHistoryDisplay = document.getElementById("bpHistoryDisplay");
    const bpStartDateInput = document.getElementById("bpStartDate");
    const bpEndDateInput = document.getElementById("bpEndDate");
    const bpClearRangeButton = document.getElementById("bpClearRangeButton");
    const bpRangeResultCount = document.getElementById("bpRangeResultCount");
    const bpCopyTextPreview = document.getElementById("bpCopyTextPreview");
    const bpCopyButton = document.getElementById("bpCopyButton");
    const bpCopyStatus = document.getElementById("bpCopyStatus");
    const bpDetailModal = document.getElementById("bpDetailModal");
    const bpDetailContent = document.getElementById("bpDetailContent");
    const bpDetailEditBtn = document.getElementById("bpDetailEditBtn");
    const bpDetailDeleteBtn = document.getElementById("bpDetailDeleteBtn");
    const bpDetailCloseBtn = document.getElementById("bpDetailCloseBtn");
    let editingBpIndex = null;
    let activeDetailIndex = null;
    let lockedScrollTop = 0;

    function parseBloodPressureDateValue(dateText) {
        const cleanValue = String(dateText || "").trim();
        if (!cleanValue) {
            return null;
        }

        const isoMatch = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(cleanValue);
        if (isoMatch) {
            const year = Number(isoMatch[1]);
            const month = Number(isoMatch[2]);
            const day = Number(isoMatch[3]);
            const value = new Date(year, month - 1, day);
            if (!Number.isNaN(value.getTime())) {
                return value;
            }
        }

        const usMatch = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/.exec(cleanValue);
        if (usMatch) {
            const month = Number(usMatch[1]);
            const day = Number(usMatch[2]);
            const year = Number(usMatch[3]);
            const value = new Date(year, month - 1, day);
            if (!Number.isNaN(value.getTime())) {
                return value;
            }
        }

        const fallback = new Date(cleanValue);
        if (!Number.isNaN(fallback.getTime())) {
            return fallback;
        }

        return null;
    }

    function formatBloodPressureCopyDate(entry) {
        const parsed = parseBloodPressureDateValue(entry && entry.date ? entry.date : "");
        if (!parsed) {
            return "Unknown Date";
        }

        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        const year = parsed.getFullYear();
        return month + "/" + day + "/" + year;
    }

    function getBloodPressureDateKey(entry) {
        const parsed = parseBloodPressureDateValue(entry && entry.date ? entry.date : "");
        if (!parsed) {
            return "";
        }

        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return year + "-" + month + "-" + day;
    }

    function getFilteredBpEntries() {
        let startDate = "";
        let endDate = "";

        if (bpStartDateInput) {
            startDate = String(bpStartDateInput.value || "").trim();
        }
        if (bpEndDateInput) {
            endDate = String(bpEndDateInput.value || "").trim();
        }

        if (startDate && endDate && startDate > endDate) {
            return [];
        }

        const filtered = bpHistory
            .slice()
            .filter(function (entry) {
                const dateKey = getBloodPressureDateKey(entry);
                if (!dateKey) {
                    return false;
                }

                if (startDate && dateKey < startDate) {
                    return false;
                }

                if (endDate && dateKey > endDate) {
                    return false;
                }

                return true;
            })
            .sort(function (a, b) {
                const timeA = parseBloodPressureDateValue(a && a.date ? a.date : "");
                const timeB = parseBloodPressureDateValue(b && b.date ? b.date : "");
                return (timeB ? timeB.getTime() : 0) - (timeA ? timeA.getTime() : 0);
            });

        if (!startDate && !endDate) {
            return bpHistory
                .slice()
                .sort(function (a, b) {
                    const timeA = parseBloodPressureDateValue(a && a.date ? a.date : "");
                    const timeB = parseBloodPressureDateValue(b && b.date ? b.date : "");
                    return (timeB ? timeB.getTime() : 0) - (timeA ? timeA.getTime() : 0);
                });
        }

        return filtered;
    }

    function buildSelectedBpCopyText(entries) {
        return entries.map(function (entry) {
            const line = formatBloodPressureCopyDate(entry) + "  " + String(entry.systolic || "--") + "/" + String(entry.diastolic || "--") + "  " + String(entry.pulse || "--");
            const note = String(entry.note || "").trim();
            return note ? line + "  " + note : line;
        }).join("\n");
    }

    function updateBpRangeSummary() {
        const hasInvalidRange = Boolean(
            bpStartDateInput && bpEndDateInput &&
            bpStartDateInput.value && bpEndDateInput.value &&
            bpStartDateInput.value > bpEndDateInput.value
        );

        const entries = getFilteredBpEntries();
        const displayText = buildSelectedBpCopyText(entries);

        if (bpCopyTextPreview) {
            bpCopyTextPreview.value = displayText;
        }

        if (bpCopyButton) {
            bpCopyButton.disabled = !entries.length || hasInvalidRange;
        }

        if (bpRangeResultCount) {
            if (hasInvalidRange) {
                bpRangeResultCount.textContent = "Start date must be on or before end date.";
                return;
            }

            if (!entries.length) {
                bpRangeResultCount.textContent = "No readings to copy.";
                return;
            }

            bpRangeResultCount.textContent = entries.length === 1 ? "1 reading" : entries.length + " readings";
        }

        if (bpCopyStatus) {
            bpCopyStatus.textContent = "";
        }
    }

    function clearBpRangeSelection() {
        if (bpStartDateInput) bpStartDateInput.value = "";
        if (bpEndDateInput) bpEndDateInput.value = "";
        if (bpCopyStatus) bpCopyStatus.textContent = "";
        updateBpRangeSummary();
    }

    function toggleBpFilterPanel() {
        if (!bpFilterToggle || !bpFilterPanel) {
            return;
        }

        const willShow = bpFilterPanel.hidden;
        bpFilterPanel.hidden = !willShow;
        bpFilterToggle.setAttribute("aria-expanded", String(willShow));
        bpFilterToggle.textContent = willShow ? "Hide Search & Filter" : "Search & Filter";
    }

    async function copySelectedBpReadings() {
        const text = bpCopyTextPreview ? bpCopyTextPreview.value.trim() : "";
        if (!text) {
            if (bpCopyStatus) {
                bpCopyStatus.textContent = "No readings to copy.";
            }
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                window.__copiedText = text;
            } else {
                const helper = document.createElement("textarea");
                helper.value = text;
                helper.setAttribute("readonly", "");
                helper.style.position = "fixed";
                helper.style.left = "-9999px";
                document.body.appendChild(helper);
                helper.select();
                document.execCommand("copy");
                document.body.removeChild(helper);
                window.__copiedText = text;
            }

            if (bpCopyStatus) {
                bpCopyStatus.textContent = "Copied";
            }

            if (bpCopyButton) {
                bpCopyButton.textContent = "Copied";
                window.setTimeout(function () {
                    if (bpCopyButton) {
                        bpCopyButton.textContent = "Copy";
                    }
                }, 1400);
            }
        } catch (error) {
            if (bpCopyStatus) {
                bpCopyStatus.textContent = "Copy unavailable. Please copy manually.";
            }
        }
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

    function setBpModalMode(isEditMode, entry) {
        if (bpDateTimeFields) {
            bpDateTimeFields.style.display = isEditMode ? "block" : "none";
        }

        if (!isEditMode) {
            if (bpDateInput) bpDateInput.value = "";
            if (bpTimeInput) bpTimeInput.value = "";
            if (deleteBpBtn) {
                deleteBpBtn.style.display = "none";
            }
            return;
        }

        if (bpDateInput) {
            bpDateInput.value = getDateInputValueFromEntry(entry) || getCurrentDateInputValue();
        }
        if (bpTimeInput) {
            bpTimeInput.value = getTimeInputValueFromEntry(entry) || getCurrentTimeInputValue();
        }
        if (deleteBpBtn) {
            deleteBpBtn.style.display = "block";
        }
    }

    function clearBpInputs() {
        if (systolicInput) systolicInput.value = "";
        if (diastolicInput) diastolicInput.value = "";
        if (pulseInput) pulseInput.value = "";
        if (bpDateInput) bpDateInput.value = "";
        if (bpTimeInput) bpTimeInput.value = "";
        if (bpNoteInput) bpNoteInput.value = "";
    }

    function lockBpModalBackgroundScroll() {
        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("bp-modal-open");
        document.body.classList.add("bp-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
    }

    function unlockBpModalBackgroundScroll() {
        document.documentElement.classList.remove("bp-modal-open");
        document.body.classList.remove("bp-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function openBpModal() {
        if (!bpModal) return;
        bpModal.classList.add("is-open");
        lockBpModalBackgroundScroll();
        if (systolicInput) {
            requestAnimationFrame(function () {
                systolicInput.focus();
            });
        }
    }

    function closeBpModal() {
        if (!bpModal) return;
        bpModal.classList.remove("is-open");
        unlockBpModalBackgroundScroll();
    }

    function closeBpDetailModal() {
        if (!bpDetailModal) return;
        bpDetailModal.style.display = "none";
    }

    function openBpDetailModal(index) {
        const entry = bpHistory[index];
        if (!entry || !bpDetailModal || !bpDetailContent) return;

        activeDetailIndex = index;

        const safeSystolic = escapeHtml(entry.systolic || "--");
        const safeDiastolic = escapeHtml(entry.diastolic || "--");
        const safePulse = escapeHtml(entry.pulse || "--");
        const safeDate = escapeHtml(entry.date || "--");
        const safeTime = escapeHtml(entry.time || "--");
        const safeNote = entry.note ? escapeHtml(entry.note) : "None";

        bpDetailContent.innerHTML =
            '<div class="bp-detail-row"><span class="bp-detail-label">Systolic</span><span>' + safeSystolic + "</span></div>" +
            '<div class="bp-detail-row"><span class="bp-detail-label">Diastolic</span><span>' + safeDiastolic + "</span></div>" +
            '<div class="bp-detail-row"><span class="bp-detail-label">Pulse</span><span>' + safePulse + "</span></div>" +
            '<div class="bp-detail-row"><span class="bp-detail-label">Date</span><span>' + safeDate + "</span></div>" +
            '<div class="bp-detail-row"><span class="bp-detail-label">Time</span><span>' + safeTime + "</span></div>" +
            '<div class="bp-detail-row"><span class="bp-detail-label">Notes</span><span>' + safeNote + "</span></div>";

        bpDetailModal.style.display = "flex";
    }

    function openBpEditModal(index) {
        const entry = bpHistory[index];
        if (!entry) return;

        editingBpIndex = index;
        if (bpModalTitle) {
            bpModalTitle.textContent = "Edit Blood Pressure";
        }
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

        setBpModalMode(true, entry);
        openBpModal();
    }

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
        bpHistoryDisplay.classList.add("bp-history-list");

        if (bpHistory.length === 0) {
            bpHistoryDisplay.textContent = "No blood pressure entries yet.";
            return;
        }

        const grouped = {};
        const orderedMonths = [];

        bpHistory.slice().reverse().forEach(function (entry, index) {
            const originalIndex = bpHistory.length - 1 - index;
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
            group.className = "bp-month-group";

            const header = document.createElement("div");
            header.className = "bp-month-header";
            header.textContent = monthKey;
            group.appendChild(header);

            grouped[monthKey].forEach(function (item) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "bp-history-row";
                row.setAttribute("data-index", String(item.index));
                row.innerHTML =
                    '<span class="bp-history-main">' +
                        '<span class="bp-history-reading">' +
                            escapeHtml(item.entry.systolic + " / " + item.entry.diastolic) +
                            ' · Pulse ' +
                            escapeHtml(item.entry.pulse || "--") +
                        '</span>' +
                        '<span class="bp-history-meta">' + escapeHtml(formatRowDate(item.entry)) + "</span>" +
                    "</span>" +
                    '<span class="bp-history-chevron" aria-hidden="true">&gt;</span>';
                group.appendChild(row);
            });

            bpHistoryDisplay.appendChild(group);
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
        updateBpRangeSummary();

        if (bpHistorySection && bpHistorySection.style.display === "block") {
            renderHistory();
        }
    }

    function toggleHistory() {
        if (!bpHistorySection || !bpHistoryButton || !bpHistoryDisplay) return;

        if (bpHistorySection.style.display === "block") {
            bpHistorySection.style.display = "none";
            bpHistoryButton.textContent = "📊 History";

            if (typeof window.scrollMedicationCenterTo === "function" && bpCard) {
                window.scrollMedicationCenterTo(bpCard);
                return;
            }

            if (bpCard) {
                bpCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }

        renderHistory();
        bpHistorySection.style.display = "block";
        bpHistoryButton.textContent = "📊 Hide History";

        if (typeof window.scrollMedicationCenterTo === "function") {
            window.scrollMedicationCenterTo(bpHistoryButton);
            return;
        }

        bpHistoryButton.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function openModal() {
        openBpModal();
    }

    function closeModal() {
        editingBpIndex = null;
        closeBpModal();
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
        updateBpRangeSummary();

        if (bpHistorySection) {
            bpHistorySection.style.display = "none";
        }

        if (bpHistoryButton) {
            bpHistoryButton.textContent = "📊 History";
            bpHistoryButton.addEventListener("click", toggleHistory);
        }

        if (bpFilterToggle && bpFilterPanel) {
            bpFilterPanel.hidden = true;
            bpFilterToggle.textContent = "Search & Filter";
            bpFilterToggle.setAttribute("aria-expanded", "false");
            bpFilterToggle.addEventListener("click", toggleBpFilterPanel);
        }

        if (bpStartDateInput) {
            bpStartDateInput.addEventListener("change", function () {
                if (bpStartDateInput.value && bpEndDateInput && bpEndDateInput.value && bpStartDateInput.value > bpEndDateInput.value) {
                    alert("Start date must be on or before end date.");
                }
                updateBpRangeSummary();
            });
        }

        if (bpEndDateInput) {
            bpEndDateInput.addEventListener("change", function () {
                if (bpStartDateInput && bpStartDateInput.value && bpEndDateInput.value && bpStartDateInput.value > bpEndDateInput.value) {
                    alert("Start date must be on or before end date.");
                }
                updateBpRangeSummary();
            });
        }

        if (bpClearRangeButton) {
            bpClearRangeButton.addEventListener("click", clearBpRangeSelection);
        }

        if (bpCopyButton) {
            bpCopyButton.addEventListener("click", copySelectedBpReadings);
        }

        if (bpButton) {
            bpButton.addEventListener("click", function () {
                editingBpIndex = null;
                activeDetailIndex = null;
                if (bpModalTitle) {
                    bpModalTitle.textContent = "Log Blood Pressure";
                }
                setBpModalMode(false);
                openModal();
            });
        }

        if (cancelBpBtn) {
            cancelBpBtn.addEventListener("click", function () {
                clearBpInputs();
                setBpModalMode(false);
                closeModal();
            });
        }

        if (saveBpBtn) {
            saveBpBtn.addEventListener("click", function () {
                const systolic = systolicInput ? systolicInput.value.trim() : "";
                const diastolic = diastolicInput ? diastolicInput.value.trim() : "";
                const pulse = pulseInput ? pulseInput.value.trim() : "";
                const note = bpNoteInput ? bpNoteInput.value.trim() : "";
                const wasEditing = editingBpIndex !== null && !!bpHistory[editingBpIndex];

                if (!systolic || !diastolic || !pulse) {
                    alert("Please enter systolic, diastolic, and pulse values.");
                    return;
                }

                if (editingBpIndex !== null && bpHistory[editingBpIndex]) {
                    const existing = bpHistory[editingBpIndex];
                    existing.systolic = systolic;
                    existing.diastolic = diastolic;
                    existing.pulse = pulse;
                    if (bpDateInput && bpDateInput.value) {
                        existing.date = bpDateInput.value;
                    }
                    if (bpTimeInput && bpTimeInput.value) {
                        existing.time = bpTimeInput.value;
                    }
                    if (note) {
                        existing.note = note;
                    } else {
                        delete existing.note;
                    }
                    bpLog = {
                        systolic: existing.systolic,
                        diastolic: existing.diastolic,
                        pulse: existing.pulse
                    };
                } else {
                    activeDetailIndex = null;
                    closeBpDetailModal();
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
                clearBpInputs();
                setBpModalMode(false);
                refreshBpData();

                if (wasEditing && activeDetailIndex !== null) {
                    const normalizedIndex = Number(activeDetailIndex);
                    if (!Number.isNaN(normalizedIndex) && bpHistory[normalizedIndex]) {
                        openBpDetailModal(normalizedIndex);
                    }
                }
            });
        }

        if (deleteBpBtn) {
            deleteBpBtn.addEventListener("click", function () {
                if (editingBpIndex === null) return;
                const index = Number(editingBpIndex);
                if (Number.isNaN(index) || !bpHistory[index]) return;

                if (!confirmHistoryDelete()) return;
                removeHistoryEntry(bpHistory, index);

                editingBpIndex = null;
                clearBpInputs();
                setBpModalMode(false);
                closeModal();
                activeDetailIndex = null;
                closeBpDetailModal();
                refreshBpData();
            });
        }

        if (bpDetailCloseBtn) {
            bpDetailCloseBtn.addEventListener("click", function () {
                closeBpDetailModal();
            });
        }

        if (bpDetailEditBtn) {
            bpDetailEditBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !bpHistory[index]) return;

                closeBpDetailModal();
                openBpEditModal(index);
            });
        }

        if (bpDetailDeleteBtn) {
            bpDetailDeleteBtn.addEventListener("click", function () {
                if (activeDetailIndex === null) return;
                const index = Number(activeDetailIndex);
                if (Number.isNaN(index) || !bpHistory[index]) return;

                if (!confirmHistoryDelete()) return;
                removeHistoryEntry(bpHistory, index);
                activeDetailIndex = null;
                closeBpDetailModal();
                refreshBpData();
            });
        }

        if (bpModal) {
            bpModal.addEventListener("touchmove", function (event) {
                if (!bpModalContent) return;
                if (!bpModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
            });
        }

        if (bpHistoryDisplay) {
            bpHistoryDisplay.addEventListener("click", function (event) {
                const row = event.target.closest(".bp-history-row");
                if (!row) return;

                const index = Number(row.getAttribute("data-index"));
                if (Number.isNaN(index) || !bpHistory[index]) return;

                row.classList.add("is-tapped");
                window.setTimeout(function () {
                    row.classList.remove("is-tapped");
                    openBpDetailModal(index);
                }, 120);
            });
        }
    }

    window.initBloodPressureCenter = initBloodPressureCenter;
})();
