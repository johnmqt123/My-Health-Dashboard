// Load saved medication status
let medicationLog = loadData("medicationLog", {});
let medicationHistory =
    loadData("medicationHistory", []);
let personalMedicationSchedule =
    JSON.parse(localStorage.getItem("personalMedicationSchedule"));

const medicationEventCompatibility = {
    wakeUp: {
        id: "wakeUp",
        defaultName: "Wake Up",
        defaultTime: "07:00",
        defaultOrder: 1,
        historyPeriod: "Wake Up",
        summaryLabel: "Wake-Up",
        buttonLabel: "Wake-Up"
    },
    breakfast: {
        id: "breakfast",
        defaultName: "Breakfast",
        defaultTime: "09:30",
        defaultOrder: 2,
        historyPeriod: "Breakfast",
        summaryLabel: "Breakfast",
        buttonLabel: "Breakfast"
    },
    midday: {
        id: "midday",
        defaultName: "Midday",
        defaultTime: "14:00",
        defaultOrder: 3,
        historyPeriod: "Midday",
        summaryLabel: "Midday",
        buttonLabel: "Midday"
    },
    dinner: {
        id: "dinner",
        defaultName: "Dinner",
        defaultTime: "17:00",
        defaultOrder: 4,
        historyPeriod: "Dinner",
        summaryLabel: "Dinner",
        buttonLabel: "Dinner"
    },
    evening: {
        id: "evening",
        defaultName: "Evening",
        defaultTime: "21:00",
        defaultOrder: 5,
        historyPeriod: "Evening",
        summaryLabel: "Evening",
        buttonLabel: "Evening"
    }
};

const medicationEventCompatibilityList = [
    medicationEventCompatibility.wakeUp,
    medicationEventCompatibility.breakfast,
    medicationEventCompatibility.midday,
    medicationEventCompatibility.dinner,
    medicationEventCompatibility.evening
];

function getClockMinutes(value) {
    const normalized = parseClockTimeTo24Hour(value);
    if (!normalized) {
        return null;
    }

    const parts = normalized.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return null;
    }

    return (hours * 60) + minutes;
}

function getTrimmedString(value) {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value).trim();
}

function parseClockTimeTo24Hour(value) {
    const timeText = getTrimmedString(value);
    if (!timeText) {
        return "";
    }

    const twentyFourHourMatch = timeText.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHourMatch) {
        const hours = Number(twentyFourHourMatch[1]);
        const minutes = Number(twentyFourHourMatch[2]);
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
        }
    }

    const twelveHourMatch = timeText.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHourMatch) {
        let hours = Number(twelveHourMatch[1]);
        const minutes = Number(twelveHourMatch[2]);
        const meridian = twelveHourMatch[3].toUpperCase();

        if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59) {
            if (meridian === "PM" && hours < 12) {
                hours += 12;
            }
            if (meridian === "AM" && hours === 12) {
                hours = 0;
            }

            return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
        }
    }

    return "";
}

