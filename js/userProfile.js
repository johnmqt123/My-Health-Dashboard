const userProfile = {
    firstName: "John",
    wakeUpTime: "7:00 AM",

    medicationTracking: true,

    weatherEnabled: true,

    cpapEnabled: true,

    bloodPressureEnabled: true,

    weightEnabled: true,

    exerciseEnabled: true,

    gardeningEnabled: true,

    legionEnabled: true
};

(function () {
    const personalProfileStorageKey = "personalProfile";

    const profileHeightDisplay = document.getElementById("profileHeightDisplay");
    const editProfileHeightButton = document.getElementById("editProfileHeightButton");
    const profileHeightModal = document.getElementById("profileHeightModal");
    const profileHeightFeetInput = document.getElementById("profileHeightFeetInput");
    const profileHeightInchesInput = document.getElementById("profileHeightInchesInput");
    const saveProfileHeightBtn = document.getElementById("saveProfileHeightBtn");
    const cancelProfileHeightBtn = document.getElementById("cancelProfileHeightBtn");

    let lockedScrollTop = 0;
    let personalProfileInitialized = false;

    function getNumberOrNull(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : null;
    }

    function loadPersonalProfile() {
        const loaded = loadData(personalProfileStorageKey, {});
        return loaded && typeof loaded === "object" ? loaded : {};
    }

    function savePersonalProfile(profile) {
        saveData(personalProfileStorageKey, profile);
    }

    function getHeightInchesFromProfile(profile) {
        if (!profile || typeof profile !== "object") {
            return null;
        }

        const parsed = getNumberOrNull(profile.heightInches);
        if (parsed === null || parsed <= 0) {
            return null;
        }

        return Math.round(parsed);
    }

    function formatHeightForDisplay(heightInches) {
        const inches = getNumberOrNull(heightInches);
        if (inches === null || inches <= 0) {
            return "Height not set";
        }

        const wholeInches = Math.round(inches);
        const feet = Math.floor(wholeInches / 12);
        const remainingInches = wholeInches % 12;
        return feet + " ft " + remainingInches + " in";
    }

    function renderProfileHeight() {
        if (!profileHeightDisplay) {
            return;
        }

        const profile = loadPersonalProfile();
        profileHeightDisplay.textContent = formatHeightForDisplay(getHeightInchesFromProfile(profile));
    }

    function lockProfileHeightModalBackgroundScroll() {
        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("profile-height-modal-open");
        document.body.classList.add("profile-height-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
    }

    function unlockProfileHeightModalBackgroundScroll() {
        document.documentElement.classList.remove("profile-height-modal-open");
        document.body.classList.remove("profile-height-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function closeProfileHeightModal() {
        if (!profileHeightModal) {
            return;
        }

        profileHeightModal.style.display = "none";
        unlockProfileHeightModalBackgroundScroll();
    }

    function openProfileHeightModal() {
        if (!profileHeightModal) {
            return;
        }

        const profile = loadPersonalProfile();
        const savedHeight = getHeightInchesFromProfile(profile);

        if (savedHeight === null) {
            if (profileHeightFeetInput) profileHeightFeetInput.value = "";
            if (profileHeightInchesInput) profileHeightInchesInput.value = "";
        } else {
            if (profileHeightFeetInput) profileHeightFeetInput.value = String(Math.floor(savedHeight / 12));
            if (profileHeightInchesInput) profileHeightInchesInput.value = String(savedHeight % 12);
        }

        profileHeightModal.style.display = "flex";
        lockProfileHeightModalBackgroundScroll();

        if (profileHeightFeetInput) {
            profileHeightFeetInput.focus();
        }
    }

    function saveProfileHeight() {
        const feet = getNumberOrNull(profileHeightFeetInput ? profileHeightFeetInput.value.trim() : "");
        const inches = getNumberOrNull(profileHeightInchesInput ? profileHeightInchesInput.value.trim() : "");

        if (feet === null || feet < 0 || !Number.isInteger(feet)) {
            alert("Please enter feet as a whole number.");
            return;
        }

        if (inches === null || inches < 0 || inches > 11 || !Number.isInteger(inches)) {
            alert("Please enter inches between 0 and 11.");
            return;
        }

        const totalHeightInches = (feet * 12) + inches;
        if (totalHeightInches <= 0) {
            alert("Please enter a valid height.");
            return;
        }

        const profile = loadPersonalProfile();
        profile.heightInches = totalHeightInches;
        savePersonalProfile(profile);
        renderProfileHeight();
        closeProfileHeightModal();
    }

    function initPersonalProfile() {
        if (!profileHeightDisplay) {
            return;
        }

        renderProfileHeight();

        if (personalProfileInitialized) {
            return;
        }
        personalProfileInitialized = true;

        if (editProfileHeightButton) {
            editProfileHeightButton.addEventListener("click", openProfileHeightModal);
        }

        if (cancelProfileHeightBtn) {
            cancelProfileHeightBtn.addEventListener("click", closeProfileHeightModal);
        }

        if (saveProfileHeightBtn) {
            saveProfileHeightBtn.addEventListener("click", saveProfileHeight);
        }
    }

    window.initPersonalProfile = initPersonalProfile;
    initPersonalProfile();
})();