const injectionProvidersByMedicationId = new Map();
const GENERIC_INJECTION_HISTORY_KEY = "injectableInjectionHistory";
let activeInjectionProviderId = "";

function getSharedInjectionElements() {
    return {
        openButton: null,
        closeButton: document.getElementById("closeZepboundModalBtn"),
        centerModal: document.getElementById("zepboundModal"),
        centerContent: document.getElementById("zepboundModalContent"),
        logButton: document.getElementById("logInjectionButton"),
        historyButton: document.getElementById("historyInjectionButton"),
        historySection: document.getElementById("historyInjectionSection"),
        historyDisplay: document.getElementById("historyInjectionDisplay"),
        entryModal: document.getElementById("injectionModal"),
        saveButton: document.getElementById("saveInjectionBtn"),
        cancelButton: document.getElementById("cancelInjectionBtn"),
        injectionLogDisplay: document.getElementById("injectionLogDisplay"),
        dateInput: document.getElementById("injectionDate"),
        timeInput: document.getElementById("injectionTime"),
        doseSelect: document.getElementById("doseSelect"),
        siteSelect: document.getElementById("siteSelect"),
        notesInput: document.getElementById("injectionNotes")
    };
}

function loadGenericInjectionHistory(medicationId) {
    const rawHistory = localStorage.getItem(GENERIC_INJECTION_HISTORY_KEY);
    if (!rawHistory) {
        return [];
    }

    try {
        const parsedHistory = JSON.parse(rawHistory);
        return Array.isArray(parsedHistory)
            ? parsedHistory.filter(function (entry) {
                return entry && entry.medicationId === medicationId;
            })
            : [];
    } catch (error) {
        return [];
    }
}

