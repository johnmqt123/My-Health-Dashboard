/**************************************************************************
 * medicationCenter.js
 * Medication Center UI
 **************************************************************************/

const manageMedicationsBtn =
    document.getElementById("manageMedicationsBtn");

const manageMedicationsModal =
    document.getElementById("manageMedicationsModal");

const manageMedicationsModalContent =
    document.getElementById("manageMedicationsModalContent");

const closeManageMedicationsModalBtn =
    document.getElementById("closeManageMedicationsModalBtn");

const manageMedicationsPanel =
    document.getElementById("manageMedicationsPanel");

const scheduleNotesModal =
    document.getElementById("scheduleNotesModal");

const scheduleNotesModalTitle =
    document.getElementById("scheduleNotesModalTitle");
const closeScheduleNotesModalBtn =
    document.getElementById("closeScheduleNotesModalBtn");

const medicationEditor =
    document.getElementById("medicationEditor");

const medicationEditArea =
    document.getElementById("medicationEditArea");

const logAsNeededMedicationButton =
    document.getElementById("logAsNeededMedicationButton");

const addAsNeededMedicationButton =
    document.getElementById("addAsNeededMedicationButton");

const asNeededMedicationModal =
    document.getElementById("asNeededMedicationModal");

const saveAsNeededMedicationBtn =
    document.getElementById("saveAsNeededMedicationBtn");

const cancelAsNeededMedicationBtn =
    document.getElementById("cancelAsNeededMedicationBtn");

const asNeededMedicationChoice =
    document.getElementById("asNeededMedicationChoice");

const asNeededMedicationNameInput =
    document.getElementById("asNeededMedicationNameInput");

const asNeededMedicationCount =
    document.getElementById("asNeededMedicationCount");

const asNeededMedicationNote =
    document.getElementById("asNeededMedicationNote");

const asNeededLastTakenDisplay =
    document.getElementById("asNeededLastTakenDisplay");

const asNeededAvailableMedicationList =
    document.getElementById("asNeededAvailableMedicationList");

const newAsNeededMedicationInput =
    document.getElementById("newAsNeededMedicationInput");

const newAsNeededMedicationDefaultQuantity =
    document.getElementById("newAsNeededMedicationDefaultQuantity");

const newAsNeededMedicationDefaultUnit =
    document.getElementById("newAsNeededMedicationDefaultUnit");

const saveAsNeededAvailableMedicationBtn =
    document.getElementById("saveAsNeededAvailableMedicationBtn");

const cancelAsNeededAvailableMedicationBtn =
    document.getElementById("cancelAsNeededAvailableMedicationBtn");

const asNeededAvailableMedicationFormLabel =
    document.getElementById("asNeededAvailableMedicationFormLabel");

const asNeededAvailableMedicationStatus =
    document.getElementById("asNeededAvailableMedicationStatus");

const asNeededMedicationUnit =
    document.getElementById("asNeededMedicationUnit");

const asNeededMedicationModalTitle =
    document.getElementById("asNeededMedicationModalTitle");

let asNeededMedicationHistory =
    loadData("asNeededMedicationHistory", []);
const AS_NEEDED_AVAILABLE_MEDICATIONS_KEY =
    "asNeededAvailableMedications";
const AS_NEEDED_DEFAULT_MEDICATIONS = [
    "ALA",
    "Tylenol"
];
const AS_NEEDED_DOSE_UNITS = [
    "tablet",
    "capsule",
    "drop",
    "teaspoon",
    "tablespoon",
    "mL",
    "puff",
    "dose",
    "application"
];
let asNeededAvailableMedications = [];
let editingAsNeededMedicationIndex = -1;
let editingAsNeededHistoryIndex = -1;
let medicationEditorLockedScrollTop = 0;
let medicationEditorReturnScrollSnapshot = null;
let activeScheduleNotesEventId = "";
let activeMedicationEditorGroupId = "";
let medicationEditorDraftMedications = [];
let medicationEditorStatusMessage = "";

function isMedicationCenterMedicationInjectable(medicationName) {
    return typeof isInjectableMedication === "function" &&
        isInjectableMedication(medicationName);
}

window.medicationCenterCapabilities = {
    isInjectableMedication: isMedicationCenterMedicationInjectable
};

function normalizeAsNeededMedicationName(name) {
    return String(name || "").replace(/\s+/g, " ").trim();
}

function getAsNeededMedicationCompareKey(name) {
    return normalizeAsNeededMedicationName(name).toLowerCase();
}

function normalizeAsNeededDoseQuantity(value, fallbackValue) {
    const quantity = Number(value);
    return Number.isFinite(quantity) && quantity > 0 ? quantity : fallbackValue;
}

function normalizeAsNeededDoseUnit(value) {
    return AS_NEEDED_DOSE_UNITS.indexOf(value) >= 0 ? value : "tablet";
}

function formatAsNeededDose(quantity, unit) {
    const normalizedQuantity = normalizeAsNeededDoseQuantity(quantity, 1);
    const normalizedUnit = normalizeAsNeededDoseUnit(unit);
    const displayQuantity = Number.isInteger(normalizedQuantity)
        ? String(normalizedQuantity)
        : String(normalizedQuantity);

    if (normalizedUnit === "mL") {
        return displayQuantity + " mL";
    }

    const displayUnit = normalizedQuantity === 1
        ? normalizedUnit
        : normalizedUnit === "dose"
            ? "doses"
            : normalizedUnit + "s";
    return displayQuantity + " " + displayUnit;
}

function getAsNeededOccurrenceDose(entry) {
    const isLegacyEntry = !Object.prototype.hasOwnProperty.call(entry || {}, "quantity");
    return {
        quantity: normalizeAsNeededDoseQuantity(
            isLegacyEntry ? entry && entry.tablets : entry && entry.quantity,
            1
        ),
        unit: normalizeAsNeededDoseUnit(isLegacyEntry ? "tablet" : entry && entry.unit)
    };
}

function getAsNeededMedicationDefinitionByName(name) {
    const compareKey = getAsNeededMedicationCompareKey(name);
    return asNeededAvailableMedications.find(function (definition) {
        return getAsNeededMedicationCompareKey(definition.name) === compareKey;
    }) || null;
}

function normalizeAsNeededMedicationDefinition(item) {
    const isLegacyName = typeof item === "string";
    const name = normalizeAsNeededMedicationName(isLegacyName ? item : item && item.name);
    if (!name) {
        return null;
    }

    return {
        name: name,
        defaultQuantity: normalizeAsNeededDoseQuantity(
            isLegacyName ? 1 : item.defaultQuantity,
            1
        ),
        defaultUnit: normalizeAsNeededDoseUnit(isLegacyName ? "tablet" : item.defaultUnit)
    };
}

