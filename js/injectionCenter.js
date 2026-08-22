function createInjectionController(configuration) {
    const options = configuration || {};
    const elements = options.elements || {};
    const helpers = options.helpers || {};
    const lifecycle = options.lifecycle || {};
    const historyClasses = Object.assign({
        entry: "injection-history-entry",
        content: "injection-history-content",
        actions: "injection-history-actions",
        editButton: "injection-history-edit-btn",
        deleteButton: "injection-history-delete-btn"
    }, options.historyClasses || {});
    const medicationName = String(options.medicationName || "").trim();
    const route = options.route || "oral";
    const requireDeleteConfirmation = options.requireDeleteConfirmation !== false;

    let history = [];
    let editingEntryIndex = null;
    let selectedHistoryIndex = null;
    let initialized = false;

    function validateConfiguration() {
        if (!medicationName || route !== "injection") {
            return false;
        }

        return typeof options.loadHistory === "function" &&
            typeof options.saveHistory === "function" &&
            typeof helpers.createInjectionEntry === "function" &&
            typeof helpers.updateInjectionEntry === "function" &&
            typeof helpers.deleteInjectionEntry === "function";
    }

    function renderLatestInjection() {
        if (!elements.injectionLogDisplay) {
            return;
        }

        if (!history.length) {
            elements.injectionLogDisplay.innerHTML = "";
            return;
        }

        const latest = history[history.length - 1];
        elements.injectionLogDisplay.innerHTML = `
            <h3>Last Injection</h3>
            <p><strong>Date:</strong> ${latest.date || ""}</p>
            <p><strong>Time:</strong> ${latest.time || ""}</p>
            <p><strong>Dose:</strong> ${latest.dose || ""}</p>
            <p><strong>Site:</strong> ${latest.site || ""}</p>
        `;
    }

    function renderHistory() {
        if (!elements.historyDisplay) {
            return;
        }

        const reversedHistory = [...history].reverse();

        if (!reversedHistory.length) {
            elements.historyDisplay.innerHTML = "<p>No injection history yet.</p>";
            selectedHistoryIndex = null;
            return;
        }

        elements.historyDisplay.innerHTML = reversedHistory.map(function (entry, index) {
            const notesMarkup = entry.notes ? `<p><strong>Notes:</strong> ${entry.notes}</p>` : "";
            const originalIndex = history.length - 1 - index;
            const isSelected = selectedHistoryIndex !== null && selectedHistoryIndex === originalIndex;

            return `
                <div class="${historyClasses.entry} ${isSelected ? "is-selected" : ""}" data-index="${originalIndex}" tabindex="0" role="button" aria-expanded="${isSelected ? "true" : "false"}">
                    <div class="${historyClasses.content}">
                        <p><strong>Date:</strong> ${entry.date || ""}</p>
                        <p><strong>Time:</strong> ${entry.time || ""}</p>
                        <p><strong>Dose:</strong> ${entry.dose || ""}</p>
                        <p><strong>Site:</strong> ${entry.site || ""}</p>
                        ${notesMarkup}
                    </div>
                    <div class="history-action-row ${historyClasses.actions}" aria-hidden="${isSelected ? "false" : "true"}">
                        <button type="button" class="history-action-btn edit ${historyClasses.editButton}" data-index="${originalIndex}">Edit</button>
                        <button type="button" class="history-action-btn delete ${historyClasses.deleteButton}" data-index="${originalIndex}">Delete</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    function render() {
        renderLatestInjection();
        renderHistory();
    }

    function clearFields() {
        if (elements.dateInput) {
            elements.dateInput.value = "";
        }

        if (elements.timeInput) {
            elements.timeInput.value = "";
        }

        if (elements.doseSelect) {
            elements.doseSelect.value = options.defaultDose || "";
        }

        if (elements.siteSelect) {
            elements.siteSelect.value = options.defaultSite || "";
        }

        if (elements.notesInput) {
            elements.notesInput.value = "";
        }
    }

    function setSelectedHistoryEntry(index) {
        selectedHistoryIndex = index === selectedHistoryIndex ? null : index;
        renderHistory();
    }

    function populateForEdit(index) {
        const entry = history[index];

        if (!entry) {
            return;
        }

        editingEntryIndex = index;

        if (elements.dateInput) {
            elements.dateInput.value = entry.date || "";
        }

        if (elements.timeInput) {
            elements.timeInput.value = entry.time || "";
        }

        if (elements.doseSelect) {
            elements.doseSelect.value = entry.dose || options.defaultDose || "";
        }

        if (elements.siteSelect) {
            elements.siteSelect.value = entry.site || options.defaultSite || "";
        }

        if (elements.notesInput) {
            elements.notesInput.value = entry.notes || "";
        }

        openEntryModal();
    }

    function open() {
        if (!elements.centerModal) {
            return;
        }

        if (typeof lifecycle.onOpen === "function") {
            lifecycle.onOpen();
        }

        elements.centerModal.style.display = options.centerOpenDisplay || "flex";
        if (elements.centerContent) {
            elements.centerContent.scrollTop = 0;
        }
        renderLatestInjection();
    }

    function close() {
        if (!elements.centerModal) {
            return;
        }

        if (typeof lifecycle.onClose === "function") {
            lifecycle.onClose();
        }

        elements.centerModal.style.display = options.centerClosedDisplay || "none";

        if (elements.historySection) {
            elements.historySection.style.display = "none";
        }

        if (elements.historyButton) {
            elements.historyButton.textContent = options.historyButtonLabel || "History";
        }

        closeEntryModal();
    }

    function openEntryModal() {
        if (typeof lifecycle.onEntryOpen === "function") {
            lifecycle.onEntryOpen();
        }

        if (elements.entryModal) {
            elements.entryModal.style.display = options.entryOpenDisplay || "block";
        }
    }

    function closeEntryModal() {
        if (typeof lifecycle.onEntryClose === "function") {
            lifecycle.onEntryClose();
        }

        if (elements.entryModal) {
            elements.entryModal.style.display = options.entryClosedDisplay || "none";
        }

        clearFields();
        editingEntryIndex = null;
    }

    function readEntry() {
        return helpers.createInjectionEntry({
            date: elements.dateInput ? elements.dateInput.value : "",
            time: elements.timeInput ? elements.timeInput.value : "",
            dose: elements.doseSelect ? elements.doseSelect.value : "",
            site: elements.siteSelect ? elements.siteSelect.value : "",
            notes: elements.notesInput ? elements.notesInput.value : ""
        });
    }

    function saveEntry() {
        const entry = readEntry();

        if (editingEntryIndex !== null && history[editingEntryIndex]) {
            history = helpers.updateInjectionEntry(history, editingEntryIndex, entry);
        } else {
            history.push(entry);
        }

        options.saveHistory(history);
        closeEntryModal();
        renderLatestInjection();
        renderHistory();
    }

    function deleteEntry(index) {
        if (requireDeleteConfirmation && typeof options.confirmDelete !== "function") {
            return;
        }

        if (requireDeleteConfirmation && !options.confirmDelete()) {
            return;
        }

        history = helpers.deleteInjectionEntry(history, index);
        options.saveHistory(history);
        selectedHistoryIndex = null;
        renderHistory();
        renderLatestInjection();
    }

    function handleHistoryClick(event) {
        const editButton = event.target.closest("." + historyClasses.editButton);
        const deleteButton = event.target.closest("." + historyClasses.deleteButton);
        const historyEntry = event.target.closest("." + historyClasses.entry);

        if (editButton) {
            populateForEdit(Number(editButton.getAttribute("data-index")));
            return;
        }

        if (deleteButton) {
            deleteEntry(Number(deleteButton.getAttribute("data-index")));
            return;
        }

        if (historyEntry) {
            setSelectedHistoryEntry(Number(historyEntry.getAttribute("data-index")));
        }
    }

    function handleHistoryKeydown(event) {
        const historyEntry = event.target.closest("." + historyClasses.entry);
        if (!historyEntry) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedHistoryEntry(Number(historyEntry.getAttribute("data-index")));
        }
    }

    function initialize() {
        if (initialized || !validateConfiguration()) {
            return false;
        }

        history = options.loadHistory();
        if (!Array.isArray(history)) {
            history = [];
        }

        if (elements.openButton) {
            elements.openButton.addEventListener("click", open);
        }

        if (elements.closeButton) {
            elements.closeButton.addEventListener("click", close);
        }

        if (elements.logButton) {
            elements.logButton.addEventListener("click", openEntryModal);
        }

        if (elements.historyButton && elements.historySection) {
            elements.historyButton.addEventListener("click", function () {
                const isHidden = elements.historySection.style.display === "none";
                elements.historySection.style.display = isHidden ? "block" : "none";
                elements.historyButton.textContent = isHidden
                    ? (options.hideHistoryButtonLabel || "Hide History")
                    : (options.historyButtonLabel || "History");

                if (isHidden) {
                    renderHistory();
                }
            });
        }

        if (elements.saveButton) {
            elements.saveButton.addEventListener("click", saveEntry);
        }

        if (elements.cancelButton) {
            elements.cancelButton.addEventListener("click", function () {
                closeEntryModal();
            });
        }

        if (elements.historyDisplay) {
            elements.historyDisplay.addEventListener("click", handleHistoryClick);
            elements.historyDisplay.addEventListener("keydown", handleHistoryKeydown);
        }

        if (elements.centerModal && typeof lifecycle.onCenterTouchMove === "function") {
            elements.centerModal.addEventListener("touchmove", lifecycle.onCenterTouchMove, {
                passive: false
            });
        }

        initialized = true;
        render();
        return true;
    }

    return {
        initialize: initialize,
        open: open,
        close: close,
        render: render,
        getMedicationName: function () {
            return medicationName;
        },
        getRoute: function () {
            return route;
        }
    };
}
