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

const saveAsNeededAvailableMedicationBtn =
    document.getElementById("saveAsNeededAvailableMedicationBtn");

const asNeededAvailableMedicationStatus =
    document.getElementById("asNeededAvailableMedicationStatus");

let asNeededMedicationHistory =
    loadData("asNeededMedicationHistory", []);
const AS_NEEDED_AVAILABLE_MEDICATIONS_KEY =
    "asNeededAvailableMedications";
const AS_NEEDED_DEFAULT_MEDICATIONS = [
    "ALA",
    "Tylenol"
];
let asNeededAvailableMedications = [];
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

function dedupeAsNeededMedicationNames(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    const seen = new Set();

    return items.map(function (item) {
        return normalizeAsNeededMedicationName(item);
    }).filter(function (item) {
        if (!item) {
            return false;
        }

        const key = getAsNeededMedicationCompareKey(item);
        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function saveAsNeededAvailableMedications() {
    saveData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, asNeededAvailableMedications);
}

function loadAsNeededAvailableMedications() {
    const storedList = loadData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, null);

    if (!Array.isArray(storedList)) {
        const migratedList = dedupeAsNeededMedicationNames(AS_NEEDED_DEFAULT_MEDICATIONS);
        saveData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, migratedList);
        return migratedList;
    }

    const normalizedList = dedupeAsNeededMedicationNames(storedList);

    if (JSON.stringify(normalizedList) !== JSON.stringify(storedList)) {
        saveData(AS_NEEDED_AVAILABLE_MEDICATIONS_KEY, normalizedList);
    }

    return normalizedList;
}

function setAsNeededAvailableMedicationStatus(messageText, isError) {
    if (!asNeededAvailableMedicationStatus) {
        return;
    }

    const message = String(messageText || "").trim();
    asNeededAvailableMedicationStatus.textContent = message;
    asNeededAvailableMedicationStatus.classList.toggle("error", !!isError && !!message);
}

