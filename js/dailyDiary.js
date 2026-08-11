(function () {
    const DIARY_STORAGE_KEY = "dailyDiaryEntries";

    let diaryEntries = loadData(DIARY_STORAGE_KEY, []);

    const dailyDiaryCurrentDate = document.getElementById("dailyDiaryCurrentDate");
    const dailyDiaryInput = document.getElementById("dailyDiaryInput");
    const dailyDiarySaveButton = document.getElementById("dailyDiarySaveButton");
    const dailyDiaryHistoryButton = document.getElementById("dailyDiaryHistoryButton");
    const dailyDiaryHistorySection = document.getElementById("dailyDiaryHistorySection");
    const dailyDiaryHistoryDisplay = document.getElementById("dailyDiaryHistoryDisplay");
    const dailyDiaryEditStatus = document.getElementById("dailyDiaryEditStatus");
    const dailyDiaryEditTodayButton = document.getElementById("dailyDiaryEditTodayButton");

    let activeEditDate = null;
    let expandedHistoryDate = null;

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
            return "(No text saved yet)";
        }

        if (compact.length <= 120) {
            return compact;
        }

        return compact.slice(0, 117) + "...";
    }

    function getSortedEntriesNewestFirst() {
        return diaryEntries.slice().sort(function (a, b) {
            if (a.date === b.date) {
                return 0;
            }

            return a.date < b.date ? 1 : -1;
        });
    }

    function setActiveEditDate(dateKey) {
        activeEditDate = dateKey;

        const entry = getEntryByDate(dateKey);
        if (dailyDiaryInput) {
            dailyDiaryInput.value = entry && typeof entry.text === "string" ? entry.text : "";
        }

        const todayKey = getLocalDateKey();
        const isToday = dateKey === todayKey;

        if (dailyDiaryEditStatus) {
            dailyDiaryEditStatus.textContent = isToday
                ? "Editing today's entry."
                : "Editing " + getFriendlyDateLabel(dateKey, true) + ".";
        }

        if (dailyDiaryEditTodayButton) {
            dailyDiaryEditTodayButton.style.display = isToday ? "none" : "block";
        }
    }

    function renderHistory() {
        if (!dailyDiaryHistoryDisplay) {
            return;
        }

        const sorted = getSortedEntriesNewestFirst();

        dailyDiaryHistoryDisplay.innerHTML = "";
        dailyDiaryHistoryDisplay.classList.add("diary-history-list");

        if (!sorted.length) {
            dailyDiaryHistoryDisplay.innerHTML = '<p class="history-empty">No diary entries yet.</p>';
            return;
        }

        const grouped = {};
        const orderedMonths = [];

        sorted.forEach(function (entry) {
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

                const row = document.createElement("button");
                row.type = "button";
                row.className = "diary-history-row";
                row.setAttribute("data-date", entry.date);
                row.setAttribute("aria-expanded", isExpanded ? "true" : "false");
                row.setAttribute("aria-label", "View diary entry for " + getFriendlyDateLabel(entry.date, true));
                row.innerHTML =
                    '<span class="diary-history-main">' +
                        '<span class="diary-history-date">' + escapeHtml(getHistoryDayLabel(entry.date)) + "</span>" +
                        '<span class="diary-history-preview">' + escapeHtml(getPreviewText(entry.text)) + "</span>" +
                    "</span>" +
                    '<span class="diary-history-chevron" aria-hidden="true">' + (isExpanded ? "⌄" : "›") + "</span>";

                item.appendChild(row);

                const details = document.createElement("div");
                details.className = "diary-history-details";
                details.style.display = isExpanded ? "grid" : "none";
                details.innerHTML =
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

    function beginEditingHistoryDate(dateKey) {
        if (!parseDateKey(dateKey)) {
            return;
        }

        setActiveEditDate(dateKey);

        if (dailyDiaryInput) {
            dailyDiaryInput.focus();
        }
    }

    function handleSaveEntry() {
        if (!dailyDiaryInput) {
            return;
        }

        const textValue = dailyDiaryInput.value.trim();
        if (!textValue) {
            alert("Please enter a diary entry before saving.");
            return;
        }

        const todayKey = getLocalDateKey();
        const targetDate = activeEditDate || todayKey;

        upsertEntry(targetDate, textValue);
        diaryEntries = normalizeDiaryEntries(diaryEntries);
        saveDiaryEntries();

        setActiveEditDate(targetDate);
        renderHistory();
    }

    function openTodayForEditing() {
        setActiveEditDate(getLocalDateKey());
        if (dailyDiaryInput) {
            dailyDiaryInput.focus();
        }
    }

    function scrollToDailyDiaryHistoryTop() {
        if (!dailyDiaryHistorySection) {
            return;
        }

        if (typeof dailyDiaryHistorySection.scrollIntoView === "function") {
            dailyDiaryHistorySection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        window.setTimeout(function () {
            const top = dailyDiaryHistorySection.getBoundingClientRect().top;
            if (top < 0 || top > 40) {
                const elementTop =
                    window.pageYOffset + dailyDiaryHistorySection.getBoundingClientRect().top;
                const targetTop = Math.max(0, elementTop - 12);
                window.scrollTo({
                    top: targetTop,
                    behavior: "smooth"
                });
            }
        }, 160);
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
            scrollToDailyDiaryHistoryTop();
            return;
        }

        expandedHistoryDate = null;
        dailyDiaryHistorySection.style.display = "none";
        dailyDiaryHistoryButton.textContent = "📊 History";
        dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");
    }

    function initDailyDiaryCenter() {
        if (!dailyDiaryInput || !dailyDiarySaveButton) {
            return;
        }

        diaryEntries = normalizeDiaryEntries(diaryEntries);
        saveDiaryEntries();

        const todayKey = getLocalDateKey();

        if (dailyDiaryCurrentDate) {
            dailyDiaryCurrentDate.textContent = getFriendlyDateLabel(todayKey, true);
        }

        if (dailyDiaryHistorySection) {
            dailyDiaryHistorySection.style.display = "none";
        }

        if (dailyDiaryHistoryButton) {
            dailyDiaryHistoryButton.textContent = "📊 History";
            dailyDiaryHistoryButton.setAttribute("aria-expanded", "false");
            dailyDiaryHistoryButton.addEventListener("click", toggleHistory);
        }

        dailyDiarySaveButton.addEventListener("click", handleSaveEntry);

        if (dailyDiaryEditTodayButton) {
            dailyDiaryEditTodayButton.addEventListener("click", openTodayForEditing);
        }

        if (dailyDiaryHistoryDisplay) {
            dailyDiaryHistoryDisplay.addEventListener("click", function (event) {
                const editButton = event.target.closest(".diary-history-edit-btn");
                if (editButton) {
                    const editDate = String(editButton.getAttribute("data-date") || "");
                    beginEditingHistoryDate(editDate);
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

        setActiveEditDate(todayKey);
        renderHistory();
    }

    window.initDailyDiaryCenter = initDailyDiaryCenter;
})();
