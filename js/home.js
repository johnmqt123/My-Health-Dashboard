
function initializeHome() {
    updateGreeting();
    updateDate();
}

function updateGreeting() {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good Morning, " + userProfile.firstName;
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon, " + userProfile.firstName;
    } else {
        greeting.textContent = "Good Evening, " + userProfile.firstName;
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