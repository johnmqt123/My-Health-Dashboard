
const WELCOME_DISPLAY_NAME = "Yooper";

function initializeHome() {
    updateGreeting();
    updateDate();
    updateDailyMessage();
}

function updateDailyMessage() {
    const dailyMessage = document.querySelector(".welcome-up-label");
    if (!dailyMessage) {
        return;
    }

    const savedMessage = window.personalProfileData &&
        typeof window.personalProfileData.getDailyMessage === "function"
        ? window.personalProfileData.getDailyMessage()
        : "";
    dailyMessage.textContent = savedMessage || "Enter your daily message";
}

function updateGreeting() {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good morning,\n" + WELCOME_DISPLAY_NAME;
    } else if (hour < 18) {
        greeting.textContent = "Good afternoon,\n" + WELCOME_DISPLAY_NAME;
    } else {
        greeting.textContent = "Good evening,\n" + WELCOME_DISPLAY_NAME;
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