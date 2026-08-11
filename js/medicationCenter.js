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

const scheduleNotesModalInput =
    document.getElementById("scheduleNotesModalInput");

const saveScheduleNotesModalBtn =
    document.getElementById("saveScheduleNotesModalBtn");

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

let asNeededMedicationHistory =
    loadData("asNeededMedicationHistory", []);
let medicationEditorLockedScrollTop = 0;
let medicationEditorReturnScrollSnapshot = null;
let activeScheduleNotesEventId = "";

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
            "</p><button type=\"button\" class=\"history-action-btn delete medication-delete-btn as-needed-delete-btn\" data-medication=\"" + medicationName + "\" aria-label=\"Delete medication entry\">Delete</button></div>";
    }).join("");
}

function resetAsNeededMedicationForm() {
    if (asNeededMedicationChoice) {
        asNeededMedicationChoice.value = "Tylenol";
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

    if (asNeededMedicationNameInput) {
        asNeededMedicationNameInput.focus();
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

    personalMedicationSchedule.forEach(function (group) {

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

    <label for="editMedicationInput">Medications</label>
    <textarea id="editMedicationInput" rows="3" class="medication-edit-input">${group.medications.join(", ")}</textarea>

    <div class="medication-edit-grid add-medication-row">
        <div>
            <label for="newMedicationInput">New Medication</label>
            <input type="text" id="newMedicationInput" class="medication-edit-input">
        </div>
        <div class="grid-action-cell">
            <button id="addMedicationBtn" type="button">Add Medication</button>
        </div>
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

            const newMedication =
                document.getElementById("newMedicationInput")
                    .value
                    .trim();

            if (newMedication === "") {

                alert("Please enter a medication.");
                return;

            }

            const editMedicationInput = document.getElementById("editMedicationInput");
            const medications = editMedicationInput
                .value
                .split(",")
                .map(item => item.trim())
                .filter(function (item) {
                    return item;
                });

            medications.push(newMedication);

            editMedicationInput.value = medications.join(", ");

            document.getElementById("newMedicationInput").value = "";

        });

    document.getElementById("openNotesEditorBtn")
        .addEventListener("click", function () {
            showNotesEditor(group);
            scrollMedicationEditorIntoView(medicationEditArea);
        });

    document.getElementById("deleteScheduleBtn")
        .addEventListener("click", function () {
            const scheduleName = group && group.name ? group.name : "this schedule";
            const confirmDelete = window.confirm(
                "Delete the entire medication schedule \"" + scheduleName + "\"? This will remove its medications and schedule notes."
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

            group.medications =
                document.getElementById("editMedicationInput")
                    .value
                    .split(",")
                    .map(item => item.trim())
                    .filter(function (item) {
                        return item;
                    });

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
    addAsNeededMedicationButton.addEventListener("click", openAsNeededMedicationModal);
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
renderAsNeededMedicationHistory();