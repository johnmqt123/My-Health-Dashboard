
const WELCOME_FALLBACK_NAME = "John";

function getWelcomeDisplayName() {
    const profileApi = window.personalProfileData;
    const profile = profileApi && typeof profileApi.loadProfile === "function"
        ? profileApi.loadProfile()
        : null;
    const firstName = profile && typeof profile.firstName === "string"
        ? profile.firstName.trim()
        : "";

    return firstName || WELCOME_FALLBACK_NAME;
}

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
    const displayName = getWelcomeDisplayName();

    if (hour < 12) {
        greeting.textContent = "Good morning,\n" + displayName;
    } else if (hour < 18) {
        greeting.textContent = "Good afternoon,\n" + displayName;
    } else {
        greeting.textContent = "Good evening,\n" + displayName;
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