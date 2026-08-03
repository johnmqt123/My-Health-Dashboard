function initZepboundCenter() {
    const zepboundButton = document.getElementById("zepboundButton");
    const closeZepboundButton = document.getElementById("closeZepboundButton");
    const zepboundCenterSection = document.getElementById("zepboundCenterSection");
    const mainDashboardHeader = document.querySelector("header");
    const mainDashboardBriefing = document.querySelector("section.briefing");
    const logInjectionButton = document.getElementById("logInjectionButton");
    const historyInjectionButton = document.getElementById("historyInjectionButton");
    const historyInjectionSection = document.getElementById("historyInjectionSection");
    const historyInjectionDisplay = document.getElementById("historyInjectionDisplay");
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
    let editingEntryIndex = null;

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

    function renderHistory() {
        if (!historyInjectionSection || !historyInjectionDisplay) {
            return;
        }

        const reversedHistory = [...history].reverse();

        if (!reversedHistory.length) {
            historyInjectionDisplay.innerHTML = "<p>No injection history yet.</p>";
            return;
        }

        historyInjectionDisplay.innerHTML = reversedHistory.map(function (entry, index) {
            const notesMarkup = entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : "";
            const originalIndex = history.length - 1 - index;
            return `
                <div style="margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                    <p><strong>Date:</strong> ${entry.date}</p>
                    <p><strong>Time:</strong> ${entry.time}</p>
                    <p><strong>Dose:</strong> ${entry.dose}</p>
                    <p><strong>Site:</strong> ${entry.site}</p>
                    ${notesMarkup}
                    <div class="history-action-row">
                        <button type="button" class="history-action-btn edit history-edit-btn" data-index="${originalIndex}">Edit</button>
                        <button type="button" class="history-action-btn delete history-delete-btn" data-index="${originalIndex}">Delete</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    function showDashboard() {
        if (mainDashboardHeader) {
            mainDashboardHeader.style.display = "block";
        }

        if (mainDashboardBriefing) {
            mainDashboardBriefing.style.display = "block";
        }

        zepboundCenterSection.style.display = "none";
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function populateModalForEdit(index) {
        const entry = history[index];

        if (!entry) {
            return;
        }

        editingEntryIndex = index;

        if (injectionDateInput) {
            injectionDateInput.value = entry.date || "";
        }

        if (injectionTimeInput) {
            injectionTimeInput.value = entry.time || "";
        }

        if (doseSelect) {
            doseSelect.value = entry.dose || "2.5 mg";
        }

        if (siteSelect) {
            siteSelect.value = entry.site || "Left Abdomen";
        }

        if (injectionNotesInput) {
            injectionNotesInput.value = entry.notes || "";
        }

        if (injectionModal) {
            injectionModal.style.display = "block";
        }
    }

    function showZepboundCenter() {
        if (mainDashboardHeader) {
            mainDashboardHeader.style.display = "none";
        }

        if (mainDashboardBriefing) {
            mainDashboardBriefing.style.display = "none";
        }

        zepboundCenterSection.style.display = "block";
        window.setTimeout(function () {
            zepboundCenterSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    }

    if (!zepboundButton || !closeZepboundButton || !zepboundCenterSection) {
        return;
    }

    renderLatestInjection();

    zepboundButton.addEventListener("click", function () {
        showZepboundCenter();
    });

    closeZepboundButton.addEventListener("click", function () {
        showDashboard();
    });

    if (logInjectionButton && injectionModal) {
        logInjectionButton.addEventListener("click", function () {
            injectionModal.style.display = "block";
        });
    }

    if (historyInjectionButton && historyInjectionSection && historyInjectionDisplay) {
        historyInjectionButton.addEventListener("click", function () {
            const isHidden = historyInjectionSection.style.display === "none";
            historyInjectionSection.style.display = isHidden ? "block" : "none";
            historyInjectionButton.textContent = isHidden ? "Hide History" : "📊 History";

            if (isHidden) {
                renderHistory();
            }
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

            if (editingEntryIndex !== null && history[editingEntryIndex]) {
                history[editingEntryIndex] = injectionEntry;
            } else {
                history.push(injectionEntry);
            }

            saveData("zepboundInjectionHistory", history);
            injectionModal.style.display = "none";
            clearModalFields();
            editingEntryIndex = null;
            renderLatestInjection();

            if (historyInjectionSection && historyInjectionSection.style.display === "block") {
                renderHistory();
            }
        });
    }

    if (cancelInjectionBtn && injectionModal) {
        cancelInjectionBtn.addEventListener("click", function () {
            injectionModal.style.display = "none";
            clearModalFields();
            editingEntryIndex = null;
        });
    }

    if (historyInjectionDisplay) {
        historyInjectionDisplay.addEventListener("click", function (event) {
            const editButton = event.target.closest(".history-edit-btn");
            const deleteButton = event.target.closest(".history-delete-btn");

            if (editButton) {
                const index = Number(editButton.getAttribute("data-index"));
                populateModalForEdit(index);
                return;
            }

            if (deleteButton) {
                const index = Number(deleteButton.getAttribute("data-index"));
                if (confirmHistoryDelete()) {
                    history.splice(index, 1);
                    saveData("zepboundInjectionHistory", history);
                    renderHistory();
                    renderLatestInjection();
                }
            }
        });
    }

    renderLatestInjection();
    renderHistory();
}