function formatClockTimeLabel(value) {
    const normalized = parseClockTimeTo24Hour(value);
    if (!normalized) {
        return "";
    }

    const parts = normalized.split(":");
    const date = new Date();
    date.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function normalizeMedicationEventId(text) {
    const lowered = getTrimmedString(text).toLowerCase();
    if (!lowered) {
        return "event";
    }

    const compact = lowered.replace(/[^a-z0-9]+/g, " ").trim();
    if (!compact) {
        return "event";
    }

    const parts = compact.split(/\s+/);
    const first = parts.shift() || "event";
    return first + parts.map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join("");
}

function inferLegacyEventId(value) {
    const normalized = normalizeMedicationEventId(value);

    if (normalized === "wakeUp" || normalized === "wakeup") {
        return "wakeUp";
    }

    if (normalized === "breakfast") {
        return "breakfast";
    }

    if (normalized === "midday") {
        return "midday";
    }

    if (normalized === "dinner") {
        return "dinner";
    }

    if (normalized === "evening") {
        return "evening";
    }

    return "";
}

function createUniqueMedicationEventId(baseId, usedIds) {
    const inferredLegacyId = inferLegacyEventId(baseId);
    let candidate = inferredLegacyId || normalizeMedicationEventId(baseId) || "event";
    let suffix = 2;

    while (usedIds.has(candidate)) {
        const baseCandidate = inferredLegacyId || normalizeMedicationEventId(baseId) || "event";
        candidate = baseCandidate + suffix;
        suffix += 1;
    }

    usedIds.add(candidate);
    return candidate;
}

function normalizeMedicationScheduleEvents(rawSchedule) {
    const source = Array.isArray(rawSchedule) ? rawSchedule : [];
    const usedIds = new Set();

    const normalized = source.map(function (entry, index) {
        const raw = entry && typeof entry === "object" ? entry : {};
        const legacyLabel = getTrimmedString(raw.time);
        const legacyId = inferLegacyEventId(raw.id || raw.name || legacyLabel);
        const defaults = legacyId ? medicationEventCompatibility[legacyId] : null;

        const name =
            getTrimmedString(raw.name) ||
            legacyLabel ||
            (defaults ? defaults.defaultName : "Medication Schedule " + (index + 1));

        const clockTime =
            parseClockTimeTo24Hour(raw.time) ||
            parseClockTimeTo24Hour(raw.clockTime) ||
            parseClockTimeTo24Hour(raw.scheduledTime) ||
            (defaults ? defaults.defaultTime : "");

        const orderValue = Number(raw.order);
        const order = Number.isFinite(orderValue) ? orderValue : (defaults ? defaults.defaultOrder : index + 1);

        const medications = Array.isArray(raw.medications)
            ? raw.medications.map(function (item) {
                return getTrimmedString(item);
            }).filter(function (item) {
                return !!item;
            })
            : [];

        const notes = getTrimmedString(raw.notes);
        const idSource = getTrimmedString(raw.id) || legacyId || name || "event";
        const id = createUniqueMedicationEventId(idSource, usedIds);

        const normalizedEntry = {
            id: id,
            name: name,
            time: clockTime,
            order: order,
            medications: medications
        };

        if (notes) {
            normalizedEntry.notes = notes;
        }

        return normalizedEntry;
    });

    normalized.sort(function (a, b) {
        const minutesA = getClockMinutes(a.time);
        const minutesB = getClockMinutes(b.time);

        if (minutesA !== null && minutesB !== null) {
            const timeDiff = minutesA - minutesB;
            if (timeDiff !== 0) {
                return timeDiff;
            }
        } else if (minutesA !== null) {
            return -1;
        } else if (minutesB !== null) {
            return 1;
        }

        const orderDiff = Number(a.order) - Number(b.order);
        if (orderDiff !== 0) {
            return orderDiff;
        }

        return a.name.localeCompare(b.name);
    });

    return normalized.map(function (entry, index) {
        return {
            id: entry.id,
            name: entry.name,
            time: entry.time,
            order: index + 1,
            medications: entry.medications,
            notes: entry.notes
        };
    });
}

function migrateMedicationScheduleEvents(rawSchedule) {
    const source = Array.isArray(rawSchedule) ? rawSchedule : [];
    const migrated = normalizeMedicationScheduleEvents(source);

    if (JSON.stringify(source) !== JSON.stringify(migrated)) {
        localStorage.setItem("personalMedicationSchedule", JSON.stringify(migrated));
    }

    return migrated;
}

function getMedicationEventForLegacyKey(legacyKey) {
    const defaults = medicationEventCompatibility[legacyKey];
    if (!defaults || !Array.isArray(personalMedicationSchedule)) {
        return null;
    }

    const byId = personalMedicationSchedule.find(function (entry) {
        return getTrimmedString(entry.id) === defaults.id;
    });
    if (byId) {
        return byId;
    }

    return personalMedicationSchedule.find(function (entry) {
        return inferLegacyEventId(entry.name) === legacyKey;
    }) || null;
}

function getMedicationButtonLabel(legacyKey) {
    const defaults = medicationEventCompatibility[legacyKey];
    const event = getMedicationEventForLegacyKey(legacyKey);
    const base = event && event.name ? event.name : (defaults ? defaults.buttonLabel : "Medication");
    return "Log " + base + " Medications";
}

function getMedicationHistoryPeriod(legacyKey) {
    const defaults = medicationEventCompatibility[legacyKey];
    return defaults ? defaults.historyPeriod : legacyKey;
}

personalMedicationSchedule = migrateMedicationScheduleEvents(personalMedicationSchedule);

window.medicationScheduleCompat = {
    normalizeMedicationScheduleEvents: normalizeMedicationScheduleEvents,
    migrateMedicationScheduleEvents: migrateMedicationScheduleEvents,
    getMedicationEventForLegacyKey: getMedicationEventForLegacyKey,
    getMedicationButtonLabel: getMedicationButtonLabel,
    getMedicationHistoryPeriod: getMedicationHistoryPeriod,
    parseClockTimeTo24Hour: parseClockTimeTo24Hour,
    formatClockTimeLabel: formatClockTimeLabel
};

if (!Array.isArray(personalMedicationSchedule)) {
    personalMedicationSchedule = Array.isArray(medicationSchedule)
        ? medicationSchedule.slice()
        : [];

    localStorage.setItem(
        "personalMedicationSchedule",
        JSON.stringify(personalMedicationSchedule)
    );
}
if (!medicationLog.evening) {
    medicationLog.evening = {};
}


let weightLog =
    loadData("weightLog", {});

let weightHistory =
    loadData("weightHistory", []);
// Restore Wake-Up medication status
if (
    medicationLog.wakeUp?.logged &&
    medicationLog.wakeUp.date === new Date().toDateString()
) {
    console.log(
        "Wake-Up medications were previously logged at",
        medicationLog.wakeUp.time
    );
} else {
    medicationLog.wakeUp = {};
}

  
// Medication Center moved to medicationCenter.js

initializeHome();

if (document.getElementById("dailyRoutineList")) {
    initDailyRoutine();
}

initExerciseCenter();
initNutritionCenter();
initWeightCenter();
initBloodPressureCenter();
initZepboundCenter();

const wakeUpButton = document.getElementById("logButton");
const medStatus = document.getElementById("medStatus");
const wakeUpMedicationList = document.getElementById("wakeUpMedicationList");
const breakfastMedicationList = document.getElementById("breakfastMedicationList");
const middayMedicationList = document.getElementById("middayMedicationList");
const dinnerMedicationList = document.getElementById("dinnerMedicationList");
const eveningMedicationList = document.getElementById("eveningMedicationList");
const wakeUpHeading = document.getElementById("wakeUpHeading");
const breakfastHeading = document.getElementById("breakfastHeading");
const middayHeading = document.getElementById("middayHeading");
const dinnerHeading = document.getElementById("dinnerHeading");
const eveningHeading = document.getElementById("eveningHeading");

const medicationCardSlots = {
    wakeUp: {
        key: "wakeUp",
        cardId: "medCard",
        headingElement: wakeUpHeading,
        listElement: wakeUpMedicationList,
        buttonId: "logButton",
        icon: "💊",
        defaultName: "Wake Up",
        defaultTime: "07:00"
    },
    breakfast: {
        key: "breakfast",
        cardId: "breakfastCard",
        headingElement: breakfastHeading,
        listElement: breakfastMedicationList,
        buttonId: "breakfastButton",
        icon: "🍳",
        defaultName: "Breakfast",
        defaultTime: "09:30"
    },
    midday: {
        key: "midday",
        cardId: "middayCard",
        headingElement: middayHeading,
        listElement: middayMedicationList,
        buttonId: "middayButton",
        icon: "☀️",
        defaultName: "Midday",
        defaultTime: "14:00"
    },
    dinner: {
        key: "dinner",
        cardId: "dinnerCard",
        headingElement: dinnerHeading,
        listElement: dinnerMedicationList,
        buttonId: "dinnerButton",
        icon: "🍽️",
        defaultName: "Dinner",
        defaultTime: "17:00"
    },
    evening: {
        key: "evening",
        cardId: "eveningCard",
        headingElement: eveningHeading,
        listElement: eveningMedicationList,
        buttonId: "eveningButton",
        icon: "🌙",
        defaultName: "Evening",
        defaultTime: "21:00"
    }
};

function getScheduleEventTimeForDisplay(eventData, fallbackTime) {
    const normalized = parseClockTimeTo24Hour(eventData && eventData.time);
    if (normalized) {
        return normalized;
    }
    return parseClockTimeTo24Hour(fallbackTime);
}

function renderMedicationCardHeading(slotConfig, eventData) {
    if (!slotConfig || !slotConfig.headingElement) {
        return;
    }

    const name = eventData && eventData.name
        ? eventData.name
        : slotConfig.defaultName;
    const eventTime = getScheduleEventTimeForDisplay(eventData, slotConfig.defaultTime);
    const timeLabel = formatClockTimeLabel(eventTime);

    slotConfig.headingElement.innerHTML =
        slotConfig.icon + " " +
        name +
        ' <span class="approx-time">~' + (timeLabel || "--") + "</span>";
}

function renderMedicationListForSlot(slotConfig, eventData) {
    if (!slotConfig || !slotConfig.listElement) {
        return;
    }

    const medications = eventData && Array.isArray(eventData.medications)
        ? eventData.medications
        : [];

    const medicationsMarkup = medications.length
        ? "<ul><li>" + medications.join("</li><li>") + "</li></ul>"
        : "<em>No medications configured.</em>";

    slotConfig.listElement.innerHTML = medicationsMarkup;
}

function getNotePreviewText(noteValue) {
    const text = noteValue ? String(noteValue).trim() : "";
    if (!text) {
        return "Add a note";
    }

    const collapsed = text.replace(/\s+/g, " ").trim();
    if (collapsed.length <= 90) {
        return collapsed;
    }

    return collapsed.slice(0, 87) + "...";
}

function ensureMedicationCardNotesRow(slotConfig) {
    if (!slotConfig || !slotConfig.cardId) {
        return null;
    }

    const cardElement = document.getElementById(slotConfig.cardId);
    if (!cardElement) {
        return null;
    }

    let notesRow = cardElement.querySelector(".medication-card-notes-row");
    if (notesRow) {
        return notesRow;
    }

    notesRow = document.createElement("button");
    notesRow.type = "button";
    notesRow.className = "medication-card-notes-row";
    notesRow.innerHTML =
        '<span class="medication-card-notes-head"><span>Notes</span><span class="medication-card-notes-chevron" aria-hidden="true">›</span></span>' +
        '<span class="medication-card-notes-preview"></span>';

    notesRow.addEventListener("click", function () {
        const eventId = this.dataset.eventId || "";
        if (!eventId) {
            return;
        }

        if (typeof window.openMedicationScheduleNotesModal === "function") {
            window.openMedicationScheduleNotesModal(eventId);
        }
    });

    const cardLogButton = slotConfig.buttonId
        ? document.getElementById(slotConfig.buttonId)
        : null;

    if (cardLogButton && cardLogButton.parentElement === cardElement) {
        cardElement.insertBefore(notesRow, cardLogButton);
    } else {
        cardElement.appendChild(notesRow);
    }

    return notesRow;
}

function renderMedicationNotesRowForSlot(slotConfig, eventData) {
    const notesRow = ensureMedicationCardNotesRow(slotConfig);
    if (!notesRow || !eventData) {
        return;
    }

    const notesPreviewElement = notesRow.querySelector(".medication-card-notes-preview");
    const displayName = eventData && eventData.name
        ? String(eventData.name).trim()
        : slotConfig.defaultName;
    const noteValue = eventData && eventData.notes
        ? String(eventData.notes)
        : "";

    notesRow.dataset.eventId = eventData.id || "";
    notesRow.setAttribute("aria-label", "Open " + displayName + " notes");

    if (notesPreviewElement) {
        notesPreviewElement.textContent = getNotePreviewText(noteValue);
    }
}

function renderMedicationScheduleCards() {
    Object.keys(medicationCardSlots).forEach(function (legacyKey) {
        const slotConfig = medicationCardSlots[legacyKey];
        const eventData = getMedicationEventForLegacyKey(legacyKey);
        const cardElement = slotConfig.cardId
            ? document.getElementById(slotConfig.cardId)
            : null;

        if (!eventData) {
            if (cardElement) {
                cardElement.style.display = "none";
            }
            return;
        }

        if (cardElement) {
            cardElement.style.display = "flex";
        }

        renderMedicationCardHeading(slotConfig, eventData);
        renderMedicationListForSlot(slotConfig, eventData);
        renderMedicationNotesRowForSlot(slotConfig, eventData);

        const button = slotConfig.buttonId
            ? document.getElementById(slotConfig.buttonId)
            : null;
        if (button) {
            button.textContent = getMedicationButtonLabel(legacyKey);
        }
    });
}

window.renderMedicationScheduleCards = renderMedicationScheduleCards;
renderMedicationScheduleCards();
function setupMedicationToggle(headingId, listId) {
    const heading = document.getElementById(headingId);
    const list = document.getElementById(listId);

    if (!heading || !list) return;

    heading.addEventListener("click", () => {
        const isHidden = list.style.display === "none";
        setMedicationSectionExpanded(list, isHidden);
    });
}

function setMedicationSectionExpanded(list, isExpanded) {
    if (!list) {
        return;
    }

    list.style.display = isExpanded ? "block" : "none";
}

setupMedicationToggle("wakeUpHeading", "wakeUpMedicationList");
setupMedicationToggle("breakfastHeading", "breakfastMedicationList");
setupMedicationToggle("middayHeading", "middayMedicationList");
setupMedicationToggle("dinnerHeading", "dinnerMedicationList");
setupMedicationToggle("eveningHeading", "eveningMedicationList");
setupMedicationToggle("asNeededHeading", "asNeededMedicationContent");
const breakfastButton =
    document.getElementById("breakfastButton");

const breakfastStatus =
    document.getElementById("breakfastStatus");
    const middayButton =
    document.getElementById("middayButton");

const middayStatus =
    document.getElementById("middayStatus");

const dinnerButton =
    document.getElementById("dinnerButton");

const dinnerStatus =
    document.getElementById("dinnerStatus");

const eveningButton =
    document.getElementById("eveningButton");

const eveningStatus =
    document.getElementById("eveningStatus");


const exerciseHistoryButton =
    document.getElementById("exerciseHistoryButton");

const exerciseHistorySection =
    document.getElementById("exerciseHistorySection");

const exerciseHistoryDisplay =
    document.getElementById("exerciseHistoryDisplay");
const addTaskButton =
    document.getElementById("addTaskButton");

const todayList =
    document.getElementById("todayList");

const quickAccessButtons =
    document.querySelectorAll(".quick-access-button");
const quickAccessGrid =
    document.querySelector(".quick-access-grid");
    
const medicationCenterCardHeading =
    document.getElementById("medicationCenterCardHeading");
const backToTop =
    document.getElementById("backToTop");
const pageBackToTop =
    document.getElementById("pageBackToTop");
const summaryMedicationStatus =
    document.getElementById("summaryBreakfastStatus");

const medicationSectionConfig = {
    wakeUp: {
        cardId: "medCard"
    },
    breakfast: {
        cardId: "breakfastCard"
    },
    midday: {
        cardId: "middayCard"
    },
    dinner: {
        cardId: "dinnerCard"
    },
    evening: {
        cardId: "eveningCard"
    }
};

function scrollMedicationCenterTo(targetElement) {
    const elementToScroll =
        targetElement || document.getElementById("medicationCenterSection");

    if (!elementToScroll) {
        return;
    }

    requestAnimationFrame(function () {
        // Keep a small top inset so tapped controls are not flush/clipped at the viewport edge on mobile.
        const elementTop =
            window.pageYOffset + elementToScroll.getBoundingClientRect().top;
        const targetTop = Math.max(0, elementTop - 12);

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    });
}

function openMedicationCenter(targetElement) {
    const medicationCenterSection =
        document.getElementById("medicationCenterSection");

    if (!medicationCenterSection) {
        return;
    }

    medicationCenterSection.style.display = "block";

    const asNeededContent = document.getElementById("asNeededMedicationContent");
    if (asNeededContent) {
        asNeededContent.style.display = "none";
    }

    if (medicationCenterCardHeading) {
        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▲";
    }

    scrollMedicationCenterTo(targetElement);
}

function openMedicationCenterForPeriod(periodKey) {
    const config = medicationSectionConfig[periodKey];

    if (!config) {
        return;
    }

    openMedicationCenter(document.getElementById(config.cardId));
}

let todayTasks =
    JSON.parse(localStorage.getItem("todayTasks")) || [];
    let taskListDate =
    localStorage.getItem("taskListDate") ||
    new Date().toDateString();

if (taskListDate !== new Date().toDateString()) {

    todayTasks = todayTasks
        .filter(task => !task.completed)
        .map(function (task) {
            return {
                text: task.text,
                completed: false
            };
        });

    taskListDate = new Date().toDateString();

    localStorage.setItem(
        "todayTasks",
        JSON.stringify(todayTasks)
    );

    localStorage.setItem(
        "taskListDate",
        taskListDate
    );
}

if (quickAccessGrid) {
    quickAccessGrid.addEventListener("click", function (event) {
        const button = event.target.closest(".quick-access-button");
        if (!button || !quickAccessGrid.contains(button)) {
            return;
        }

        const feature = button.dataset.feature || "This feature";
        const url = button.dataset.url;
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (feature === "Reminders") {
            alert("Apple Reminders does not currently expose a supported URL scheme that Safari can launch from a web page. Open the Reminders app manually.");
            return;
        }

        if (url) {
            if (isIOS) {
                window.location.href = url;
                return;
            }

            window.open(url, "_blank", "noopener,noreferrer");
            return;
        }

        alert(feature + " is under development.");
    });
}

if (todayTasks.length > 0 && todayList) {

    displayTodayTasks();

}

function updateAtAGlanceStatus() {
    if (summaryMedicationStatus) {
        const todayDate = new Date().toDateString();
        const medicationPeriods = medicationEventCompatibilityList
            .map(function (defaults, index) {
                const eventData = getMedicationEventForLegacyKey(defaults.id);
                if (!eventData) {
                    return null;
                }
                const normalizedTime = parseClockTimeTo24Hour(eventData && eventData.time) || defaults.defaultTime;
                const parts = normalizedTime.split(":");
                const minutes = Number(parts[0]) * 60 + Number(parts[1]);
                const orderValue = eventData && Number.isFinite(Number(eventData.order))
                    ? Number(eventData.order)
                    : defaults.defaultOrder;

                return {
                    key: defaults.id,
                    label: eventData && eventData.name ? eventData.name : defaults.summaryLabel,
                    minutes: Number.isFinite(minutes) ? minutes : 9999,
                    order: Number.isFinite(orderValue) ? orderValue : index + 1
                };
            })
            .filter(function (period) {
                return !!period;
            })
            .sort(function (a, b) {
                const timeDiff = a.minutes - b.minutes;
                if (timeDiff !== 0) {
                    return timeDiff;
                }
                return a.order - b.order;
            });

        if (!medicationPeriods.length) {
            summaryMedicationStatus.textContent = "No medication schedules configured.";
            return;
        }

        const nextPeriod = medicationPeriods.find(function (period) {
            const logEntry = medicationLog[period.key];
            return !(logEntry && logEntry.logged && logEntry.date === todayDate);
        });

        if (nextPeriod) {
            summaryMedicationStatus.innerHTML =
                'Next due: <button type="button" class="summary-medication-link" data-period-key="' +
                nextPeriod.key +
                '">' +
                nextPeriod.label +
                ' Medications</button>';
            return;
        }

        summaryMedicationStatus.textContent =
            "All scheduled medications completed today. ✓";
    }
}

window.updateAtAGlanceStatus = updateAtAGlanceStatus;
updateAtAGlanceStatus();

// Restore Wake-Up medication display
if (
    medicationLog.wakeUp?.logged &&
    medicationLog.wakeUp.date === new Date().toDateString()
) {

    medStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.wakeUp.time;
        

    wakeUpButton.textContent = "✅ Logged Today";
    const summaryWakeUp = document.getElementById("summaryWakeUp");

if (summaryWakeUp) {
    summaryWakeUp.textContent = "✅ Logged " + medicationLog.wakeUp.time;
}
    wakeUpButton.disabled = false;
}
// Restore Breakfast medication display
if (
    medicationLog.breakfast?.logged &&
    medicationLog.breakfast.date === new Date().toDateString()
) {

    breakfastStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.breakfast.time;
        
        

    breakfastButton.textContent = "✅ Logged Today";
    breakfastButton.disabled = false;

    updateAtAGlanceStatus();
}
// Restore Midday medication display
if (
    medicationLog.midday?.logged &&
    medicationLog.midday.date === new Date().toDateString()
) {
    middayStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.midday.time;
        
        

    middayButton.textContent = "✅ Logged Today";
    middayButton.disabled = false;
}
// Restore Dinner medication display
if (
    medicationLog.dinner?.logged &&
    medicationLog.dinner.date === new Date().toDateString()
) {

    dinnerStatus.innerHTML =
    "<strong>✅ Logged Today:</strong> " +
    medicationLog.dinner.time;



dinnerButton.textContent = "✅ Logged Today";
dinnerButton.disabled = false;
}
// Restore Evening medication display
if (
    medicationLog.evening?.logged &&
    medicationLog.evening.date === new Date().toDateString()
) {

    eveningStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.evening.time;
        
        

    eveningButton.textContent = "✅ Logged Today";
    eveningButton.disabled = false;
}
wakeUpButton.addEventListener("click", function () {
    console.log("Wake-Up button clicked");
const historyPeriod = getMedicationHistoryPeriod("wakeUp");
if (
    wakeUpButton.textContent === "✅ Logged Today"
) {
    medicationLog.wakeUp = {};
    medicationHistory = medicationHistory.filter(function (entry) {
    return !(
        entry.period === historyPeriod &&
        entry.date === new Date().toDateString()
    );
});

    saveMedicationLog();
localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);
    medStatus.textContent = "Not Logged";

    

        wakeUpButton.textContent = getMedicationButtonLabel("wakeUp");

    updateAtAGlanceStatus();

    return;
}

    const now = new Date();

    medicationLog.wakeUp = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    saveMedicationLog();
    medicationHistory.push({
    date: now.toDateString(),
    period: historyPeriod,
    time: medicationLog.wakeUp.time
});

localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);

    medStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.wakeUp.time;

        

    wakeUpButton.textContent = "✅ Logged Today";
    wakeUpButton.disabled = false;

    updateAtAGlanceStatus();

});

