// =====================================
// John's Assistant
// cpapSupplies.js
// =====================================

(function () {
    const CPAP_SUPPLIES_STORAGE_KEY = "cpapSupplies";

    const CPAP_ITEMS = [
        { key: "machine", displayId: "cpapMachineDisplay", inputId: "cpapMachineDateInput", label: "Received" },
        { key: "maskFrame", displayId: "cpapMaskFrameDisplay", inputId: "cpapMaskFrameDateInput", label: "Last Changed" },
        { key: "maskCushion", displayId: "cpapMaskCushionDisplay", inputId: "cpapMaskCushionDateInput", label: "Last Changed" },
        { key: "hoseTubing", displayId: "cpapHoseTubingDisplay", inputId: "cpapHoseTubingDateInput", label: "Last Changed" },
        { key: "disposableFilter", displayId: "cpapDisposableFilterDisplay", inputId: "cpapDisposableFilterDateInput", label: "Last Changed" },
        { key: "waterTank", displayId: "cpapWaterTankDisplay", inputId: "cpapWaterTankDateInput", label: "Last Changed" }
    ];

    const cpapSuppliesModal = document.getElementById("cpapSuppliesModal");
    const editCpapSuppliesButton = document.getElementById("editCpapSuppliesButton");
    const saveCpapSuppliesBtn = document.getElementById("saveCpapSuppliesBtn");
    const cancelCpapSuppliesBtn = document.getElementById("cancelCpapSuppliesBtn");

    let lockedScrollTop = 0;

    function getDefaultCpapSupplies() {
        const defaults = {};
        CPAP_ITEMS.forEach(function (item) {
            defaults[item.key] = { lastDate: "" };
        });
        return defaults;
    }

    function normalizeCpapSupplies(rawData) {
        const source = rawData && typeof rawData === "object" ? rawData : {};
        const normalized = {};

        CPAP_ITEMS.forEach(function (item) {
            const rawItem = source[item.key];
            const rawDate = rawItem && typeof rawItem === "object" ? rawItem.lastDate : "";
            const validDate = /^\d{4}-\d{2}-\d{2}$/.test(String(rawDate || "")) ? String(rawDate) : "";
            normalized[item.key] = { lastDate: validDate };
        });

        return normalized;
    }

    function loadCpapSupplies() {
        return normalizeCpapSupplies(loadData(CPAP_SUPPLIES_STORAGE_KEY, getDefaultCpapSupplies()));
    }

    function saveCpapSupplies(data) {
        saveData(CPAP_SUPPLIES_STORAGE_KEY, data);
    }

    function formatCpapDate(dateValue) {
        if (!dateValue) {
            return "Not recorded";
        }

        const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
        if (!parts) {
            return "Not recorded";
        }

        const parsed = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
        if (Number.isNaN(parsed.getTime())) {
            return "Not recorded";
        }

        return parsed.toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function renderCpapSuppliesCard() {
        const data = loadCpapSupplies();

        CPAP_ITEMS.forEach(function (item) {
            const displayEl = document.getElementById(item.displayId);
            if (!displayEl) {
                return;
            }

            const lastDate = data[item.key] ? data[item.key].lastDate : "";
            const formatted = formatCpapDate(lastDate);
            displayEl.textContent = lastDate ? item.label + ": " + formatted : "Not recorded";
        });
    }

    function lockCpapModalBackgroundScroll() {
        lockedScrollTop = window.scrollY || window.pageYOffset || 0;
        document.documentElement.classList.add("cpap-modal-open");
        document.body.classList.add("cpap-modal-open");
        document.body.style.top = "-" + lockedScrollTop + "px";
    }

    function unlockCpapModalBackgroundScroll() {
        document.documentElement.classList.remove("cpap-modal-open");
        document.body.classList.remove("cpap-modal-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollTop);
    }

    function openCpapSuppliesModal() {
        if (!cpapSuppliesModal) {
            return;
        }

        const data = loadCpapSupplies();
        CPAP_ITEMS.forEach(function (item) {
            const inputEl = document.getElementById(item.inputId);
            if (inputEl) {
                inputEl.value = data[item.key] ? data[item.key].lastDate : "";
            }
        });

        cpapSuppliesModal.style.display = "flex";
        lockCpapModalBackgroundScroll();
    }

    function closeCpapSuppliesModal() {
        if (!cpapSuppliesModal) {
            return;
        }

        cpapSuppliesModal.style.display = "none";
        unlockCpapModalBackgroundScroll();
    }

    function saveCpapSuppliesFromForm() {
        const data = loadCpapSupplies();

        CPAP_ITEMS.forEach(function (item) {
            const inputEl = document.getElementById(item.inputId);
            const value = inputEl ? inputEl.value.trim() : "";
            data[item.key] = { lastDate: value };
        });

        saveCpapSupplies(data);
        renderCpapSuppliesCard();
        closeCpapSuppliesModal();
    }

    function initCpapSupplies() {
        renderCpapSuppliesCard();

        if (editCpapSuppliesButton) {
            editCpapSuppliesButton.addEventListener("click", openCpapSuppliesModal);
        }

        if (saveCpapSuppliesBtn) {
            saveCpapSuppliesBtn.addEventListener("click", saveCpapSuppliesFromForm);
        }

        if (cancelCpapSuppliesBtn) {
            cancelCpapSuppliesBtn.addEventListener("click", closeCpapSuppliesModal);
        }

        if (cpapSuppliesModal) {
            cpapSuppliesModal.addEventListener("click", function (event) {
                if (event.target === cpapSuppliesModal) {
                    closeCpapSuppliesModal();
                }
            });
        }
    }

    window.initCpapSupplies = initCpapSupplies;
})();