function normalizeAsNeededMedicationDefinitions(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    const seen = new Set();

    return items.map(function (item) {
        return normalizeAsNeededMedicationDefinition(item);
    }).filter(function (item) {
        if (!item) {
            return false;
        }

        const key = getAsNeededMedicationCompareKey(item.name);
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function saveAsNeededAvailableMedications() {
    const storedDefinitions = asNeededAvailableMedications.map(function (definition) {
        if (definition.defaultQuantity === 1 && definition.defaultUnit === "tablet") {
            return definition.name;
        }

        return definition;
    });
    saveData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, storedDefinitions);
}

function loadAsNeededAvailableMedications() {
    const storedList = loadData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, null);

    if (!Array.isArray(storedList)) {
        return normalizeAsNeededMedicationDefinitions(AS_NEEDED_DEFAULT_MEDICATIONS);
    }

    return normalizeAsNeededMedicationDefinitions(storedList);
}

function setAsNeededAvailableMedicationStatus(messageText, isError) {
    if (!asNeededAvailableMedicationStatus) {
        return;
    }

    const message = String(messageText || "").trim();
    asNeededAvailableMedicationStatus.textContent = message;
    asNeededAvailableMedicationStatus.classList.toggle("error", !!isError && !!message);
}

function resetAsNeededAvailableMedicationEditor() {
    editingAsNeededMedicationIndex = -1;

    if (newAsNeededMedicationInput) {
        newAsNeededMedicationInput.value = "";
    }
    if (newAsNeededMedicationDefaultQuantity) {
        newAsNeededMedicationDefaultQuantity.value = "1";
    }
    if (newAsNeededMedicationDefaultUnit) {
        newAsNeededMedicationDefaultUnit.value = "tablet";
    }
    if (asNeededAvailableMedicationFormLabel) {
        asNeededAvailableMedicationFormLabel.textContent = "New As-Needed Medication";
    }
    if (saveAsNeededAvailableMedicationBtn) {
        saveAsNeededAvailableMedicationBtn.textContent = "Add Medication";
    }
    if (cancelAsNeededAvailableMedicationBtn) {
        cancelAsNeededAvailableMedicationBtn.style.display = "none";
    }
}

function renderAsNeededMedicationChoices() {
    if (!asNeededMedicationChoice) {
        return;
    }

    const previousValue = asNeededMedicationChoice.value;
    asNeededMedicationChoice.innerHTML = "";

    asNeededAvailableMedications.forEach(function (definition) {
        const option = document.createElement("option");
        option.value = definition.name;
        option.textContent = definition.name;
        asNeededMedicationChoice.appendChild(option);
    });

    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Other / custom medication";
    asNeededMedicationChoice.appendChild(customOption);

    const hasPreviousValue = asNeededAvailableMedications.some(function (definition) {
        return definition.name === previousValue;
    });

    if (previousValue === "custom") {
        asNeededMedicationChoice.value = "custom";
    } else if (hasPreviousValue) {
        asNeededMedicationChoice.value = previousValue;
    } else if (asNeededAvailableMedications.length) {
        asNeededMedicationChoice.value = asNeededAvailableMedications[0].name;
    } else {
        asNeededMedicationChoice.value = "custom";
    }

    updateAsNeededMedicationNameInputVisibility();
}

function confirmAsNeededMedicationRemove(medicationName) {
    return window.confirm(
        "Remove As-Needed Medication?\n\nAre you sure you want to remove " +
        medicationName +
        " from your available As-Needed medications?"
    );
}

function renderAsNeededAvailableMedicationList() {
    if (!asNeededAvailableMedicationList) {
        return;
    }

    if (!asNeededAvailableMedications.length) {
        asNeededAvailableMedicationList.innerHTML =
            "<p class=\"as-needed-empty\">No available medications yet. Add one below.</p>";
        return;
    }

    asNeededAvailableMedicationList.innerHTML = "";

    asNeededAvailableMedications.forEach(function (definition, index) {
        const row = document.createElement("div");
        row.className = "as-needed-available-row";

        const name = document.createElement("span");
        name.className = "as-needed-available-name";
        name.textContent = definition.name;

        const dose = document.createElement("span");
        dose.className = "as-needed-available-dose";
        dose.textContent = formatAsNeededDose(definition.defaultQuantity, definition.defaultUnit);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "history-action-btn edit as-needed-available-edit-btn";
        editButton.textContent = "Edit";
        editButton.setAttribute("data-index", String(index));

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "history-action-btn delete as-needed-available-remove-btn";
        removeButton.textContent = "Remove from List";
        removeButton.setAttribute("data-medication", definition.name);

        row.appendChild(name);
        row.appendChild(dose);
        row.appendChild(editButton);
        row.appendChild(removeButton);
        asNeededAvailableMedicationList.appendChild(row);
    });
}

function addAsNeededAvailableMedication() {
    if (!newAsNeededMedicationInput) {
        return;
    }

    const normalizedName = normalizeAsNeededMedicationName(newAsNeededMedicationInput.value);
    if (!normalizedName) {
        setAsNeededAvailableMedicationStatus("Enter a medication name to add.", true);
        return;
    }

    const compareKey = getAsNeededMedicationCompareKey(normalizedName);
    const defaultQuantity = normalizeAsNeededDoseQuantity(
        newAsNeededMedicationDefaultQuantity ? newAsNeededMedicationDefaultQuantity.value : 1,
        0
    );
    const defaultUnit = normalizeAsNeededDoseUnit(
        newAsNeededMedicationDefaultUnit ? newAsNeededMedicationDefaultUnit.value : "tablet"
    );

    if (!defaultQuantity) {
        setAsNeededAvailableMedicationStatus("Enter a default quantity greater than zero.", true);
        return;
    }

    const isDuplicate = asNeededAvailableMedications.some(function (definition, index) {
        return index !== editingAsNeededMedicationIndex &&
            getAsNeededMedicationCompareKey(definition.name) === compareKey;
    });

    if (isDuplicate) {
        setAsNeededAvailableMedicationStatus(
            normalizedName + " is already available for logging.",
            true
        );
        newAsNeededMedicationInput.value = "";
        return;
    }

    const existingDefinition = editingAsNeededMedicationIndex >= 0
        ? asNeededAvailableMedications[editingAsNeededMedicationIndex]
        : null;
    const originalName = existingDefinition ? existingDefinition.name : "";
    const definition = {
        name: normalizedName,
        defaultQuantity: defaultQuantity,
        defaultUnit: defaultUnit
    };

    if (editingAsNeededMedicationIndex >= 0) {
        asNeededAvailableMedications[editingAsNeededMedicationIndex] = definition;
    } else {
        asNeededAvailableMedications.push(definition);
    }

    if (existingDefinition && originalName !== normalizedName) {
        asNeededMedicationHistory.forEach(function (entry) {
            if (entry && typeof entry === "object" && entry.medication === originalName) {
                entry.medication = normalizedName;
            }
        });
        saveData("asNeededMedicationHistory", asNeededMedicationHistory);
        renderAsNeededMedicationHistory();
    }

    saveAsNeededAvailableMedications();
    renderAsNeededAvailableMedicationList();
    renderAsNeededMedicationChoices();
    setAsNeededAvailableMedicationStatus(
        "✓ " + normalizedName + " is ready for As-Needed logging.",
        false
    );
    newAsNeededMedicationInput.value = "";
    if (newAsNeededMedicationDefaultQuantity) {
        newAsNeededMedicationDefaultQuantity.value = "1";
    }
    if (newAsNeededMedicationDefaultUnit) {
        newAsNeededMedicationDefaultUnit.value = "tablet";
    }
    editingAsNeededMedicationIndex = -1;
    if (asNeededAvailableMedicationFormLabel) {
        asNeededAvailableMedicationFormLabel.textContent = "New As-Needed Medication";
    }
    if (saveAsNeededAvailableMedicationBtn) {
        saveAsNeededAvailableMedicationBtn.textContent = "Add Medication";
    }
    if (cancelAsNeededAvailableMedicationBtn) {
        cancelAsNeededAvailableMedicationBtn.style.display = "none";
    }
    newAsNeededMedicationInput.focus();
}

function removeAsNeededAvailableMedication(medicationName) {
    const compareKey = getAsNeededMedicationCompareKey(medicationName);
    const index = asNeededAvailableMedications.findIndex(function (definition) {
        return getAsNeededMedicationCompareKey(definition.name) === compareKey;
    });

    if (index < 0) {
        return;
    }

    const label = asNeededAvailableMedications[index].name;
    if (!confirmAsNeededMedicationRemove(label)) {
        return;
    }

    asNeededAvailableMedications.splice(index, 1);
    saveAsNeededAvailableMedications();
    renderAsNeededAvailableMedicationList();
    renderAsNeededMedicationChoices();
    setAsNeededAvailableMedicationStatus(label + " removed from available medications.", false);
}

function openAsNeededMedicationManager() {
    const asNeededContent = document.getElementById("asNeededMedicationContent");
    if (asNeededContent && typeof window.setMedicationSectionExpanded === "function") {
        window.setMedicationSectionExpanded(asNeededContent, true);
    } else if (asNeededContent) {
        asNeededContent.style.display = "block";
    }

    if (newAsNeededMedicationInput) {
        newAsNeededMedicationInput.focus();
    }
}

function getDefaultDateTimeValue() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
}

