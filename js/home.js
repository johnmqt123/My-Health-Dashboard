
const WELCOME_DISPLAY_NAME = "Yooper";

function initializeHome() {
    updateGreeting();
    updateDate();
}

function updateGreeting() {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();
    const greetingSuffix = ", " + WELCOME_DISPLAY_NAME;

    if (hour < 12) {
        greeting.textContent = "Good morning" + greetingSuffix;
    } else if (hour < 18) {
        greeting.textContent = "Good afternoon" + greetingSuffix;
    } else {
        greeting.textContent = "Good evening" + greetingSuffix;
    }
}

function updateDate() {
    const today = document.getElementById("today");
    

    if (!today) {
        return;
    }

    today.textContent = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}