function initAsNeededMedicationCenter() {
    const logTylenolButton = document.getElementById("logTylenolButton");
    const tylenolModal = document.getElementById("tylenolModal");
    const saveTylenolBtn = document.getElementById("saveTylenolBtn");
    const cancelTylenolBtn = document.getElementById("cancelTylenolBtn");
    const tylenolTabletCount = document.getElementById("tylenolTabletCount");
    const tylenolTakenAt = document.getElementById("tylenolTakenAt");
    const tylenolNote = document.getElementById("tylenolNote");
    const tylenolLastTakenDisplay = document.getElementById("tylenolLastTakenDisplay");

    let tylenolLog = loadData("tylenolLog", []);

    function getCurrentDateTimeValue() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localTime = new Date(now.getTime() - offset * 60000);
        return localTime.toISOString().slice(0, 16);
    }

    function formatDateTime(value) {
        if (!value) {
            return "Not logged yet";
        }

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date.toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short"
            });
        }

        return value;
    }

    function renderLastTaken() {
        if (!tylenolLastTakenDisplay) {
            return;
        }

        if (!tylenolLog.length) {
            tylenolLastTakenDisplay.textContent = "No Tylenol logged yet.";
            return;
        }

        const latest = tylenolLog[tylenolLog.length - 1];
        const tabletsText = latest.tablets === 2 ? "2 tablets" : "1 tablet";
        const noteText = latest.note ? ` — ${latest.note}` : "";
        tylenolLastTakenDisplay.textContent =
            `Last taken: ${formatDateTime(latest.dateTime)} · ${tabletsText}${noteText}`;
    }

    function resetForm() {
        if (tylenolTabletCount) {
            tylenolTabletCount.value = "1";
        }

        if (tylenolTakenAt) {
            tylenolTakenAt.value = getCurrentDateTimeValue();
        }

        if (tylenolNote) {
            tylenolNote.value = "";
        }
    }

    function openModal() {
        if (tylenolModal) {
            resetForm();
            tylenolModal.style.display = "block";
        }

        const medicationSelect = document.getElementById("asNeededMedicationSelect");
        if (medicationSelect) {
            medicationSelect.focus();
        }
    }

    function closeModal() {
        if (tylenolModal) {
            tylenolModal.style.display = "none";
        }
    }

    if (logTylenolButton) {
        logTylenolButton.addEventListener("click", openModal);
    }

    const medicationSelect = document.getElementById("asNeededMedicationSelect");
    if (medicationSelect) {
        medicationSelect.addEventListener("change", function () {
            if (tylenolTabletCount) {
                tylenolTabletCount.focus();
            }
        });
    }

    if (saveTylenolBtn) {
        saveTylenolBtn.addEventListener("click", function () {
            const entry = {
                dateTime: tylenolTakenAt ? tylenolTakenAt.value : getCurrentDateTimeValue(),
                tablets: tylenolTabletCount ? Number(tylenolTabletCount.value) : 1,
                note: tylenolNote ? tylenolNote.value.trim() : ""
            };

            tylenolLog.push(entry);
            saveData("tylenolLog", tylenolLog);
            closeModal();
            renderLastTaken();
        });
    }

    if (cancelTylenolBtn) {
        cancelTylenolBtn.addEventListener("click", closeModal);
    }

    renderLastTaken();
}
