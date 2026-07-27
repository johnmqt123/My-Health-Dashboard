/**************************************************************************
 * Storage Helpers
 **************************************************************************/

function loadData(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Load saved medication status
let medicationLog = loadData("medicationLog", {});
let medicationHistory =
    loadData("medicationHistory", []);
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


let weightLog =
    loadData("weightLog", {});

let weightHistory =
    loadData("weightHistory", []);
  let exerciseHistory =
    loadData("exerciseHistory", []);  
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
const exerciseButton = document.getElementById("exerciseButton");
const exerciseDisplay = document.getElementById("exerciseDisplay");
const exerciseModal = document.getElementById("exerciseModal");
const cancelExerciseBtn = document.getElementById("cancelExerciseBtn");
const stationaryBikeBtn = document.getElementById("stationaryBikeBtn");
const ebikeRideBtn = document.getElementById("ebikeRideBtn");
exerciseButton.addEventListener("click", function () {
    exerciseModal.style.display = "block";
});
let exerciseLog = loadData("exerciseLog", []);
cancelExerciseBtn.addEventListener("click", function () {
    exerciseModal.style.display = "none";
});
stationaryBikeBtn.addEventListener("click", function () {

    exerciseModal.style.display = "none";

    const minutes = prompt("How many minutes did you ride the stationary bike?");

    if (!minutes) return;

    exerciseLog.push({
    type: "Stationary Bike",
    amount: minutes,
    unit: "minutes"
});
exerciseHistory.push({
    type: "Stationary Bike",
    amount: minutes,
    unit: "minutes",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    })
});

saveData("exerciseHistory", exerciseHistory);
saveData("exerciseLog", exerciseLog);

displayExerciseLog();
});
ebikeRideBtn.addEventListener("click", function () {

    exerciseModal.style.display = "none";

    const miles = prompt("How many miles did you ride your e-bike?");

    if (!miles) return;
    exerciseLog.push({
    type: "E-Bike Ride",
    amount: miles,
    unit: "miles"
});
exerciseHistory.push({
    type: "E-Bike Ride",
    amount: miles,
    unit: "miles",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    })
});

saveData("exerciseHistory", exerciseHistory);
saveData("exerciseLog", exerciseLog);

displayExerciseLog();

    
});

function displayExerciseLog() {
    if (!exerciseDisplay) return;
    if (exerciseLog.length === 0) {
        exerciseDisplay.textContent = "No exercise logged yet.";
        return;
    }
    const latest = exerciseLog[exerciseLog.length - 1];
    exerciseDisplay.innerHTML =
        "Last Exercise: <strong>" + latest.type + "</strong> - " +
        latest.amount + " " + latest.unit;
}

displayExerciseLog();

// Display all logged exercise entries


const wakeUpButton = document.getElementById("logButton");
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
function setupMedicationToggle(headingId, listId) {
    const heading = document.getElementById(headingId);
    const list = document.getElementById(listId);

    if (!heading || !list) return;

    heading.addEventListener("click", () => {
        const isHidden = list.style.display === "none";

        list.style.display = isHidden ? "block" : "none";

        heading.textContent =
            (isHidden ? "▼ " : "▶ ") +
            heading.textContent.substring(2);
    });
}

setupMedicationToggle("wakeUpHeading", "wakeUpMedicationList");
setupMedicationToggle("breakfastHeading", "breakfastMedicationList");
setupMedicationToggle("middayHeading", "middayMedicationList");
setupMedicationToggle("dinnerHeading", "dinnerMedicationList");
setupMedicationToggle("eveningHeading", "eveningMedicationList");
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


const weightButton = document.getElementById("weightButton");
const weightDisplay = document.getElementById("weightDisplay");
const summaryWeight = document.getElementById("summaryWeight");
const weightHistoryButton =
    document.getElementById("weightHistoryButton");
    const weightHistorySection =
    document.getElementById("weightHistorySection");


    const weightHistoryDisplay =
    document.getElementById("weightHistoryDisplay");
    const exerciseHistoryButton =
    document.getElementById("exerciseHistoryButton");

const exerciseHistorySection =
    document.getElementById("exerciseHistorySection");

const exerciseHistoryDisplay =
    document.getElementById("exerciseHistoryDisplay");
const summaryBP =
    document.getElementById("summaryBP");
        




const bpButton = document.getElementById("bpButton");
const bpDisplay = document.getElementById("bpDisplay");
const heartRateDisplay = document.getElementById("heartRateDisplay");
const addTaskButton =
    document.getElementById("addTaskButton");

const todayList =
    document.getElementById("todayList");
    
    const medicationCenterCardHeading =
    document.getElementById("medicationCenterCardHeading");
    const backToTop =
    document.getElementById("backToTop");

let bpLog = JSON.parse(localStorage.getItem("bpLog")) || {};
let todayTasks =
    JSON.parse(localStorage.getItem("todayTasks")) || [];
    let taskListDate =
    localStorage.getItem("taskListDate") ||
    new Date().toDateString();