breakfastButton.addEventListener("click", function () {
    const historyPeriod = getMedicationHistoryPeriod("breakfast");
    if (
    breakfastButton.textContent === "✅ Logged Today"
) {
    breakfastButton.textContent = getMedicationButtonLabel("breakfast");

    breakfastStatus.textContent = "Not Logged";

    

// Remove today's Breakfast entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === historyPeriod &&
        entry.date === new Date().toDateString()
    );
});


medicationLog.breakfast = {};

saveMedicationLog();

    updateAtAGlanceStatus();

    return;
}

    const now = new Date();

    medicationLog.breakfast = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    saveMedicationLog();
    medicationHistory.push({
    date: now.toDateString(),
    period: historyPeriod,
    time: medicationLog.breakfast.time
});

localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);


    breakfastStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.breakfast.time;

    breakfastButton.textContent = "✅ Logged Today";
    breakfastButton.disabled = false;

    updateAtAGlanceStatus();

});

middayButton.addEventListener("click", function () {
    const historyPeriod = getMedicationHistoryPeriod("midday");
    if (
    middayButton.textContent === "✅ Logged Today"
) {
    middayButton.textContent = getMedicationButtonLabel("midday");

    middayStatus.textContent = "Not Logged";

    

// Remove today's Midday entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === historyPeriod &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.midday = {};

saveMedicationLog();

    updateAtAGlanceStatus();

    return;
}

    const now = new Date();

    medicationLog.midday = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    saveMedicationLog();
medicationHistory.push({
    date: now.toDateString(),
    period: historyPeriod,
    time: medicationLog.midday.time
});

localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);

    middayStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.midday.time;

    middayButton.textContent = "✅ Logged Today";
    middayButton.disabled = false;

    updateAtAGlanceStatus();

});
dinnerButton.addEventListener("click", function () {
    const historyPeriod = getMedicationHistoryPeriod("dinner");
    if (
    dinnerButton.textContent === "✅ Logged Today"
) {
    dinnerButton.textContent = getMedicationButtonLabel("dinner");

    dinnerStatus.textContent = "Not Logged";

    

// Remove today's Dinner entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === historyPeriod &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.dinner = {};

saveMedicationLog();

updateAtAGlanceStatus();

return;
}

    const now = new Date();

    medicationLog.dinner = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    saveMedicationLog();
    medicationHistory.push({
    date: now.toDateString(),
    period: historyPeriod,
    time: medicationLog.dinner.time
});

localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);

   dinnerStatus.innerHTML =
    "<strong>✅ Logged Today:</strong> " +
    medicationLog.dinner.time;



dinnerButton.textContent = "✅ Logged Today";
dinnerButton.disabled = false;

updateAtAGlanceStatus();

});
eveningButton.addEventListener("click", function () {
    const historyPeriod = getMedicationHistoryPeriod("evening");
    if (
    eveningButton.textContent === "✅ Logged Today"
) {
    eveningButton.textContent = getMedicationButtonLabel("evening");

    eveningStatus.textContent = "Not Logged";

    

// Remove today's Evening entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === historyPeriod &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.evening = {};

saveMedicationLog();

updateAtAGlanceStatus();

return;
}

    const now = new Date();

    medicationLog.evening = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    saveMedicationLog();
    
    medicationHistory.push({
    date: now.toDateString(),
    period: historyPeriod,
    time: medicationLog.evening.time
});

localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);



    eveningStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.evening.time;

    eveningButton.textContent = "✅ Logged Today";
    eveningButton.disabled = false;

    updateAtAGlanceStatus();

});

