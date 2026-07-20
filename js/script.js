// Load saved medication status
let medicationLog = JSON.parse(localStorage.getItem("medicationLog")) || {};
// Load John's personal medication schedule
let personalMedicationSchedule =
    JSON.parse(localStorage.getItem("personalMedicationSchedule"));

if (!personalMedicationSchedule) {
    personalMedicationSchedule = medicationSchedule;

    localStorage.setItem(
        "personalMedicationSchedule",
        JSON.stringify(personalMedicationSchedule)
    );
}
if (!medicationLog.evening) {
    medicationLog.evening = {};
}


let weightLog = JSON.parse(localStorage.getItem("weightLog")) || {};
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
const greeting = document.getElementById("greeting");

const hour = new Date().getHours();

if (hour < 12) {
    greeting.textContent = "Good Morning, " + userProfile.firstName;
} else if (hour < 18) {
    greeting.textContent = "Good Afternoon, " + userProfile.firstName;
} else {
    greeting.textContent = "Good Evening, " + userProfile.firstName;
}
console.log("John's Assistant started.");

console.log(medicationSchedule);

const today = document.getElementById("today");

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

today.textContent =
    new Date().toLocaleDateString("en-US", options);
  const manageMedicationsBtn = document.getElementById("manageMedicationsBtn");
const manageMedicationsPanel = document.getElementById("manageMedicationsPanel");

const medicationEditor = document.getElementById("medicationEditor");
const medicationEditArea = document.getElementById("medicationEditArea");

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

    document.querySelectorAll(".editMedicationBtn").forEach(function (button) {

        button.addEventListener("click", function () {

    


            const group = personalMedicationSchedule.find(
                item => item.time === this.dataset.time
            );

            showMedicationEditor(group);

        });

    });
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
    document.querySelectorAll(".notesMedicationBtn").forEach(function (button) {

    button.addEventListener("click", function () {

        const group = personalMedicationSchedule.find(
            item => item.time === this.dataset.time
        );

        showNotesEditor(group);

    });

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

console.log("Finished creating medication editor");

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

            const updatedMedications =
                document.getElementById("editMedicationInput")
                    .value
                    .split(",")
                    .map(item => item.trim());

            group.medications = updatedMedications;

            localStorage.setItem(
                "personalMedicationSchedule",
                JSON.stringify(personalMedicationSchedule)
            );

            buildMedicationList();

            medicationEditArea.innerHTML = "";

            alert("Medication list updated.");

        });

}
    const logButton = document.getElementById("logButton");
const medStatus = document.getElementById("medStatus");
const wakeUpMedicationList = document.getElementById("wakeUpMedicationList");
const breakfastMedicationList = document.getElementById("breakfastMedicationList");
const middayMedicationList = document.getElementById("middayMedicationList");
const dinnerMedicationList = document.getElementById("dinnerMedicationList");
const eveningMedicationList = document.getElementById("eveningMedicationList");

    function displayMedicationList(time, element) {
    const group = personalMedicationSchedule.find(
        group => group.time === time
    );

    if (!group) return;

    element.innerHTML =
        "<ul><li>" +
        group.medications.join("</li><li>") +
        "</li></ul>";
        
}
displayMedicationList("Wake Up", wakeUpMedicationList);
displayMedicationList("Breakfast", breakfastMedicationList);
displayMedicationList("Midday", middayMedicationList);
displayMedicationList("Dinner", dinnerMedicationList);
displayMedicationList("Evening", eveningMedicationList);
const breakfastButton =
    document.getElementById("breakfastButton");

const breakfastStatus =
    document.getElementById("breakfastStatus");
    const middayButton =
    document.getElementById("middayButton");

const middayStatus =
    document.getElementById("middayStatus");
    const eveningButton =
    document.getElementById("eveningButton");

const eveningStatus =
    document.getElementById("eveningStatus");

const summaryEvening =
    document.getElementById("summaryEvening");
const weightButton = document.getElementById("weightButton");
const weightDisplay = document.getElementById("weightDisplay");
const summaryWeight = document.getElementById("summaryWeight");
const summaryBP =
    document.getElementById("summaryBP");
    const summaryBreakfast =
    document.getElementById("summaryBreakfast");
    const summaryMidday =
    document.getElementById("summaryMidday");
    const summaryWakeUp =
    document.getElementById("summaryWakeUp");
const bpButton = document.getElementById("bpButton");
const bpDisplay = document.getElementById("bpDisplay");
const heartRateDisplay = document.getElementById("heartRateDisplay");

let bpLog = JSON.parse(localStorage.getItem("bpLog")) || {};

