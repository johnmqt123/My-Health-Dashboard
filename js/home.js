
function initializeHome() {
    updateGreeting();
    updateDate();
}

function updateGreeting() {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();
    const profile = typeof window.personalProfileData !== "undefined" &&
        typeof window.personalProfileData.loadProfile === "function"
        ? window.personalProfileData.loadProfile()
        : {};
    const firstName = typeof profile.firstName === "string"
        ? profile.firstName.trim()
        : "";
    const greetingSuffix = firstName ? ", " + firstName : "";

    if (hour < 12) {
        greeting.textContent = "Good Morning" + greetingSuffix;
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon" + greetingSuffix;
    } else {
        greeting.textContent = "Good Evening" + greetingSuffix;
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