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

  
// Medication Center moved to medicationCenter.js

initializeHome();

if (document.getElementById("dailyRoutineList")) {
    initDailyRoutine();
}

initExerciseCenter();
initNutritionCenter();
initWeightCenter();
initBloodPressureCenter();
initZepboundCenter();

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
        setMedicationSectionExpanded(list, isHidden);
    });
}

function setMedicationSectionExpanded(list, isExpanded) {
    if (!list) {
        return;
    }

    list.style.display = isExpanded ? "block" : "none";
}

setupMedicationToggle("wakeUpHeading", "wakeUpMedicationList");
setupMedicationToggle("breakfastHeading", "breakfastMedicationList");
setupMedicationToggle("middayHeading", "middayMedicationList");
setupMedicationToggle("dinnerHeading", "dinnerMedicationList");
setupMedicationToggle("eveningHeading", "eveningMedicationList");
setupMedicationToggle("asNeededHeading", "asNeededMedicationContent");
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


const exerciseHistoryButton =
    document.getElementById("exerciseHistoryButton");

const exerciseHistorySection =
    document.getElementById("exerciseHistorySection");

const exerciseHistoryDisplay =
    document.getElementById("exerciseHistoryDisplay");
const addTaskButton =
    document.getElementById("addTaskButton");

const todayList =
    document.getElementById("todayList");

const quickAccessButtons =
    document.querySelectorAll(".quick-access-button");
    
const medicationCenterCardHeading =
    document.getElementById("medicationCenterCardHeading");
const backToTop =
    document.getElementById("backToTop");
const pageBackToTop =
    document.getElementById("pageBackToTop");
const summaryMedicationStatus =
    document.getElementById("summaryBreakfastStatus");

const medicationSectionConfig = {
    wakeUp: {
        cardId: "medCard"
    },
    breakfast: {
        cardId: "breakfastCard"
    },
    midday: {
        cardId: "middayCard"
    },
    dinner: {
        cardId: "dinnerCard"
    },
    evening: {
        cardId: "eveningCard"
    }
};

function scrollMedicationCenterTo(targetElement) {
    const elementToScroll =
        targetElement || document.getElementById("medicationCenterSection");

    if (!elementToScroll) {
        return;
    }

    requestAnimationFrame(function () {
        elementToScroll.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

function openMedicationCenter(targetElement) {
    const medicationCenterSection =
        document.getElementById("medicationCenterSection");

    if (!medicationCenterSection) {
        return;
    }

    medicationCenterSection.style.display = "block";

    const asNeededContent = document.getElementById("asNeededMedicationContent");
    if (asNeededContent) {
        asNeededContent.style.display = "none";
    }

    if (medicationCenterCardHeading) {
        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▲";
    }

    scrollMedicationCenterTo(targetElement);
}

function openMedicationCenterForPeriod(periodKey) {
    const config = medicationSectionConfig[periodKey];

    if (!config) {
        return;
    }

    openMedicationCenter(document.getElementById(config.cardId));
}

let todayTasks =
    JSON.parse(localStorage.getItem("todayTasks")) || [];
    let taskListDate =
    localStorage.getItem("taskListDate") ||
    new Date().toDateString();

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

if (quickAccessButtons.length) {
    quickAccessButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const feature = this.dataset.feature || "This feature";
            const url = this.dataset.url;
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (feature === "Reminders") {
                alert("Apple Reminders does not currently expose a supported URL scheme that Safari can launch from a web page. Open the Reminders app manually.");
                return;
            }

            if (url) {
                if (isIOS) {
                    window.location.href = url;
                    return;
                }

                window.open(url, "_blank", "noopener,noreferrer");
                return;
            }

            alert(feature + " is under development.");
        });
    });
}

if (todayTasks.length > 0 && todayList) {

    displayTodayTasks();

}

function updateAtAGlanceStatus() {
    if (summaryMedicationStatus) {
        const todayDate = new Date().toDateString();
        const medicationPeriods = [
            { key: "wakeUp", label: "Wake-Up" },
            { key: "breakfast", label: "Breakfast" },
            { key: "midday", label: "Midday" },
            { key: "dinner", label: "Dinner" },
            { key: "evening", label: "Evening" }
        ];

        const nextPeriod = medicationPeriods.find(function (period) {
            const logEntry = medicationLog[period.key];
            return !(logEntry && logEntry.logged && logEntry.date === todayDate);
        });

        if (nextPeriod) {
            summaryMedicationStatus.innerHTML =
                'Next due: <button type="button" class="summary-medication-link" data-period-key="' +
                nextPeriod.key +
                '">' +
                nextPeriod.label +
                ' Medications</button>';
            return;
        }

        summaryMedicationStatus.textContent =
            "All scheduled medications completed today. ✓";
    }
}

window.updateAtAGlanceStatus = updateAtAGlanceStatus;
updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();
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

    updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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

updateAtAGlanceStatus();

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

updateAtAGlanceStatus();

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

updateAtAGlanceStatus();

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

    updateAtAGlanceStatus();

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
if (addTaskButton) {
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
}
function displayTodayTasks() {

    if (!todayList) {
        return;
    }

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
        openMedicationCenter();

    } else {

        medicationCenterSection.style.display = "none";

        medicationCenterCardHeading.textContent =
            "💊 Medication Center ▼";

    }

});

if (summaryMedicationStatus) {
    summaryMedicationStatus.addEventListener("click", function (event) {
        const periodTrigger = event.target.closest(".summary-medication-link");

        if (!periodTrigger) {
            return;
        }

        openMedicationCenterForPeriod(periodTrigger.dataset.periodKey);
    });
}

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

if (pageBackToTop) {
    pageBackToTop.addEventListener("click", function () {
        const zepboundCenterSection = document.getElementById("zepboundCenterSection");
        const closeZepboundButton = document.getElementById("closeZepboundButton");

        if (
            zepboundCenterSection &&
            zepboundCenterSection.style.display === "block" &&
            closeZepboundButton
        ) {
            closeZepboundButton.click();
            return;
        }

        const medicationCenterSection = document.getElementById("medicationCenterSection");

        if (
            medicationCenterSection &&
            medicationCenterSection.style.display === "block" &&
            backToTop
        ) {
            backToTop.click();
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}



function saveMedicationLog() {
    localStorage.setItem(
        "medicationLog",
        JSON.stringify(medicationLog)
    );
}