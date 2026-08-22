function initZepboundCenter() {
    const injectionCompatibilityConfig = {
        legacyStorageKey: "zepboundInjectionHistory",
        medicationName: "Zepbound",
        route: "injection"
    };

    if (typeof registerMedicationDefinition === "function") {
        registerMedicationDefinition({
            name: injectionCompatibilityConfig.medicationName,
            route: injectionCompatibilityConfig.route
        });
    }

    const injectionMedicationDefinition = typeof getMedicationDefinition === "function"
        ? getMedicationDefinition(injectionCompatibilityConfig.medicationName)
        : { name: injectionCompatibilityConfig.medicationName };
    const injectionMedicationName = injectionMedicationDefinition.name ||
        injectionCompatibilityConfig.medicationName;

    function getInjectionCompatibilityConfig() {
        return injectionCompatibilityConfig;
    }

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
    const zepboundMedicationCard = document.getElementById("zepboundMedicationCard");

    if (zepboundMedicationCard) {
        const cardHeading = zepboundMedicationCard.querySelector("h2");
        const cardDescription = zepboundMedicationCard.querySelector("p");
        const cardButton = document.getElementById("openZepboundModalBtn");

        if (cardHeading) {
            cardHeading.textContent = "💉 " + injectionMedicationName;
        }

        if (cardDescription) {
            cardDescription.textContent = "Track injections, doses, rotation sites, and injection notes.";
        }

        if (cardButton) {
            cardButton.textContent = "Open " + injectionMedicationName;
        }
    }

    if (zepboundModal) {
        const modalHeading = zepboundModal.querySelector(".zepbound-modal-header h2");
        const modalDescription = zepboundModal.querySelector(".zepbound-modal-body > p");

        if (modalHeading) {
            modalHeading.textContent = "💉 " + injectionMedicationName + " Center";
        }

        if (modalDescription) {
            modalDescription.textContent = "Record each " + injectionMedicationName + " injection.";
        }
    }

    function loadZepboundLegacyHistory() {
        return loadInjectionHistory(getInjectionCompatibilityConfig().legacyStorageKey, []);
    }

    function saveZepboundLegacyHistory(historyArray) {
        return saveInjectionHistory(getInjectionCompatibilityConfig().legacyStorageKey, historyArray);
    }

    let zepboundLockedScrollTop = 0;

    function lockZepboundModalBackgroundScroll() {
        zepboundLockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("zepbound-modal-open");
        document.body.classList.add("zepbound-modal-open");
        document.body.style.top = "-" + zepboundLockedScrollTop + "px";
    }

    function unlockZepboundModalBackgroundScroll() {
        document.documentElement.classList.remove("zepbound-modal-open");
        document.body.classList.remove("zepbound-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, zepboundLockedScrollTop);
    }

    function createZepboundInjectionProvider() {
        return {
            medicationName: injectionCompatibilityConfig.medicationName,
            route: injectionCompatibilityConfig.route,
            loadHistory: loadZepboundLegacyHistory,
            saveHistory: saveZepboundLegacyHistory,
            confirmDelete: confirmHistoryDelete,
            defaultDose: "2.5 mg",
            defaultSite: "Left Abdomen",
            historyButtonLabel: "📊 History",
            hideHistoryButtonLabel: "Hide History",
            elements: {
                openButton: openZepboundModalBtn,
                closeButton: closeZepboundModalBtn,
                centerModal: zepboundModal,
                centerContent: zepboundModalContent,
                logButton: logInjectionButton,
                historyButton: historyInjectionButton,
                historySection: historyInjectionSection,
                historyDisplay: historyInjectionDisplay,
                entryModal: injectionModal,
                saveButton: saveInjectionBtn,
                cancelButton: cancelInjectionBtn,
                injectionLogDisplay: injectionLogDisplay,
                dateInput: injectionDateInput,
                timeInput: injectionTimeInput,
                doseSelect: doseSelect,
                siteSelect: siteSelect,
                notesInput: injectionNotesInput
            },
            helpers: {
                createInjectionEntry: createInjectionEntry,
                updateInjectionEntry: updateInjectionEntry,
                deleteInjectionEntry: deleteInjectionEntry
            },
            historyClasses: {
                entry: "zepbound-history-entry",
                content: "zepbound-history-content",
                actions: "zepbound-history-actions",
                editButton: "history-edit-btn",
                deleteButton: "history-delete-btn"
            },
            lifecycle: {
                onOpen: lockZepboundModalBackgroundScroll,
                onClose: unlockZepboundModalBackgroundScroll,
                onCenterTouchMove: function (event) {
                    if (!zepboundModalContent) {
                        return;
                    }

                    if (!zepboundModalContent.contains(event.target)) {
                        event.preventDefault();
                    }
                }
            }
        };
    }

    const providerConfiguration = createZepboundInjectionProvider();
    const injectionController = typeof createInjectionController === "function"
        ? createInjectionController(providerConfiguration)
        : null;

    if (!injectionController || !injectionController.initialize()) {
        return;
    }

    window.createZepboundInjectionProvider = createZepboundInjectionProvider;
    window.closeZepboundModal = function () {
        if (!zepboundModal || zepboundModal.style.display !== "flex") {
            return;
        }

        injectionController.close();
    };
    if (window.medicationCenterCapabilities) {
        window.medicationCenterCapabilities.openInjection = function () {
            injectionController.open();
        };
    }
    window.isZepboundModalOpen = function () {
        return !!(zepboundModal && zepboundModal.style.display === "flex");
    };
}
