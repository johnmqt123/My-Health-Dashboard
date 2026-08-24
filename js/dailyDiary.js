(function () {
    const DIARY_STORAGE_KEY = "dailyDiaryEntries";

    let diaryEntries = loadData(DIARY_STORAGE_KEY, []);

    const dailyDiaryCard = document.getElementById("dailyDiaryCard");
    const dailyDiaryCurrentDate = document.getElementById("dailyDiaryCurrentDate");
    const dailyDiaryTodayPreview = document.getElementById("dailyDiaryTodayPreview");
    const dailyDiaryOpenTodayButton = document.getElementById("dailyDiaryOpenTodayButton");
    const dailyDiaryHistoryButton = document.getElementById("dailyDiaryHistoryButton");
    const dailyDiaryHistorySection = document.getElementById("dailyDiaryHistorySection");
    const dailyDiaryHistoryDisplay = document.getElementById("dailyDiaryHistoryDisplay");
    const dailyDiarySearchInput = document.getElementById("dailyDiarySearchInput");

    const dailyDiaryEditorModal = document.getElementById("dailyDiaryEditorModal");
    const dailyDiaryEditorTitle = document.getElementById("dailyDiaryEditorTitle");
    const dailyDiaryEditorDate = document.getElementById("dailyDiaryEditorDate");
    const dailyDiaryEditorInput = document.getElementById("dailyDiaryEditorInput");
    const dailyDiaryEditorSaveButton = document.getElementById("dailyDiaryEditorSaveButton");
    const dailyDiaryEditorCloseButton = document.getElementById("dailyDiaryEditorCloseButton");

    let expandedHistoryDate = null;
    let editorActiveDate = null;

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

    function getFilteredDiaryEntries() {
        const query = dailyDiarySearchInput ? dailyDiarySearchInput.value.trim() : "";
        const normalizedQuery = query.toLowerCase();
        const sorted = getSortedEntriesNewestFirst();

        if (!normalizedQuery) {
            return sorted;
        }

        return sorted.filter(function (entry) {
            return String(entry.text || "").toLowerCase().indexOf(normalizedQuery) !== -1;
        });
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

        dailyDiaryHistoryDisplay.innerHTML = "";
        dailyDiaryHistoryDisplay.classList.add("diary-history-list");

        if (!filteredEntries.length) {
            const message = (dailyDiarySearchInput && dailyDiarySearchInput.value.trim())
                ? "No matching entries."
                : "No diary entries yet.";
            dailyDiaryHistoryDisplay.innerHTML = '<p class="history-empty">' + escapeHtml(message) + "</p>";
            return;
        }

        const grouped = {};
        const orderedMonths = [];

        filteredEntries.forEach(function (entry) {
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
            dailyDiaryHistorySection.style.display = "block";
            dailyDiaryHistoryButton.textContent = "Hide History";
            dailyDiaryHistoryButton.setAttribute("aria-expanded", "true");

            const alignHistoryControl = function () {
                const buttonTop =
                    window.pageYOffset + dailyDiaryHistoryButton.getBoundingClientRect().top;
                const targetTop = Math.max(0, buttonTop - 8);

                window.scrollTo({
                    top: targetTop,
                    behavior: "auto"
                });
            };

            alignHistoryControl();

            window.setTimeout(function () {
                const buttonRect = dailyDiaryHistoryButton.getBoundingClientRect();
                const sectionRect = dailyDiaryHistorySection.getBoundingClientRect();
                const monthHeading = dailyDiaryHistoryDisplay
                    ? dailyDiaryHistoryDisplay.querySelector(".diary-month-header")
                    : null;
                const monthRect = monthHeading ? monthHeading.getBoundingClientRect() : null;
                const buttonVisible = buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;
                const sectionStartVisible = sectionRect.top < window.innerHeight;
                const monthVisible = !monthRect || (monthRect.top >= 0 && monthRect.top < window.innerHeight);

                if (buttonVisible && sectionStartVisible && monthVisible) {
                    return;
                }

                alignHistoryControl();
            }, 160);

            return;
        }

        expandedHistoryDate = null;
        dailyDiaryHistorySection.style.display = "none";
        dailyDiaryHistoryButton.textContent = "📊 History";
        dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");

        if (typeof window.scrollMedicationCenterTo === "function" && dailyDiaryCard) {
            window.scrollMedicationCenterTo(dailyDiaryCard);
            return;
        }

        if (dailyDiaryCard) {
            dailyDiaryCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function initDailyDiaryCenter() {
        if (!dailyDiaryOpenTodayButton || !dailyDiaryEditorInput || !dailyDiaryEditorSaveButton) {
            return;
        }

        diaryEntries = normalizeDiaryEntries(diaryEntries);
        saveDiaryEntries();

        renderTodaySummary();

        if (dailyDiaryHistorySection) {
            dailyDiaryHistorySection.style.display = "none";
        }

        if (dailyDiaryHistoryButton) {
            dailyDiaryHistoryButton.textContent = "📊 History";
            dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");
            dailyDiaryHistoryButton.addEventListener("click", toggleHistory);
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
                renderHistory();
            });
        }

        renderHistory();
    }

    window.initDailyDiaryCenter = initDailyDiaryCenter;
})();
