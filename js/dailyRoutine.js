// Daily Routine

let dailyRoutine = [
    {
        id: "wakeUp",
        name: "Wake Up",
        time: "07:00",
        enabled: true,
        order: 1
    },
    {
        id: "breakfast",
        name: "Breakfast",
        time: "08:00",
        enabled: true,
        order: 2
    },
    {
        id: "midday",
        name: "Midday",
        time: "13:00",
        enabled: true,
        order: 3
    },
    {
        id: "evening",
        name: "Evening",
        time: "19:00",
        enabled: true,
        order: 4
    }
];

function initDailyRoutine() {
    showDailyRoutine();
    displayDailyRoutine();
}

function showDailyRoutine() {
    console.table(dailyRoutine);
}

function displayDailyRoutine() {
    const list = document.getElementById("dailyRoutineList");

    list.innerHTML = "";

    dailyRoutine.forEach(item => {
        list.innerHTML += `
            <p><strong>${item.name}</strong> — ${item.time}</p>
        `;
    });
}