function formatDateTime(value) {
    if (!value) {
        return "Not logged yet";
    }

    const date = new Date(value);

    if (!isNaN(date.getTime())) {
        return date.toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    return value;
}

function saveMedicationSchedule() {
    if (window.medicationScheduleCompat && typeof window.medicationScheduleCompat.normalizeMedicationScheduleEvents === "function") {
        personalMedicationSchedule = window.medicationScheduleCompat.normalizeMedicationScheduleEvents(personalMedicationSchedule);
    }

    localStorage.setItem(
        "personalMedicationSchedule",
        JSON.stringify(personalMedicationSchedule)
    );

    if (typeof window.renderMedicationScheduleCards === "function") {
        window.renderMedicationScheduleCards();
    }

    if (typeof window.updateAtAGlanceStatus === "function") {
        window.updateAtAGlanceStatus();
    }
}

const expandedInjectableMedicationIds = new Set();

const mainInjectableDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

function getInjectableMedicationRegimenLabel(regimen) {
    if (!regimen || regimen.frequency !== "weekly" ||
        !Number.isInteger(regimen.dayOfWeek) ||
        !mainInjectableDayNames[regimen.dayOfWeek]) {
        return "Weekly schedule not configured";
    }

    return "Every " + mainInjectableDayNames[regimen.dayOfWeek];
}

function renderMainInjectableMedications() {
    const asNeededCard = document.getElementById("asNeededMedicationCard");
    const medicationCenterSection = document.getElementById("medicationCenterSection");
    const cardContainer = asNeededCard && asNeededCard.parentNode
        ? asNeededCard.parentNode
        : (medicationCenterSection ? medicationCenterSection.querySelector(".briefing") : null);

    if (!cardContainer || !asNeededCard) {
        return;
    }

    const existingSection = document.getElementById("mainInjectableMedicationsSection");
    if (existingSection) {
        existingSection.remove();
    }

    const definitionCompat = window.medicationDefinitionCompat || {};
    if (typeof definitionCompat.loadMedicationDefinitions !== "function") {
        return;
    }

    const existingCards = cardContainer.querySelectorAll(".main-injectable-medication-card");
    existingCards.forEach(function (card) {
        card.remove();
    });

    const definitions = definitionCompat.loadMedicationDefinitions().filter(function (definition) {
        return definition && definition.route === "injection" && definition.active !== false;
    });
    const regimens = typeof definitionCompat.loadInjectableMedicationRegimens === "function"
        ? definitionCompat.loadInjectableMedicationRegimens()
        : [];
    const providerCompat = window.injectionProviderCompat || {};
    const getInjectionProvider = typeof providerCompat.getInjectionProvider === "function"
        ? providerCompat.getInjectionProvider
        : null;

    definitions.forEach(function (definition) {
        const isExpanded = expandedInjectableMedicationIds.has(definition.id);
        const contentId = "injectableMedicationContent-" + definition.id;
        const card = document.createElement("section");
        card.className = "card medication-center-card main-injectable-medication-card";
        card.dataset.medicationId = definition.id;

        const heading = document.createElement("h2");
        heading.className = "main-injectable-medication-heading";
        heading.tabIndex = 0;
        heading.setAttribute("role", "button");
        heading.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        heading.setAttribute("aria-controls", contentId);
        heading.setAttribute("aria-label", definition.name + " injectable medication details");

        const headingMain = document.createElement("span");
        headingMain.className = "medication-heading-main";
        const headingTitle = document.createElement("span");
        headingTitle.className = "medication-heading-title";
        headingTitle.textContent = "💉 " + definition.name;
        const headingChevron = document.createElement("span");
        headingChevron.className = "medication-heading-chevron";
        headingChevron.setAttribute("aria-hidden", "true");
        headingChevron.textContent = isExpanded ? "⌄" : "›";
        headingMain.appendChild(headingTitle);
        headingMain.appendChild(headingChevron);
        heading.appendChild(headingMain);

        const regimen = regimens.find(function (candidate) {
            return candidate && candidate.medicationId === definition.id;
        });
        const schedule = document.createElement("span");
        schedule.className = "main-injectable-medication-schedule";
        schedule.textContent = getInjectableMedicationRegimenLabel(regimen);
        heading.appendChild(schedule);

        const content = document.createElement("div");
        content.id = contentId;
        content.className = "main-injectable-medication-content";
        content.style.display = isExpanded ? "grid" : "none";

        const trackingProvider = getInjectionProvider
            ? getInjectionProvider(definition)
            : null;
        if (trackingProvider && typeof trackingProvider.open === "function" &&
            (!trackingProvider.isAvailable || trackingProvider.isAvailable())) {
            const trackingButton = document.createElement("button");
            trackingButton.type = "button";
            trackingButton.className = "main-injectable-medication-tracking-button";
            trackingButton.textContent = "Open Injection Tracking";
            trackingButton.setAttribute("aria-label", "Open injection tracking for " + definition.name);
            trackingButton.addEventListener("click", function () {
                trackingProvider.open();
            });
            content.appendChild(trackingButton);
        }

        heading.addEventListener("click", function () {
            if (expandedInjectableMedicationIds.has(definition.id)) {
                expandedInjectableMedicationIds.delete(definition.id);
            } else {
                expandedInjectableMedicationIds.add(definition.id);
            }
            renderMainInjectableMedications();
        });
        heading.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            heading.click();
        });

        card.appendChild(heading);
        card.appendChild(content);
        cardContainer.insertBefore(card, asNeededCard);
    });
}

window.renderMainInjectableMedications = renderMainInjectableMedications;

function getMedicationScheduleGroupById(eventId) {
    if (!eventId || !Array.isArray(personalMedicationSchedule)) {
        return null;
    }

    return personalMedicationSchedule.find(function (group) {
        return group && group.id === eventId;
    }) || null;
}

function getMedicationScheduleGroupDisplayName(group) {
    return group && group.name
        ? group.name
        : (group && group.time ? group.time : "Schedule");
}

function closeScheduleNotesModal() {
    if (!scheduleNotesModal) {
        return;
    }

    scheduleNotesModal.style.display = "none";
    activeScheduleNotesEventId = "";
}

function openScheduleNotesModal(eventId) {
    if (!scheduleNotesModal || !scheduleNotesModalInput || !scheduleNotesModalTitle) {
        return;
    }

    const group = getMedicationScheduleGroupById(eventId);
    if (!group) {
        return;
    }

    activeScheduleNotesEventId = group.id;
    scheduleNotesModalTitle.textContent = getMedicationScheduleGroupDisplayName(group) + " Notes";
    scheduleNotesModalInput.value = group.notes || "";
    scheduleNotesModal.style.display = "flex";

    window.requestAnimationFrame(function () {
        scheduleNotesModalInput.focus();
    });
}

function getMedicationHistoryFor(medicationName) {
    return asNeededMedicationHistory.filter(function (entry) {
        return (entry.medication || "") === medicationName;
    });
}

function renderAsNeededMedicationHistory() {
    if (!asNeededLastTakenDisplay) {
        return;
    }

    if (!asNeededMedicationHistory.length) {
        asNeededLastTakenDisplay.textContent = "No as-needed medications logged yet.";
        return;
    }

    const latestByMedication = {};

    asNeededMedicationHistory.forEach(function (entry) {
        const medicationName = entry && entry.medication ? String(entry.medication).trim() : "";
        if (!medicationName) {
            return;
        }

        latestByMedication[medicationName] = entry;
    });

    const medicationNames = Object.keys(latestByMedication).sort(function (a, b) {
        return a.localeCompare(b);
    });

    if (!medicationNames.length) {
        asNeededLastTakenDisplay.textContent = "No as-needed medications logged yet.";
        return;
    }

    asNeededLastTakenDisplay.innerHTML = medicationNames.map(function (medicationName) {
        const latest = latestByMedication[medicationName];
        const historyIndex = asNeededMedicationHistory.lastIndexOf(latest);
        const dose = getAsNeededOccurrenceDose(latest);
        const noteText = latest.note ? " — " + latest.note : "";

        return "<div class=\"as-needed-entry\"><div class=\"history-entry-header\"><strong>" + medicationName +
            "</strong></div><div class=\"history-entry-meta\">Last Taken: " + formatDateTime(latest.dateTime) +
            " · " + formatAsNeededDose(dose.quantity, dose.unit) + noteText +
            "</div><div class=\"history-entry-actions\"><button type=\"button\" class=\"history-action-btn edit as-needed-edit-btn\" data-index=\"" +
            historyIndex + "\">Edit</button><button type=\"button\" class=\"history-action-btn delete medication-delete-btn as-needed-delete-btn\" data-medication=\"" +
            medicationName + "\" aria-label=\"Delete medication entry\">Delete Entry</button></div></div>";
    }).join("");
}

function resetAsNeededMedicationForm() {
    if (asNeededMedicationChoice) {
        if (asNeededAvailableMedications.length) {
            asNeededMedicationChoice.value = asNeededAvailableMedications[0].name;
        } else {
            asNeededMedicationChoice.value = "custom";
        }
    }

    if (asNeededMedicationNameInput) {
        asNeededMedicationNameInput.value = "";
        asNeededMedicationNameInput.style.display = "none";
    }

    if (asNeededMedicationCount) {
        asNeededMedicationCount.value = "1";
    }

    if (asNeededMedicationUnit) {
        asNeededMedicationUnit.value = "tablet";
    }

    if (asNeededMedicationNote) {
        asNeededMedicationNote.value = "";
    }

    updateAsNeededMedicationNameInputVisibility();
}

