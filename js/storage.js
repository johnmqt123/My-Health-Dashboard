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
