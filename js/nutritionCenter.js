// =====================================
// John's Assistant
// nutritionCenter.js
// =====================================

(function () {
    const NUTRITION_LOG_URL = "https://docs.google.com/spreadsheets/d/1mYoz9EWW6P3mkAvfHJ89uHUASNJL-WzbMltccG4y3ws/edit?gid=1876887081#gid=1876887081";

    const nutritionCard = document.getElementById("nutritionCard");
    const nutritionCaloriesValue = document.getElementById("nutritionCaloriesValue");
    const nutritionProteinValue = document.getElementById("nutritionProteinValue");
    const nutritionCarbsValue = document.getElementById("nutritionCarbsValue");
    const nutritionFatValue = document.getElementById("nutritionFatValue");

    const nutritionLogFoodButton = document.getElementById("nutritionLogFoodButton");
    const nutritionHistoryButton = document.getElementById("nutritionHistoryButton");
    const nutritionHistorySection = document.getElementById("nutritionHistorySection");
    const nutritionHistoryDisplay = document.getElementById("nutritionHistoryDisplay");
    const nutritionDayDetailModal = document.getElementById("nutritionDayDetailModal");
    const nutritionDayDetailContent = document.getElementById("nutritionDayDetailContent");
    const nutritionDayDetailCloseBtn = document.getElementById("nutritionDayDetailCloseBtn");

    let nutritionToday = loadData("nutritionToday", {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    let nutritionHistory = loadData("nutritionHistory", []);
    let nutritionDays = [];
    let activeNutritionDayKey = null;

    function getNumber(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    }

    function getNumberFromKeys(source, keys) {
        if (!source || typeof source !== "object") {
            return 0;
        }

        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                return getNumber(source[key]);
            }
        }

        return 0;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function parseDateFromHistoryEntry(entry, fallbackDate, fallbackTime) {
        const dateValue = entry && entry.date !== undefined ? entry.date : fallbackDate;
        const timeValue = entry && entry.time !== undefined ? entry.time : fallbackTime;

        if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
            return dateValue;
        }

        if (typeof dateValue === "number") {
            const fromNumber = new Date(dateValue);
            if (!Number.isNaN(fromNumber.getTime())) {
                return fromNumber;
            }
        }

        const dateText = dateValue ? String(dateValue).trim() : "";
        const timeText = timeValue ? String(timeValue).trim() : "";

        if (dateText) {
            const usParts = dateText.split("/");
            if (usParts.length === 3) {
                const month = Number(usParts[0]);
                const day = Number(usParts[1]);
                const year = Number(usParts[2]);
                if (!Number.isNaN(month) && !Number.isNaN(day) && !Number.isNaN(year)) {
                    const usDate = new Date(year, month - 1, day);
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
                    if (!Number.isNaN(isoDate.getTime())) {
                        return isoDate;
                    }
                }
            }

            const fallback = timeText ? new Date(dateText + " " + timeText) : new Date(dateText);
            if (!Number.isNaN(fallback.getTime())) {
                return fallback;
            }
        }

        return null;
    }

    function toDayKey(dateObj) {
        if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
            return "";
        }

        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return dateObj.getFullYear() + "-" + month + "-" + day;
    }

    function parseDayKey(dayKey) {
        if (!dayKey || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
            return null;
        }

        const parts = dayKey.split("-");
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);
        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function getMonthKey(dayData) {
        const parsed = parseDayKey(dayData.dayKey);
        if (!parsed) {
            return "Unknown Month";
        }

        return parsed.toLocaleDateString([], {
            month: "long",
            year: "numeric"
        });
    }

    function getDisplayDayLabel(dayData) {
        const parsed = parseDayKey(dayData.dayKey);
        if (!parsed) {
            return dayData.fallbackDateLabel || "Unknown Date";
        }

        return parsed.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function normalizeFoodDescription(entry) {
        const candidates = [
            entry.description,
            entry.food,
            entry.name,
            entry.item,
            entry.title,
            entry.meal
        ];

        for (let i = 0; i < candidates.length; i += 1) {
            const value = candidates[i];
            if (value !== undefined && value !== null) {
                const trimmed = String(value).trim();
                if (trimmed) {
                    return trimmed;
                }
            }
        }

        return "Food entry";
    }

    function normalizeFoodNotes(entry) {
        const note = entry.note !== undefined ? entry.note : entry.notes;
        if (note === undefined || note === null) {
            return "";
        }

        return String(note).trim();
    }

    function normalizeFoodEntry(entry, parentEntry) {
        const source = entry && typeof entry === "object" ? entry : {};
        const parent = parentEntry && typeof parentEntry === "object" ? parentEntry : {};

        const parsedDate =
            parseDateFromHistoryEntry(source, parent.date, parent.time) ||
            parseDateFromHistoryEntry(parent);

        return {
            dayKey: toDayKey(parsedDate),
            fallbackDateLabel: source.date || parent.date || "",
            description: normalizeFoodDescription(source),
            calories: getNumberFromKeys(source, ["calories", "kcal"]),
            protein: getNumberFromKeys(source, ["protein", "proteinG", "protein_g"]),
            carbs: getNumberFromKeys(source, ["carbs", "carbohydrates", "carbohydrate", "carbsG", "carbohydratesG"]),
            fat: getNumberFromKeys(source, ["fat", "fatG", "fats"]),
            notes: normalizeFoodNotes(source)
        };
    }

    function extractFoodEntries(rawEntry) {
        if (!rawEntry || typeof rawEntry !== "object") {
            return [];
        }

        if (Array.isArray(rawEntry.foodEntries)) {
            return rawEntry.foodEntries.map(function (entry) {
                return normalizeFoodEntry(entry, rawEntry);
            });
        }

        if (Array.isArray(rawEntry.entries)) {
            return rawEntry.entries.map(function (entry) {
                return normalizeFoodEntry(entry, rawEntry);
            });
        }

        if (Array.isArray(rawEntry.foods)) {
            return rawEntry.foods.map(function (entry) {
                return normalizeFoodEntry(entry, rawEntry);
            });
        }

        return [normalizeFoodEntry(rawEntry, null)];
    }

    function buildNutritionDayHistory() {
        const rawHistory = Array.isArray(nutritionHistory) ? nutritionHistory : [];
        const dayMap = {};

        rawHistory.forEach(function (rawEntry, index) {
            const normalizedEntries = extractFoodEntries(rawEntry);
            normalizedEntries.forEach(function (entry, entryIndex) {
                const fallbackKey = "unknown-" + index + "-" + entryIndex;
                const dayKey = entry.dayKey || fallbackKey;

                if (!dayMap[dayKey]) {
                    dayMap[dayKey] = {
                        dayKey: dayKey,
                        fallbackDateLabel: entry.fallbackDateLabel || "",
                        entries: [],
                        totals: {
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0
                        }
                    };
                }

                dayMap[dayKey].entries.push(entry);
                dayMap[dayKey].totals.calories += getNumber(entry.calories);
                dayMap[dayKey].totals.protein += getNumber(entry.protein);
                dayMap[dayKey].totals.carbs += getNumber(entry.carbs);
                dayMap[dayKey].totals.fat += getNumber(entry.fat);

                if (!dayMap[dayKey].fallbackDateLabel && entry.fallbackDateLabel) {
                    dayMap[dayKey].fallbackDateLabel = entry.fallbackDateLabel;
                }
            });
        });

        return Object.keys(dayMap)
            .map(function (key) {
                return dayMap[key];
            })
            .sort(function (a, b) {
                const aDate = parseDayKey(a.dayKey);
                const bDate = parseDayKey(b.dayKey);

                if (aDate && bDate) {
                    return bDate.getTime() - aDate.getTime();
                }
                if (aDate && !bDate) {
                    return -1;
                }
                if (!aDate && bDate) {
                    return 1;
                }
                return a.dayKey < b.dayKey ? 1 : -1;
            });
    }

    function findNutritionDayByKey(dayKey) {
        return nutritionDays.find(function (day) {
            return day.dayKey === dayKey;
        }) || null;
    }

    function closeNutritionDayDetailModal() {
        if (nutritionDayDetailModal) {
            nutritionDayDetailModal.style.display = "none";
        }
        activeNutritionDayKey = null;
    }

    function renderNutritionDayDetail(dayData) {
        if (!nutritionDayDetailContent) {
            return;
        }

        const entryHtml = dayData.entries
            .map(function (entry) {
                const notesHtml = entry.notes
                    ? '<div class="nutrition-day-detail-notes"><span class="nutrition-day-detail-label">Notes</span><span>' + escapeHtml(entry.notes) + "</span></div>"
                    : "";

                return '<div class="nutrition-day-detail-entry">' +
                    '<div class="nutrition-day-detail-description">' + escapeHtml(entry.description) + "</div>" +
                    '<div class="nutrition-day-detail-macros">' +
                        '<span>' + escapeHtml(String(entry.calories)) + " kcal</span>" +
                        '<span>' + escapeHtml(String(entry.protein)) + " g P</span>" +
                        '<span>' + escapeHtml(String(entry.carbs)) + " g C</span>" +
                        '<span>' + escapeHtml(String(entry.fat)) + " g F</span>" +
                    "</div>" +
                    notesHtml +
                "</div>";
            })
            .join("");

        nutritionDayDetailContent.innerHTML =
            '<div class="nutrition-day-detail-date">' + escapeHtml(getDisplayDayLabel(dayData)) + "</div>" +
            '<div class="nutrition-day-detail-list">' + entryHtml + "</div>" +
            '<div class="nutrition-day-detail-totals">' +
                '<div class="nutrition-day-detail-totals-title">Daily Totals</div>' +
                '<div class="nutrition-day-detail-totals-grid">' +
                    '<span>' + escapeHtml(String(dayData.totals.calories)) + " kcal</span>" +
                    '<span>' + escapeHtml(String(dayData.totals.protein)) + " g Protein</span>" +
                    '<span>' + escapeHtml(String(dayData.totals.carbs)) + " g Carbohydrates</span>" +
                    '<span>' + escapeHtml(String(dayData.totals.fat)) + " g Fat</span>" +
                "</div>" +
            "</div>";
    }

    function openNutritionDayDetailModal(dayKey) {
        const dayData = findNutritionDayByKey(dayKey);
        if (!dayData || !nutritionDayDetailModal || !nutritionDayDetailContent) {
            return;
        }

        activeNutritionDayKey = dayKey;
        renderNutritionDayDetail(dayData);
        nutritionDayDetailModal.style.display = "flex";
    }

    function openNutritionLog() {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
            window.location.href = NUTRITION_LOG_URL;
            return;
        }

        window.open(NUTRITION_LOG_URL, "_blank", "noopener,noreferrer");
    }

    function renderTodaySummary() {
        nutritionToday = nutritionToday || {};

        const calories = getNumber(nutritionToday.calories);
        const protein = getNumber(nutritionToday.protein);
        const carbs = getNumber(nutritionToday.carbs);
        const fat = getNumber(nutritionToday.fat);

        if (nutritionCaloriesValue) {
            nutritionCaloriesValue.textContent = String(calories);
        }
        if (nutritionProteinValue) {
            nutritionProteinValue.textContent = protein + " g";
        }
        if (nutritionCarbsValue) {
            nutritionCarbsValue.textContent = carbs + " g";
        }
        if (nutritionFatValue) {
            nutritionFatValue.textContent = fat + " g";
        }
    }

    function renderHistoryFramework() {
        if (!nutritionHistoryDisplay) {
            return;
        }

        nutritionDays = buildNutritionDayHistory();

        if (nutritionDays.length === 0) {
            nutritionHistoryDisplay.innerHTML =
                "<p class=\"history-empty\">No nutrition entries yet.</p>";
            return;
        }

        nutritionHistoryDisplay.innerHTML = "";
        nutritionHistoryDisplay.classList.add("nutrition-history-list");

        const grouped = {};
        const orderedMonths = [];

        nutritionDays.forEach(function (dayData) {
            const monthKey = getMonthKey(dayData);
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
                orderedMonths.push(monthKey);
            }
            grouped[monthKey].push(dayData);
        });

        orderedMonths.forEach(function (monthKey) {
            const group = document.createElement("div");
            group.className = "nutrition-month-group";

            const header = document.createElement("div");
            header.className = "nutrition-month-header";
            header.textContent = monthKey;
            group.appendChild(header);

            grouped[monthKey].forEach(function (dayData) {
                const row = document.createElement("button");
                row.type = "button";
                row.className = "nutrition-history-row";
                row.setAttribute("data-day-key", dayData.dayKey);
                row.innerHTML =
                    '<span class="nutrition-history-main">' +
                        '<span class="nutrition-history-date">' + escapeHtml(getDisplayDayLabel(dayData)) + "</span>" +
                        '<span class="nutrition-history-totals">' +
                            escapeHtml(String(dayData.totals.calories)) + " kcal · " +
                            escapeHtml(String(dayData.totals.protein)) + "g P · " +
                            escapeHtml(String(dayData.totals.carbs)) + "g C" +
                        "</span>" +
                    "</span>" +
                    '<span class="nutrition-history-chevron" aria-hidden="true">&gt;</span>';
                group.appendChild(row);
            });

            nutritionHistoryDisplay.appendChild(group);
        });
    }

    function initNutritionCenter() {
        if (!nutritionCard) {
            return;
        }

        renderTodaySummary();
        renderHistoryFramework();

        if (nutritionHistorySection) {
            nutritionHistorySection.style.display = "none";
        }

        if (nutritionLogFoodButton) {
            nutritionLogFoodButton.addEventListener("click", openNutritionLog);
        }

        if (nutritionHistoryButton) {
            nutritionHistoryButton.textContent = "📊 History";
            nutritionHistoryButton.addEventListener("click", function () {
                if (!nutritionHistorySection) {
                    return;
                }

                if (nutritionHistorySection.style.display === "block") {
                    nutritionHistorySection.style.display = "none";
                    nutritionHistoryButton.textContent = "📊 History";
                    return;
                }

                renderHistoryFramework();
                nutritionHistorySection.style.display = "block";
                nutritionHistoryButton.textContent = "📊 Hide History";

                if (typeof window.scrollMedicationCenterTo === "function") {
                    window.scrollMedicationCenterTo(nutritionHistorySection);
                }
            });
        }

        if (nutritionHistoryDisplay) {
            nutritionHistoryDisplay.addEventListener("click", function (event) {
                const row = event.target.closest(".nutrition-history-row");
                if (!row) {
                    return;
                }

                const dayKey = row.getAttribute("data-day-key");
                if (!dayKey) {
                    return;
                }

                row.classList.add("is-tapped");
                window.setTimeout(function () {
                    row.classList.remove("is-tapped");
                    openNutritionDayDetailModal(dayKey);
                }, 120);
            });
        }

        if (nutritionDayDetailCloseBtn) {
            nutritionDayDetailCloseBtn.addEventListener("click", function () {
                closeNutritionDayDetailModal();
            });
        }
    }

    window.initNutritionCenter = initNutritionCenter;
})();