function openAsNeededMedicationModal(historyIndex) {
    editingAsNeededHistoryIndex = Number.isInteger(historyIndex) ? historyIndex : -1;
    resetAsNeededMedicationForm();

    if (editingAsNeededHistoryIndex >= 0) {
        const entry = asNeededMedicationHistory[editingAsNeededHistoryIndex];
        if (!entry) {
            editingAsNeededHistoryIndex = -1;
        } else {
            asNeededMedicationChoice.value = entry.medication;
            updateAsNeededMedicationNameInputVisibility();
            const dose = getAsNeededOccurrenceDose(entry);
            asNeededMedicationCount.value = String(dose.quantity);
            asNeededMedicationUnit.value = dose.unit;
            asNeededMedicationNote.value = entry.note || "";
        }
    }

    if (asNeededMedicationModalTitle) {
        asNeededMedicationModalTitle.textContent = editingAsNeededHistoryIndex >= 0
            ? "Edit As-Needed Medication Entry"
            : "Log As-Needed Medication";
    }

    if (asNeededMedicationModal) {
        asNeededMedicationModal.style.display = "block";
    }

    if (editingAsNeededHistoryIndex >= 0 && asNeededMedicationCount) {
        asNeededMedicationCount.focus();
    } else if (asNeededMedicationChoice && asNeededMedicationChoice.value === "custom" && asNeededMedicationNameInput) {
        asNeededMedicationNameInput.focus();
    } else if (asNeededMedicationChoice) {
        asNeededMedicationChoice.focus();
    }
}

function closeAsNeededMedicationModal() {
    if (asNeededMedicationModal) {
        asNeededMedicationModal.style.display = "none";
    }
}

function updateAsNeededMedicationNameInputVisibility() {
    if (!asNeededMedicationChoice || !asNeededMedicationNameInput) {
        return;
    }

    const isCustom = asNeededMedicationChoice.value === "custom";
    asNeededMedicationNameInput.style.display = isCustom ? "block" : "none";
    asNeededMedicationNameInput.required = isCustom;

    if (!isCustom) {
        asNeededMedicationNameInput.value = "";
        const definition = getAsNeededMedicationDefinitionByName(asNeededMedicationChoice.value);
        if (definition && asNeededMedicationCount && asNeededMedicationUnit) {
            asNeededMedicationCount.value = String(definition.defaultQuantity);
            asNeededMedicationUnit.value = definition.defaultUnit;
        }
    }
}

function updateManageMedicationsButtonLabel(isExpanded) {
    if (!manageMedicationsBtn) {
        return;
    }

    manageMedicationsBtn.textContent =
        "Manage Medications " + (isExpanded ? "▼" : "▶");
}

function isMedicationManagementModalOpen() {
    if (!manageMedicationsModal) {
        return false;
    }

    return window.getComputedStyle(manageMedicationsModal).display !== "none";
}

function resetMedicationManagementModalScrollToTop() {
    if (!manageMedicationsModalContent) {
        return;
    }

    manageMedicationsModalContent.scrollTop = 0;
}

function lockMedicationEditorBackgroundScroll() {
    medicationEditorLockedScrollTop = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("medication-editor-open");
    document.body.classList.add("medication-editor-open");
    document.body.style.top = "-" + medicationEditorLockedScrollTop + "px";
}

function unlockMedicationEditorBackgroundScroll() {
    document.documentElement.classList.remove("medication-editor-open");
    document.body.classList.remove("medication-editor-open");
    document.body.style.top = "";
    window.scrollTo(0, medicationEditorLockedScrollTop);
}

function captureMedicationEditorReturnScrollSnapshot() {
    medicationEditorReturnScrollSnapshot = {
        panelScrollTop: manageMedicationsModalContent ? manageMedicationsModalContent.scrollTop : 0
    };
}

function restoreMedicationEditorReturnScrollSnapshot() {
    if (!medicationEditorReturnScrollSnapshot) {
        return;
    }

    if (manageMedicationsModalContent) {
        manageMedicationsModalContent.scrollTo({
            top: Math.max(0, medicationEditorReturnScrollSnapshot.panelScrollTop || 0),
            behavior: "auto"
        });
    }

    medicationEditorReturnScrollSnapshot = null;
}

function openMedicationManagementModal() {
    if (!manageMedicationsModal) {
        return;
    }

    manageMedicationsModal.style.display = "flex";
    setMedicationScheduleListVisibility(true);
    buildMedicationList();
    resetMedicationManagementModalScrollToTop();
    lockMedicationEditorBackgroundScroll();
    updateManageMedicationsButtonLabel(true);
}

function closeMedicationManagementModal() {
    if (!manageMedicationsModal || !isMedicationManagementModalOpen()) {
        return;
    }

    manageMedicationsModal.style.display = "none";
    medicationEditArea.innerHTML = "";
    medicationEditArea.style.display = "none";
    setMedicationScheduleListVisibility(true);
    setAddScheduleControlsVisibility(true);
    medicationEditorReturnScrollSnapshot = null;
    updateManageMedicationsButtonLabel(false);
    unlockMedicationEditorBackgroundScroll();
}

updateManageMedicationsButtonLabel(false);

if (manageMedicationsBtn) {
    manageMedicationsBtn.addEventListener("click", function (event) {
        if (event) {
            event.preventDefault();
        }

        if (isMedicationManagementModalOpen()) {
            return;
        }

        openMedicationManagementModal();
    });
}

if (closeManageMedicationsModalBtn) {
    closeManageMedicationsModalBtn.addEventListener("click", function (event) {
        if (event) {
            event.preventDefault();
        }

        closeMedicationManagementModal();
    });
}

if (manageMedicationsModal) {
    manageMedicationsModal.addEventListener("touchmove", function (event) {
        if (!manageMedicationsModalContent) {
            return;
        }

        if (!manageMedicationsModalContent.contains(event.target)) {
            event.preventDefault();
        }
    }, {
        passive: false
    });
}

if (scheduleNotesModal) {
    scheduleNotesModal.addEventListener("touchmove", function (event) {
        const content = scheduleNotesModal.querySelector(".schedule-notes-modal-content");
        if (!content) {
            return;
        }

        if (!content.contains(event.target)) {
            event.preventDefault();
        }
    }, {
        passive: false
    });

    scheduleNotesModal.addEventListener("click", function (event) {
        if (event.target === scheduleNotesModal) {
            closeScheduleNotesModal();
        }
    });
}

if (closeScheduleNotesModalBtn) {
    closeScheduleNotesModalBtn.addEventListener("click", function () {
        closeScheduleNotesModal();
    });
}

if (saveScheduleNotesModalBtn) {
    saveScheduleNotesModalBtn.addEventListener("click", function () {
        const group = getMedicationScheduleGroupById(activeScheduleNotesEventId);
        if (!group) {
            closeScheduleNotesModal();
            return;
        }

        group.notes = scheduleNotesModalInput
            ? scheduleNotesModalInput.value
            : "";

        saveMedicationSchedule();

        if (typeof window.buildMedicationList === "function" && isMedicationManagementModalOpen()) {
            window.buildMedicationList();
        }

        closeScheduleNotesModal();
    });
}

window.closeMedicationManagementModal = closeMedicationManagementModal;
window.isMedicationManagementModalOpen = isMedicationManagementModalOpen;
window.openMedicationScheduleNotesModal = openScheduleNotesModal;

