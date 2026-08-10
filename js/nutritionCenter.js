// =====================================
// John's Assistant
// nutritionCenter.js
// =====================================

(function () {
    const nutritionCard = document.getElementById("nutritionCard");
    const nutritionCaloriesValue = document.getElementById("nutritionCaloriesValue");
    const nutritionProteinValue = document.getElementById("nutritionProteinValue");
    const nutritionCarbsValue = document.getElementById("nutritionCarbsValue");
    const nutritionFatValue = document.getElementById("nutritionFatValue");

    const nutritionLogFoodButton = document.getElementById("nutritionLogFoodButton");
    const nutritionHistoryButton = document.getElementById("nutritionHistoryButton");
    const nutritionGoalsReferenceButton = document.getElementById("nutritionGoalsReferenceButton");
    const nutritionHistorySection = document.getElementById("nutritionHistorySection");
    const nutritionHistoryDisplay = document.getElementById("nutritionHistoryDisplay");
    const nutritionGoalsReferenceSection = document.getElementById("nutritionGoalsReferenceSection");
    const nutritionGoalsReferenceContent = document.getElementById("nutritionGoalsReferenceContent");
    const nutritionLogModal = document.getElementById("nutritionLogModal");
    const nutritionLogModalContent = nutritionLogModal ? nutritionLogModal.querySelector(".modal-content") : null;
    const nutritionDescriptionInput = document.getElementById("nutritionDescriptionInput");
    const nutritionMealInput = document.getElementById("nutritionMealInput");
    const nutritionCaloriesInput = document.getElementById("nutritionCaloriesInput");
    const nutritionProteinInput = document.getElementById("nutritionProteinInput");
    const nutritionCarbsInput = document.getElementById("nutritionCarbsInput");
    const nutritionFatInput = document.getElementById("nutritionFatInput");
    const nutritionDateInput = document.getElementById("nutritionDateInput");
    const nutritionNoteInput = document.getElementById("nutritionNoteInput");
    const saveNutritionBtn = document.getElementById("saveNutritionBtn");
    const cancelNutritionBtn = document.getElementById("cancelNutritionBtn");
    const nutritionDailyGoalsModal = document.getElementById("nutritionDailyGoalsModal");
    const nutritionDailyGoalsModalContent = nutritionDailyGoalsModal
        ? nutritionDailyGoalsModal.querySelector(".modal-content")
        : null;
    const nutritionDailyGoalsEditor = document.getElementById("nutritionDailyGoalsEditor");
    const saveNutritionDailyGoalsBtn = document.getElementById("saveNutritionDailyGoalsBtn");
    const cancelNutritionDailyGoalsBtn = document.getElementById("cancelNutritionDailyGoalsBtn");
    const nutritionWeightLossPlanModal = document.getElementById("nutritionWeightLossPlanModal");
    const nutritionWeightLossPlanModalContent = nutritionWeightLossPlanModal
        ? nutritionWeightLossPlanModal.querySelector(".modal-content")
        : null;
    const nutritionWeightLossPlanEditor = document.getElementById("nutritionWeightLossPlanEditor");
    const saveNutritionWeightLossPlanBtn = document.getElementById("saveNutritionWeightLossPlanBtn");
    const cancelNutritionWeightLossPlanBtn = document.getElementById("cancelNutritionWeightLossPlanBtn");
    const nutritionDayDetailModal = document.getElementById("nutritionDayDetailModal");
    const nutritionDayDetailModalContent = nutritionDayDetailModal ? nutritionDayDetailModal.querySelector(".modal-content") : null;
    const nutritionDayDetailContent = document.getElementById("nutritionDayDetailContent");
    const nutritionDayDetailTitle = document.getElementById("nutritionDayDetailTitle");
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
    let lockedScrollTop = 0;
    let nutritionModalLockCount = 0;
    let nutritionGoalsLiveMetricsSnapshot = "";
    let nutritionGoalsLiveRefreshTimer = null;

    const nutritionGoalsReferenceStorageKey = "nutritionGoalsReference";
    const nutritionGoalsReferenceSchema = {
        dailyGoals: [
            {
                key: "calories",
                label: "Calories",
                target: null,
                unit: "Kcal/day",
                established: false
            },
            {
                key: "protein",
                label: "Protein",
                target: null,
                unit: "g/day",
                established: false
            },
            {
                key: "carbohydrates",
                label: "Carbohydrates",
                target: null,
                unit: "",
                established: false
            },
            {
                key: "fat",
                label: "Fat",
                target: null,
                unit: "",
                established: false
            },
            {
                key: "fiber",
                label: "Fiber",
                target: null,
                unit: "",
                established: false
            },
            {
                key: "sodium",
                label: "Sodium",
                target: null,
                unit: "",
                established: false
            }
        ],
        weightReference: {
            milestones: [
                {
                    key: "leaveObesity",
                    label: "Leave Obesity",
                    weightLb: null,
                    bmi: ""
                },
                {
                    key: "bmiUnder29",
                    label: "BMI under 29",
                    weightLb: null,
                    bmi: ""
                },
                {
                    key: "bmiUnder28",
                    label: "BMI under 28",
                    weightLb: null,
                    bmi: ""
                },
                {
                    key: "bmiUnder27",
                    label: "BMI under 27",
                    weightLb: null,
                    bmi: ""
                },
                {
                    key: "bmiUnder26",
                    label: "BMI under 26",
                    weightLb: null,
                    bmi: ""
                },
                {
                    key: "healthyWeight",
                    label: "Healthy Weight",
                    weightLb: null,
                    bmi: ""
                }
            ],
            expectedRate: "",
            primaryGoal: "",
            monthlyPlanTargets: []
        }
    };

    const recognizedDailyGoalKeys = new Set(
        nutritionGoalsReferenceSchema.dailyGoals.map(function (goal) {
            return goal.key;
        })
    );

    const editableDailyGoalKeys = nutritionGoalsReferenceSchema.dailyGoals.map(function (goal) {
        return goal.key;
    });

    const editableWeightPlanRows = [
        "Today",
        "1 Week",
        "1 Month",
        "2 Months",
        "3 Months",
        "6 Months"
    ];

    function getNumberOrNull(value) {
        if (value === undefined || value === null || value === "") {
            return null;
        }

        const num = Number(value);
        return Number.isFinite(num) ? num : null;
    }

    function getTrimmedTextOrEmpty(value) {
        if (value === undefined || value === null) {
            return "";
        }

        return String(value).trim();
    }

    function normalizeNutritionGoalsReference(rawGoals) {
        const source = rawGoals && typeof rawGoals === "object" ? rawGoals : {};
        const sourceDailyGoals = Array.isArray(source.dailyGoals) ? source.dailyGoals : [];
        const sourceWeightReference = source.weightReference && typeof source.weightReference === "object"
            ? source.weightReference
            : {};
        const sourceMilestones = Array.isArray(sourceWeightReference.milestones)
            ? sourceWeightReference.milestones
            : [];
        const sourceMonthlyPlanTargets = Array.isArray(sourceWeightReference.monthlyPlanTargets)
            ? sourceWeightReference.monthlyPlanTargets
            : [];

        const normalizedDailyGoals = nutritionGoalsReferenceSchema.dailyGoals.map(function (schemaGoal) {
            const sourceGoal = sourceDailyGoals.find(function (item) {
                return item && item.key === schemaGoal.key;
            }) || {};

            const parsedTarget = getNumberOrNull(sourceGoal.target);
            const hasEstablishedFlag = Object.prototype.hasOwnProperty.call(sourceGoal, "established");
            const isLegacyEstablishedGoal = !hasEstablishedFlag && parsedTarget !== null && parsedTarget > 0;
            const established = (Boolean(sourceGoal.established) && parsedTarget !== null) || isLegacyEstablishedGoal;

            return {
                key: schemaGoal.key,
                label: schemaGoal.label,
                target: parsedTarget,
                unit: schemaGoal.unit,
                established: established
            };
        });

        const normalizedMilestones = nutritionGoalsReferenceSchema.weightReference.milestones.map(function (schemaMilestone) {
            const sourceMilestone = sourceMilestones.find(function (item) {
                return item && (item.key === schemaMilestone.key || item.label === schemaMilestone.label);
            }) || {};
            const sourceLabel = getTrimmedTextOrEmpty(sourceMilestone.label);

            return {
                key: schemaMilestone.key,
                label: sourceLabel || schemaMilestone.label,
                weightLb: getNumberOrNull(sourceMilestone.weightLb),
                bmi: getTrimmedTextOrEmpty(sourceMilestone.bmi)
            };
        });

        const normalizedMonthlyPlanTargets = sourceMonthlyPlanTargets
            .map(function (row) {
                if (!row || typeof row !== "object") {
                    return null;
                }

                const timeLabel = getTrimmedTextOrEmpty(row.timeLabel);
                if (!timeLabel) {
                    return null;
                }

                return {
                    timeLabel: timeLabel,
                    expectedWeightMinLb: getNumberOrNull(row.expectedWeightMinLb),
                    expectedWeightMaxLb: getNumberOrNull(row.expectedWeightMaxLb),
                    estimatedBmiMin: getNumberOrNull(row.estimatedBmiMin),
                    estimatedBmiMax: getNumberOrNull(row.estimatedBmiMax),
                    expectedLossMinLb: getNumberOrNull(row.expectedLossMinLb),
                    expectedLossMaxLb: getNumberOrNull(row.expectedLossMaxLb)
                };
            })
            .filter(function (row) {
                return Boolean(row);
            });

        return {
            dailyGoals: normalizedDailyGoals,
            weightReference: {
                milestones: normalizedMilestones,
                expectedRate: getTrimmedTextOrEmpty(sourceWeightReference.expectedRate),
                primaryGoal: getTrimmedTextOrEmpty(sourceWeightReference.primaryGoal),
                monthlyPlanTargets: normalizedMonthlyPlanTargets
            }
        };
    }

    function cloneStorageValue(value) {
        if (value === undefined) {
            return undefined;
        }

        return JSON.parse(JSON.stringify(value));
    }

    function applyNutritionGoalsSafeMigrations(rawGoals) {
        if (!rawGoals || typeof rawGoals !== "object") {
            return {
                migratedGoals: rawGoals,
                positiveLegacyUpgradePerformed: false
            };
        }

        const migratedGoals = cloneStorageValue(rawGoals);
        let positiveLegacyUpgradePerformed = false;

        if (Array.isArray(migratedGoals.dailyGoals)) {
            migratedGoals.dailyGoals.forEach(function (goal) {
                if (!goal || typeof goal !== "object") {
                    return;
                }

                const key = getTrimmedTextOrEmpty(goal.key);
                if (!recognizedDailyGoalKeys.has(key)) {
                    return;
                }

                const parsedTarget = getNumberOrNull(goal.target);
                const hasEstablishedFlag = Object.prototype.hasOwnProperty.call(goal, "established");
                const shouldUpgradeLegacyGoal = !hasEstablishedFlag && parsedTarget !== null && parsedTarget > 0;

                if (shouldUpgradeLegacyGoal) {
                    goal.established = true;
                    positiveLegacyUpgradePerformed = true;
                }
            });
        }

        return {
            migratedGoals: migratedGoals,
            positiveLegacyUpgradePerformed: positiveLegacyUpgradePerformed
        };
    }

    function loadNutritionGoalsReferenceForRuntime() {
        const loadedGoals = loadData(nutritionGoalsReferenceStorageKey, null);
        const migrationResult = applyNutritionGoalsSafeMigrations(loadedGoals);

        if (migrationResult.positiveLegacyUpgradePerformed) {
            saveData(nutritionGoalsReferenceStorageKey, migrationResult.migratedGoals);
        }

        return normalizeNutritionGoalsReference(
            migrationResult.positiveLegacyUpgradePerformed
                ? migrationResult.migratedGoals
                : loadedGoals
        );
    }

    let nutritionGoalsReferenceConfig = loadNutritionGoalsReferenceForRuntime();
    window.nutritionGoalsReferenceConfig = nutritionGoalsReferenceConfig;

    function refreshNutritionGoalsReferenceConfig() {
        nutritionGoalsReferenceConfig = loadNutritionGoalsReferenceForRuntime();
        window.nutritionGoalsReferenceConfig = nutritionGoalsReferenceConfig;
    }

    function getNumber(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    }

    function getDailyGoalByKey(goalKey) {
        if (!nutritionGoalsReferenceConfig || !Array.isArray(nutritionGoalsReferenceConfig.dailyGoals)) {
            return null;
        }

        return nutritionGoalsReferenceConfig.dailyGoals.find(function (goal) {
            return goal && goal.key === goalKey;
        }) || null;
    }

    function formatNutritionValue(value) {
        return String(roundNutritionValue(getNumber(value)));
    }

    function getGoalDisplayUnit(goal, fallbackUnit) {
        const raw = getTrimmedTextOrEmpty(goal && goal.unit);
        if (raw) {
            return raw.replace(/\s*\/\s*day\s*$/i, "");
        }

        return fallbackUnit;
    }

    function formatActualGoalOrUnset(actualValue, goalKey, fallbackUnit) {
        const goal = getDailyGoalByKey(goalKey);
        const actualText = formatNutritionValue(actualValue);

        if (goal && goal.established && goal.target !== null) {
            const goalUnit = getGoalDisplayUnit(goal, fallbackUnit);
            return actualText + " / " + goal.target.toLocaleString() + " " + goalUnit;
        }

        return actualText + " " + fallbackUnit + " (Goal not set)";
    }

    function getCurrentDateInputValue() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return now.getFullYear() + "-" + month + "-" + day;
    }

    function getCurrentTimeValue() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return hours + ":" + minutes;
    }

    function getTodayDayKey() {
        return toDayKey(new Date());
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

    function normalizeFoodMeal(entry) {
        const meal = entry.meal !== undefined ? entry.meal : entry.mealCategory;
        if (meal === undefined || meal === null) {
            return "";
        }

        const trimmed = String(meal).trim();
        if (!trimmed || trimmed.toLowerCase() === "none") {
            return "";
        }

        return trimmed;
    }

    function roundNutritionValue(value) {
        const rounded = Math.round(value * 10) / 10;
        return Number.isInteger(rounded) ? rounded : rounded;
    }

    function normalizeSavedNutritionHistory(rawHistory) {
        if (!Array.isArray(rawHistory)) {
            return [];
        }

        return rawHistory
            .map(function (entry) {
                const normalizedEntry = normalizeFoodEntry(entry, null);
                if (!normalizedEntry.description || !normalizedEntry.dayKey) {
                    return null;
                }

                const savedEntry = {
                    description: normalizedEntry.description,
                    calories: roundNutritionValue(normalizedEntry.calories),
                    protein: roundNutritionValue(normalizedEntry.protein),
                    carbs: roundNutritionValue(normalizedEntry.carbs),
                    fat: roundNutritionValue(normalizedEntry.fat),
                    date: normalizedEntry.dayKey,
                    time: entry && entry.time ? String(entry.time) : ""
                };

                if (normalizedEntry.notes) {
                    savedEntry.note = normalizedEntry.notes;
                }

                if (normalizedEntry.meal) {
                    savedEntry.meal = normalizedEntry.meal;
                }

                return savedEntry;
            })
            .filter(function (entry) {
                return !!entry;
            });
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
            meal: normalizeFoodMeal(source),
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

    function rebuildNutritionTodayFromHistory() {
        const todayKey = getTodayDayKey();
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        nutritionHistory.forEach(function (entry) {
            const normalizedEntry = normalizeFoodEntry(entry, null);
            if (normalizedEntry.dayKey !== todayKey) {
                return;
            }

            totals.calories += getNumber(normalizedEntry.calories);
            totals.protein += getNumber(normalizedEntry.protein);
            totals.carbs += getNumber(normalizedEntry.carbs);
            totals.fat += getNumber(normalizedEntry.fat);
        });

        nutritionToday = {
            calories: roundNutritionValue(totals.calories),
            protein: roundNutritionValue(totals.protein),
            carbs: roundNutritionValue(totals.carbs),
            fat: roundNutritionValue(totals.fat)
        };
    }

    function saveNutritionData() {
        saveData("nutritionHistory", nutritionHistory);
        saveData("nutritionToday", nutritionToday);
    }

    function refreshNutritionData() {
        nutritionHistory = normalizeSavedNutritionHistory(loadData("nutritionHistory", nutritionHistory));
        rebuildNutritionTodayFromHistory();
        saveNutritionData();
        renderTodaySummary();

        if (nutritionHistorySection && nutritionHistorySection.style.display === "block") {
            renderHistoryFramework();
        }

        if (nutritionGoalsReferenceSection && nutritionGoalsReferenceSection.style.display === "block") {
            renderNutritionGoalsReference();
        }
    }

    function formatGoalValue(goal) {
        if (!goal.established) {
            return "Goal to be added later";
        }

        return goal.target.toLocaleString() + " " + goal.unit;
    }

    function formatWeightValue(weightLb) {
        if (weightLb === null || weightLb === undefined) {
            return "--";
        }

        return String(weightLb) + " lb";
    }

    function getSchemaDailyGoalByKey(goalKey) {
        return nutritionGoalsReferenceSchema.dailyGoals.find(function (goal) {
            return goal && goal.key === goalKey;
        }) || null;
    }

    function getEditableDailyGoalByKey(goalKey) {
        return nutritionGoalsReferenceConfig.dailyGoals.find(function (goal) {
            return goal && goal.key === goalKey;
        }) || null;
    }

    function formatEditorTargetValue(goal) {
        if (!goal || goal.target === null || goal.target === undefined) {
            return "";
        }

        if (!goal.established && Number(goal.target) <= 0) {
            return "";
        }

        return String(goal.target);
    }

    function getMilestoneByKey(goalKey) {
        if (!nutritionGoalsReferenceConfig || !nutritionGoalsReferenceConfig.weightReference) {
            return null;
        }

        const milestones = Array.isArray(nutritionGoalsReferenceConfig.weightReference.milestones)
            ? nutritionGoalsReferenceConfig.weightReference.milestones
            : [];

        return milestones.find(function (milestone) {
            return milestone && milestone.key === goalKey;
        }) || null;
    }

    function normalizeEditorNumberText(value) {
        const num = getNumberOrNull(value);
        return num === null ? "" : String(num);
    }

    function normalizeTimeLabelForCompare(value) {
        return getTrimmedTextOrEmpty(value).toLowerCase();
    }

    function getMonthlyPlanRowForEditor(rowLabel, rowIndex) {
        const monthlyPlanTargets = Array.isArray(nutritionGoalsReferenceConfig.weightReference.monthlyPlanTargets)
            ? nutritionGoalsReferenceConfig.weightReference.monthlyPlanTargets
            : [];
        const normalizedLabel = normalizeTimeLabelForCompare(rowLabel);

        const byLabel = monthlyPlanTargets.find(function (row) {
            return row && normalizeTimeLabelForCompare(row.timeLabel) === normalizedLabel;
        });
        if (byLabel) {
            return byLabel;
        }

        const byIndex = monthlyPlanTargets[rowIndex];
        if (byIndex && typeof byIndex === "object") {
            return byIndex;
        }

        return null;
    }

    function renderWeightLossPlanEditor() {
        if (!nutritionWeightLossPlanEditor) {
            return;
        }

        const expectedRateValue = getTrimmedTextOrEmpty(nutritionGoalsReferenceConfig.weightReference.expectedRate);
        const primaryGoalValue = getTrimmedTextOrEmpty(nutritionGoalsReferenceConfig.weightReference.primaryGoal);

        const milestoneRowsHtml = nutritionGoalsReferenceSchema.weightReference.milestones.map(function (schemaMilestone) {
            const milestone = getMilestoneByKey(schemaMilestone.key) || schemaMilestone;
            const isActive = milestone.weightLb !== null || getTrimmedTextOrEmpty(milestone.bmi) !== "";
            const toggleId = "nutritionWeightPlanMilestoneSet_" + schemaMilestone.key;
            const labelId = "nutritionWeightPlanMilestoneLabel_" + schemaMilestone.key;
            const weightId = "nutritionWeightPlanMilestoneWeight_" + schemaMilestone.key;
            const bmiId = "nutritionWeightPlanMilestoneBmi_" + schemaMilestone.key;

            return '<div class="nutrition-weight-plan-milestone-row" data-milestone-key="' + escapeHtml(schemaMilestone.key) + '">' +
                '<div class="nutrition-weight-plan-row-header">' +
                    '<label class="nutrition-weight-plan-toggle" for="' + escapeHtml(toggleId) + '">' +
                        '<input id="' + escapeHtml(toggleId) + '" class="nutrition-weight-plan-milestone-toggle" type="checkbox"' + (isActive ? " checked" : "") + '>' +
                        '<span>Set milestone</span>' +
                    '</label>' +
                '</div>' +
                '<div class="nutrition-weight-plan-grid nutrition-weight-plan-grid-3">' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(labelId) + '">Milestone Name</label>' +
                        '<input id="' + escapeHtml(labelId) + '" class="nutrition-weight-plan-milestone-label" type="text" value="' + escapeHtml(getTrimmedTextOrEmpty(milestone.label) || schemaMilestone.label) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(weightId) + '">Target Weight (lb)</label>' +
                        '<input id="' + escapeHtml(weightId) + '" class="nutrition-weight-plan-milestone-weight" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(milestone.weightLb)) + '"' + (isActive ? "" : " disabled") + '>' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(bmiId) + '">Target BMI</label>' +
                        '<input id="' + escapeHtml(bmiId) + '" class="nutrition-weight-plan-milestone-bmi" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(getTrimmedTextOrEmpty(milestone.bmi)) + '"' + (isActive ? "" : " disabled") + '>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join("");

        const planRowsHtml = editableWeightPlanRows.map(function (rowLabel, index) {
            const row = getMonthlyPlanRowForEditor(rowLabel, index) || {};
            const rowId = "nutritionWeightPlanRow_" + String(index);

            return '<div class="nutrition-weight-plan-time-row" data-plan-row-index="' + escapeHtml(String(index)) + '">' +
                '<div class="nutrition-weight-plan-grid nutrition-weight-plan-grid-7">' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_label') + '">Time Label</label>' +
                        '<input id="' + escapeHtml(rowId + '_label') + '" class="nutrition-weight-plan-row-time" type="text" value="' + escapeHtml(getTrimmedTextOrEmpty(row.timeLabel) || rowLabel) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_wmin') + '">Weight Min</label>' +
                        '<input id="' + escapeHtml(rowId + '_wmin') + '" class="nutrition-weight-plan-row-wmin" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.expectedWeightMinLb)) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_wmax') + '">Weight Max</label>' +
                        '<input id="' + escapeHtml(rowId + '_wmax') + '" class="nutrition-weight-plan-row-wmax" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.expectedWeightMaxLb)) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_bmin') + '">BMI Min</label>' +
                        '<input id="' + escapeHtml(rowId + '_bmin') + '" class="nutrition-weight-plan-row-bmin" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.estimatedBmiMin)) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_bmax') + '">BMI Max</label>' +
                        '<input id="' + escapeHtml(rowId + '_bmax') + '" class="nutrition-weight-plan-row-bmax" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.estimatedBmiMax)) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_lmin') + '">Loss Min</label>' +
                        '<input id="' + escapeHtml(rowId + '_lmin') + '" class="nutrition-weight-plan-row-lmin" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.expectedLossMinLb)) + '">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="' + escapeHtml(rowId + '_lmax') + '">Loss Max</label>' +
                        '<input id="' + escapeHtml(rowId + '_lmax') + '" class="nutrition-weight-plan-row-lmax" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(normalizeEditorNumberText(row.expectedLossMaxLb)) + '">' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join("");

        nutritionWeightLossPlanEditor.innerHTML =
            '<section class="nutrition-weight-plan-section">' +
                '<h3>Plan Information</h3>' +
                '<div class="nutrition-weight-plan-grid nutrition-weight-plan-grid-2">' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="nutritionWeightPlanExpectedRateInput">Expected Rate</label>' +
                        '<input id="nutritionWeightPlanExpectedRateInput" type="text" value="' + escapeHtml(expectedRateValue) + '" placeholder="Enter expected rate">' +
                    '</div>' +
                    '<div class="nutrition-weight-plan-field">' +
                        '<label for="nutritionWeightPlanPrimaryGoalInput">Primary Goal</label>' +
                        '<input id="nutritionWeightPlanPrimaryGoalInput" type="text" value="' + escapeHtml(primaryGoalValue) + '" placeholder="Describe your goal">' +
                    '</div>' +
                '</div>' +
            '</section>' +
            '<section class="nutrition-weight-plan-section">' +
                '<h3>BMI Milestones</h3>' +
                '<div class="nutrition-weight-plan-list">' + milestoneRowsHtml + '</div>' +
            '</section>' +
            '<section class="nutrition-weight-plan-section">' +
                '<h3>Time-Based Weight-Loss Plan</h3>' +
                '<div class="nutrition-weight-plan-list">' + planRowsHtml + '</div>' +
            '</section>';
    }

    function openNutritionWeightLossPlanModal() {
        if (!nutritionWeightLossPlanModal) {
            return;
        }

        refreshNutritionGoalsReferenceConfig();
        renderWeightLossPlanEditor();

        nutritionWeightLossPlanModal.style.display = "flex";
        lockNutritionModalBackgroundScroll();

        if (nutritionWeightLossPlanModalContent) {
            nutritionWeightLossPlanModalContent.scrollTop = 0;
        }
    }

    function closeNutritionWeightLossPlanModal() {
        if (!nutritionWeightLossPlanModal) {
            return;
        }

        nutritionWeightLossPlanModal.style.display = "none";
        unlockNutritionModalBackgroundScroll();
    }

    function collectAndValidateWeightLossPlanUpdates() {
        if (!nutritionWeightLossPlanEditor) {
            return null;
        }

        const expectedRateInput = document.getElementById("nutritionWeightPlanExpectedRateInput");
        const primaryGoalInput = document.getElementById("nutritionWeightPlanPrimaryGoalInput");
        const expectedRate = getTrimmedTextOrEmpty(expectedRateInput ? expectedRateInput.value : "");
        const primaryGoal = getTrimmedTextOrEmpty(primaryGoalInput ? primaryGoalInput.value : "");

        const validationErrors = [];

        const milestoneRows = Array.from(
            nutritionWeightLossPlanEditor.querySelectorAll(".nutrition-weight-plan-milestone-row")
        );
        const milestones = milestoneRows.map(function (row) {
            const milestoneKey = getTrimmedTextOrEmpty(row.getAttribute("data-milestone-key"));
            const toggle = row.querySelector(".nutrition-weight-plan-milestone-toggle");
            const labelInput = row.querySelector(".nutrition-weight-plan-milestone-label");
            const weightInput = row.querySelector(".nutrition-weight-plan-milestone-weight");
            const bmiInput = row.querySelector(".nutrition-weight-plan-milestone-bmi");
            const schemaMilestone = nutritionGoalsReferenceSchema.weightReference.milestones.find(function (item) {
                return item && item.key === milestoneKey;
            }) || {
                key: milestoneKey,
                label: milestoneKey
            };

            const isActive = Boolean(toggle && toggle.checked);
            const labelValue = getTrimmedTextOrEmpty(labelInput ? labelInput.value : "") || schemaMilestone.label;

            if (!isActive) {
                return {
                    key: schemaMilestone.key,
                    label: labelValue,
                    weightLb: null,
                    bmi: ""
                };
            }

            const rawWeight = getTrimmedTextOrEmpty(weightInput ? weightInput.value : "");
            const rawBmi = getTrimmedTextOrEmpty(bmiInput ? bmiInput.value : "");
            const parsedWeight = getNumberOrNull(rawWeight);
            const parsedBmi = getNumberOrNull(rawBmi);

            if (!labelValue) {
                validationErrors.push("Milestone name is required for active milestones.");
            }

            if (parsedWeight === null || parsedWeight <= 0) {
                validationErrors.push(labelValue + ": target weight must be a number greater than zero.");
            }

            if (parsedBmi === null || parsedBmi <= 0) {
                validationErrors.push(labelValue + ": target BMI must be a number greater than zero.");
            }

            return {
                key: schemaMilestone.key,
                label: labelValue,
                weightLb: parsedWeight,
                bmi: parsedBmi === null ? "" : String(parsedBmi)
            };
        });

        const planRows = Array.from(
            nutritionWeightLossPlanEditor.querySelectorAll(".nutrition-weight-plan-time-row")
        );
        const monthlyPlanTargets = planRows.map(function (row) {
            const labelInput = row.querySelector(".nutrition-weight-plan-row-time");
            const wMinInput = row.querySelector(".nutrition-weight-plan-row-wmin");
            const wMaxInput = row.querySelector(".nutrition-weight-plan-row-wmax");
            const bMinInput = row.querySelector(".nutrition-weight-plan-row-bmin");
            const bMaxInput = row.querySelector(".nutrition-weight-plan-row-bmax");
            const lMinInput = row.querySelector(".nutrition-weight-plan-row-lmin");
            const lMaxInput = row.querySelector(".nutrition-weight-plan-row-lmax");

            const timeLabel = getTrimmedTextOrEmpty(labelInput ? labelInput.value : "");
            const expectedWeightMinLb = getNumberOrNull(wMinInput ? wMinInput.value : "");
            const expectedWeightMaxLb = getNumberOrNull(wMaxInput ? wMaxInput.value : "");
            const estimatedBmiMin = getNumberOrNull(bMinInput ? bMinInput.value : "");
            const estimatedBmiMax = getNumberOrNull(bMaxInput ? bMaxInput.value : "");
            const expectedLossMinLb = getNumberOrNull(lMinInput ? lMinInput.value : "");
            const expectedLossMaxLb = getNumberOrNull(lMaxInput ? lMaxInput.value : "");

            if (!timeLabel) {
                validationErrors.push("Each plan row needs a time label.");
            }

            if (expectedWeightMinLb === null || expectedWeightMaxLb === null) {
                validationErrors.push((timeLabel || "Plan row") + ": weight min and max are required numeric values.");
            }

            if (estimatedBmiMin === null || estimatedBmiMax === null) {
                validationErrors.push((timeLabel || "Plan row") + ": BMI min and max are required numeric values.");
            }

            if (expectedLossMinLb === null || expectedLossMaxLb === null) {
                validationErrors.push((timeLabel || "Plan row") + ": loss min and max are required numeric values.");
            }

            return {
                timeLabel: timeLabel,
                expectedWeightMinLb: expectedWeightMinLb,
                expectedWeightMaxLb: expectedWeightMaxLb,
                estimatedBmiMin: estimatedBmiMin,
                estimatedBmiMax: estimatedBmiMax,
                expectedLossMinLb: expectedLossMinLb,
                expectedLossMaxLb: expectedLossMaxLb
            };
        });

        if (validationErrors.length > 0) {
            alert(validationErrors.join("\n"));
            return null;
        }

        return {
            expectedRate: expectedRate,
            primaryGoal: primaryGoal,
            milestones: milestones,
            monthlyPlanTargets: monthlyPlanTargets
        };
    }

    function saveNutritionWeightLossPlan() {
        const updates = collectAndValidateWeightLossPlanUpdates();
        if (!updates) {
            return;
        }

        const loadedGoals = loadData(nutritionGoalsReferenceStorageKey, null);
        const writableGoals = (loadedGoals && typeof loadedGoals === "object")
            ? cloneStorageValue(loadedGoals)
            : {};
        const writableWeightReference = (writableGoals.weightReference && typeof writableGoals.weightReference === "object")
            ? writableGoals.weightReference
            : {};

        writableWeightReference.expectedRate = updates.expectedRate;
        writableWeightReference.primaryGoal = updates.primaryGoal;
        writableWeightReference.milestones = updates.milestones;
        writableWeightReference.monthlyPlanTargets = updates.monthlyPlanTargets;
        writableGoals.weightReference = writableWeightReference;

        saveData(nutritionGoalsReferenceStorageKey, writableGoals);
        refreshNutritionGoalsReferenceConfig();
        renderNutritionGoalsReference();
        closeNutritionWeightLossPlanModal();
    }

    function renderNutritionDailyGoalsEditor() {
        if (!nutritionDailyGoalsEditor) {
            return;
        }

        const rowHtml = editableDailyGoalKeys.map(function (goalKey) {
            const goal = getEditableDailyGoalByKey(goalKey);
            if (!goal) {
                return "";
            }

            const targetText = formatEditorTargetValue(goal);
            const checkboxId = "nutritionGoalSet_" + goal.key;
            const inputId = "nutritionGoalTarget_" + goal.key;
            const unitText = getTrimmedTextOrEmpty(goal.unit) || "Unit not set";

            return '<div class="nutrition-daily-goal-editor-row" data-daily-goal-key="' + escapeHtml(goal.key) + '">' +
                '<div class="nutrition-daily-goal-editor-header">' + escapeHtml(goal.label) + "</div>" +
                '<label class="nutrition-daily-goal-set-label" for="' + escapeHtml(checkboxId) + '">' +
                    '<input id="' + escapeHtml(checkboxId) + '" class="nutrition-daily-goal-set-toggle" type="checkbox"' + (goal.established ? " checked" : "") + ">" +
                    "<span>Set Goal</span>" +
                "</label>" +
                '<div class="nutrition-daily-goal-input-row">' +
                    '<input id="' + escapeHtml(inputId) + '" class="nutrition-daily-goal-target-input" type="number" min="0" step="0.1" inputmode="decimal" value="' + escapeHtml(targetText) + '"' + (goal.established ? "" : " disabled") + ">" +
                    '<span class="nutrition-daily-goal-unit">' + escapeHtml(unitText) + "</span>" +
                "</div>" +
            "</div>";
        }).join("");

        nutritionDailyGoalsEditor.innerHTML = rowHtml;
    }

    function openNutritionDailyGoalsModal() {
        if (!nutritionDailyGoalsModal) {
            return;
        }

        refreshNutritionGoalsReferenceConfig();
        renderNutritionDailyGoalsEditor();

        nutritionDailyGoalsModal.style.display = "flex";
        lockNutritionModalBackgroundScroll();

        if (nutritionDailyGoalsModalContent) {
            nutritionDailyGoalsModalContent.scrollTop = 0;
        }
    }

    function closeNutritionDailyGoalsModal() {
        if (!nutritionDailyGoalsModal) {
            return;
        }

        nutritionDailyGoalsModal.style.display = "none";
        unlockNutritionModalBackgroundScroll();
    }

    function collectAndValidateDailyGoalUpdates() {
        if (!nutritionDailyGoalsEditor) {
            return null;
        }

        const rows = nutritionDailyGoalsEditor.querySelectorAll(".nutrition-daily-goal-editor-row");
        const updates = [];
        const validationErrors = [];

        rows.forEach(function (row) {
            const goalKey = row.getAttribute("data-daily-goal-key") || "";
            const schemaGoal = getSchemaDailyGoalByKey(goalKey);
            if (!schemaGoal) {
                return;
            }

            const toggle = row.querySelector(".nutrition-daily-goal-set-toggle");
            const input = row.querySelector(".nutrition-daily-goal-target-input");
            const isEstablished = Boolean(toggle && toggle.checked);

            if (isEstablished) {
                const rawValue = input ? input.value.trim() : "";
                if (!rawValue) {
                    validationErrors.push(schemaGoal.label + ": enter a target greater than zero.");
                    return;
                }

                const parsedValue = Number(rawValue);
                if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
                    validationErrors.push(schemaGoal.label + ": target must be a valid number greater than zero.");
                    return;
                }

                updates.push({
                    key: schemaGoal.key,
                    label: schemaGoal.label,
                    unit: schemaGoal.unit,
                    established: true,
                    target: parsedValue
                });
                return;
            }

            updates.push({
                key: schemaGoal.key,
                label: schemaGoal.label,
                unit: schemaGoal.unit,
                established: false
            });
        });

        if (validationErrors.length > 0) {
            alert(validationErrors.join("\n"));
            return null;
        }

        return updates;
    }

    function saveNutritionDailyGoals() {
        const updates = collectAndValidateDailyGoalUpdates();
        if (!updates) {
            return;
        }

        const loadedGoals = loadData(nutritionGoalsReferenceStorageKey, null);
        const writableGoals = (loadedGoals && typeof loadedGoals === "object")
            ? cloneStorageValue(loadedGoals)
            : {};

        if (!Array.isArray(writableGoals.dailyGoals)) {
            writableGoals.dailyGoals = [];
        }

        updates.forEach(function (update) {
            let existingGoal = writableGoals.dailyGoals.find(function (goal) {
                return goal && goal.key === update.key;
            });

            if (!existingGoal) {
                existingGoal = {
                    key: update.key,
                    label: update.label,
                    target: null,
                    unit: update.unit,
                    established: false
                };
                writableGoals.dailyGoals.push(existingGoal);
            }

            existingGoal.key = update.key;
            existingGoal.label = update.label;
            existingGoal.unit = update.unit;
            existingGoal.established = update.established;

            if (update.established) {
                existingGoal.target = update.target;
            }
        });

        saveData(nutritionGoalsReferenceStorageKey, writableGoals);
        refreshNutritionGoalsReferenceConfig();
        renderNutritionGoalsReference();
        renderTodaySummary();
        closeNutritionDailyGoalsModal();
    }

    function formatBmiValue(bmiValue) {
        const text = getTrimmedTextOrEmpty(bmiValue);
        return text || "--";
    }

    function formatLbNumber(value) {
        const num = getNumberOrNull(value);
        if (num === null) {
            return "--";
        }

        const rounded = Math.round(num * 10) / 10;
        if (Number.isInteger(rounded)) {
            return String(rounded.toFixed(0));
        }

        return String(rounded.toFixed(1));
    }

    function formatRangeText(low, high, suffix) {
        const lowText = formatLbNumber(low);
        const highText = formatLbNumber(high);
        if (lowText === "--" || highText === "--") {
            return "--";
        }

        if (Number(lowText) === Number(highText)) {
            return lowText + (suffix || "");
        }

        return lowText + "-" + highText + (suffix || "");
    }

    function formatValueOrRange(minValue, maxValue, suffix) {
        const minNum = getNumberOrNull(minValue);
        const maxNum = getNumberOrNull(maxValue);
        if (minNum === null && maxNum === null) {
            return "--";
        }

        if (minNum !== null && maxNum === null) {
            return formatLbNumber(minNum) + (suffix || "");
        }

        if (minNum === null && maxNum !== null) {
            return formatLbNumber(maxNum) + (suffix || "");
        }

        if (Math.abs(minNum - maxNum) < 0.0001) {
            return formatLbNumber(minNum) + (suffix || "");
        }

        const low = Math.min(minNum, maxNum);
        const high = Math.max(minNum, maxNum);
        return formatLbNumber(low) + "-" + formatLbNumber(high) + (suffix || "");
    }

    function getProjectedBmiFromLiveApis(weightLb) {
        const safeWeight = getNumberOrNull(weightLb);
        if (safeWeight === null) {
            return null;
        }

        const weightApi = window.weightCenterMetrics;
        const profileApi = window.personalProfileData;
        if (
            !weightApi ||
            typeof weightApi.calculateBmiFromWeight !== "function" ||
            !profileApi ||
            typeof profileApi.getHeightInches !== "function"
        ) {
            return null;
        }

        const heightInches = getNumberOrNull(profileApi.getHeightInches());
        return getNumberOrNull(weightApi.calculateBmiFromWeight(safeWeight, heightInches));
    }

    function formatMilestoneDistanceText(currentWeightLb, milestoneWeightLb) {
        const safeCurrent = getNumberOrNull(currentWeightLb);
        const safeMilestone = getNumberOrNull(milestoneWeightLb);
        if (safeCurrent === null || safeMilestone === null) {
            return "--";
        }

        const poundsToMilestone = Math.round((safeCurrent - safeMilestone) * 10) / 10;
        if (poundsToMilestone <= 0) {
            return "Reached";
        }

        return formatLbNumber(poundsToMilestone) + " lb to milestone";
    }

    function parseExpectedRateLbPerWeek(rawRateText) {
        const raw = getTrimmedTextOrEmpty(rawRateText);
        if (!raw) {
            return null;
        }

        const normalized = raw
            .toLowerCase()
            .replace(/[\u2012\u2013\u2014\u2015]/g, "-")
            .replace(/\s+/g, " ");

        const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
        if (rangeMatch) {
            const first = Number(rangeMatch[1]);
            const second = Number(rangeMatch[2]);
            if (Number.isFinite(first) && Number.isFinite(second) && first > 0 && second > 0) {
                return {
                    minRateLbPerWeek: Math.min(first, second),
                    maxRateLbPerWeek: Math.max(first, second),
                    isRange: true,
                    rawText: raw
                };
            }
        }

        const singleMatch = normalized.match(/(\d+(?:\.\d+)?)/);
        if (singleMatch) {
            const singleRate = Number(singleMatch[1]);
            if (Number.isFinite(singleRate) && singleRate > 0) {
                return {
                    minRateLbPerWeek: singleRate,
                    maxRateLbPerWeek: singleRate,
                    isRange: false,
                    rawText: raw
                };
            }
        }

        return null;
    }

    function buildProjectionRows(currentWeightLb, rateInfo) {
        const monthSteps = [0, 1, 2, 3, 6];
        const weeksPerMonth = 4.345;
        const safeCurrentWeight = getNumberOrNull(currentWeightLb);

        return monthSteps.map(function (months) {
            const label = months === 0 ? "Starting point" : String(months) + " month" + (months > 1 ? "s" : "");

            if (months === 0) {
                const startBmi = getProjectedBmiFromLiveApis(safeCurrentWeight);
                return {
                    label: label,
                    projectedWeightText: safeCurrentWeight === null ? "--" : formatLbNumber(safeCurrentWeight) + " lb",
                    projectedBmiText: startBmi === null ? "--" : String(startBmi),
                    totalLossText: "0 lb"
                };
            }

            if (!rateInfo || safeCurrentWeight === null) {
                return {
                    label: label,
                    projectedWeightText: "--",
                    projectedBmiText: "--",
                    totalLossText: "--"
                };
            }

            const weeks = months * weeksPerMonth;
            const minLoss = rateInfo.minRateLbPerWeek * weeks;
            const maxLoss = rateInfo.maxRateLbPerWeek * weeks;
            const projectedLowWeight = safeCurrentWeight - maxLoss;
            const projectedHighWeight = safeCurrentWeight - minLoss;
            const projectedLowBmi = getProjectedBmiFromLiveApis(projectedLowWeight);
            const projectedHighBmi = getProjectedBmiFromLiveApis(projectedHighWeight);

            const isRange = rateInfo.isRange || Math.abs(rateInfo.maxRateLbPerWeek - rateInfo.minRateLbPerWeek) > 0;
            const projectedWeightText = isRange
                ? formatRangeText(projectedLowWeight, projectedHighWeight, " lb")
                : formatLbNumber(projectedLowWeight) + " lb";
            const projectedBmiText = isRange
                ? formatRangeText(projectedLowBmi, projectedHighBmi, "")
                : (projectedLowBmi === null ? "--" : String(projectedLowBmi));
            const totalLossText = isRange
                ? formatRangeText(minLoss, maxLoss, " lb")
                : formatLbNumber(minLoss) + " lb";

            return {
                label: label,
                projectedWeightText: projectedWeightText,
                projectedBmiText: projectedBmiText,
                totalLossText: totalLossText
            };
        });
    }

    function buildProjectionRowsFromMonthlyPlanTargets(monthlyPlanTargets) {
        return monthlyPlanTargets.map(function (row) {
            return {
                label: row.timeLabel,
                projectedWeightText: formatValueOrRange(row.expectedWeightMinLb, row.expectedWeightMaxLb, " lb"),
                projectedBmiText: formatValueOrRange(row.estimatedBmiMin, row.estimatedBmiMax, ""),
                totalLossText: formatValueOrRange(row.expectedLossMinLb, row.expectedLossMaxLb, " lb")
            };
        });
    }

    function getLiveMetricsSnapshotText() {
        const liveMetrics = getLiveWeightCenterMetrics();
        return [
            liveMetrics.currentWeightLb,
            liveMetrics.currentBmi,
            liveMetrics.category,
            liveMetrics.bmiMissingReason
        ].join("|");
    }

    function ensureNutritionGoalsLiveRefresh() {
        if (nutritionGoalsLiveRefreshTimer !== null) {
            return;
        }

        nutritionGoalsLiveRefreshTimer = window.setInterval(function () {
            if (!nutritionGoalsReferenceSection || nutritionGoalsReferenceSection.style.display !== "block") {
                return;
            }

            const latestSnapshot = getLiveMetricsSnapshotText();
            if (latestSnapshot === nutritionGoalsLiveMetricsSnapshot) {
                return;
            }

            nutritionGoalsLiveMetricsSnapshot = latestSnapshot;
            renderNutritionGoalsReference();
        }, 3000);
    }

    function getLiveWeightCenterMetrics() {
        const weightApi = window.weightCenterMetrics;
        const profileApi = window.personalProfileData;

        if (
            weightApi &&
            typeof weightApi.getCurrentWeightLb === "function" &&
            typeof weightApi.calculateBmiFromWeight === "function" &&
            typeof weightApi.getBmiCategory === "function" &&
            profileApi &&
            typeof profileApi.getHeightInches === "function"
        ) {
            const currentWeightLb = getNumberOrNull(weightApi.getCurrentWeightLb());
            const heightInches = getNumberOrNull(profileApi.getHeightInches());
            const currentBmi = getNumberOrNull(weightApi.calculateBmiFromWeight(currentWeightLb, heightInches));

            let bmiMissingReason = "";
            if (currentWeightLb === null) {
                bmiMissingReason = "Weight not available";
            } else if (heightInches === null) {
                bmiMissingReason = "Height not set";
            }

            return {
                currentWeightLb: currentWeightLb,
                currentBmi: currentBmi,
                category: getTrimmedTextOrEmpty(weightApi.getBmiCategory(currentBmi)),
                bmiMissingReason: bmiMissingReason
            };
        }

        return {
            currentWeightLb: null,
            currentBmi: null,
            category: "",
            bmiMissingReason: "Weight not available"
        };
    }

    function renderNutritionGoalsReference() {
        if (!nutritionGoalsReferenceContent) {
            return;
        }

        const dailyGoalsHtml = nutritionGoalsReferenceConfig.dailyGoals
            .map(function (goal) {
                const valueClass = goal.established
                    ? "nutrition-goals-value"
                    : "nutrition-goals-value nutrition-goals-pending";

                return '<div class="nutrition-goals-row">' +
                    '<span class="nutrition-goals-label">' + escapeHtml(goal.label) + "</span>" +
                    '<span class="' + valueClass + '">' + escapeHtml(formatGoalValue(goal)) + "</span>" +
                "</div>";
            })
            .join("");

        const liveMetrics = getLiveWeightCenterMetrics();
        nutritionGoalsLiveMetricsSnapshot = getLiveMetricsSnapshotText();

        const configuredMilestones = nutritionGoalsReferenceConfig.weightReference.milestones.filter(function (milestone) {
            return milestone.weightLb !== null || getTrimmedTextOrEmpty(milestone.bmi) !== "";
        });

        const milestonesHtml = configuredMilestones
            .map(function (milestone) {
                const distanceText = formatMilestoneDistanceText(liveMetrics.currentWeightLb, milestone.weightLb);
                return '<div class="nutrition-goals-milestone-row">' +
                    '<span class="nutrition-goals-milestone-label">' + escapeHtml(milestone.label) + "</span>" +
                    '<span class="nutrition-goals-milestone-weight">' + escapeHtml(formatWeightValue(milestone.weightLb)) + "</span>" +
                    '<span class="nutrition-goals-milestone-bmi">' + escapeHtml(formatBmiValue(milestone.bmi)) + "</span>" +
                    '<span class="nutrition-goals-milestone-distance">' + escapeHtml(distanceText) + "</span>" +
                "</div>";
            })
            .join("");

        const currentWeightLine = liveMetrics.currentWeightLb !== null
            ? "Current Weight: " + escapeHtml(formatWeightValue(liveMetrics.currentWeightLb))
            : "Current Weight: Weight not available";

        const currentBmiLine = liveMetrics.currentBmi !== null
            ? "Current BMI: " + escapeHtml(String(liveMetrics.currentBmi)) +
                (liveMetrics.category ? " • " + escapeHtml(liveMetrics.category) : "")
            : "Current BMI: " + escapeHtml(liveMetrics.bmiMissingReason || "Not available");

        const expectedRateLine = getTrimmedTextOrEmpty(nutritionGoalsReferenceConfig.weightReference.expectedRate)
            ? "Expected rate: " + escapeHtml(nutritionGoalsReferenceConfig.weightReference.expectedRate)
            : "Expected rate to be added later";

        const primaryGoalLine = getTrimmedTextOrEmpty(nutritionGoalsReferenceConfig.weightReference.primaryGoal)
            ? "Primary goal: " + escapeHtml(nutritionGoalsReferenceConfig.weightReference.primaryGoal)
            : "Primary goal to be added later";

        const monthlyPlanTargets = Array.isArray(nutritionGoalsReferenceConfig.weightReference.monthlyPlanTargets)
            ? nutritionGoalsReferenceConfig.weightReference.monthlyPlanTargets
            : [];
        const hasMonthlyPlanTargets = monthlyPlanTargets.length > 0;

        const rateInfo = parseExpectedRateLbPerWeek(nutritionGoalsReferenceConfig.weightReference.expectedRate);
        const projectionRows = hasMonthlyPlanTargets
            ? buildProjectionRowsFromMonthlyPlanTargets(monthlyPlanTargets)
            : buildProjectionRows(liveMetrics.currentWeightLb, rateInfo);
        const projectionRowsHtml = projectionRows.map(function (row) {
            return '<div class="nutrition-projection-row">' +
                '<span class="nutrition-projection-time">' + escapeHtml(row.label) + "</span>" +
                '<span class="nutrition-projection-weight">' + escapeHtml(row.projectedWeightText) + "</span>" +
                '<span class="nutrition-projection-bmi">' + escapeHtml(row.projectedBmiText) + "</span>" +
                '<span class="nutrition-projection-loss">' + escapeHtml(row.totalLossText) + "</span>" +
            "</div>";
        }).join("");

        const expectedRateForNote = getTrimmedTextOrEmpty(nutritionGoalsReferenceConfig.weightReference.expectedRate);

        const rateParseNotice = hasMonthlyPlanTargets
            ? (expectedRateForNote
                ? "These are planning ranges based on an expected loss of " + expectedRateForNote + ". Actual results will vary."
                : "These are planning ranges. Actual results will vary.")
            : (rateInfo
                ? "Projection uses your stored expected rate."
                : "Weight-loss plan is not configured in your local data yet.");

        const milestonesConfigured = configuredMilestones.length > 0;

        const milestonesMissingNotice = milestonesConfigured
            ? ""
            : '<p class="nutrition-goals-reference nutrition-goals-warning">Milestones are not configured in your local data yet.</p>';

        const projectionMissingNotice = hasMonthlyPlanTargets
            ? ""
            : '<p class="nutrition-goals-reference nutrition-goals-warning">Add monthly plan targets to see your stored time-based plan ranges.</p>';

        nutritionGoalsReferenceContent.innerHTML =
            '<section class="nutrition-goals-block">' +
                '<div class="nutrition-goals-header-row">' +
                    '<h3 class="nutrition-goals-heading">Daily Nutrition Goals</h3>' +
                    '<div class="nutrition-goals-header-actions">' +
                        '<button id="nutritionEditDailyGoalsButton" class="nutrition-goals-edit-button" type="button">Edit Daily Goals</button>' +
                        '<button id="nutritionEditWeightLossPlanButton" class="nutrition-goals-edit-button" type="button">Edit Weight-Loss Plan</button>' +
                    "</div>" +
                "</div>" +
                '<div class="nutrition-goals-grid">' + dailyGoalsHtml + "</div>" +
            "</section>" +
            '<section class="nutrition-goals-block">' +
                '<h3 class="nutrition-goals-heading">Weight &amp; BMI Goals</h3>' +
                '<p class="nutrition-goals-reference">' + currentWeightLine + "</p>" +
                '<p class="nutrition-goals-reference">' + currentBmiLine + "</p>" +
                milestonesMissingNotice +
                (milestonesConfigured
                    ? ('<div class="nutrition-goals-milestone-table">' +
                        '<div class="nutrition-goals-milestone-head">' +
                            '<span>Milestone</span><span>Weight</span><span>BMI</span><span>Distance</span>' +
                        "</div>" +
                        milestonesHtml +
                    "</div>")
                    : "") +
            "</section>" +
            '<section class="nutrition-goals-block">' +
                '<h3 class="nutrition-goals-heading">Weight-Loss Plan &amp; Projection</h3>' +
                '<p class="nutrition-goals-reference">Current Weight: ' + escapeHtml(liveMetrics.currentWeightLb !== null ? formatWeightValue(liveMetrics.currentWeightLb) : "Weight not available") + "</p>" +
                '<p class="nutrition-goals-reference">Current BMI: ' + escapeHtml(liveMetrics.currentBmi !== null ? String(liveMetrics.currentBmi) : (liveMetrics.bmiMissingReason || "Not available")) + "</p>" +
                '<p class="nutrition-goals-reference">' + primaryGoalLine + "</p>" +
                '<p class="nutrition-goals-reference">' + expectedRateLine + "</p>" +
                '<p class="nutrition-goals-reference nutrition-goals-warning">' + escapeHtml(rateParseNotice) + "</p>" +
                projectionMissingNotice +
                (projectionRows.length > 0
                    ? ('<div class="nutrition-projection-table">' +
                        '<div class="nutrition-projection-head">' +
                            '<span>Time</span><span>Expected Weight</span><span>Estimated BMI</span><span>Expected Loss</span>' +
                        '</div>' +
                        projectionRowsHtml +
                    '</div>')
                    : "") +
            "</section>";
    }

    function findNutritionDayByKey(dayKey) {
        return nutritionDays.find(function (day) {
            return day.dayKey === dayKey;
        }) || null;
    }

    function closeNutritionDayDetailModal() {
        if (!nutritionDayDetailModal) {
            return;
        }

        nutritionDayDetailModal.style.display = "none";
        if (nutritionDayDetailTitle) {
            nutritionDayDetailTitle.textContent = "Nutrition Day Detail";
        }
        activeNutritionDayKey = null;
        unlockNutritionModalBackgroundScroll();
    }

    function renderNutritionDayDetail(dayData) {
        if (!nutritionDayDetailContent) {
            return;
        }

        const entryHtml = dayData.entries
            .map(function (entry) {
                const mealHtml = entry.meal
                    ? '<div class="nutrition-day-detail-notes"><span class="nutrition-day-detail-label">Meal</span><span>' + escapeHtml(entry.meal) + "</span></div>"
                    : "";
                const notesHtml = entry.notes
                    ? '<div class="nutrition-day-detail-notes"><span class="nutrition-day-detail-label">Notes</span><span>' + escapeHtml(entry.notes) + "</span></div>"
                    : "";

                return '<div class="nutrition-day-detail-entry">' +
                    '<div class="nutrition-day-detail-description">' + escapeHtml(entry.description) + "</div>" +
                    '<div class="nutrition-day-detail-macros">' +
                        '<span>' + escapeHtml(String(entry.calories)) + " Kcal</span>" +
                        '<span>' + escapeHtml(String(entry.protein)) + " g Protein</span>" +
                        '<span>' + escapeHtml(String(entry.carbs)) + " g Carbohydrates</span>" +
                        '<span>' + escapeHtml(String(entry.fat)) + " g Fat</span>" +
                    "</div>" +
                    mealHtml +
                    notesHtml +
                "</div>";
            })
            .join("");

        nutritionDayDetailContent.innerHTML =
            '<div class="nutrition-day-detail-list">' + entryHtml + "</div>" +
            '<div class="nutrition-day-detail-totals">' +
                '<div class="nutrition-day-detail-totals-title">Daily Totals</div>' +
                '<div class="nutrition-day-detail-totals-grid">' +
                    '<span>' + escapeHtml(String(dayData.totals.calories)) + " Kcal</span>" +
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
        if (nutritionDayDetailTitle) {
            nutritionDayDetailTitle.textContent = getDisplayDayLabel(dayData);
        }
        nutritionDayDetailModal.style.display = "flex";
        if (nutritionDayDetailContent) {
            nutritionDayDetailContent.scrollTop = 0;
        }
        lockNutritionModalBackgroundScroll();
    }

    function lockNutritionModalBackgroundScroll() {
        if (nutritionModalLockCount > 0) {
            nutritionModalLockCount += 1;
            return;
        }

        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("nutrition-modal-open");
        document.body.classList.add("nutrition-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
        nutritionModalLockCount = 1;
    }

    function unlockNutritionModalBackgroundScroll() {
        if (nutritionModalLockCount === 0) {
            return;
        }

        nutritionModalLockCount -= 1;
        if (nutritionModalLockCount > 0) {
            return;
        }

        document.documentElement.classList.remove("nutrition-modal-open");
        document.body.classList.remove("nutrition-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function resetNutritionForm() {
        if (nutritionDescriptionInput) nutritionDescriptionInput.value = "";
        if (nutritionMealInput) nutritionMealInput.value = "";
        if (nutritionCaloriesInput) nutritionCaloriesInput.value = "";
        if (nutritionProteinInput) nutritionProteinInput.value = "";
        if (nutritionCarbsInput) nutritionCarbsInput.value = "";
        if (nutritionFatInput) nutritionFatInput.value = "";
        if (nutritionDateInput) nutritionDateInput.value = getCurrentDateInputValue();
        if (nutritionNoteInput) nutritionNoteInput.value = "";
    }

    function shouldAutofocusNutritionDescription() {
        if (!window.matchMedia) {
            return true;
        }

        const isCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const isSmallViewport = window.innerWidth <= 430;
        return !(isCoarsePointer && isSmallViewport);
    }

    function openNutritionLog() {
        if (!nutritionLogModal) {
            return;
        }

        resetNutritionForm();
        nutritionLogModal.style.display = "flex";
        lockNutritionModalBackgroundScroll();

        if (nutritionDescriptionInput && shouldAutofocusNutritionDescription()) {
            requestAnimationFrame(function () {
                nutritionDescriptionInput.focus();
            });
        }
    }

    function closeNutritionLogModal() {
        if (!nutritionLogModal) {
            return;
        }

        nutritionLogModal.style.display = "none";
        unlockNutritionModalBackgroundScroll();
    }

    function createNutritionEntryFromForm() {
        const description = nutritionDescriptionInput ? nutritionDescriptionInput.value.trim() : "";
        const meal = nutritionMealInput ? nutritionMealInput.value.trim() : "";
        const calories = nutritionCaloriesInput ? nutritionCaloriesInput.value.trim() : "";
        const protein = nutritionProteinInput ? nutritionProteinInput.value.trim() : "";
        const carbs = nutritionCarbsInput ? nutritionCarbsInput.value.trim() : "";
        const fat = nutritionFatInput ? nutritionFatInput.value.trim() : "";
        const date = nutritionDateInput && nutritionDateInput.value ? nutritionDateInput.value : getCurrentDateInputValue();
        const note = nutritionNoteInput ? nutritionNoteInput.value.trim() : "";

        if (!description) {
            alert("Please enter a food description.");
            return null;
        }

        if (!calories) {
            alert("Please enter Kcal.");
            return null;
        }

        if (!protein || !carbs) {
            alert("Please enter protein and carbohydrates.");
            return null;
        }

        const entry = {
            description: description,
            calories: roundNutritionValue(getNumber(calories)),
            protein: roundNutritionValue(getNumber(protein)),
            carbs: roundNutritionValue(getNumber(carbs)),
            fat: roundNutritionValue(getNumber(fat || 0)),
            date: date,
            time: getCurrentTimeValue()
        };

        if (meal) {
            entry.meal = meal;
        }

        if (note) {
            entry.note = note;
        }

        return entry;
    }

    function addNutritionEntry(entry) {
        nutritionHistory.push(entry);
        nutritionHistory = normalizeSavedNutritionHistory(nutritionHistory);
        rebuildNutritionTodayFromHistory();
        saveNutritionData();
    }

    function renderTodaySummary() {
        nutritionToday = nutritionToday || {};
        refreshNutritionGoalsReferenceConfig();

        const calories = getNumber(nutritionToday.calories);
        const protein = getNumber(nutritionToday.protein);
        const carbs = getNumber(nutritionToday.carbs);
        const fat = getNumber(nutritionToday.fat);

        if (nutritionCaloriesValue) {
            nutritionCaloriesValue.textContent = formatActualGoalOrUnset(calories, "calories", "Kcal");
        }
        if (nutritionProteinValue) {
            nutritionProteinValue.textContent = formatActualGoalOrUnset(protein, "protein", "g");
        }
        if (nutritionCarbsValue) {
            nutritionCarbsValue.textContent = formatActualGoalOrUnset(carbs, "carbohydrates", "g");
        }
        if (nutritionFatValue) {
            nutritionFatValue.textContent = formatActualGoalOrUnset(fat, "fat", "g");
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
                            escapeHtml(String(dayData.totals.calories)) + " Kcal · " +
                            escapeHtml(String(dayData.totals.protein)) + "g Protein · " +
                            escapeHtml(String(dayData.totals.carbs)) + "g Carbs" +
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

        nutritionHistory = normalizeSavedNutritionHistory(nutritionHistory);
        rebuildNutritionTodayFromHistory();
        saveNutritionData();
        renderTodaySummary();
        renderHistoryFramework();
        renderNutritionGoalsReference();
        ensureNutritionGoalsLiveRefresh();

        if (nutritionHistorySection) {
            nutritionHistorySection.style.display = "none";
        }

        if (nutritionGoalsReferenceSection) {
            nutritionGoalsReferenceSection.style.display = "none";
        }

        if (nutritionLogFoodButton) {
            nutritionLogFoodButton.addEventListener("click", openNutritionLog);
        }

        if (cancelNutritionBtn) {
            cancelNutritionBtn.addEventListener("click", function () {
                closeNutritionLogModal();
                resetNutritionForm();
            });
        }

        if (saveNutritionBtn) {
            saveNutritionBtn.addEventListener("click", function () {
                const entry = createNutritionEntryFromForm();
                if (!entry) {
                    return;
                }

                addNutritionEntry(entry);
                closeNutritionLogModal();
                resetNutritionForm();
                refreshNutritionData();
            });
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
                    window.scrollMedicationCenterTo(nutritionHistoryButton);
                    return;
                }

                nutritionHistoryButton.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }

        if (nutritionGoalsReferenceButton) {
            nutritionGoalsReferenceButton.textContent = "🎯 Nutrition Goals & Reference";
            nutritionGoalsReferenceButton.addEventListener("click", function () {
                if (!nutritionGoalsReferenceSection) {
                    return;
                }

                if (nutritionGoalsReferenceSection.style.display === "block") {
                    nutritionGoalsReferenceSection.style.display = "none";
                    nutritionGoalsReferenceButton.textContent = "🎯 Nutrition Goals & Reference";
                    return;
                }

                renderNutritionGoalsReference();
                nutritionGoalsReferenceSection.style.display = "block";
                nutritionGoalsReferenceButton.textContent = "🎯 Hide Goals & Reference";

                if (typeof window.scrollMedicationCenterTo === "function") {
                    window.scrollMedicationCenterTo(nutritionGoalsReferenceButton);
                    return;
                }

                nutritionGoalsReferenceButton.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }

        if (nutritionGoalsReferenceContent) {
            nutritionGoalsReferenceContent.addEventListener("click", function (event) {
                const editButton = event.target.closest("#nutritionEditDailyGoalsButton");
                if (editButton) {
                    openNutritionDailyGoalsModal();
                    return;
                }

                const editWeightPlanButton = event.target.closest("#nutritionEditWeightLossPlanButton");
                if (editWeightPlanButton) {
                    openNutritionWeightLossPlanModal();
                }
            });
        }

        if (nutritionDailyGoalsEditor) {
            nutritionDailyGoalsEditor.addEventListener("change", function (event) {
                const toggle = event.target.closest(".nutrition-daily-goal-set-toggle");
                if (!toggle) {
                    return;
                }

                const row = toggle.closest(".nutrition-daily-goal-editor-row");
                if (!row) {
                    return;
                }

                const input = row.querySelector(".nutrition-daily-goal-target-input");
                if (!input) {
                    return;
                }

                input.disabled = !toggle.checked;
                if (toggle.checked) {
                    requestAnimationFrame(function () {
                        input.focus();
                    });
                }
            });
        }

        if (cancelNutritionDailyGoalsBtn) {
            cancelNutritionDailyGoalsBtn.addEventListener("click", function () {
                closeNutritionDailyGoalsModal();
            });
        }

        if (saveNutritionDailyGoalsBtn) {
            saveNutritionDailyGoalsBtn.addEventListener("click", function () {
                saveNutritionDailyGoals();
            });
        }

        if (nutritionWeightLossPlanEditor) {
            nutritionWeightLossPlanEditor.addEventListener("change", function (event) {
                const toggle = event.target.closest(".nutrition-weight-plan-milestone-toggle");
                if (!toggle) {
                    return;
                }

                const row = toggle.closest(".nutrition-weight-plan-milestone-row");
                if (!row) {
                    return;
                }

                const weightInput = row.querySelector(".nutrition-weight-plan-milestone-weight");
                const bmiInput = row.querySelector(".nutrition-weight-plan-milestone-bmi");
                const nextDisabled = !toggle.checked;
                if (weightInput) {
                    weightInput.disabled = nextDisabled;
                }
                if (bmiInput) {
                    bmiInput.disabled = nextDisabled;
                }
            });
        }

        if (cancelNutritionWeightLossPlanBtn) {
            cancelNutritionWeightLossPlanBtn.addEventListener("click", function () {
                closeNutritionWeightLossPlanModal();
            });
        }

        if (saveNutritionWeightLossPlanBtn) {
            saveNutritionWeightLossPlanBtn.addEventListener("click", function () {
                saveNutritionWeightLossPlan();
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

        if (nutritionDayDetailModal) {
            nutritionDayDetailModal.addEventListener("touchmove", function (event) {
                if (!nutritionDayDetailModalContent) return;
                if (!nutritionDayDetailModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
            });
        }

        if (nutritionDailyGoalsModal) {
            nutritionDailyGoalsModal.addEventListener("touchmove", function (event) {
                if (!nutritionDailyGoalsModalContent) return;
                if (!nutritionDailyGoalsModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
            });
        }

        if (nutritionWeightLossPlanModal) {
            nutritionWeightLossPlanModal.addEventListener("touchmove", function (event) {
                if (!nutritionWeightLossPlanModalContent) return;
                if (!nutritionWeightLossPlanModalContent.contains(event.target)) {
                    event.preventDefault();
                }
            }, {
                passive: false
            });
        }
    }

    window.initNutritionCenter = initNutritionCenter;
})();
