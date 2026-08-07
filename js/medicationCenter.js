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

const logTylenolButton =
    document.getElementById("logTylenolButton");

const tylenolModal =
    document.getElementById("tylenolModal");

const saveTylenolBtn =
    document.getElementById("saveTylenolBtn");

const cancelTylenolBtn =
    document.getElementById("cancelTylenolBtn");

const asNeededMedicationSelect =
    document.getElementById("asNeededMedicationSelect");

const tylenolTabletCount =
    document.getElementById("tylenolTabletCount");

const tylenolTakenAt =
    document.getElementById("tylenolTakenAt");

const tylenolNote =
    document.getElementById("tylenolNote");

const tylenolLastTakenDisplay =
    document.getElementById("tylenolLastTakenDisplay");

const alaLastTakenDisplay =
    document.getElementById("alaLastTakenDisplay");

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

function getMedicationHistoryFor(medicationName) {
    return asNeededMedicationHistory.filter(function (entry) {
        return (entry.medication || "Tylenol") === medicationName;
    });
}

function renderMedicationLastTaken(displayElement, medicationName) {
    if (!displayElement) {
        return;
    }

    const history = getMedicationHistoryFor(medicationName);

    if (!history.length) {
        displayElement.innerHTML =
            `<strong>${medicationName}</strong><br>Last Taken: Not logged yet.`;
        return;
    }

    const latest = history[history.length - 1];
    const tabletsText =
        `${latest.tablets} tablet${latest.tablets === 1 ? "" : "s"}`;
    const noteText = latest.note ? ` — ${latest.note}` : "";

    displayElement.innerHTML =
        `<strong>${medicationName}</strong><br>Last Taken: ${formatDateTime(latest.dateTime)} · ${tabletsText}${noteText} <button type="button" class="history-delete-btn medication-delete-btn" data-medication="${medicationName}" aria-label="Delete medication entry">🗑️</button>`;
}

function renderTylenolLastTaken() {
    renderMedicationLastTaken(tylenolLastTakenDisplay, "Tylenol");
    renderMedicationLastTaken(alaLastTakenDisplay, "ALA");
}

function resetTylenolForm() {
    if (asNeededMedicationSelect) {
        asNeededMedicationSelect.value = "Tylenol";
    }

    if (tylenolTabletCount) {
        tylenolTabletCount.value = "1";
    }

    if (tylenolTakenAt) {
        tylenolTakenAt.value = getDefaultDateTimeValue();
    }

    if (tylenolNote) {
        tylenolNote.value = "";
    }
}

function openTylenolModal() {
    resetTylenolForm();

    if (tylenolModal) {
        tylenolModal.style.display = "block";
    }

    if (asNeededMedicationSelect) {
        asNeededMedicationSelect.focus();
    }
}

function closeTylenolModal() {
    if (tylenolModal) {
        tylenolModal.style.display = "none";
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

    personalMedicationSchedule.forEach(function (group) {

        const row = document.createElement("p");

        row.innerHTML = `
<strong>${group.time}</strong>

<button class="editMedicationBtn"
        data-time="${group.time}">
    Edit
</button>

<button class="notesMedicationBtn"
        data-time="${group.time}">
    Notes
</button>

<br>

${group.medications.join(", ")}
`;

        medicationEditor.appendChild(row);

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

    document.querySelectorAll(".notesMedicationBtn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const group =
                    personalMedicationSchedule.find(
                        item => item.time === this.dataset.time
                    );

                showNotesEditor(group);

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

            localStorage.setItem(
                "personalMedicationSchedule",
                JSON.stringify(personalMedicationSchedule)
            );

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

    document.getElementById("saveMedicationBtn")
        .addEventListener("click", function () {

            group.medications =
                document.getElementById("editMedicationInput")
                    .value
                    .split(",")
                    .map(item => item.trim());

            localStorage.setItem(
                "personalMedicationSchedule",
                JSON.stringify(personalMedicationSchedule)
            );

            buildMedicationList();

            medicationEditArea.innerHTML = "";

            alert("Medication list updated.");

        });

}

if (logTylenolButton) {
    logTylenolButton.addEventListener("click", openTylenolModal);
}

if (saveTylenolBtn) {
    saveTylenolBtn.addEventListener("click", function () {
        const entry = {
            medication: asNeededMedicationSelect ? asNeededMedicationSelect.value : "Tylenol",
            dateTime: tylenolTakenAt ? tylenolTakenAt.value : getDefaultDateTimeValue(),
            tablets: tylenolTabletCount ? Number(tylenolTabletCount.value) : 1,
            note: tylenolNote ? tylenolNote.value.trim() : ""
        };

        asNeededMedicationHistory.push(entry);
        saveData("asNeededMedicationHistory", asNeededMedicationHistory);
        closeTylenolModal();
        renderTylenolLastTaken();
    });
}

if (tylenolLastTakenDisplay) {
    tylenolLastTakenDisplay.addEventListener("click", function (event) {
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
            renderTylenolLastTaken();
        }
    });
}

if (alaLastTakenDisplay) {
    alaLastTakenDisplay.addEventListener("click", function (event) {
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
            renderTylenolLastTaken();
        }
    });
}

if (cancelTylenolBtn) {
    cancelTylenolBtn.addEventListener("click", closeTylenolModal);
}

renderTylenolLastTaken();