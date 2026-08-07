// =====================================
// John's Assistant
// nutritionCenter.js
// =====================================

(function () {
    const NUTRITION_LOG_URL = "https://docs.google.com/spreadsheets/d/1mYoz9EWW6P3mkAvfHJ89uHUASNJL-WzbMltccG4y3ws/edit?gid=1876887081#gid=1876887081";

    const nutritionCenterCardHeading = document.getElementById("nutritionCenterCardHeading");
    const nutritionCenterSection = document.getElementById("nutritionCenterSection");
    const closeNutritionCenterButton = document.getElementById("closeNutritionCenterButton");
    const nutritionSummaryPreview = document.getElementById("nutritionSummaryPreview");

    const nutritionCaloriesValue = document.getElementById("nutritionCaloriesValue");
    const nutritionProteinValue = document.getElementById("nutritionProteinValue");
    const nutritionCarbsValue = document.getElementById("nutritionCarbsValue");
    const nutritionFatValue = document.getElementById("nutritionFatValue");

    const nutritionLogMealButton = document.getElementById("nutritionLogMealButton");
    const nutritionHistoryButton = document.getElementById("nutritionHistoryButton");
    const nutritionHistorySection = document.getElementById("nutritionHistorySection");
    const nutritionHistoryDisplay = document.getElementById("nutritionHistoryDisplay");

    let nutritionToday = loadData("nutritionToday", {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    let nutritionHistory = loadData("nutritionHistory", []);

    function getNumber(value) {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    }

    function openNutritionLog() {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
            window.location.href = NUTRITION_LOG_URL;
            return;
        }

        window.open(NUTRITION_LOG_URL, "_blank", "noopener,noreferrer");
    }

    function renderTodaySummary() {
        nutritionToday = nutritionToday || {};

        const calories = getNumber(nutritionToday.calories);
        const protein = getNumber(nutritionToday.protein);
        const carbs = getNumber(nutritionToday.carbs);
        const fat = getNumber(nutritionToday.fat);

        if (nutritionCaloriesValue) {
            nutritionCaloriesValue.textContent = String(calories);
        }
        if (nutritionProteinValue) {
            nutritionProteinValue.textContent = protein + " g";
        }
        if (nutritionCarbsValue) {
            nutritionCarbsValue.textContent = carbs + " g";
        }
        if (nutritionFatValue) {
            nutritionFatValue.textContent = fat + " g";
        }

        if (nutritionSummaryPreview) {
            nutritionSummaryPreview.textContent =
                calories + " kcal · " + protein + "g P · " + carbs + "g C · " + fat + "g F";
        }
    }

    function renderHistoryFramework() {
        if (!nutritionHistoryDisplay) {
            return;
        }

        if (!Array.isArray(nutritionHistory) || nutritionHistory.length === 0) {
            nutritionHistoryDisplay.innerHTML =
                "<p class=\"history-empty\">Nutrition history will be added in a future version.</p>";
            return;
        }

        nutritionHistoryDisplay.innerHTML = nutritionHistory
            .slice()
            .reverse()
            .map(function (entry) {
                const date = entry.date || "Unknown date";
                const calories = getNumber(entry.calories);
                const protein = getNumber(entry.protein);
                const carbs = getNumber(entry.carbs);
                const fat = getNumber(entry.fat);

                return "<div class=\"history-entry\">" +
                    "<div class=\"history-entry-header\"><strong>" + date + "</strong></div>" +
                    "<div class=\"history-entry-meta\">" +
                        calories + " kcal · " + protein + "g P · " + carbs + "g C · " + fat + "g F" +
                    "</div>" +
                "</div>";
            })
            .join("");
    }

    function showNutritionCenter() {
        if (!nutritionCenterSection) {
            return;
        }

        nutritionCenterSection.style.display = "block";

        if (nutritionCenterCardHeading) {
            nutritionCenterCardHeading.textContent = "🍽️ Nutrition Center ▲";
        }

        if (typeof window.scrollMedicationCenterTo === "function") {
            window.scrollMedicationCenterTo(nutritionCenterSection);
            return;
        }

        nutritionCenterSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function hideNutritionCenter() {
        if (!nutritionCenterSection) {
            return;
        }

        nutritionCenterSection.style.display = "none";

        if (nutritionCenterCardHeading) {
            nutritionCenterCardHeading.textContent = "🍽️ Nutrition Center ▼";
        }

        if (nutritionHistorySection) {
            nutritionHistorySection.style.display = "none";
        }
        if (nutritionHistoryButton) {
            nutritionHistoryButton.textContent = "📊 History";
        }
    }

    function initNutritionCenter() {
        if (!nutritionCenterSection) {
            return;
        }

        renderTodaySummary();
        renderHistoryFramework();

        nutritionCenterSection.style.display = "none";

        if (nutritionCenterCardHeading) {
            nutritionCenterCardHeading.addEventListener("click", showNutritionCenter);
        }

        if (closeNutritionCenterButton) {
            closeNutritionCenterButton.addEventListener("click", hideNutritionCenter);
        }

        if (nutritionLogMealButton) {
            nutritionLogMealButton.addEventListener("click", openNutritionLog);
        }

        if (nutritionHistoryButton) {
            nutritionHistoryButton.textContent = "📊 History";
            nutritionHistoryButton.addEventListener("click", function () {
                if (!nutritionHistorySection) {
                    return;
                }

                if (nutritionHistorySection.style.display === "block") {
                    nutritionHistorySection.style.display = "none";
                    nutritionHistoryButton.textContent = "📊 History";
                    return;
                }

                renderHistoryFramework();
                nutritionHistorySection.style.display = "block";
                nutritionHistoryButton.textContent = "📊 Hide History";
            });
        }
    }

    window.initNutritionCenter = initNutritionCenter;
})();
