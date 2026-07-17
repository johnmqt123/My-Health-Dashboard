// Load saved medication status
let medicationLog = JSON.parse(localStorage.getItem("medicationLog")) || {};
let weightLog = JSON.parse(localStorage.getItem("weightLog")) || {};
// Restore Wake-Up medication status
if (medicationLog.wakeUp?.logged) {
    console.log("Wake-Up medications were previously logged at", medicationLog.wakeUp.time);
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
const weightButton = document.getElementById("weightButton");
const weightDisplay = document.getElementById("weightDisplay");
weightButton.addEventListener("click", function () {

    const weight = prompt("Enter your current weight:");

    if (weight) {

        weightDisplay.textContent =
            "Last Weight: " + weight + " lb";

    }

});
updateDashboard();
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

logButton.addEventListener("click", function () {

    const now = new Date();
medicationLog.wakeUp = {
    logged: true,
    time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
};

localStorage.setItem("medicationLog", JSON.stringify(medicationLog));
    medStatus.innerHTML =
    "<strong>✅ Logged Today:</strong> " +
    now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

logButton.textContent = "✅ Logged Today";
logButton.disabled = true;

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