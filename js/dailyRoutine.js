// Daily Routine

let dailyRoutine = [
    {
    id: "wakeUp",
    name: "Wake Up",
    icon: "🌅",
    time: "07:00",
    enabled: true,
    order: 1
},
    {
        id: "breakfast",
        name: "Breakfast",
        icon: "🍳",
        time: "08:00",
        enabled: true,
        order: 2
    },
    {
        id: "midday",
        name: "Midday",
        icon: "☀️",
        time: "13:00",
        enabled: true,
        order: 3
    },
    {
        id: "evening",
        name: "Evening",
        icon: "🌙",
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
            <p>${item.icon} <strong>${item.name}</strong> — ${item.time}</p>
        `;
    });
}