function buildMedicationList() {

    setMedicationScheduleListVisibility(true);
    medicationEditor.innerHTML = "";
    medicationEditArea.innerHTML = "";
    medicationEditArea.style.display = "none";

    if (!Array.isArray(personalMedicationSchedule)) {
        personalMedicationSchedule = [];
    }

    if (window.medicationScheduleCompat && typeof window.medicationScheduleCompat.normalizeMedicationScheduleEvents === "function") {
        personalMedicationSchedule = window.medicationScheduleCompat.normalizeMedicationScheduleEvents(personalMedicationSchedule);
    }

    const hasRegularSchedules = personalMedicationSchedule.length > 0;
    let firstUseRegularButton = null;

    if (hasRegularSchedules) {
        const scheduleHint = document.createElement("p");
        scheduleHint.className = "medication-editor-hint";
        scheduleHint.innerHTML = "<strong>Manage your Medication Schedule</strong><br>Set up your medication schedule and add medications to each schedule event.";
        medicationEditor.appendChild(scheduleHint);
    } else {
        const firstUseSection = document.createElement("section");
        firstUseSection.className = "medication-schedule-section medication-first-use";

        const firstUseTitle = document.createElement("h4");
        firstUseTitle.className = "medication-schedule-title";
        firstUseTitle.textContent = "Add a Medication";
        firstUseSection.appendChild(firstUseTitle);

        const firstUseDescription = document.createElement("p");
        firstUseDescription.className = "medication-editor-hint";
        firstUseDescription.textContent = "Choose the type of medication to add.";
        firstUseSection.appendChild(firstUseDescription);

        const firstUseActions = document.createElement("div");
        firstUseActions.className = "medication-editor-actions compact-actions";

        firstUseRegularButton = document.createElement("button");
        firstUseRegularButton.type = "button";
        firstUseRegularButton.textContent = "Regular Medication";

        const firstUseInjectableButton = document.createElement("button");
        firstUseInjectableButton.type = "button";
        firstUseInjectableButton.textContent = "Injectable Medication";

        firstUseActions.appendChild(firstUseRegularButton);
        firstUseActions.appendChild(firstUseInjectableButton);
        firstUseSection.appendChild(firstUseActions);
        medicationEditor.appendChild(firstUseSection);

        firstUseInjectableButton.addEventListener("click", function () {
            const addInjectableButton = medicationEditor.querySelector(".injectable-medication-add-btn");
            if (addInjectableButton) {
                addInjectableButton.click();
            }
        });
    }

    const sortedSchedule = window.medicationScheduleCompat && typeof window.medicationScheduleCompat.sortMedicationScheduleItems === "function"
        ? window.medicationScheduleCompat.sortMedicationScheduleItems(personalMedicationSchedule, function (group) {
            return window.medicationScheduleCompat.getMedicationScheduleItemMinutes
                ? window.medicationScheduleCompat.getMedicationScheduleItemMinutes(group, group && group.time)
                : null;
        })
        : personalMedicationSchedule.slice();

    sortedSchedule.forEach(function (group) {

        const groupName = group && group.name ? group.name : (group && group.time ? group.time : "Schedule");

        const section = document.createElement("section");
        section.className = "medication-schedule-section";

        const title = document.createElement("h4");
        title.className = "medication-schedule-title";
        title.textContent = groupName;
        section.appendChild(title);

        const list = document.createElement("ul");
        list.className = "medication-schedule-list";

        if (Array.isArray(group.medications) && group.medications.length) {
            group.medications.forEach(function (medicationName) {
                const item = document.createElement("li");
                item.textContent = medicationName;

                list.appendChild(item);
            });
        } else {
            const emptyItem = document.createElement("li");
            emptyItem.className = "medication-schedule-empty";
            emptyItem.textContent = "No medications yet.";
            list.appendChild(emptyItem);
        }

        section.appendChild(list);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "editMedicationBtn";
        editButton.dataset.eventId = group.id;
        editButton.textContent = "Edit " + groupName;
        section.appendChild(editButton);

        medicationEditor.appendChild(section);

    });

    renderInjectableMedicationManagement();

    const addTimeContainer = document.createElement("div");
    addTimeContainer.className = "add-medication-time-block";
    addTimeContainer.id = "addMedicationTimeControls";
    if (!hasRegularSchedules) {
        addTimeContainer.style.display = "none";
    }

    const addTimeLabel = document.createElement("label");
    addTimeLabel.setAttribute("for", "newMedicationTimeInput");
    addTimeLabel.textContent = hasRegularSchedules
        ? "Add Another Medication Schedule"
        : "Regular Medication Schedule";
    addTimeContainer.appendChild(addTimeLabel);

    const addTimeInput = document.createElement("input");
    addTimeInput.type = "text";
    addTimeInput.id = "newMedicationTimeInput";
    addTimeInput.style.width = "100%";
    addTimeContainer.appendChild(addTimeInput);

    const addTimeButton = document.createElement("button");
    addTimeButton.type = "button";
    addTimeButton.id = "addMedicationTimeBtn";
    addTimeButton.textContent = "Add Schedule";
    addTimeContainer.appendChild(addTimeButton);

    medicationEditor.appendChild(addTimeContainer);

    if (firstUseRegularButton) {
        firstUseRegularButton.addEventListener("click", function () {
            addTimeContainer.style.display = "grid";
            addTimeInput.focus();
        });
    }

    addTimeButton.addEventListener("click", function () {
        const normalized = addTimeInput.value.trim();
        if (!normalized) {
            alert("Please enter a schedule time.");
            return;
        }

        const exists = personalMedicationSchedule.some(function (group) {
            const groupName = group && group.name ? group.name : group.time;
            return String(groupName || "").toLowerCase() === normalized.toLowerCase();
        });

        if (exists) {
            alert("That schedule time already exists.");
            return;
        }

        const normalizedClockTime = window.medicationScheduleCompat && typeof window.medicationScheduleCompat.parseClockTimeTo24Hour === "function"
            ? window.medicationScheduleCompat.parseClockTimeTo24Hour(normalized)
            : "";

        personalMedicationSchedule.push({
            id: "event" + Date.now(),
            name: normalized,
            time: normalizedClockTime,
            order: personalMedicationSchedule.length + 1,
            medications: []
        });

        addTimeInput.value = "";
        saveMedicationSchedule();
        buildMedicationList();
    });

    document.querySelectorAll(".editMedicationBtn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const group =
                    personalMedicationSchedule.find(
                        item => item.id === this.dataset.eventId
                    );

                if (!group) {
                    return;
                }

                captureMedicationEditorReturnScrollSnapshot();
                setAddScheduleControlsVisibility(false);
                showMedicationEditor(group);
                scrollMedicationEditorIntoView(medicationEditArea);

            });

        });

}

function setAddScheduleControlsVisibility(isVisible) {
    const addTimeContainer = document.getElementById("addMedicationTimeControls");
    if (!addTimeContainer) {
        return;
    }

    addTimeContainer.style.display = isVisible ? "grid" : "none";
}

function setMedicationScheduleListVisibility(isVisible) {
    if (!medicationEditor) {
        return;
    }

    medicationEditor.style.display = isVisible ? "block" : "none";
}

function closeMedicationEditor() {
    medicationEditArea.innerHTML = "";
    medicationEditArea.style.display = "none";
    setMedicationScheduleListVisibility(true);
    setAddScheduleControlsVisibility(true);
    restoreMedicationEditorReturnScrollSnapshot();
    activeMedicationEditorGroupId = "";
    medicationEditorDraftMedications = [];
}

function getMedicationEditorScrollContainer() {
    return manageMedicationsModalContent || null;
}

function scrollMedicationListToTop() {
    const scrollContainer = getMedicationEditorScrollContainer();
    if (scrollContainer) {
        scrollContainer.scrollTo({
            top: 0,
            behavior: "auto"
        });
        return;
    }

}

function scrollMedicationEditorIntoView(targetElement) {
    const target = targetElement || medicationEditArea;
    if (!target) {
        return;
    }

    window.requestAnimationFrame(function () {
        const scrollContainer = getMedicationEditorScrollContainer();
        if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            const scrollTop =
                scrollContainer.scrollTop +
                (targetRect.top - containerRect.top) -
                12;

            scrollContainer.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: "auto"
            });
        }
    });
}

const injectableDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

function getMedicationDefinitionCompat() {
    return window.medicationDefinitionCompat || null;
}

function getInjectableMedicationDefinitions() {
    const compat = getMedicationDefinitionCompat();
    if (!compat || typeof compat.loadMedicationDefinitions !== "function") {
        return [];
    }

    return compat.loadMedicationDefinitions().filter(function (definition) {
        return definition && definition.route === "injection";
    });
}

function getInjectableRegimenForMedication(regimens, medicationId) {
    return regimens.find(function (regimen) {
        return regimen && regimen.medicationId === medicationId;
    }) || null;
}

function getInjectableRegimenLabel(regimen) {
    if (!regimen || regimen.frequency !== "weekly" ||
        !Number.isInteger(regimen.dayOfWeek) ||
        !injectableDayNames[regimen.dayOfWeek]) {
        return "Weekly schedule not configured";
    }

    return "Every " + injectableDayNames[regimen.dayOfWeek];
}

function refreshInjectableMedicationPresentation() {
    if (typeof window.renderMedicationScheduleCards === "function") {
        window.renderMedicationScheduleCards();
    }
}

function createInjectableDaySelect(selectedDay) {
    const select = document.createElement("select");
    select.id = "injectableDayOfWeekInput";
    select.className = "medication-edit-input";
    select.setAttribute("aria-label", "Weekly day");

    injectableDayNames.forEach(function (dayName, dayOfWeek) {
        const option = document.createElement("option");
        option.value = String(dayOfWeek);
        option.textContent = dayName;
        select.appendChild(option);
    });

    select.value = Number.isInteger(selectedDay) && selectedDay >= 0 && selectedDay <= 6
        ? String(selectedDay)
        : "5";
    return select;
}

