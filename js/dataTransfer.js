/*
 * dataTransfer.js
 * Backup and restore for the application's persisted data.
 */

(function () {
    const BACKUP_FORMAT = "johns-assistant-backup";
    const BACKUP_FORMAT_VERSION = 1;
    const APPLICATION_NAME = "John's Assistant";
    const STORAGE_KEYS = [
        "medicationLog",
        "medicationHistory",
        "personalMedicationSchedule",
        "asNeededAvailableMedications",
        "asNeededMedicationHistory",
        "medicationDefinitions",
        "injectableMedicationRegimens",
        "injectableInjectionHistory",
        "zepboundInjectionHistory",
        "weightLog",
        "weightHistory",
        "bpLog",
        "bpHistory",
        "exerciseLog",
        "exerciseHistory",
        "dailyDiaryEntries",
        "nutritionToday",
        "nutritionHistory",
        "nutritionGoalsReference",
        "personalProfile",
        "todayTasks",
        "taskListDate"
    ];

    const EXPECTED_TYPES = {
        medicationLog: "object",
        medicationHistory: "array",
        personalMedicationSchedule: "array",
        asNeededAvailableMedications: "array",
        asNeededMedicationHistory: "array",
        medicationDefinitions: "array",
        injectableMedicationRegimens: "array",
        injectableInjectionHistory: "array",
        zepboundInjectionHistory: "array",
        weightLog: "object",
        weightHistory: "array",
        bpLog: "object",
        bpHistory: "array",
        exerciseLog: "array",
        exerciseHistory: "array",
        dailyDiaryEntries: "array",
        nutritionToday: "object",
        nutritionHistory: "array",
        nutritionGoalsReference: "object",
        personalProfile: "object",
        todayTasks: "array",
        taskListDate: "string"
    };

    function getEmptyValue(key) {
        return EXPECTED_TYPES[key] === "array"
            ? []
            : EXPECTED_TYPES[key] === "string"
                ? ""
                : {};
    }

    function getRawStorageData() {
        const data = {};

        STORAGE_KEYS.forEach(function (key) {
            const rawValue = localStorage.getItem(key);
            if (rawValue === null) {
                data[key] = getEmptyValue(key);
                return;
            }

            data[key] = key === "taskListDate" ? rawValue : JSON.parse(rawValue);
        });

        return data;
    }

    function createBackup() {
        return {
            backupFormat: BACKUP_FORMAT,
            backupFormatVersion: BACKUP_FORMAT_VERSION,
            application: APPLICATION_NAME,
            createdAt: new Date().toISOString(),
            data: getRawStorageData()
        };
    }

    function getValueType(value) {
        if (Array.isArray(value)) {
            return "array";
        }

        if (value !== null && typeof value === "object") {
            return "object";
        }

        return typeof value;
    }

    function validateBackup(backup) {
        if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
            return { valid: false, error: "The backup root must be a JSON object." };
        }

        if (backup.backupFormat !== BACKUP_FORMAT) {
            return { valid: false, error: "This file is not a John's Assistant backup." };
        }

        if (backup.backupFormatVersion !== BACKUP_FORMAT_VERSION) {
            return { valid: false, error: "This backup version is not supported." };
        }

        if (backup.application !== APPLICATION_NAME) {
            return { valid: false, error: "This backup belongs to an unsupported application." };
        }

        if (typeof backup.createdAt !== "string" || !backup.createdAt ||
            Number.isNaN(Date.parse(backup.createdAt))) {
            return { valid: false, error: "The backup creation timestamp is invalid." };
        }

        if (!backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) {
            return { valid: false, error: "The backup data section is missing or invalid." };
        }

        for (let index = 0; index < STORAGE_KEYS.length; index += 1) {
            const key = STORAGE_KEYS[index];
            if (!Object.prototype.hasOwnProperty.call(backup.data, key)) {
                return { valid: false, error: "The backup is missing the " + key + " data section." };
            }

            if (getValueType(backup.data[key]) !== EXPECTED_TYPES[key]) {
                return { valid: false, error: "The " + key + " data section has the wrong type." };
            }
        }

        return { valid: true, backup: backup };
    }

    async function downloadBackup() {
        let backup;
        try {
            backup = createBackup();
        } catch (error) {
            window.alert("Backup could not be created because saved data could not be read.");
            return;
        }

        const json = JSON.stringify(backup, null, 2);
        const date = new Date().toISOString().slice(0, 10);
        const filename = "johns-assistant-backup-" + date + ".json";

        let file;
        try {
            file = new File([json], filename, { type: "application/json" });
        } catch (error) {
            file = null;
        }

        if (file && navigator.share && navigator.canShare) {
            let canShareFile = false;
            try {
                canShareFile = navigator.canShare({ files: [file] });
            } catch (error) {
                canShareFile = false;
            }

            if (canShareFile) {
                try {
                    await navigator.share({
                        files: [file],
                        title: filename
                    });
                    window.alert("Backup shared successfully.");
                    return;
                } catch (error) {
                    if (error && error.name === "AbortError") {
                        return;
                    }
                }
            }
        }

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);
        window.alert("Backup downloaded successfully.");
    }

    function captureRawStorage() {
        const rawValues = {};
        STORAGE_KEYS.forEach(function (key) {
            rawValues[key] = localStorage.getItem(key);
        });
        return rawValues;
    }

    function restoreRawStorage(rawValues) {
        STORAGE_KEYS.forEach(function (key) {
            if (rawValues[key] === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, rawValues[key]);
            }
        });
    }

    function replaceStorage(backupData) {
        const previousValues = captureRawStorage();

        try {
            STORAGE_KEYS.forEach(function (key) {
                localStorage.setItem(key, JSON.stringify(backupData[key]));
            });
        } catch (error) {
            try {
                restoreRawStorage(previousValues);
            } catch (rollbackError) {
                window.alert("Restore failed, and the previous data could not be fully restored.");
                return false;
            }

            window.alert("Restore failed. Existing data was restored where possible.");
            return false;
        }

        return true;
    }

    function restoreBackupText(text) {
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (error) {
            return { valid: false, error: "The selected file is not valid JSON." };
        }

        const validation = validateBackup(parsed);
        if (!validation.valid) {
            return validation;
        }

        if (!window.confirm("Restore this backup?\n\nThis will replace all saved John's Assistant data.")) {
            return { canceled: true };
        }

        if (!replaceStorage(validation.backup.data)) {
            return { valid: false, error: "Restore failed." };
        }

        window.alert("Backup restored successfully. The application will reload.");
        window.location.reload();
        return { valid: true };
    }

    function handleRestoreFile(event) {
        const file = event.target.files && event.target.files[0];
        event.target.value = "";
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", function () {
            const result = restoreBackupText(String(reader.result || ""));
            if (result.valid || result.canceled) {
                return;
            }

            window.alert("Backup rejected. Existing data was not changed.\n\n" + result.error);
        });
        reader.addEventListener("error", function () {
            window.alert("Backup rejected. The selected file could not be read. Existing data was not changed.");
        });
        reader.readAsText(file);
    }

    const backupButton = document.getElementById("backupDataButton");
    const restoreButton = document.getElementById("restoreDataButton");
    const restoreFileInput = document.getElementById("restoreDataFileInput");

    if (backupButton) {
        backupButton.addEventListener("click", downloadBackup);
    }

    if (restoreButton && restoreFileInput) {
        restoreButton.addEventListener("click", function () {
            restoreFileInput.click();
        });
        restoreFileInput.addEventListener("change", handleRestoreFile);
    }

    window.backupRestore = {
        storageKeys: STORAGE_KEYS.slice(),
        createBackup: createBackup,
        validateBackup: validateBackup,
        restoreBackupText: restoreBackupText
    };
}());