function updateDashboard() {

    if (medicationLog.wakeUp?.logged) {

        medStatus.innerHTML =
            "<strong>✅ Logged Today:</strong> " +
            medicationLog.wakeUp.time;

        wakeUpButton.textContent = "✅ Logged Today";

        const summaryWakeUp =
            document.getElementById("summaryWakeUp");


        if (summaryWakeUp) {
            summaryWakeUp.textContent =
                "✅ Logged " + medicationLog.wakeUp.time;
        }
    }

    wakeUpButton.disabled = false;
}

    


updateDashboard();
console.log(medicationHistory);
if (addTaskButton) {
    addTaskButton.addEventListener("click", function () {

        const task = prompt("Enter a task for today:");

        if (!task) {
            return;
        }

        todayTasks.push({
        text: task,
        completed: false
    });

    displayTodayTasks();

    localStorage.setItem(
        "todayTasks",
        JSON.stringify(todayTasks)
    );
    });
}
function displayTodayTasks() {

    if (!todayList) {
        return;
    }

    if (todayTasks.length === 0) {

        todayList.textContent = "No tasks yet.";
        return;

    }

    todayList.innerHTML =
        "<ul>" +
        todayTasks.map(function (task, index) {

            const checked =
                task.completed ? "checked" : "";

            return "<li><input type='checkbox' " +
                checked +
                " data-index='" + index + "'> " +
               "<span class='taskText'>" +
task.text +
"</span>" +
" <button class='deleteTaskBtn' style='font-size:14px; padding:2px 6px;' data-index='" +
index +
"'>🗑️</button>"
                "</li>";

        }).join("") +
        "</ul>";

    document.querySelectorAll("#todayList input[type='checkbox']")
        .forEach(function (checkbox) {

            checkbox.addEventListener("change", function () {

                const index = this.dataset.index;

                todayTasks[index].completed = this.checked;

                localStorage.setItem(
                    "todayTasks",
                    JSON.stringify(todayTasks)
                );

            });

        });

   document.querySelectorAll(".deleteTaskBtn")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const index = this.dataset.index;

            todayTasks.splice(index, 1);

            localStorage.setItem(
                "todayTasks",
                JSON.stringify(todayTasks)
            );

            displayTodayTasks();

        });

    });     
}