function saveInjectableDefinition(definition, nameInput, daySelect, isNew) {
    const compat = getMedicationDefinitionCompat();
    if (!compat || typeof compat.loadMedicationDefinitions !== "function" ||
        typeof compat.saveMedicationDefinitions !== "function" ||
        typeof compat.loadInjectableMedicationRegimens !== "function" ||
        typeof compat.saveInjectableMedicationRegimens !== "function") {
        return;
    }

    const name = nameInput.value.replace(/\s+/g, " ").trim();
    const dayOfWeek = Number(daySelect.value);
    if (!name) {
        alert("Please enter an injectable medication name.");
        nameInput.focus();
        return;
    }

    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        alert("Please select a valid weekly day.");
        daySelect.focus();
        return;
    }

    const definitions = compat.loadMedicationDefinitions();
    const duplicate = definitions.some(function (existing) {
        return existing.active && existing.id !== (definition ? definition.id : "") &&
            String(existing.name || "").trim().toLowerCase() === name.toLowerCase();
    });
    if (duplicate) {
        alert("An active medication with that name already exists.");
        nameInput.focus();
        return;
    }

    const savedDefinition = definition
        ? Object.assign({}, definition, {
            name: name,
            route: "injection"
        })
        : {
            id: compat.generateMedicationDefinitionId(),
            name: name,
            route: "injection",
            active: true
        };
    const nextDefinitions = isNew
        ? definitions.concat(savedDefinition)
        : definitions.map(function (existing) {
            return existing.id === savedDefinition.id ? savedDefinition : existing;
        });

    compat.saveMedicationDefinitions(nextDefinitions);

    const regimens = compat.loadInjectableMedicationRegimens();
    const nextRegimen = {
        medicationId: savedDefinition.id,
        frequency: "weekly",
        dayOfWeek: dayOfWeek
    };
    const nextRegimens = regimens.some(function (regimen) {
        return regimen.medicationId === savedDefinition.id;
    })
        ? regimens.map(function (regimen) {
            return regimen.medicationId === savedDefinition.id ? nextRegimen : regimen;
        })
        : regimens.concat(nextRegimen);
    compat.saveInjectableMedicationRegimens(nextRegimens);

    buildMedicationList();
    refreshInjectableMedicationPresentation();
}

function setInjectableDefinitionActive(definition, isActive) {
    const compat = getMedicationDefinitionCompat();
    if (!compat || typeof compat.loadMedicationDefinitions !== "function" ||
        typeof compat.saveMedicationDefinitions !== "function") {
        return;
    }

    const definitions = compat.loadMedicationDefinitions();
    const duplicateActiveName = isActive && definitions.some(function (existing) {
        return existing.active && existing.id !== definition.id &&
            String(existing.name || "").trim().toLowerCase() ===
            String(definition.name || "").trim().toLowerCase();
    });
    if (duplicateActiveName) {
        alert("An active medication with that name already exists.");
        return;
    }

    compat.saveMedicationDefinitions(definitions.map(function (existing) {
        return existing.id === definition.id
            ? Object.assign({}, existing, { active: isActive })
            : existing;
    }));
    buildMedicationList();
    refreshInjectableMedicationPresentation();
}

function renderInjectableMedicationManagement() {
    const compat = getMedicationDefinitionCompat();
    if (!compat || !medicationEditor ||
        typeof compat.loadMedicationDefinitions !== "function") {
        return;
    }

    const definitions = getInjectableMedicationDefinitions();
    const regimens = typeof compat.loadInjectableMedicationRegimens === "function"
        ? compat.loadInjectableMedicationRegimens()
        : [];
    const section = document.createElement("section");
    section.className = "medication-schedule-section injectable-medication-management";

    const title = document.createElement("h4");
    title.className = "medication-schedule-title";
    title.textContent = "Injectable Medications";
    section.appendChild(title);

    const list = document.createElement("div");
    list.className = "injectable-medication-definition-list";

    if (!definitions.length) {
        const empty = document.createElement("p");
        empty.className = "medication-schedule-empty";
        empty.textContent = "No injectable medications added yet.";
        list.appendChild(empty);
    }

    definitions.forEach(function (definition) {
        const row = document.createElement("div");
        row.className = "injectable-medication-definition-row" +
            (definition.active ? "" : " is-inactive");

        const details = document.createElement("div");
        details.className = "injectable-medication-definition-details";
        const name = document.createElement("strong");
        name.textContent = definition.name;
        const schedule = document.createElement("span");
        schedule.textContent = getInjectableRegimenLabel(
            getInjectableRegimenForMedication(regimens, definition.id)
        );
        details.appendChild(name);
        details.appendChild(schedule);

        const actions = document.createElement("div");
        actions.className = "injectable-medication-definition-actions";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "editMedicationBtn";
        editButton.textContent = "Edit " + definition.name;
        editButton.addEventListener("click", function () {
            openInjectableDefinitionEditor(section, definition);
        });
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = definition.active
            ? "injectable-medication-deactivate-btn"
            : "injectable-medication-activate-btn";
        toggleButton.textContent = definition.active ? "Deactivate" : "Activate";
        toggleButton.setAttribute("aria-label", (definition.active ? "Deactivate " : "Activate ") + definition.name);
        toggleButton.addEventListener("click", function () {
            setInjectableDefinitionActive(definition, !definition.active);
        });
        actions.appendChild(editButton);
        actions.appendChild(toggleButton);

        row.appendChild(details);
        row.appendChild(actions);
        list.appendChild(row);
    });

    section.appendChild(list);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "editMedicationBtn injectable-medication-add-btn";
    addButton.textContent = "Add Injectable Medication";
    addButton.addEventListener("click", function () {
        openInjectableDefinitionEditor(section, null);
    });
    section.appendChild(addButton);
    medicationEditor.appendChild(section);
}

function openInjectableDefinitionEditor(section, definition) {
    const compat = getMedicationDefinitionCompat();
    if (!compat || typeof compat.loadInjectableMedicationRegimens !== "function") {
        return;
    }

    const existingEditor = section.querySelector(".injectable-medication-definition-editor");
    if (existingEditor) {
        existingEditor.remove();
    }

    const regimens = compat.loadInjectableMedicationRegimens();
    const regimen = definition
        ? getInjectableRegimenForMedication(regimens, definition.id)
        : null;
    const editor = document.createElement("div");
    editor.className = "injectable-medication-definition-editor";

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "injectableMedicationNameInput");
    nameLabel.textContent = "Medication Name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "injectableMedicationNameInput";
    nameInput.className = "medication-edit-input";
    nameInput.value = definition ? definition.name : "";

    const routeLabel = document.createElement("label");
    routeLabel.textContent = "Route";
    const routeValue = document.createElement("span");
    routeValue.className = "injectable-medication-route-value";
    routeValue.textContent = "Injection";

    const frequencyLabel = document.createElement("label");
    frequencyLabel.setAttribute("for", "injectableFrequencyInput");
    frequencyLabel.textContent = "Frequency";
    const frequencySelect = document.createElement("select");
    frequencySelect.id = "injectableFrequencyInput";
    frequencySelect.className = "medication-edit-input";
    const weeklyOption = document.createElement("option");
    weeklyOption.value = "weekly";
    weeklyOption.textContent = "Weekly";
    frequencySelect.appendChild(weeklyOption);

    const dayLabel = document.createElement("label");
    dayLabel.setAttribute("for", "injectableDayOfWeekInput");
    dayLabel.textContent = "Day of week";
    const daySelect = createInjectableDaySelect(regimen ? regimen.dayOfWeek : 5);

    const fields = document.createElement("div");
    fields.className = "injectable-medication-definition-fields";
    [[nameLabel, nameInput], [routeLabel, routeValue], [frequencyLabel, frequencySelect], [dayLabel, daySelect]]
        .forEach(function (field) {
            const group = document.createElement("div");
            group.appendChild(field[0]);
            group.appendChild(field[1]);
            fields.appendChild(group);
        });

    const actions = document.createElement("div");
    actions.className = "medication-editor-actions compact-actions";
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "editMedicationBtn";
    saveButton.textContent = "Save Injectable";
    saveButton.addEventListener("click", function () {
        if (frequencySelect.value !== "weekly") {
            alert("Please select Weekly frequency.");
            return;
        }
        if (definition && definition.route !== "injection") {
            alert("The medication route must be Injection.");
            return;
        }
        saveInjectableDefinition(definition, nameInput, daySelect, !definition);
    });
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "injectable-medication-cancel-btn";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function () {
        editor.remove();
    });
    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    editor.appendChild(fields);
    editor.appendChild(actions);
    section.appendChild(editor);
    nameInput.focus();
}

function normalizeMedicationDraftItems(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map(function (item) {
        return String(item || "").trim();
    }).filter(function (item) {
        return !!item;
    });
}

function medicationDraftHasValue(medicationName) {
    const normalized = String(medicationName || "").trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    return medicationEditorDraftMedications.some(function (item) {
        return String(item || "").trim().toLowerCase() === normalized;
    });
}

function confirmMedicationDraftRemove(medicationName) {
    const label = String(medicationName || "medication").trim() || "medication";
    return window.confirm(
        "Remove Medication?\n\nAre you sure you want to remove " +
        label +
        " from this schedule?"
    );
}

