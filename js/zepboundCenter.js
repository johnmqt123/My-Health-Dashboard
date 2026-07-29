function initZepboundCenter() {
    const zepboundButton = document.getElementById("zepboundButton");
    const closeZepboundButton = document.getElementById("closeZepboundButton");
    const zepboundCenterSection = document.getElementById("zepboundCenterSection");
    const mainDashboardHeader = document.querySelector("header");
    const mainDashboardBriefing = document.querySelector("section.briefing");
    const logInjectionButton = document.getElementById("logInjectionButton");
    const injectionModal = document.getElementById("injectionModal");
    const saveInjectionBtn = document.getElementById("saveInjectionBtn");
    const cancelInjectionBtn = document.getElementById("cancelInjectionBtn");
    const injectionLogDisplay = document.getElementById("injectionLogDisplay");
    const injectionDateInput = document.getElementById("injectionDate");
    const injectionTimeInput = document.getElementById("injectionTime");
    const doseSelect = document.getElementById("doseSelect");
    const siteSelect = document.getElementById("siteSelect");
    const injectionNotesInput = document.getElementById("injectionNotes");
    let history = loadData("zepboundInjectionHistory", []);

    function renderLatestInjection() {
        if (!injectionLogDisplay) {
            return;
        }

        if (!history.length) {
            injectionLogDisplay.innerHTML = "";
            return;
        }

        const latest = history[history.length - 1];
        injectionLogDisplay.innerHTML = `
            <h3>Last Injection</h3>
            <p><strong>Date:</strong> ${latest.date}</p>
            <p><strong>Time:</strong> ${latest.time}</p>
            <p><strong>Dose:</strong> ${latest.dose}</p>
            <p><strong>Site:</strong> ${latest.site}</p>
        `;
    }

    function clearModalFields() {
        if (injectionDateInput) {
            injectionDateInput.value = "";
        }

        if (injectionTimeInput) {
            injectionTimeInput.value = "";
        }

        if (doseSelect) {
            doseSelect.value = "2.5 mg";
        }

        if (siteSelect) {
            siteSelect.value = "Left Abdomen";
        }

        if (injectionNotesInput) {
            injectionNotesInput.value = "";
        }
    }

    if (!zepboundButton || !closeZepboundButton || !zepboundCenterSection) {
        return;
    }

    renderLatestInjection();

    zepboundButton.addEventListener("click", function () {
        if (mainDashboardHeader) {
            mainDashboardHeader.style.display = "none";
        }

        if (mainDashboardBriefing) {
            mainDashboardBriefing.style.display = "none";
        }

        zepboundCenterSection.style.display = "block";
    });

    closeZepboundButton.addEventListener("click", function () {
        zepboundCenterSection.style.display = "none";

        if (mainDashboardHeader) {
            mainDashboardHeader.style.display = "block";
        }

        if (mainDashboardBriefing) {
            mainDashboardBriefing.style.display = "block";
        }
    });

    if (logInjectionButton && injectionModal) {
        logInjectionButton.addEventListener("click", function () {
            injectionModal.style.display = "block";
        });
    }

    if (saveInjectionBtn && injectionModal) {
        saveInjectionBtn.addEventListener("click", function () {
            const injectionEntry = {
                date: injectionDateInput ? injectionDateInput.value : "",
                time: injectionTimeInput ? injectionTimeInput.value : "",
                dose: doseSelect ? doseSelect.value : "",
                site: siteSelect ? siteSelect.value : "",
                notes: injectionNotesInput ? injectionNotesInput.value : ""
            };

            history.push(injectionEntry);
            saveData("zepboundInjectionHistory", history);
            injectionModal.style.display = "none";
            clearModalFields();
            renderLatestInjection();
        });
    }

    if (cancelInjectionBtn && injectionModal) {
        cancelInjectionBtn.addEventListener("click", function () {
            injectionModal.style.display = "none";
            clearModalFields();
        });
    }

    renderLatestInjection();
}