if (weightLog.current) {

    weightDisplay.textContent =
        "Last Weight: " + weightLog.current + " lb";

    summaryWeight.textContent =
        weightLog.current + " lb";
}

if (bpLog.systolic) {

    bpDisplay.textContent =
        "Last Reading: " +
        bpLog.systolic +
        " / " +
        bpLog.diastolic;

    heartRateDisplay.textContent =
        "Heart Rate: " +
        bpLog.heartRate +
        " bpm";

    summaryBP.textContent =
        bpLog.systolic +
        " / " +
        bpLog.diastolic;
}
bpButton.addEventListener("click", function () {

    const systolic = prompt("Enter systolic pressure:");
    const diastolic = prompt("Enter diastolic pressure:");
    const heartRate = prompt("Enter heart rate:");

    if (systolic && diastolic && heartRate) {

        bpDisplay.textContent =
    "Last Reading: " + systolic + " / " + diastolic;

heartRateDisplay.textContent =
    "Heart Rate: " + heartRate + " bpm";

summaryBP.textContent =
    systolic + " / " + diastolic;

bpLog = {
    systolic: systolic,
    diastolic: diastolic,
    heartRate: heartRate
};

localStorage.setItem(
    "bpLog",
    JSON.stringify(bpLog)
);
    systolic + " / " + diastolic;
        heartRateDisplay.textContent =
            "Heart Rate: " + heartRate + " bpm";

    }

}); 
weightButton.addEventListener("click", function () {
   

    const weight = prompt("Enter your current weight:");

    if (weight) {

        weightDisplay.textContent =
            "Last Weight: " + weight + " lb";
summaryWeight.textContent =
    weight + " lb";

      weightLog.current = weight;

localStorage.setItem(
    "weightLog",
    JSON.stringify(weightLog)
);      

    }

});

// Restore Wake-Up medication display
if (medicationLog.wakeUp?.logged) {

    medStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.wakeUp.time;
        

    logButton.textContent = "✅ Logged Today";
    const summaryWakeUp = document.getElementById("summaryWakeUp");
summaryWakeUp.textContent = "✅ Logged " + medicationLog.wakeUp.time;
    logButton.disabled = true;
}
// Restore Breakfast medication display
if (medicationLog.breakfast?.logged) {

    breakfastStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.breakfast.time;
        
        summaryBreakfast.textContent =
    "✅ Logged " + medicationLog.breakfast.time;

    breakfastButton.textContent = "✅ Logged Today";
    breakfastButton.disabled = true;
}
// Restore Midday medication display
if (medicationLog.midday?.logged) {

    middayStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.midday.time;
        
        summaryMidday.textContent =
    "✅ Logged " + medicationLog.midday.time;

    middayButton.textContent = "✅ Logged Today";
    middayButton.disabled = true;
}
// Restore Evening medication display
if (medicationLog.evening?.logged) {

    eveningStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.evening.time;
        
        summaryEvening.textContent =
    "✅ Logged " + medicationLog.evening.time;

    eveningButton.textContent = "✅ Logged Today";
    eveningButton.disabled = true;
}
logButton.addEventListener("click", function () {

    const now = new Date();

    medicationLog.wakeUp = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );

    medStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.wakeUp.time;

        summaryWakeUp.textContent =
    "✅ Logged " + medicationLog.wakeUp.time;

    logButton.textContent = "✅ Logged Today";
    logButton.disabled = true;

});

breakfastButton.addEventListener("click", function () {

    const now = new Date();

    medicationLog.breakfast = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );

    breakfastStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.breakfast.time;

    breakfastButton.textContent = "✅ Logged Today";
    breakfastButton.disabled = true;

});
middayButton.addEventListener("click", function () {

    const now = new Date();

    medicationLog.midday = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );

    middayStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.midday.time;

    middayButton.textContent = "✅ Logged Today";
    middayButton.disabled = true;

});

eveningButton.addEventListener("click", function () {

    const now = new Date();

    medicationLog.evening = {
        logged: true,
        date: now.toDateString(),
        time: now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })
    };

    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );

    eveningStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.evening.time;

    eveningButton.textContent = "✅ Logged Today";
    eveningButton.disabled = true;

});

function updateDashboard() {if (medicationLog.wakeUp?.logged) {

    medStatus.innerHTML =
        "<strong>✅ Logged Today:</strong> " +
        medicationLog.wakeUp.time;

    logButton.textContent = "✅ Logged Today";

    const summaryWakeUp =
        document.getElementById("summaryWakeUp");

    summaryWakeUp.textContent =
        "✅ Logged " + medicationLog.wakeUp.time;

    logButton.disabled = true;
}

    

}
updateDashboard();