function setMedicationEditorStatusMessage(messageText) {
    medicationEditorStatusMessage = String(messageText || "").trim();

    const statusElement = document.getElementById("medicationDraftStatusMessage");
    if (!statusElement) {
        return;
    }

    if (!medicationEditorStatusMessage) {
        statusElement.textContent = "";
        statusElement.style.display = "none";
        return;
    }

    statusElement.textContent = medicationEditorStatusMessage;
    statusElement.style.display = "block";
}

function syncMedicationDraftsToEditor() {
    const list = document.getElementById("currentMedicationList");
    if (!list) {
        return;
    }

    medicationEditorDraftMedications = normalizeMedicationDraftItems(medicationEditorDraftMedications);
    list.innerHTML = "";

    if (!medicationEditorDraftMedications.length) {
        const emptyState = document.createElement("p");
        emptyState.className = "medication-draft-empty";
        emptyState.textContent = "No medications added yet.";
        list.appendChild(emptyState);
        return;
    }

    medicationEditorDraftMedications.forEach(function (medicationName, index) {
        const row = document.createElement("div");
        row.className = "medication-draft-row";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "medication-edit-input medication-draft-input";
        input.value = medicationName;
        input.setAttribute("aria-label", "Medication " + (index + 1));

        input.addEventListener("input", function () {
            medicationEditorDraftMedications[index] = input.value;
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "medication-draft-remove-btn";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            if (!confirmMedicationDraftRemove(medicationEditorDraftMedications[index])) {
                return;
            }

            medicationEditorDraftMedications.splice(index, 1);
            syncMedicationDraftsToEditor();
        });

        row.appendChild(input);
        row.appendChild(removeButton);
        list.appendChild(row);
    });
}

function addMedicationDraftFromInput() {
    const input = document.getElementById("newMedicationInput");
    if (!input) {
        return false;
    }

    const medicationName = input.value.trim();
    if (!medicationName) {
        return false;
    }

    if (medicationDraftHasValue(medicationName)) {
        input.value = "";
        return false;
    }

    medicationEditorDraftMedications.push(medicationName);
    input.value = "";
    syncMedicationDraftsToEditor();
    setMedicationEditorStatusMessage(
        "✓ " + medicationName + " added. Tap Save to keep this change."
    );

    if (typeof input.blur === "function") {
        input.blur();
    }

    return true;
}

function commitMedicationDraftsToGroup(group) {
    if (!group) {
        return;
    }

    const normalizedDrafts = normalizeMedicationDraftItems(medicationEditorDraftMedications);
    const pendingInput = document.getElementById("newMedicationInput");
    const pendingMedication = pendingInput ? pendingInput.value.trim() : "";

    if (pendingMedication) {
        const isDuplicate = normalizedDrafts.some(function (item) {
            return item.toLowerCase() === pendingMedication.toLowerCase();
        });

        if (!isDuplicate) {
            normalizedDrafts.push(pendingMedication);
        }

        if (pendingInput) {
            pendingInput.value = "";
        }
    }

    group.medications = normalizeMedicationDraftItems(normalizedDrafts);
    medicationEditorDraftMedications = group.medications.slice();

    if (window.medicationCenterCapabilities &&
        typeof window.medicationCenterCapabilities.onMedicationConfigured === "function") {
        group.medications.forEach(function (medicationName) {
            window.medicationCenterCapabilities.onMedicationConfigured(medicationName);
        });
    }
}

function showNotesEditor(group) {

    const groupName = group && group.name ? group.name : (group && group.time ? group.time : "Schedule");

    medicationEditArea.innerHTML = `
<div class="medication-edit-card">
    <h4>${groupName} Notes</h4>

    <label for="groupNotesInput">Schedule Notes</label>
    <textarea
        id="groupNotesInput"
        rows="5"
        class="medication-edit-input"
    >${group.notes || ""}</textarea>

    <div class="medication-editor-actions compact-actions">
        <button id="saveNotesBtn" type="button">Save Notes</button>
        <button id="closeNotesBtn" type="button">Close</button>
    </div>
</div>
`;

    medicationEditArea.style.display = "block";
    setMedicationScheduleListVisibility(false);

    document.getElementById("saveNotesBtn")
        .addEventListener("click", function () {

            group.notes =
                document.getElementById("groupNotesInput").value;

            saveMedicationSchedule();

            showMedicationEditor(group);
            scrollMedicationEditorIntoView(medicationEditArea);

        });

    document.getElementById("closeNotesBtn")
        .addEventListener("click", function () {
            showMedicationEditor(group);
            scrollMedicationEditorIntoView(medicationEditArea);
        });

}

function showMedicationEditor(group) {

    const groupName = group && group.name ? group.name : (group && group.time ? group.time : "Schedule");
    const groupTime = window.medicationScheduleCompat && typeof window.medicationScheduleCompat.parseClockTimeTo24Hour === "function"
        ? window.medicationScheduleCompat.parseClockTimeTo24Hour(group && group.time ? group.time : "")
        : (group && group.time ? group.time : "");

    activeMedicationEditorGroupId = group && group.id ? group.id : "";
    medicationEditorDraftMedications = Array.isArray(group && group.medications)
        ? group.medications.slice()
        : [];
    medicationEditorStatusMessage = "";

    medicationEditArea.innerHTML = `
<div class="medication-edit-card">
    <h4>Editing ${groupName}</h4>

    <div class="medication-edit-grid">
        <div>
            <label for="editScheduleEventNameInput">Schedule Event Name</label>
            <input type="text" id="editScheduleEventNameInput" class="medication-edit-input">
        </div>
        <div>
            <label for="editScheduleEventTimeInput">Scheduled Time</label>
            <input type="time" id="editScheduleEventTimeInput" class="medication-edit-input">
        </div>
    </div>

    <label for="newMedicationInput">New Medication</label>
    <div class="medication-add-medication-row">
        <input type="text" id="newMedicationInput" class="medication-edit-input" autocomplete="off">
        <button id="addMedicationBtn" type="button">Add Medication</button>
    </div>

    <p id="medicationDraftStatusMessage" class="medication-draft-status" style="display: none;" aria-live="polite"></p>

    <div class="medication-current-list-block">
        <label>Existing Medications</label>
        <div id="currentMedicationList" class="medication-current-list" aria-live="polite"></div>
    </div>

    <div class="medication-editor-secondary-actions">
        <button id="openNotesEditorBtn" type="button">Notes</button>
        <button id="deleteScheduleBtn" type="button">Delete Schedule</button>
    </div>

    <div class="medication-editor-actions compact-actions">
        <button id="saveMedicationBtn" type="button">Save</button>
        <button id="cancelMedicationEditBtn" type="button">Cancel</button>
    </div>
</div>
`;

    medicationEditArea.style.display = "block";
    setMedicationScheduleListVisibility(false);

    const editScheduleEventNameInput = document.getElementById("editScheduleEventNameInput");
    const editScheduleEventTimeInput = document.getElementById("editScheduleEventTimeInput");

    if (editScheduleEventNameInput) {
        editScheduleEventNameInput.value = groupName;
    }

    if (editScheduleEventTimeInput) {
        editScheduleEventTimeInput.value = groupTime;
    }

    syncMedicationDraftsToEditor();

    function registerKeyboardVisibilityFocus(inputElement) {
        if (!inputElement) {
            return;
        }

        let pendingFocusScrollId = null;

        inputElement.addEventListener("focus", function () {
            if (pendingFocusScrollId) {
                window.clearTimeout(pendingFocusScrollId);
            }

            pendingFocusScrollId = window.setTimeout(function () {
                pendingFocusScrollId = null;

                if (document.activeElement !== inputElement) {
                    return;
                }

                scrollMedicationEditorIntoView(inputElement);
            }, 120);
        });

        inputElement.addEventListener("blur", function () {
            if (pendingFocusScrollId) {
                window.clearTimeout(pendingFocusScrollId);
                pendingFocusScrollId = null;
            }
        });
    }

    registerKeyboardVisibilityFocus(editScheduleEventNameInput);
    registerKeyboardVisibilityFocus(editScheduleEventTimeInput);

    document.getElementById("addMedicationBtn")
        .addEventListener("click", function () {
            if (!addMedicationDraftFromInput()) {
                alert("Please enter a medication.");
            }

        });

    const newMedicationInput = document.getElementById("newMedicationInput");
    if (newMedicationInput) {
        newMedicationInput.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") {
                return;
            }

            event.preventDefault();

            if (!addMedicationDraftFromInput()) {
                alert("Please enter a medication.");
            }
        });
    }

    document.getElementById("openNotesEditorBtn")
        .addEventListener("click", function () {
            showNotesEditor(group);
            scrollMedicationEditorIntoView(medicationEditArea);
        });

    document.getElementById("deleteScheduleBtn")
        .addEventListener("click", function () {
            const scheduleName = group && group.name ? group.name : "this schedule";
            const confirmDelete = window.confirm(
                "Delete the entire medication schedule \"" + scheduleName + "\"? This will remove its medications, schedule notes, today's logged status, and associated medication history."
            );

            if (!confirmDelete) {
                return;
            }

            personalMedicationSchedule = personalMedicationSchedule.filter(function (entry) {
                return entry && entry.id !== group.id;
            });

            if (group && group.id && medicationLog[group.id]) {
                delete medicationLog[group.id];
                localStorage.setItem("medicationLog", JSON.stringify(medicationLog));
            }

            if (window.medicationScheduleCompat && typeof window.medicationScheduleCompat.getMedicationHistoryPeriod === "function") {
                const historyPeriod = window.medicationScheduleCompat.getMedicationHistoryPeriod(group.id);
                medicationHistory = medicationHistory.filter(function (entry) {
                    return entry && entry.period !== historyPeriod;
                });
                localStorage.setItem("medicationHistory", JSON.stringify(medicationHistory));
            }

            saveMedicationSchedule();
            buildMedicationList();
            closeMedicationEditor();
        });

    document.getElementById("saveMedicationBtn")
        .addEventListener("click", function () {

            const updatedName =
                document.getElementById("editScheduleEventNameInput")
                    .value
                    .trim();

            if (!updatedName) {
                alert("Please enter a schedule event name.");
                return;
            }

            const editedTimeRaw =
                document.getElementById("editScheduleEventTimeInput")
                    .value
                    .trim();

            const normalizedTime = window.medicationScheduleCompat && typeof window.medicationScheduleCompat.parseClockTimeTo24Hour === "function"
                ? window.medicationScheduleCompat.parseClockTimeTo24Hour(editedTimeRaw)
                : editedTimeRaw;

            if (!normalizedTime) {
                alert("Please enter a scheduled time.");
                return;
            }

            group.name = updatedName;
            group.time = normalizedTime;

            commitMedicationDraftsToGroup(group);

            saveMedicationSchedule();

            buildMedicationList();
            restoreMedicationEditorReturnScrollSnapshot();

            alert("Medication list updated.");

        });

    document.getElementById("cancelMedicationEditBtn")
        .addEventListener("click", function () {
            closeMedicationEditor();
        });

}

