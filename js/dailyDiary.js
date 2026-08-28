(function () {
    const DIARY_STORAGE_KEY = "dailyDiaryEntries";

    let diaryEntries = loadData(DIARY_STORAGE_KEY, []);

    const dailyDiaryCard = document.getElementById("dailyDiaryCard");
    const dailyDiaryCurrentDate = document.getElementById("dailyDiaryCurrentDate");
    const dailyDiaryTodayPreview = document.getElementById("dailyDiaryTodayPreview");
    const dailyDiaryOpenTodayButton = document.getElementById("dailyDiaryOpenTodayButton");
    const dailyDiaryHistoryButton = document.getElementById("dailyDiaryHistoryButton");
    const dailyDiaryHistorySection = document.getElementById("dailyDiaryHistorySection");
    const dailyDiaryFilterToggle = document.getElementById("dailyDiaryFilterToggle");
    const dailyDiaryFilterPanel = document.getElementById("dailyDiaryFilterPanel");
    const dailyDiaryHistoryDisplay = document.getElementById("dailyDiaryHistoryDisplay");
    const dailyDiarySearchInput = document.getElementById("dailyDiarySearchInput");
    const dailyDiaryStartDateInput = document.getElementById("dailyDiaryStartDate");
    const dailyDiaryEndDateInput = document.getElementById("dailyDiaryEndDate");
    const dailyDiaryClearFiltersButton = document.getElementById("dailyDiaryClearFiltersButton");
    const dailyDiaryResultCount = document.getElementById("dailyDiaryResultCount");
    const dailyDiaryShowMoreButton = document.getElementById("dailyDiaryShowMoreButton");

    const dailyDiaryEditorModal = document.getElementById("dailyDiaryEditorModal");
    const dailyDiaryEditorTitle = document.getElementById("dailyDiaryEditorTitle");
    const dailyDiaryEditorDate = document.getElementById("dailyDiaryEditorDate");
    const dailyDiaryEditorInput = document.getElementById("dailyDiaryEditorInput");
    const dailyDiaryEditorSaveButton = document.getElementById("dailyDiaryEditorSaveButton");
    const dailyDiaryEditorCloseButton = document.getElementById("dailyDiaryEditorCloseButton");

    let expandedHistoryDate = null;
    let editorActiveDate = null;
    const INITIAL_DIARY_VISIBLE_COUNT = 40;
    const DIARY_SHOW_MORE_STEP = 40;
    let visibleDiaryEntriesCount = 0;

    function getLocalDateKey(dateValue) {
        const safeDate = dateValue instanceof Date ? dateValue : new Date();
        const year = safeDate.getFullYear();
        const month = String(safeDate.getMonth() + 1).padStart(2, "0");
        const day = String(safeDate.getDate()).padStart(2, "0");
        return year + "-" + month + "-" + day;
    }

    function parseDateKey(dateKey) {
        const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(String(dateKey || ""));
        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const parsed = new Date(year, month - 1, day);

        if (
            Number.isNaN(parsed.getTime()) ||
            parsed.getFullYear() !== year ||
            parsed.getMonth() !== (month - 1) ||
            parsed.getDate() !== day
        ) {
            return null;
        }

        return parsed;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalizeDiaryEntries(source) {
        if (!Array.isArray(source)) {
            return [];
        }

        const byDate = {};

        source.forEach(function (entry) {
            if (!entry || typeof entry !== "object") {
                return;
            }

            const date = String(entry.date || "").trim();
            if (!parseDateKey(date)) {
                return;
            }

            byDate[date] = {
                date: date,
                text: String(entry.text || "")
            };
        });

        return Object.keys(byDate)
            .sort()
            .map(function (date) {
                return byDate[date];
            });
    }

    function saveDiaryEntries() {
        saveData(DIARY_STORAGE_KEY, diaryEntries);
    }

    function getEntryByDate(dateKey) {
        return diaryEntries.find(function (entry) {
            return entry.date === dateKey;
        }) || null;
    }

    function upsertEntry(dateKey, textValue) {
        const existing = getEntryByDate(dateKey);

        if (existing) {
            existing.text = textValue;
            return;
        }

        diaryEntries.push({
            date: dateKey,
            text: textValue
        });
    }

    function getFriendlyDateLabel(dateKey, includeWeekday) {
        const parsed = parseDateKey(dateKey);
        if (!parsed) {
            return dateKey;
        }

        const options = includeWeekday
            ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
            : { month: "long", day: "numeric", year: "numeric" };

        return parsed.toLocaleDateString([], options);
    }

    function getHistoryMonthLabel(dateKey) {
        const parsed = parseDateKey(dateKey);
        if (!parsed) {
            return "Unknown Month";
        }

        return parsed.toLocaleDateString([], {
            month: "long",
            year: "numeric"
        });
    }

    function getHistoryDayLabel(dateKey) {
        const parsed = parseDateKey(dateKey);
        if (!parsed) {
            return dateKey;
        }

        return parsed.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function getPreviewText(textValue) {
        const compact = String(textValue || "").replace(/\s+/g, " ").trim();
        if (!compact) {
            return "No entry yet. Add today's diary entry.";
        }

        if (compact.length <= 120) {
            return compact;
        }

        return compact.slice(0, 117) + "...";
    }

    function getSearchPreviewText(textValue, searchText) {
        const compact = String(textValue || "").replace(/\s+/g, " ").trim();
        const normalizedSearch = String(searchText || "").trim();
        if (!compact) {
            return "No entry yet. Add today's diary entry.";
        }

        if (!normalizedSearch) {
            return getPreviewText(compact);
        }

        const normalizedText = compact.toLowerCase();
        const searchLower = normalizedSearch.toLowerCase();
        const matchIndex = normalizedText.indexOf(searchLower);
        if (matchIndex === -1) {
            return getPreviewText(compact);
        }

        const snippetLength = 90;
        const start = Math.max(0, matchIndex - 35);
        const end = Math.min(compact.length, start + snippetLength);
        let preview = compact.slice(start, end).trim();

        if (start > 0) {
            preview = "…" + preview;
        }

        if (end < compact.length) {
            preview = preview + "…";
        }

        return preview || getPreviewText(compact);
    }

    function getSortedEntriesNewestFirst() {
        return diaryEntries.slice().sort(function (a, b) {
            if (a.date === b.date) {
                return 0;
            }

            return a.date < b.date ? 1 : -1;
        });
    }

    function getDiaryFilterState() {
        return {
            searchText: dailyDiarySearchInput ? String(dailyDiarySearchInput.value || "").trim() : "",
            startDate: dailyDiaryStartDateInput ? String(dailyDiaryStartDateInput.value || "").trim() : "",
            endDate: dailyDiaryEndDateInput ? String(dailyDiaryEndDateInput.value || "").trim() : ""
        };
    }

    function getFilteredDiaryEntries() {
        const filterState = getDiaryFilterState();
        const query = filterState.searchText;
        const normalizedQuery = query.toLowerCase();
        const startDate = filterState.startDate;
        const endDate = filterState.endDate;
        const sorted = getSortedEntriesNewestFirst();

        if (startDate && endDate && startDate > endDate) {
            return [];
        }

        return sorted.filter(function (entry) {
            if (startDate && entry.date < startDate) {
                return false;
            }

            if (endDate && entry.date > endDate) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            return String(entry.text || "").toLowerCase().indexOf(normalizedQuery) !== -1;
        });
    }

    function getDiaryResultLabel(count) {
        if (count === 1) {
            return "1 entry found";
        }

        return count + " entries found";
    }

    function resetDiaryVisibleCount() {
        visibleDiaryEntriesCount = INITIAL_DIARY_VISIBLE_COUNT;
    }

    function updateDiaryResultCount(filteredEntries) {
        if (!dailyDiaryResultCount) {
            return;
        }

        if (dailyDiaryStartDateInput && dailyDiaryEndDateInput &&
            dailyDiaryStartDateInput.value && dailyDiaryEndDateInput.value &&
            dailyDiaryStartDateInput.value > dailyDiaryEndDateInput.value) {
            dailyDiaryResultCount.textContent = "Start date must be on or before end date.";
            return;
        }

        if (!filteredEntries.length) {
            dailyDiaryResultCount.textContent = getDiaryResultLabel(0);
            return;
        }

        const maximumVisible = Math.min(visibleDiaryEntriesCount, filteredEntries.length);
        dailyDiaryResultCount.textContent = getDiaryResultLabel(filteredEntries.length) + " · showing " + maximumVisible;
    }

    function renderTodaySummary() {
        const todayKey = getLocalDateKey();
        const todayEntry = getEntryByDate(todayKey);

        if (dailyDiaryCurrentDate) {
            dailyDiaryCurrentDate.textContent = getFriendlyDateLabel(todayKey, true);
        }

        if (dailyDiaryTodayPreview) {
            dailyDiaryTodayPreview.textContent = getPreviewText(todayEntry ? todayEntry.text : "");
        }
    }

    function openEditorForDate(dateKey) {
        if (!parseDateKey(dateKey) || !dailyDiaryEditorModal || !dailyDiaryEditorInput) {
            return;
        }

        editorActiveDate = dateKey;

        const todayKey = getLocalDateKey();
        const isToday = editorActiveDate === todayKey;
        const entry = getEntryByDate(editorActiveDate);

        if (dailyDiaryEditorTitle) {
            dailyDiaryEditorTitle.textContent = isToday ? "Today's Diary" : "Edit Diary Entry";
        }

        if (dailyDiaryEditorDate) {
            dailyDiaryEditorDate.textContent = getFriendlyDateLabel(editorActiveDate, true);
        }

        dailyDiaryEditorInput.value = entry ? String(entry.text || "") : "";
        dailyDiaryEditorModal.style.display = "block";

        window.requestAnimationFrame(function () {
            dailyDiaryEditorInput.focus();
            const length = dailyDiaryEditorInput.value.length;
            dailyDiaryEditorInput.setSelectionRange(length, length);
        });
    }

    function closeEditor() {
        if (!dailyDiaryEditorModal || !dailyDiaryEditorInput) {
            editorActiveDate = null;
            return;
        }

        dailyDiaryEditorModal.style.display = "none";
        dailyDiaryEditorInput.value = "";
        editorActiveDate = null;
    }

    function handleEditorSave() {
        if (!dailyDiaryEditorInput || !editorActiveDate) {
            return;
        }

        const textValue = dailyDiaryEditorInput.value.trim();
        if (!textValue) {
            alert("Please enter a diary entry before saving.");
            return;
        }

        upsertEntry(editorActiveDate, textValue);
        diaryEntries = normalizeDiaryEntries(diaryEntries);
        saveDiaryEntries();
        renderTodaySummary();
        renderHistory();
        closeEditor();
    }

    function renderHistory() {
        if (!dailyDiaryHistoryDisplay) {
            return;
        }

        const filteredEntries = getFilteredDiaryEntries();
        const hasInvalidRange = Boolean(
            dailyDiaryStartDateInput && dailyDiaryEndDateInput &&
            dailyDiaryStartDateInput.value && dailyDiaryEndDateInput.value &&
            dailyDiaryStartDateInput.value > dailyDiaryEndDateInput.value
        );

        if (filteredEntries.length && visibleDiaryEntriesCount === 0) {
            visibleDiaryEntriesCount = Math.min(INITIAL_DIARY_VISIBLE_COUNT, filteredEntries.length);
        }

        if (!filteredEntries.length) {
            dailyDiaryHistoryDisplay.innerHTML = "";
            dailyDiaryHistoryDisplay.classList.add("diary-history-list");
            if (dailyDiaryShowMoreButton) {
                dailyDiaryShowMoreButton.hidden = true;
            }
            updateDiaryResultCount(filteredEntries);

            const message = hasInvalidRange
                ? "Start date must be on or before end date."
                : (dailyDiarySearchInput && dailyDiarySearchInput.value.trim())
                    ? "No matching entries."
                    : "No diary entries yet.";
            dailyDiaryHistoryDisplay.innerHTML = '<p class="history-empty">' + escapeHtml(message) + "</p>";
            return;
        }

        if (visibleDiaryEntriesCount <= 0) {
            visibleDiaryEntriesCount = Math.min(INITIAL_DIARY_VISIBLE_COUNT, filteredEntries.length);
        }

        const visibleEntries = filteredEntries.slice(0, Math.min(visibleDiaryEntriesCount, filteredEntries.length));

        dailyDiaryHistoryDisplay.innerHTML = "";
        dailyDiaryHistoryDisplay.classList.add("diary-history-list");
        updateDiaryResultCount(filteredEntries);

        if (dailyDiaryShowMoreButton) {
            dailyDiaryShowMoreButton.hidden = filteredEntries.length <= visibleEntries.length;
        }

        const grouped = {};
        const orderedMonths = [];

        visibleEntries.forEach(function (entry) {
            const monthLabel = getHistoryMonthLabel(entry.date);
            if (!grouped[monthLabel]) {
                grouped[monthLabel] = [];
                orderedMonths.push(monthLabel);
            }

            grouped[monthLabel].push(entry);
        });

        orderedMonths.forEach(function (monthLabel) {
            const group = document.createElement("div");
            group.className = "diary-month-group";

            const header = document.createElement("div");
            header.className = "diary-month-header";
            header.textContent = monthLabel;
            group.appendChild(header);

            grouped[monthLabel].forEach(function (entry) {
                const isExpanded = expandedHistoryDate === entry.date;
                const item = document.createElement("div");
                item.className = "diary-history-item" + (isExpanded ? " is-expanded" : "");

                const previewText = getSearchPreviewText(entry.text, dailyDiarySearchInput ? dailyDiarySearchInput.value : "");
                const row = document.createElement("button");
                row.type = "button";
                row.className = "diary-history-row";
                row.setAttribute("data-date", entry.date);
                row.setAttribute("aria-expanded", isExpanded ? "true" : "false");
                row.setAttribute("aria-label", "View diary entry for " + getFriendlyDateLabel(entry.date, true));
                row.innerHTML =
                    '<span class="diary-history-main">' +
                        '<span class="diary-history-date">' + escapeHtml(getHistoryDayLabel(entry.date)) + "</span>" +
                        '<span class="diary-history-preview">' + escapeHtml(previewText) + "</span>" +
                    "</span>" +
                    '<span class="diary-history-chevron" aria-hidden="true">' + (isExpanded ? "⌄" : "›") + "</span>";

                item.appendChild(row);

                const details = document.createElement("div");
                details.className = "diary-history-details";
                details.style.display = isExpanded ? "grid" : "none";
                details.innerHTML =
                    '<div class="diary-history-detail-date">' + escapeHtml(getFriendlyDateLabel(entry.date, true)) + "</div>" +
                    '<div class="diary-history-full-text">' + escapeHtml(entry.text || "") + "</div>" +
                    '<button type="button" class="diary-history-edit-btn" data-date="' + escapeHtml(entry.date) +
                    '" aria-label="Edit diary entry for ' + escapeHtml(getFriendlyDateLabel(entry.date, true)) +
                    '">Edit Entry</button>';

                item.appendChild(details);
                group.appendChild(item);
            });

            dailyDiaryHistoryDisplay.appendChild(group);
        });
    }

    function toggleHistoryEntry(dateKey) {
        if (!parseDateKey(dateKey)) {
            return;
        }

        expandedHistoryDate = expandedHistoryDate === dateKey ? null : dateKey;
        renderHistory();
    }

    function resetHistoryScroll() {
        if (dailyDiaryHistoryDisplay) {
            dailyDiaryHistoryDisplay.scrollTop = 0;
        }
    }

    function editHistoryDate(dateKey) {
        if (!parseDateKey(dateKey)) {
            return;
        }

        openEditorForDate(dateKey);
    }

    function toggleHistory() {
        if (!dailyDiaryHistorySection || !dailyDiaryHistoryButton) {
            return;
        }

        const isHidden = dailyDiaryHistorySection.style.display === "none";

        if (isHidden) {
            renderHistory();
            resetHistoryScroll();
            dailyDiaryHistorySection.style.display = "block";
            dailyDiaryHistoryButton.textContent = "Hide History";
            dailyDiaryHistoryButton.setAttribute("aria-expanded", "true");
            return;
        }

        expandedHistoryDate = null;
        resetHistoryScroll();
        dailyDiaryHistorySection.style.display = "none";
        dailyDiaryHistoryButton.textContent = "📊 History";
        dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");
    }

    function applyDiaryFilterChanges() {
        const filteredEntries = getFilteredDiaryEntries();
        if (dailyDiaryStartDateInput && dailyDiaryEndDateInput &&
            dailyDiaryStartDateInput.value && dailyDiaryEndDateInput.value &&
            dailyDiaryStartDateInput.value > dailyDiaryEndDateInput.value) {
            alert("Start date must be on or before end date.");
        }

        visibleDiaryEntriesCount = INITIAL_DIARY_VISIBLE_COUNT;
        if (filteredEntries.length < INITIAL_DIARY_VISIBLE_COUNT) {
            visibleDiaryEntriesCount = filteredEntries.length;
        }
        renderHistory();
    }

    function clearDiaryFilters() {
        if (dailyDiarySearchInput) {
            dailyDiarySearchInput.value = "";
        }
        if (dailyDiaryStartDateInput) {
            dailyDiaryStartDateInput.value = "";
        }
        if (dailyDiaryEndDateInput) {
            dailyDiaryEndDateInput.value = "";
        }
        visibleDiaryEntriesCount = INITIAL_DIARY_VISIBLE_COUNT;
        renderHistory();
    }

    function toggleDiaryFilterPanel() {
        if (!dailyDiaryFilterToggle || !dailyDiaryFilterPanel) {
            return;
        }

        const willShow = dailyDiaryFilterPanel.hidden;
        dailyDiaryFilterPanel.hidden = !willShow;
        dailyDiaryFilterToggle.setAttribute("aria-expanded", String(willShow));
        dailyDiaryFilterToggle.textContent = willShow ? "Hide Search & Filter" : "Search & Filter";
    }

    function loadMoreDiaryEntries() {
        const filteredEntries = getFilteredDiaryEntries();
        if (!filteredEntries.length) {
            return;
        }

        visibleDiaryEntriesCount = Math.min(
            visibleDiaryEntriesCount + DIARY_SHOW_MORE_STEP,
            filteredEntries.length
        );
        renderHistory();
    }

    function initDailyDiaryCenter() {
        if (!dailyDiaryOpenTodayButton || !dailyDiaryEditorInput || !dailyDiaryEditorSaveButton) {
            return;
        }

        diaryEntries = normalizeDiaryEntries(diaryEntries);
        saveDiaryEntries();
        visibleDiaryEntriesCount = INITIAL_DIARY_VISIBLE_COUNT;

        renderTodaySummary();

        if (dailyDiaryHistorySection) {
            dailyDiaryHistorySection.style.display = "none";
        }

        if (dailyDiaryHistoryButton) {
            dailyDiaryHistoryButton.textContent = "📊 History";
            dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");
            dailyDiaryHistoryButton.addEventListener("click", toggleHistory);
        }

        if (dailyDiaryFilterToggle && dailyDiaryFilterPanel) {
            dailyDiaryFilterPanel.hidden = true;
            dailyDiaryFilterToggle.textContent = "Search & Filter";
            dailyDiaryFilterToggle.setAttribute("aria-expanded", "false");
            dailyDiaryFilterToggle.addEventListener("click", toggleDiaryFilterPanel);
        }

        dailyDiaryOpenTodayButton.addEventListener("click", function () {
            openEditorForDate(getLocalDateKey());
        });

        dailyDiaryEditorSaveButton.addEventListener("click", handleEditorSave);

        if (dailyDiaryEditorCloseButton) {
            dailyDiaryEditorCloseButton.addEventListener("click", closeEditor);
        }

        if (dailyDiaryEditorModal) {
            dailyDiaryEditorModal.addEventListener("click", function (event) {
                if (event.target === dailyDiaryEditorModal) {
                    closeEditor();
                }
            });
        }

        if (dailyDiaryHistoryDisplay) {
            dailyDiaryHistoryDisplay.addEventListener("click", function (event) {
                const editButton = event.target.closest(".diary-history-edit-btn");
                if (editButton) {
                    const editDate = String(editButton.getAttribute("data-date") || "");
                    editHistoryDate(editDate);
                    return;
                }

                const row = event.target.closest(".diary-history-row");
                if (!row) {
                    return;
                }

                const dateKey = String(row.getAttribute("data-date") || "");
                toggleHistoryEntry(dateKey);
            });
        }

        if (dailyDiarySearchInput) {
            dailyDiarySearchInput.addEventListener("input", function () {
                resetHistoryScroll();
                applyDiaryFilterChanges();
            });
        }

        if (dailyDiaryStartDateInput) {
            dailyDiaryStartDateInput.addEventListener("change", function () {
                resetHistoryScroll();
                applyDiaryFilterChanges();
            });
        }

        if (dailyDiaryEndDateInput) {
            dailyDiaryEndDateInput.addEventListener("change", function () {
                resetHistoryScroll();
                applyDiaryFilterChanges();
            });
        }

        if (dailyDiaryClearFiltersButton) {
            dailyDiaryClearFiltersButton.addEventListener("click", function () {
                clearDiaryFilters();
            });
        }

        if (dailyDiaryShowMoreButton) {
            dailyDiaryShowMoreButton.addEventListener("click", function () {
                loadMoreDiaryEntries();
            });
        }

        renderHistory();
    }

    window.initDailyDiaryCenter = initDailyDiaryCenter;
})();