function loadAllGenericInjectionHistory() {
    const rawHistory = localStorage.getItem(GENERIC_INJECTION_HISTORY_KEY);
    if (!rawHistory) {
        return [];
    }

    try {
        const parsedHistory = JSON.parse(rawHistory);
        return Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (error) {
        return [];
    }
}

function saveGenericInjectionHistory(medicationId, history) {
    const existingHistory = loadAllGenericInjectionHistory().filter(function (entry) {
        return !entry || entry.medicationId !== medicationId;
    });
    const medicationHistory = Array.isArray(history)
        ? history.map(function (entry) {
            return Object.assign({}, entry, { medicationId: medicationId });
        })
        : [];

    saveData(GENERIC_INJECTION_HISTORY_KEY, existingHistory.concat(medicationHistory));
}

function createGenericInjectionEntry(entry, medicationId) {
    return Object.assign(createInjectionEntry(entry), { medicationId: medicationId });
}

function updateGenericInjectionEntry(history, index, entry, medicationId) {
    if (!Array.isArray(history) || index < 0 || index >= history.length) {
        return history;
    }

    history[index] = createGenericInjectionEntry(entry, medicationId);
    return history;
}

function setActiveInjectionProvider(providerId) {
    activeInjectionProviderId = providerId || "";
}

function setInjectionModalMedicationName(medicationName) {
    const modal = document.getElementById("zepboundModal");
    if (!modal) {
        return;
    }

    const heading = modal.querySelector(".zepbound-modal-header h2");
    const description = modal.querySelector(".zepbound-modal-body > p");
    if (heading) {
        heading.textContent = "💉 " + medicationName + " Center";
    }
    if (description) {
        description.textContent = "Record each " + medicationName + " injection.";
    }
}

function createGenericInjectionProvider(definition) {
    if (!definition || !definition.id || definition.route !== "injection" ||
        definition.legacyHistoryKey || typeof createInjectionController !== "function") {
        return null;
    }

    const medicationId = definition.id;
    const provider = {
        medicationDefinitionId: medicationId,
        medicationName: definition.name,
        route: "injection",
        legacyHistoryKey: "",
        deferInitialRender: true,
        isAvailable: function () {
            return definition.active !== false;
        },
        open: function () {
            setActiveInjectionProvider(medicationId);
            setInjectionModalMedicationName(definition.name);
            controller.open();
        },
        loadHistory: function () {
            return loadGenericInjectionHistory(medicationId);
        },
        saveHistory: function (history) {
            saveGenericInjectionHistory(medicationId, history);
        },
        confirmDelete: confirmHistoryDelete,
        defaultDose: "",
        defaultSite: "",
        historyButtonLabel: "📊 History",
        hideHistoryButtonLabel: "Hide History",
        elements: getSharedInjectionElements(),
        helpers: {
            createInjectionEntry: function (entry) {
                return createGenericInjectionEntry(entry, medicationId);
            },
            updateInjectionEntry: function (history, index, entry) {
                return updateGenericInjectionEntry(history, index, entry, medicationId);
            },
            deleteInjectionEntry: deleteInjectionEntry
        },
        historyClasses: {
            entry: "zepbound-history-entry",
            content: "zepbound-history-content",
            actions: "zepbound-history-actions",
            editButton: "history-edit-btn",
            deleteButton: "history-delete-btn"
        },
        isActive: function () {
            return activeInjectionProviderId === medicationId;
        },
        lifecycle: {
            onOpen: function () {
                setActiveInjectionProvider(medicationId);
                setInjectionModalMedicationName(definition.name);
            },
            onClose: function () {
                setActiveInjectionProvider("");
            }
        }
    };
    const controller = createInjectionController(provider);
    if (!controller || !controller.initialize()) {
        return null;
    }

    provider.controller = controller;
    return provider;
}

function registerInjectionProvider(provider) {
    if (!provider || !provider.medicationDefinitionId) {
        return null;
    }

    injectionProvidersByMedicationId.set(provider.medicationDefinitionId, provider);
    return provider;
}

function getInjectionProvider(definition) {
    if (!definition || typeof definition !== "object" ||
        definition.route !== "injection" || !definition.id) {
        return null;
    }

    if (definition.active === false) {
        return null;
    }

    const provider = injectionProvidersByMedicationId.get(definition.id);
    if (provider) {
        if (provider.legacyHistoryKey) {
            return provider.legacyHistoryKey === definition.legacyHistoryKey
                ? provider
                : null;
        }

        return definition.legacyHistoryKey ? null : provider;
    }

    const genericProvider = createGenericInjectionProvider(definition);
    if (!genericProvider) {
        return null;
    }

    return registerInjectionProvider(genericProvider);
}

window.injectionProviderCompat = {
    registerInjectionProvider: registerInjectionProvider,
    getInjectionProvider: getInjectionProvider
};

function initZepboundCenter() {
    if (window.zepboundCenterInitialized) {
        return;
    }

    const injectionCompatibilityConfig = {
        legacyStorageKey: "zepboundInjectionHistory",
        medicationName: "Zepbound",
        route: "injection"
    };

    const zepboundMedicationCard = document.getElementById("zepboundMedicationCard");

    function hasConfiguredZepboundMedication() {
        const schedule = Array.isArray(personalMedicationSchedule)
            ? personalMedicationSchedule
            : [];
        const expectedName = injectionCompatibilityConfig.medicationName.toLowerCase();

        return schedule.some(function (group) {
            return Array.isArray(group && group.medications) &&
                group.medications.some(function (medicationName) {
                    return String(medicationName || "").trim().toLowerCase() === expectedName;
                });
        });
    }

    function hasLegacyZepboundHistory() {
        const rawHistory = localStorage.getItem(injectionCompatibilityConfig.legacyStorageKey);
        if (!rawHistory) {
            return false;
        }

        let parsedHistory;
        try {
            parsedHistory = JSON.parse(rawHistory);
        } catch (error) {
            return false;
        }

        return Array.isArray(parsedHistory) && parsedHistory.some(function (entry) {
            return entry && typeof entry === "object" && !Array.isArray(entry);
        });
    }

    if (window.medicationCenterCapabilities) {
        window.medicationCenterCapabilities.onMedicationConfigured = function (medicationName) {
            if (String(medicationName || "").trim().toLowerCase() ===
                injectionCompatibilityConfig.medicationName.toLowerCase()) {
                initZepboundCenter();
            }
        };
    }

    const hasConfiguredZepbound = hasConfiguredZepboundMedication();
    const hasLegacyHistory = hasLegacyZepboundHistory();

    if (!hasConfiguredZepbound && !hasLegacyHistory) {
        if (zepboundMedicationCard) {
            zepboundMedicationCard.style.display = "none";
        }

        return;
    }

    if (zepboundMedicationCard && !hasConfiguredZepbound) {
        zepboundMedicationCard.style.display = "";
    }

    if (typeof registerMedicationDefinition === "function") {
        registerMedicationDefinition({
            name: injectionCompatibilityConfig.medicationName,
            route: injectionCompatibilityConfig.route
        });
    }

    const medicationDefinitionCompat = window.medicationDefinitionCompat || {};
    const zepboundMedicationDefinition =
        typeof medicationDefinitionCompat.loadMedicationDefinitions === "function"
            ? medicationDefinitionCompat.loadMedicationDefinitions().find(function (definition) {
                return definition && definition.route === injectionCompatibilityConfig.route &&
                    definition.legacyHistoryKey === injectionCompatibilityConfig.legacyStorageKey;
            })
            : null;

    if (!zepboundMedicationDefinition) {
        return;
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
            medicationDefinitionId: zepboundMedicationDefinition.id,
            medicationName: injectionCompatibilityConfig.medicationName,
            route: injectionCompatibilityConfig.route,
            legacyHistoryKey: injectionCompatibilityConfig.legacyStorageKey,
            isAvailable: function () {
                return zepboundMedicationDefinition.active !== false;
            },
            isActive: function () {
                return activeInjectionProviderId === zepboundMedicationDefinition.id;
            },
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
                onOpen: function () {
                    setActiveInjectionProvider(zepboundMedicationDefinition.id);
                    setInjectionModalMedicationName(injectionMedicationName);
                    lockZepboundModalBackgroundScroll();
                },
                onClose: function () {
                    unlockZepboundModalBackgroundScroll();
                    setActiveInjectionProvider("");
                },
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

    registerInjectionProvider(Object.assign({}, providerConfiguration, {
        controller: injectionController,
        open: function () {
            injectionController.open();
        }
    }));

    window.zepboundCenterInitialized = true;
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

        if (!hasConfiguredZepbound && hasLegacyHistory) {
            window.medicationCenterCapabilities.getInjectionAccess = function () {
                return {
                    medicationName: injectionMedicationName,
                    open: function () {
                        injectionController.open();
                    }
                };
            };
        }
    }
    window.isZepboundModalOpen = function () {
        return !!(zepboundModal && zepboundModal.style.display === "flex");
    };
}
