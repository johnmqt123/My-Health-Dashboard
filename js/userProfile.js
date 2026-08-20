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
    const profileQuickLinksList = document.getElementById("profileQuickLinksList");
    const profileQuickLinkNameInput = document.getElementById("profileQuickLinkNameInput");
    const profileQuickLinkUrlInput = document.getElementById("profileQuickLinkUrlInput");
    const saveProfileQuickLinkBtn = document.getElementById("saveProfileQuickLinkBtn");
    const cancelProfileQuickLinkEditBtn = document.getElementById("cancelProfileQuickLinkEditBtn");
    const quickAccessGrid = document.querySelector(".quick-access-grid");

    let lockedScrollTop = 0;
    let personalProfileInitialized = false;
    let editingQuickLinkIndex = -1;

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

    function isValidHttpUrl(rawUrl) {
        const text = typeof rawUrl === "string" ? rawUrl.trim() : "";
        if (!text) {
            return false;
        }

        try {
            const parsed = new URL(text);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch (_error) {
            return false;
        }
    }

    function getNormalizedQuickLinks(profile) {
        if (!profile || typeof profile !== "object") {
            return [];
        }

        const quickLinks = profile.quickLinks && typeof profile.quickLinks === "object"
            ? profile.quickLinks
            : {};
        const links = Array.isArray(quickLinks.links) ? quickLinks.links : [];

        return links
            .map(function (link) {
                if (!link || typeof link !== "object") {
                    return null;
                }

                const name = typeof link.name === "string" ? link.name.trim() : "";
                const url = typeof link.url === "string" ? link.url.trim() : "";
                if (!name || !isValidHttpUrl(url)) {
                    return null;
                }

                return {
                    name: name,
                    url: url
                };
            })
            .filter(function (link) {
                return !!link;
            });
    }

    function migrateLegacyNutritionTableLink(profile) {
        if (!profile || typeof profile !== "object") {
            return {
                profile: {},
                changed: true
            };
        }

        if (!profile.quickLinks || typeof profile.quickLinks !== "object") {
            profile.quickLinks = {};
        }

        const migratedLinks = getNormalizedQuickLinks(profile);
        const legacyUrl = typeof profile.quickLinks.nutritionTableUrl === "string"
            ? profile.quickLinks.nutritionTableUrl.trim()
            : "";

        let changed = false;

        if (legacyUrl && isValidHttpUrl(legacyUrl)) {
            const hasNutritionName = migratedLinks.some(function (link) {
                return link.name.toLowerCase() === "nutrition table";
            });
            const hasLegacyUrl = migratedLinks.some(function (link) {
                return link.url === legacyUrl;
            });

            if (!hasNutritionName && !hasLegacyUrl) {
                migratedLinks.push({
                    name: "Nutrition Table",
                    url: legacyUrl
                });
                changed = true;
            }
        }

        if (profile.quickLinks.nutritionTableUrl !== undefined) {
            delete profile.quickLinks.nutritionTableUrl;
            changed = true;
        }

        const currentLinks = Array.isArray(profile.quickLinks.links) ? profile.quickLinks.links : [];
        if (JSON.stringify(currentLinks) !== JSON.stringify(migratedLinks)) {
            profile.quickLinks.links = migratedLinks;
            changed = true;
        }

        return {
            profile: profile,
            changed: changed
        };
    }

    function saveQuickLinksToProfile(profile, links) {
        if (!profile.quickLinks || typeof profile.quickLinks !== "object") {
            profile.quickLinks = {};
        }

        profile.quickLinks.links = links;
        return profile;
    }

    function clearQuickLinkEditor() {
        editingQuickLinkIndex = -1;
        if (profileQuickLinkNameInput) {
            profileQuickLinkNameInput.value = "";
        }
        if (profileQuickLinkUrlInput) {
            profileQuickLinkUrlInput.value = "";
        }
        if (saveProfileQuickLinkBtn) {
            saveProfileQuickLinkBtn.textContent = "Save Link";
        }
    }

    function renderDashboardQuickLinks(profile) {
        if (!quickAccessGrid) {
            return;
        }

        quickAccessGrid.querySelectorAll('[data-user-quick-link="true"]').forEach(function (button) {
            button.remove();
        });

        const links = getNormalizedQuickLinks(profile);
        links.forEach(function (link) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "quick-access-button";
            button.textContent = link.name;
            button.setAttribute("data-feature", link.name);
            button.setAttribute("data-url", link.url);
            button.setAttribute("data-user-quick-link", "true");
            quickAccessGrid.appendChild(button);
        });
    }

    function renderProfileQuickLinksList() {
        if (!profileQuickLinksList) {
            return;
        }

        const profile = loadPersonalProfile();
        const links = getNormalizedQuickLinks(profile);

        if (links.length === 0) {
            profileQuickLinksList.innerHTML = '<p class="profile-quick-links-empty">No custom quick links yet.</p>';
            return;
        }

        profileQuickLinksList.innerHTML = links
            .map(function (link, index) {
                const isFirstLink = index === 0;
                const isLastLink = index === links.length - 1;
                return '<div class="profile-quick-link-row" data-quick-link-index="' + index + '">' +
                    '<p class="profile-quick-link-name">' +
                        escapeHtml(link.name) +
                    '</p>' +
                    '<p class="profile-quick-link-url">' +
                        escapeHtml(link.url) +
                    '</p>' +
                    '<div class="profile-quick-link-row-actions">' +
                        '<button type="button" class="profile-quick-link-move-up"' +
                            (isFirstLink ? ' disabled' : '') +
                            '>Move Up</button>' +
                        '<button type="button" class="profile-quick-link-move-down"' +
                            (isLastLink ? ' disabled' : '') +
                            '>Move Down</button>' +
                        '<button type="button" class="profile-quick-link-edit">Edit</button>' +
                        '<button type="button" class="profile-quick-link-delete">Delete</button>' +
                    '</div>' +
                '</div>';
            })
            .join("");
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
        const migrationResult = migrateLegacyNutritionTableLink(profile);
        if (migrationResult.changed) {
            savePersonalProfile(migrationResult.profile);
        }
        const savedHeight = getHeightInchesFromProfile(profile);
        renderProfileHeight();
        renderProfileQuickLinksList();
        renderDashboardQuickLinks(profile);
        clearQuickLinkEditor();

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

    function saveProfileQuickLink() {
        const name = profileQuickLinkNameInput ? profileQuickLinkNameInput.value.trim() : "";
        const url = profileQuickLinkUrlInput ? profileQuickLinkUrlInput.value.trim() : "";

        if (!name) {
            alert("Please enter a link name.");
            return;
        }

        if (!url || !isValidHttpUrl(url)) {
            alert("Please enter a valid http:// or https:// URL.");
            return;
        }

        const profile = loadPersonalProfile();
        const links = getNormalizedQuickLinks(profile);
        const nextLink = {
            name: name,
            url: url
        };

        if (editingQuickLinkIndex >= 0 && editingQuickLinkIndex < links.length) {
            links[editingQuickLinkIndex] = nextLink;
        } else {
            links.push(nextLink);
        }

        savePersonalProfile(saveQuickLinksToProfile(profile, links));
        renderProfileQuickLinksList();
        renderDashboardQuickLinks(profile);
        clearQuickLinkEditor();
    }

    function editProfileQuickLink(index) {
        const profile = loadPersonalProfile();
        const links = getNormalizedQuickLinks(profile);
        if (index < 0 || index >= links.length) {
            return;
        }

        editingQuickLinkIndex = index;
        if (profileQuickLinkNameInput) {
            profileQuickLinkNameInput.value = links[index].name;
        }
        if (profileQuickLinkUrlInput) {
            profileQuickLinkUrlInput.value = links[index].url;
        }
        if (saveProfileQuickLinkBtn) {
            saveProfileQuickLinkBtn.textContent = "Update Link";
        }

        if (profileQuickLinkNameInput) {
            profileQuickLinkNameInput.focus();
        }
    }

    function deleteProfileQuickLink(index) {
        const profile = loadPersonalProfile();
        const links = getNormalizedQuickLinks(profile);
        if (index < 0 || index >= links.length) {
            return;
        }

        links.splice(index, 1);
        savePersonalProfile(saveQuickLinksToProfile(profile, links));
        renderProfileQuickLinksList();
        renderDashboardQuickLinks(profile);
        clearQuickLinkEditor();
    }

    function moveProfileQuickLink(index, direction) {
        const profile = loadPersonalProfile();
        const links = getNormalizedQuickLinks(profile);
        const targetIndex = index + direction;
        if (index < 0 || index >= links.length || targetIndex < 0 || targetIndex >= links.length) {
            return;
        }

        const movedLink = links[index];
        links[index] = links[targetIndex];
        links[targetIndex] = movedLink;

        savePersonalProfile(saveQuickLinksToProfile(profile, links));
        renderProfileQuickLinksList();
        renderDashboardQuickLinks(profile);
        clearQuickLinkEditor();
    }

    function initPersonalProfile() {
        if (!profileHeightDisplay) {
            return;
        }

        const profile = loadPersonalProfile();
        const migrationResult = migrateLegacyNutritionTableLink(profile);
        if (migrationResult.changed) {
            savePersonalProfile(migrationResult.profile);
        }

        renderProfileHeight();
        renderDashboardQuickLinks(profile);

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

        if (saveProfileQuickLinkBtn) {
            saveProfileQuickLinkBtn.addEventListener("click", saveProfileQuickLink);
        }

        if (cancelProfileQuickLinkEditBtn) {
            cancelProfileQuickLinkEditBtn.addEventListener("click", clearQuickLinkEditor);
        }

        if (profileQuickLinksList) {
            profileQuickLinksList.addEventListener("click", function (event) {
                const row = event.target.closest("[data-quick-link-index]");
                if (!row) {
                    return;
                }

                const index = Number(row.getAttribute("data-quick-link-index"));
                if (!Number.isInteger(index) || index < 0) {
                    return;
                }

                if (event.target.closest(".profile-quick-link-move-up")) {
                    moveProfileQuickLink(index, -1);
                    return;
                }

                if (event.target.closest(".profile-quick-link-move-down")) {
                    moveProfileQuickLink(index, 1);
                    return;
                }

                if (event.target.closest(".profile-quick-link-edit")) {
                    editProfileQuickLink(index);
                    return;
                }

                if (event.target.closest(".profile-quick-link-delete")) {
                    deleteProfileQuickLink(index);
                }
            });
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    window.personalProfileData = {
        loadProfile: loadPersonalProfile,
        saveProfile: savePersonalProfile,
        getQuickLinks: function () {
            return getNormalizedQuickLinks(loadPersonalProfile());
        },
        getHeightInches: function () {
            return getHeightInchesFromProfile(loadPersonalProfile());
        },
        formatHeightForDisplay: formatHeightForDisplay
    };

    window.initPersonalProfile = initPersonalProfile;
    initPersonalProfile();
})();