if (logAsNeededMedicationButton) {
    logAsNeededMedicationButton.addEventListener("click", openAsNeededMedicationModal);
}

if (addAsNeededMedicationButton) {
    addAsNeededMedicationButton.addEventListener("click", openAsNeededMedicationManager);
}

if (saveAsNeededAvailableMedicationBtn) {
    saveAsNeededAvailableMedicationBtn.addEventListener("click", addAsNeededAvailableMedication);
}

if (newAsNeededMedicationInput) {
    newAsNeededMedicationInput.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        addAsNeededAvailableMedication();
    });
}

if (cancelAsNeededAvailableMedicationBtn) {
    cancelAsNeededAvailableMedicationBtn.addEventListener("click", function () {
        resetAsNeededAvailableMedicationEditor();
        setAsNeededAvailableMedicationStatus("Medication edit canceled.", false);
        if (newAsNeededMedicationInput) {
            newAsNeededMedicationInput.focus();
        }
    });
}

if (asNeededAvailableMedicationList) {
    asNeededAvailableMedicationList.addEventListener("click", function (event) {
        const editButton = event.target.closest(".as-needed-available-edit-btn");
        if (editButton && asNeededAvailableMedicationList.contains(editButton)) {
            const index = Number(editButton.getAttribute("data-index"));
            const definition = asNeededAvailableMedications[index];
            if (!definition || !newAsNeededMedicationInput) {
                return;
            }

            editingAsNeededMedicationIndex = index;
            newAsNeededMedicationInput.value = definition.name;
            if (newAsNeededMedicationDefaultQuantity) {
                newAsNeededMedicationDefaultQuantity.value = String(definition.defaultQuantity);
            }
            if (newAsNeededMedicationDefaultUnit) {
                newAsNeededMedicationDefaultUnit.value = definition.defaultUnit;
            }
            if (saveAsNeededAvailableMedicationBtn) {
                saveAsNeededAvailableMedicationBtn.textContent = "Save Medication";
            }
            if (asNeededAvailableMedicationFormLabel) {
                asNeededAvailableMedicationFormLabel.textContent = "Edit As-Needed Medication";
            }
            if (cancelAsNeededAvailableMedicationBtn) {
                cancelAsNeededAvailableMedicationBtn.style.display = "inline-block";
            }
            newAsNeededMedicationInput.focus();
            return;
        }

        const removeButton = event.target.closest(".as-needed-available-remove-btn");
        if (!removeButton || !asNeededAvailableMedicationList.contains(removeButton)) {
            return;
        }

        const medicationName = removeButton.getAttribute("data-medication") || "";
        removeAsNeededAvailableMedication(medicationName);
    });
}

if (asNeededMedicationChoice) {
    asNeededMedicationChoice.addEventListener("change", function () {
        updateAsNeededMedicationNameInputVisibility();

        if (asNeededMedicationChoice.value === "custom" && asNeededMedicationNameInput) {
            asNeededMedicationNameInput.focus();
        }
    });
}

if (saveAsNeededMedicationBtn) {
    saveAsNeededMedicationBtn.addEventListener("click", function () {
        const selectedChoice = asNeededMedicationChoice
            ? asNeededMedicationChoice.value
            : "custom";

        const medicationName = selectedChoice === "custom"
            ? (asNeededMedicationNameInput ? asNeededMedicationNameInput.value.trim() : "")
            : selectedChoice;

        if (!medicationName) {
            alert("Please enter a medication name.");
            return;
        }

        const quantity = normalizeAsNeededDoseQuantity(
            asNeededMedicationCount ? asNeededMedicationCount.value : 1,
            0
        );
        if (!quantity) {
            alert("Please enter a quantity greater than zero.");
            return;
        }

        const existingEntry = editingAsNeededHistoryIndex >= 0
            ? asNeededMedicationHistory[editingAsNeededHistoryIndex]
            : null;
        const entry = {
            medication: medicationName,
            dateTime: existingEntry && existingEntry.dateTime
                ? existingEntry.dateTime
                : getDefaultDateTimeValue(),
            quantity: quantity,
            unit: normalizeAsNeededDoseUnit(
                asNeededMedicationUnit ? asNeededMedicationUnit.value : "tablet"
            ),
            note: asNeededMedicationNote ? asNeededMedicationNote.value.trim() : ""
        };

        if (editingAsNeededHistoryIndex >= 0) {
            asNeededMedicationHistory[editingAsNeededHistoryIndex] = entry;
        } else {
            asNeededMedicationHistory.push(entry);
        }
        saveData("asNeededMedicationHistory", asNeededMedicationHistory);
        closeAsNeededMedicationModal();
        renderAsNeededMedicationHistory();
    });
}

if (asNeededLastTakenDisplay) {
    asNeededLastTakenDisplay.addEventListener("click", function (event) {
        const editButton = event.target.closest(".as-needed-edit-btn");
        if (editButton) {
            const historyIndex = Number(editButton.getAttribute("data-index"));
            const entry = asNeededMedicationHistory[historyIndex];
            if (!entry) return;
            openAsNeededMedicationModal(historyIndex);
            return;
        }

        const deleteButton = event.target.closest(".medication-delete-btn");
        if (!deleteButton) return;

        const medication = deleteButton.getAttribute("data-medication");
        if (!medication) return;

        const medicationHistory = getMedicationHistoryFor(medication);
        if (!medicationHistory.length) return;

        const latestEntry = medicationHistory[medicationHistory.length - 1];
        const latestDose = getAsNeededOccurrenceDose(latestEntry);
        const deleteMessage = "Delete this history entry?\n\n" + medication +
            "\n" + formatDateTime(latestEntry.dateTime) + " · " +
            formatAsNeededDose(latestDose.quantity, latestDose.unit);
        if (!window.confirm(deleteMessage)) return;

        const latestIndex = asNeededMedicationHistory.lastIndexOf(medicationHistory[medicationHistory.length - 1]);
        if (latestIndex >= 0) {
            asNeededMedicationHistory.splice(latestIndex, 1);
            saveData("asNeededMedicationHistory", asNeededMedicationHistory);
            renderAsNeededMedicationHistory();
        }
    });
}

if (cancelAsNeededMedicationBtn) {
    cancelAsNeededMedicationBtn.addEventListener("click", closeAsNeededMedicationModal);
}

updateAsNeededMedicationNameInputVisibility();
asNeededAvailableMedications = loadAsNeededAvailableMedications();
renderAsNeededAvailableMedicationList();
renderAsNeededMedicationChoices();
renderAsNeededMedicationHistory();