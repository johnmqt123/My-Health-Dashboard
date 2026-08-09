/**************************************************************************
 * medicationCenter.js
 * Medication Center UI
 **************************************************************************/

const manageMedicationsBtn =
    document.getElementById("manageMedicationsBtn");

const manageMedicationsPanel =
    document.getElementById("manageMedicationsPanel");

const medicationEditor =
    document.getElementById("medicationEditor");

const medicationEditArea =
    document.getElementById("medicationEditArea");

const logAsNeededMedicationButton =
    document.getElementById("logAsNeededMedicationButton");

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
    localStorage.setItem(
        "personalMedicationSchedule",
        JSON.stringify(personalMedicationSchedule)
    );
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

        return "<p><strong>" + medicationName + "</strong><br>Last Taken: " +
            formatDateTime(latest.dateTime) + " · " + tabletsText + noteText +
            " <button type=\"button\" class=\"history-delete-btn medication-delete-btn\" data-medication=\"" + medicationName + "\" aria-label=\"Delete medication entry\">🗑️</button></p>";
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

manageMedicationsBtn.addEventListener("click", function () {

    if (manageMedicationsPanel.style.display === "block") {

        manageMedicationsPanel.style.display = "none";
        medicationEditArea.innerHTML = "";
        return;

    }

    manageMedicationsPanel.style.display = "block";

    buildMedicationList();

});

function buildMedicationList() {

    medicationEditor.innerHTML = "";

    const scheduleHint = document.createElement("p");
    scheduleHint.className = "medication-editor-hint";
    scheduleHint.textContent = "Create schedule times, then add medications under each time.";
    medicationEditor.appendChild(scheduleHint);

    if (!Array.isArray(personalMedicationSchedule)) {
        personalMedicationSchedule = [];
    }

    if (!personalMedicationSchedule.length) {
        const empty = document.createElement("p");
        empty.textContent = "No medication schedule configured yet.";
        medicationEditor.appendChild(empty);
    }

    personalMedicationSchedule.forEach(function (group) {

        const section = document.createElement("section");
        section.className = "medication-schedule-section";

        const title = document.createElement("h4");
        title.className = "medication-schedule-title";
        title.textContent = group.time;
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
        editButton.dataset.time = group.time;
        editButton.textContent = "Edit " + group.time;
        section.appendChild(editButton);

        medicationEditor.appendChild(section);

    });

    const addTimeContainer = document.createElement("div");
    addTimeContainer.className = "add-medication-time-block";

    const addTimeLabel = document.createElement("label");
    addTimeLabel.setAttribute("for", "newMedicationTimeInput");
    addTimeLabel.textContent = "New Schedule Time";
    addTimeContainer.appendChild(addTimeLabel);

    const addTimeInput = document.createElement("input");
    addTimeInput.type = "text";
    addTimeInput.id = "newMedicationTimeInput";
    addTimeInput.style.width = "100%";
    addTimeContainer.appendChild(addTimeInput);

    const addTimeButton = document.createElement("button");
    addTimeButton.type = "button";
    addTimeButton.id = "addMedicationTimeBtn";
    addTimeButton.textContent = "Add Schedule Time";
    addTimeContainer.appendChild(addTimeButton);

    medicationEditor.appendChild(addTimeContainer);

    addTimeButton.addEventListener("click", function () {
        const normalized = addTimeInput.value.trim();
        if (!normalized) {
            alert("Please enter a schedule time.");
            return;
        }

        const exists = personalMedicationSchedule.some(function (group) {
            return String(group.time || "").toLowerCase() === normalized.toLowerCase();
        });

        if (exists) {
            alert("That schedule time already exists.");
            return;
        }

        personalMedicationSchedule.push({
            time: normalized,
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
                        item => item.time === this.dataset.time
                    );

                showMedicationEditor(group);

            });

        });

}

function showNotesEditor(group) {

    medicationEditArea.innerHTML = `
<h4>${group.time} Notes</h4>

<textarea
    id="groupNotesInput"
    rows="6"
    style="width:100%; resize:vertical;"
>${group.notes || ""}</textarea>

<br><br>

<button id="saveNotesBtn">
    Save Notes
</button>
`;

    medicationEditArea.style.display = "block";

    document.getElementById("saveNotesBtn")
        .addEventListener("click", function () {

            group.notes =
                document.getElementById("groupNotesInput").value;

            saveMedicationSchedule();

            alert("Notes saved.");

        });

}

function showMedicationEditor(group) {

    medicationEditArea.innerHTML = `
<h4>Editing ${group.time}</h4>

<label>Medications:</label><br>

<textarea
id="editMedicationInput"
rows="4"
style="width:100%; resize:vertical;"
>${group.medications.join(", ")}</textarea>

<br><br>

<label>New Medication:</label><br>

<input
type="text"
id="newMedicationInput"
style="width:100%;"
>

<br><br>

<button id="addMedicationBtn">
Add Medication
</button>

<br><br>

<button id="openNotesEditorBtn">
Edit ${group.time} Notes
</button>

<br><br>

<button id="saveMedicationBtn">
Save
</button>
`;

    medicationEditArea.style.display = "block";

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

            group.medications.push(newMedication);

            document.getElementById("editMedicationInput").value =
                group.medications.join(", ");

            document.getElementById("newMedicationInput").value = "";

        });

    document.getElementById("openNotesEditorBtn")
        .addEventListener("click", function () {
            showNotesEditor(group);
        });

    document.getElementById("saveMedicationBtn")
        .addEventListener("click", function () {

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

            medicationEditArea.innerHTML = "";

            alert("Medication list updated.");

        });

}

if (logAsNeededMedicationButton) {
    logAsNeededMedicationButton.addEventListener("click", openAsNeededMedicationModal);
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