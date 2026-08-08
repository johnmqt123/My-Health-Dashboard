function initAsNeededMedicationCenter() {
    const logAsNeededMedicationButton = document.getElementById("logAsNeededMedicationButton");
    const asNeededMedicationModal = document.getElementById("asNeededMedicationModal");
    const saveAsNeededMedicationBtn = document.getElementById("saveAsNeededMedicationBtn");
    const cancelAsNeededMedicationBtn = document.getElementById("cancelAsNeededMedicationBtn");
    const asNeededMedicationNameInput = document.getElementById("asNeededMedicationNameInput");
    const asNeededMedicationCount = document.getElementById("asNeededMedicationCount");
    const asNeededMedicationNote = document.getElementById("asNeededMedicationNote");
    const asNeededLastTakenDisplay = document.getElementById("asNeededLastTakenDisplay");

    let asNeededMedicationHistory = loadData("asNeededMedicationHistory", []);

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
        if (!asNeededLastTakenDisplay) {
            return;
        }

        if (!asNeededMedicationHistory.length) {
            asNeededLastTakenDisplay.textContent = "No as-needed medications logged yet.";
            return;
        }

        const latest = asNeededMedicationHistory[asNeededMedicationHistory.length - 1];
        const medicationName = latest.medication || "Medication";
        const tablets = Number(latest.tablets) || 1;
        const tabletsText = tablets === 2 ? "2 tablets" : "1 tablet";
        const noteText = latest.note ? ` — ${latest.note}` : "";
        asNeededLastTakenDisplay.textContent =
            `${medicationName}: ${formatDateTime(latest.dateTime)} · ${tabletsText}${noteText}`;
    }

    function resetForm() {
        if (asNeededMedicationNameInput) {
            asNeededMedicationNameInput.value = "";
        }

        if (asNeededMedicationCount) {
            asNeededMedicationCount.value = "1";
        }

        if (asNeededMedicationNote) {
            asNeededMedicationNote.value = "";
        }
    }

    function openModal() {
        if (asNeededMedicationModal) {
            resetForm();
            asNeededMedicationModal.style.display = "block";
        }

        if (asNeededMedicationNameInput) {
            asNeededMedicationNameInput.focus();
        }
    }

    function closeModal() {
        if (asNeededMedicationModal) {
            asNeededMedicationModal.style.display = "none";
        }
    }

    if (logAsNeededMedicationButton) {
        logAsNeededMedicationButton.addEventListener("click", openModal);
    }

    if (saveAsNeededMedicationBtn) {
        saveAsNeededMedicationBtn.addEventListener("click", function () {
            const medicationName = asNeededMedicationNameInput
                ? asNeededMedicationNameInput.value.trim()
                : "";

            if (!medicationName) {
                alert("Please enter a medication name.");
                return;
            }

            const entry = {
                medication: medicationName,
                dateTime: getCurrentDateTimeValue(),
                tablets: asNeededMedicationCount ? Number(asNeededMedicationCount.value) : 1,
                note: asNeededMedicationNote ? asNeededMedicationNote.value.trim() : ""
            };

            asNeededMedicationHistory.push(entry);
            saveData("asNeededMedicationHistory", asNeededMedicationHistory);
            closeModal();
            renderLastTaken();
        });
    }

    if (cancelAsNeededMedicationBtn) {
        cancelAsNeededMedicationBtn.addEventListener("click", closeModal);
    }

    renderLastTaken();
}
