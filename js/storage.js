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
