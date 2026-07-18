// Load saved medication status
let medicationLog = JSON.parse(localStorage.getItem("medicationLog")) || {};

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
    const logButton = document.getElementById("logButton");
const medStatus = document.getElementById("medStatus");
const wakeUpMedicationList = document.getElementById("wakeUpMedicationList");
const breakfastMedicationList = document.getElementById("breakfastMedicationList");
const middayMedicationList = document.getElementById("middayMedicationList");
const dinnerMedicationList = document.getElementById("dinnerMedicationList");
const eveningMedicationList = document.getElementById("eveningMedicationList");

    function displayMedicationList(time, element) {
    const group = medicationSchedule.find(
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