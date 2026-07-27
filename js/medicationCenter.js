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