function initZepboundCenter() {
    const openZepboundModalBtn = document.getElementById("openZepboundModalBtn");
    const zepboundModal = document.getElementById("zepboundModal");
    const zepboundModalContent = document.getElementById("zepboundModalContent");
    const closeZepboundModalBtn = document.getElementById("closeZepboundModalBtn");
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
    let zepboundLockedScrollTop = 0;

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

    function lockZepboundModalBackgroundScroll() {
        zepboundLockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("zepbound-modal-open");
        document.body.classList.add("zepbound-modal-open");
        document.body.style.top = "-" + zepboundLockedScrollTop + "px";
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

    function unlockZepboundModalBackgroundScroll() {
        document.documentElement.classList.remove("zepbound-modal-open");
        document.body.classList.remove("zepbound-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, zepboundLockedScrollTop);
    }

    function resetZepboundModalScrollToTop() {
        if (!zepboundModalContent) {
            return;
        }

        zepboundModalContent.scrollTop = 0;
    }

    function isZepboundModalOpen() {
        return !!(zepboundModal && zepboundModal.style.display === "flex");
    }

    function openZepboundModal() {
        if (!zepboundModal) {
            return;
        }

        zepboundModal.style.display = "flex";
        resetZepboundModalScrollToTop();
        lockZepboundModalBackgroundScroll();
        renderLatestInjection();
    }

    function closeZepboundModal() {
        if (!zepboundModal || !isZepboundModalOpen()) {
            return;
        }

        zepboundModal.style.display = "none";

        if (historyInjectionSection) {
            historyInjectionSection.style.display = "none";
        }

        if (historyInjectionButton) {
            historyInjectionButton.textContent = "📊 History";
        }

        if (injectionModal) {
            injectionModal.style.display = "none";
        }

        clearModalFields();
        editingEntryIndex = null;
        unlockZepboundModalBackgroundScroll();
    }

    if (!openZepboundModalBtn || !zepboundModal || !closeZepboundModalBtn) {
        return;
    }

    renderLatestInjection();

    openZepboundModalBtn.addEventListener("click", function () {
        openZepboundModal();
    });

    closeZepboundModalBtn.addEventListener("click", function () {
        closeZepboundModal();
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

                if (historyInjectionSection && typeof historyInjectionSection.scrollIntoView === "function") {
                    historyInjectionSection.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
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

    if (zepboundModal) {
        zepboundModal.addEventListener("touchmove", function (event) {
            if (!zepboundModalContent) {
                return;
            }

            if (!zepboundModalContent.contains(event.target)) {
                event.preventDefault();
            }
        }, {
            passive: false
        });
    }

    window.closeZepboundModal = closeZepboundModal;
    window.isZepboundModalOpen = isZepboundModalOpen;

    renderLatestInjection();
    renderHistory();
}