function renderAsNeededMedicationChoices() {
    if (!asNeededMedicationChoice) {
        return;
    }

    const previousValue = asNeededMedicationChoice.value;
    asNeededMedicationChoice.innerHTML = "";

    asNeededAvailableMedications.forEach(function (medicationName) {
        const option = document.createElement("option");
        option.value = medicationName;
        option.textContent = medicationName;
        asNeededMedicationChoice.appendChild(option);
    });

    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Other / custom medication";
    asNeededMedicationChoice.appendChild(customOption);

    const hasPreviousValue = asNeededAvailableMedications.some(function (item) {
        return item === previousValue;
    });

    if (previousValue === "custom") {
        asNeededMedicationChoice.value = "custom";
    } else if (hasPreviousValue) {
        asNeededMedicationChoice.value = previousValue;
    } else if (asNeededAvailableMedications.length) {
        asNeededMedicationChoice.value = asNeededAvailableMedications[0];
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

    asNeededAvailableMedications.forEach(function (medicationName) {
        const row = document.createElement("div");
        row.className = "as-needed-available-row";

        const name = document.createElement("span");
        name.className = "as-needed-available-name";
        name.textContent = medicationName;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "history-action-btn delete as-needed-available-remove-btn";
        removeButton.textContent = "Remove from List";
        removeButton.setAttribute("data-medication", medicationName);

        row.appendChild(name);
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
    const isDuplicate = asNeededAvailableMedications.some(function (medicationName) {
        return getAsNeededMedicationCompareKey(medicationName) === compareKey;
    });

    if (isDuplicate) {
        setAsNeededAvailableMedicationStatus(
            normalizedName + " is already available for logging.",
            true
        );
        newAsNeededMedicationInput.value = "";
        return;
    }

    asNeededAvailableMedications.push(normalizedName);
    saveAsNeededAvailableMedications();
    renderAsNeededAvailableMedicationList();
    renderAsNeededMedicationChoices();
    setAsNeededAvailableMedicationStatus(
        "✓ " + normalizedName + " is now available for As-Needed logging.",
        false
    );
    newAsNeededMedicationInput.value = "";
    newAsNeededMedicationInput.focus();
}

function removeAsNeededAvailableMedication(medicationName) {
    const compareKey = getAsNeededMedicationCompareKey(medicationName);
    const index = asNeededAvailableMedications.findIndex(function (item) {
        return getAsNeededMedicationCompareKey(item) === compareKey;
    });

    if (index < 0) {
        return;
    }

    const label = asNeededAvailableMedications[index];
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

    const capabilities = window.medicationCenterCapabilities || {};
    const isInjectable = typeof capabilities.isInjectableMedication === "function"
        ? capabilities.isInjectableMedication
        : null;
    const openInjection = typeof capabilities.openInjection === "function"
        ? capabilities.openInjection
        : null;
    const injectableMedications = [];
    const medicationKeys = new Set();
    const schedule = typeof personalMedicationSchedule !== "undefined" &&
        Array.isArray(personalMedicationSchedule)
        ? personalMedicationSchedule
        : [];

    if (isInjectable) {
        schedule.forEach(function (group) {
            if (!Array.isArray(group && group.medications)) {
                return;
            }

            group.medications.forEach(function (medicationName) {
                if (!isInjectable(medicationName)) {
                    return;
                }

                const normalizedName = String(medicationName || "").trim();
                const medicationKey = normalizedName.toLowerCase();
                if (!normalizedName || medicationKeys.has(medicationKey)) {
                    return;
                }

                medicationKeys.add(medicationKey);
                injectableMedications.push({
                    medicationName: normalizedName,
                    open: openInjection
                });
            });
        });
    }

    const injectionAccess = capabilities.getInjectionAccess &&
        typeof capabilities.getInjectionAccess === "function"
        ? capabilities.getInjectionAccess()
        : null;
    if (injectionAccess && typeof injectionAccess.open === "function" &&
        isInjectable && isInjectable(injectionAccess.medicationName)) {
        const normalizedName = String(injectionAccess.medicationName || "").trim();
        const medicationKey = normalizedName.toLowerCase();
        if (normalizedName && !medicationKeys.has(medicationKey)) {
            injectableMedications.push({
                medicationName: normalizedName,
                open: injectionAccess.open
            });
        }
    }

    if (!injectableMedications.length) {
        return;
    }

    const section = document.createElement("section");
    section.className = "card medication-center-card medication-schedule-section main-injectable-medications-section";
    section.id = "mainInjectableMedicationsSection";

    const title = document.createElement("h2");
    title.className = "";
    title.textContent = "Injectable Medications";
    section.appendChild(title);

    const list = document.createElement("ul");
    list.className = "medication-schedule-list main-injectable-medications-list";

    injectableMedications.forEach(function (injectableMedication) {
        const item = document.createElement("li");
        item.className = "main-injectable-medication-item";
        item.textContent = injectableMedication.medicationName;

        if (typeof injectableMedication.open === "function") {
            item.tabIndex = 0;
            item.setAttribute("role", "button");
            item.setAttribute("aria-label", "Open injection tracking for " + injectableMedication.medicationName);
            item.addEventListener("click", function () {
                injectableMedication.open();
            });
            item.addEventListener("keydown", function (event) {
                if (event.key !== "Enter" && event.key !== " ") {
                    return;
                }

                event.preventDefault();
                injectableMedication.open();
            });
        }

        list.appendChild(item);
    });

    section.appendChild(list);
    cardContainer.insertBefore(section, asNeededCard);
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
        const tablets = Number(latest.tablets) || 1;
        const tabletsText = tablets + " tablet" + (tablets === 1 ? "" : "s");
        const noteText = latest.note ? " — " + latest.note : "";

        return "<div class=\"as-needed-entry\"><p><strong>" + medicationName + "</strong><br>Last Taken: " +
            formatDateTime(latest.dateTime) + " · " + tabletsText + noteText +
            "</p><button type=\"button\" class=\"history-action-btn delete medication-delete-btn as-needed-delete-btn\" data-medication=\"" + medicationName + "\" aria-label=\"Delete medication entry\">Delete Entry</button></div>";
    }).join("");
}

function resetAsNeededMedicationForm() {
    if (asNeededMedicationChoice) {
        if (asNeededAvailableMedications.length) {
            asNeededMedicationChoice.value = asNeededAvailableMedications[0];
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

    if (asNeededMedicationNote) {
        asNeededMedicationNote.value = "";
    }
}

function openAsNeededMedicationModal() {
    resetAsNeededMedicationForm();

    if (asNeededMedicationModal) {
        asNeededMedicationModal.style.display = "block";
    }

    if (asNeededMedicationChoice && asNeededMedicationChoice.value === "custom" && asNeededMedicationNameInput) {
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

    const scheduleHint = document.createElement("p");
    scheduleHint.className = "medication-editor-hint";
    scheduleHint.innerHTML = "<strong>Manage your Medication Schedule</strong><br>Set up your medication schedule and add medications to each schedule event.";
    medicationEditor.appendChild(scheduleHint);

    if (!Array.isArray(personalMedicationSchedule)) {
        personalMedicationSchedule = [];
    }

    if (window.medicationScheduleCompat && typeof window.medicationScheduleCompat.normalizeMedicationScheduleEvents === "function") {
        personalMedicationSchedule = window.medicationScheduleCompat.normalizeMedicationScheduleEvents(personalMedicationSchedule);
    }

    if (!personalMedicationSchedule.length) {
        const empty = document.createElement("p");
        empty.textContent = "No medication schedule configured yet.";
        medicationEditor.appendChild(empty);
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

    const addTimeContainer = document.createElement("div");
    addTimeContainer.className = "add-medication-time-block";
    addTimeContainer.id = "addMedicationTimeControls";

    const addTimeLabel = document.createElement("label");
    addTimeLabel.setAttribute("for", "newMedicationTimeInput");
    addTimeLabel.textContent = "Add Another Medication Schedule";
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

if (asNeededAvailableMedicationList) {
    asNeededAvailableMedicationList.addEventListener("click", function (event) {
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

        const entry = {
            medication: medicationName,
            dateTime: getDefaultDateTimeValue(),
            tablets: asNeededMedicationCount ? Number(asNeededMedicationCount.value) : 1,
            note: asNeededMedicationNote ? asNeededMedicationNote.value.trim() : ""
        };

        asNeededMedicationHistory.push(entry);
        saveData("asNeededMedicationHistory", asNeededMedicationHistory);
        closeAsNeededMedicationModal();
        renderAsNeededMedicationHistory();
    });
}

if (asNeededLastTakenDisplay) {
    asNeededLastTakenDisplay.addEventListener("click", function (event) {
        const deleteButton = event.target.closest(".medication-delete-btn");
        if (!deleteButton) return;

        const medication = deleteButton.getAttribute("data-medication");
        if (!medication || !confirmHistoryDelete()) return;

        const medicationHistory = getMedicationHistoryFor(medication);
        if (!medicationHistory.length) return;

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