medicationCenterCardHeading.addEventListener("click", function () {

    const medicationCenterSection =
        document.getElementById("medicationCenterSection");

    const isOpening =
        medicationCenterSection.style.display === "none";

    if (isOpening) {
        openMedicationCenter();

    } else {

        if (typeof window.closeMedicationManagementModal === "function") {
            window.closeMedicationManagementModal();
        }

        if (typeof window.closeZepboundModal === "function") {
            window.closeZepboundModal();
        }

        medicationCenterSection.style.display = "none";

        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▼";

    }

});

if (summaryMedicationStatus) {
    summaryMedicationStatus.addEventListener("click", function (event) {
        const periodTrigger = event.target.closest(".summary-medication-link");

        if (!periodTrigger) {
            return;
        }

        openMedicationCenterForPeriod(periodTrigger.dataset.periodKey);
    });
}

backToTop.addEventListener("click", function () {

    if (typeof window.closeMedicationManagementModal === "function") {
        window.closeMedicationManagementModal();
    }

    if (typeof window.closeZepboundModal === "function") {
        window.closeZepboundModal();
    }

    document.getElementById("medicationCenterSection")
        .style.display = "none";

    medicationCenterCardHeading.textContent =
        "💊 Medication Center ▼";

    document.getElementById("greeting").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

if (pageBackToTop) {
    pageBackToTop.addEventListener("click", function () {
        const medicationCenterSection = document.getElementById("medicationCenterSection");

        if (
            medicationCenterSection &&
            medicationCenterSection.style.display === "block" &&
            backToTop
        ) {
            backToTop.click();
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}



function saveMedicationLog() {
    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );
}