if (weightLog.current) {

    weightDisplay.textContent =
        "Last Weight: " + weightLog.current + " lb";

    summaryWeight.textContent =
        weightLog.current + " lb";
}
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

if (todayTasks.length > 0) {

    displayTodayTasks();

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
      weightHistory.push({
    weight: weight,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    })
});

saveData("weightHistory", weightHistory);

saveData("weightLog", weightLog);      

    }

});
// Initialize history panels closed on page load
if (weightHistorySection) {
    weightHistorySection.style.display = "none";
    weightHistoryButton.textContent = "📊 History";
}
if (exerciseHistorySection) {
    exerciseHistorySection.style.display = "none";
    exerciseHistoryButton.textContent = "📊 History";
}

weightHistoryButton.addEventListener("click", function () {

    if (weightHistorySection.style.display === "block") {

        weightHistorySection.style.display = "none";
        weightHistoryButton.textContent = "📊 History";
        return;

    }

    weightHistoryDisplay.innerHTML = "";

    if (weightHistory.length === 0) {

        weightHistoryDisplay.textContent =
            "No weight entries yet.";

    } else {

        weightHistory
            .slice()
            .reverse()
            .forEach(function (entry) {

                weightHistoryDisplay.innerHTML +=
                    entry.date +
                    " • " +
                    entry.time +
                    " — <strong>" +
                    entry.weight +
                    " lb</strong><br>";

            });

    }

    weightHistorySection.style.display = "block";
    weightHistoryButton.textContent = "📊 Hide History";

    

});

    

exerciseHistoryButton.addEventListener("click", function () {

    if (exerciseHistorySection.style.display === "block") {
        exerciseHistorySection.style.display = "none";
        exerciseHistoryButton.textContent = "📊 History";
        return;
    }

    exerciseHistoryDisplay.innerHTML = "";

    if (exerciseHistory.length === 0) {
        exerciseHistoryDisplay.textContent = "No exercise entries yet.";
    } else {
        exerciseHistory.slice().reverse().forEach(function (entry) {
            exerciseHistoryDisplay.innerHTML +=
                entry.date + " • " + entry.time +
                " — <strong>" + entry.type +
                "</strong> - " + entry.amount + " " + entry.unit + "<br>";
        });
    }

    exerciseHistorySection.style.display = "block";
    exerciseHistoryButton.textContent = "📊 Hide History";
});

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
if (
    wakeUpButton.textContent === "✅ Logged Today"
) {
    medicationLog.wakeUp = {};
    medicationHistory = medicationHistory.filter(function (entry) {
    return !(
        entry.period === "Wake Up" &&
        entry.date === new Date().toDateString()
    );
});

    saveMedicationLog();
localStorage.setItem(
    "medicationHistory",
    JSON.stringify(medicationHistory)
);
    medStatus.textContent = "Not Logged";

    

    wakeUpButton.textContent = "Wake-Up Medications";

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
    period: "Wake Up",
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

});

breakfastButton.addEventListener("click", function () {
    if (
    breakfastButton.textContent === "✅ Logged Today"
) {
    breakfastButton.textContent = "Breakfast Medications";

    breakfastStatus.textContent = "Not Logged";

    

// Remove today's Breakfast entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === "Breakfast" &&
        entry.date === new Date().toDateString()
    );
});


medicationLog.breakfast = {};

saveMedicationLog();

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
    period: "Breakfast",
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

});

middayButton.addEventListener("click", function () {
    if (
    middayButton.textContent === "✅ Logged Today"
) {
    middayButton.textContent = "Midday Medications";

    middayStatus.textContent = "Not Logged";

    

// Remove today's Midday entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === "Midday" &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.midday = {};

saveMedicationLog();

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
    period: "Midday",
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

});
dinnerButton.addEventListener("click", function () {
    if (
    dinnerButton.textContent === "✅ Logged Today"
) {
    dinnerButton.textContent = "Dinner Medications";

    dinnerStatus.textContent = "Not Logged";

    

// Remove today's Dinner entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === "Dinner" &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.dinner = {};

saveMedicationLog();

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
    period: "Dinner",
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

});
eveningButton.addEventListener("click", function () {
    if (
    eveningButton.textContent === "✅ Logged Today"
) {
    eveningButton.textContent = "Evening Medications";

    eveningStatus.textContent = "Not Logged";

    

// Remove today's Evening entry from history
medicationHistory = medicationHistory.filter(entry => {
    return !(
        entry.period === "Evening" &&
        entry.date === new Date().toDateString()
    );
});

medicationLog.evening = {};

saveMedicationLog();

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
    period: "Evening",
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
function displayTodayTasks() {

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

        medicationCenterSection.style.display = "block";

        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▲";

        document.getElementById("medicationCenterSection")
            .scrollIntoView({
                behavior: "smooth"
            });

    } else {

        medicationCenterSection.style.display = "none";

        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▼";

    }

});

backToTop.addEventListener("click", function () {

    document.getElementById("medicationCenterSection")
        .style.display = "none";

    medicationCenterCardHeading.textContent =
        "💊 Medication Center ▼";

    document.getElementById("greeting").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});



function saveMedicationLog() {
    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );
}