/**************************************************************************
 * storage.js
 * Shared localStorage helper functions
 **************************************************************************/

function loadData(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadInjectionHistory(storageKey, defaultValue) {
    const data = loadData(storageKey, defaultValue);
    return Array.isArray(data) ? data : defaultValue;
}

function saveInjectionHistory(storageKey, historyArray) {
    saveData(storageKey, historyArray);
    return historyArray;
}

function createInjectionEntry(entry) {
    const source = entry || {};
    return {
        date: source.date || "",
        time: source.time || "",
        dose: source.dose || "",
        site: source.site || "",
        notes: source.notes || ""
    };
}

function updateInjectionEntry(historyArray, index, entry) {
    if (!Array.isArray(historyArray)) {
        return historyArray;
    }

    if (index < 0 || index >= historyArray.length) {
        return historyArray;
    }

    historyArray[index] = createInjectionEntry(entry);
    return historyArray;
}

function deleteInjectionEntry(historyArray, index) {
    return removeHistoryEntry(historyArray, index);
}

function confirmHistoryDelete() {
    return window.confirm("Delete this history entry?");
}

function removeHistoryEntry(historyArray, index) {
    if (!Array.isArray(historyArray)) {
        return historyArray;
    }

    if (index < 0 || index >= historyArray.length) {
        return historyArray;
    }

    historyArray.splice(index, 1);
    return historyArray;
}
