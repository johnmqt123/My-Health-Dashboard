(function () {
    const section = document.getElementById("nutritionStatisticsSection");
    const openButton = document.getElementById("nutritionStatisticsButton");
    const closeButton = document.getElementById("nutritionStatisticsCloseButton");
    const rangeSelect = document.getElementById("nutritionStatisticsRangeSelect");
    const customDates = document.getElementById("nutritionStatisticsCustomDates");
    const startDateInput = document.getElementById("nutritionStatisticsStartDate");
    const endDateInput = document.getElementById("nutritionStatisticsEndDate");
    const applyCustomButton = document.getElementById("nutritionStatisticsApplyCustomButton");
    const rangeLabel = document.getElementById("nutritionStatisticsRangeLabel");
    const emptyState = document.getElementById("nutritionStatisticsEmptyState");
    const report = document.getElementById("nutritionStatisticsReport");
    const nutritionMetrics = document.getElementById("nutritionStatisticsNutritionMetrics");
    const weightMetrics = document.getElementById("nutritionStatisticsWeightMetrics");
    const chartMetric = document.getElementById("nutritionStatisticsChartMetric");
    const chart = document.getElementById("nutritionStatisticsChart");

    let selectedRange = null;

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function dayKey(date) {
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
    }

    function parseDayKey(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
            return null;
        }
        const parts = value.split("-").map(Number);
        const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function addDays(date, amount) {
        const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        result.setDate(result.getDate() + amount);
        return result;
    }

    function formatDate(value) {
        const date = typeof value === "string" ? parseDayKey(value) : value;
        return date ? date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Unknown date";
    }

    function formatNumber(value, digits) {
        return Number(value).toLocaleString([], { maximumFractionDigits: digits });
    }

    function parseWeightDate(entry) {
        const dateText = entry && entry.date ? String(entry.date).trim() : "";
        const timeText = entry && entry.time ? String(entry.time).trim() : "";
        let date = null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
            date = parseDayKey(dateText);
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateText)) {
            const parts = dateText.split("/").map(Number);
            date = new Date(parts[2], parts[0] - 1, parts[1]);
        } else if (dateText) {
            const fallback = new Date(dateText + (timeText ? " " + timeText : ""));
            date = Number.isNaN(fallback.getTime()) ? null : fallback;
        }
        if (!date || Number.isNaN(date.getTime())) {
            return null;
        }
        const timeMatch = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(timeText);
        if (timeMatch) {
            let hours = Number(timeMatch[1]);
            const minutes = Number(timeMatch[2]);
            const meridian = timeMatch[3] ? timeMatch[3].toUpperCase() : "";
            if (meridian === "PM" && hours < 12) hours += 12;
            if (meridian === "AM" && hours === 12) hours = 0;
            date.setHours(hours, minutes, 0, 0);
        }
        return date;
    }

    function getRange() {
        const today = new Date();
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (rangeSelect.value === "custom") {
            return selectedRange;
        }
        const rangeValue = rangeSelect.value;
        let start;
        if (rangeValue === "180") {
            start = new Date(end.getFullYear(), end.getMonth() - 6, end.getDate());
        } else if (rangeValue === "365") {
            start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
        } else {
            const days = Number(rangeValue);
            start = addDays(end, -(days - 1));
        }
        return {
            start: start,
            end: end,
            label: rangeSelect.options[rangeSelect.selectedIndex].textContent
        };
    }

    function isInRange(key, range) {
        return key >= dayKey(range.start) && key <= dayKey(range.end);
    }

    function getData() {
        const nutrition = window.nutritionStatisticsData && typeof window.nutritionStatisticsData.getHistoryEntries === "function"
            ? window.nutritionStatisticsData.getHistoryEntries()
            : [];
        const weights = window.weightCenterMetrics && typeof window.weightCenterMetrics.getHistoryEntries === "function"
            ? window.weightCenterMetrics.getHistoryEntries()
            : [];
        return { nutrition: nutrition, weights: weights };
    }

    function aggregate(range) {
        const data = getData();
        const nutritionEntries = data.nutrition.filter(function (entry) {
            return entry.dayKey && isInRange(entry.dayKey, range);
        });
        const nutritionDays = new Set(nutritionEntries.map(function (entry) { return entry.dayKey; }));
        const totals = { calories: 0, protein: 0, carbs: 0 };
        nutritionEntries.forEach(function (entry) {
            totals.calories += Number(entry.calories) || 0;
            totals.protein += Number(entry.protein) || 0;
            totals.carbs += Number(entry.carbs) || 0;
        });

        const weights = data.weights.map(function (entry, index) {
            const date = parseWeightDate(entry);
            const value = Number(entry.weight);
            return { entry: entry, date: date, value: value, index: index };
        }).filter(function (item) {
            return item.date && Number.isFinite(item.value) && isInRange(dayKey(item.date), range);
        }).sort(function (left, right) {
            return left.date - right.date || left.index - right.index;
        });

        return {
            nutritionEntries: nutritionEntries,
            nutritionDays: nutritionDays,
            totals: totals,
            weights: weights,
            calendarDays: Math.round((range.end - range.start) / 86400000) + 1
        };
    }

    function metricRow(label, value) {
        const row = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label;
        row.appendChild(strong);
        row.appendChild(document.createTextNode(" " + value));
        return row;
    }

    function renderMetrics(range, result) {
        nutritionMetrics.replaceChildren();
        nutritionMetrics.appendChild(metricRow("Total calories:", formatNumber(result.totals.calories, 0) + " Kcal"));
        nutritionMetrics.appendChild(metricRow("Average calories:", formatNumber(result.totals.calories / result.calendarDays, 1) + " Kcal/day"));
        nutritionMetrics.appendChild(metricRow("Total protein:", formatNumber(result.totals.protein, 1) + " g"));
        nutritionMetrics.appendChild(metricRow("Average protein:", formatNumber(result.totals.protein / result.calendarDays, 1) + " g/day"));
        nutritionMetrics.appendChild(metricRow("Total carbohydrates:", formatNumber(result.totals.carbs, 1) + " g"));
        nutritionMetrics.appendChild(metricRow("Average carbohydrates:", formatNumber(result.totals.carbs / result.calendarDays, 1) + " g/day"));
        nutritionMetrics.appendChild(metricRow("Nutrition days logged:", result.nutritionDays.size + " of " + result.calendarDays));

        weightMetrics.replaceChildren();
        if (!result.weights.length) {
            weightMetrics.appendChild(metricRow("Weight:", "Unavailable for this range"));
        } else {
            const beginning = result.weights[0].value;
            const ending = result.weights[result.weights.length - 1].value;
            weightMetrics.appendChild(metricRow("Beginning:", formatNumber(beginning, 1) + " lb"));
            weightMetrics.appendChild(metricRow("Ending/latest:", formatNumber(ending, 1) + " lb"));
            weightMetrics.appendChild(metricRow("Change:", formatNumber(ending - beginning, 1) + " lb"));
        }
    }

    function renderChart(range, result) {
        const metric = chartMetric.value;
        const values = [];
        const labels = [];
        for (let cursor = new Date(range.start); cursor <= range.end; cursor = addDays(cursor, 1)) {
            const key = dayKey(cursor);
            let value = null;
            if (metric === "weight") {
                const daily = result.weights.filter(function (item) { return dayKey(item.date) === key; });
                value = daily.length ? daily[daily.length - 1].value : null;
            } else {
                const daily = result.nutritionEntries.filter(function (entry) { return entry.dayKey === key; });
                if (daily.length) {
                    value = daily.reduce(function (sum, entry) { return sum + (Number(entry[metric]) || 0); }, 0);
                }
            }
            values.push(value);
            labels.push(key);
        }
        const valid = values.filter(function (value) { return value !== null; });
        if (!valid.length) {
            chart.textContent = "No recorded data for this metric in the selected range.";
            return;
        }
        const width = 720;
        const height = 240;
        const padX = 42;
        const padY = 24;
        const min = Math.min.apply(null, valid);
        const max = Math.max.apply(null, valid);
        const span = max === min ? 1 : max - min;
        const segments = [];
        let currentSegment = [];
        values.forEach(function (value, index) {
            if (value === null) {
                if (currentSegment.length) segments.push(currentSegment);
                currentSegment = [];
                return;
            }
            const x = padX + (index / Math.max(1, values.length - 1)) * (width - padX * 2);
            const y = height - padY - ((value - min) / span) * (height - padY * 2);
            currentSegment.push(x.toFixed(1) + "," + y.toFixed(1));
        });
        if (currentSegment.length) segments.push(currentSegment);
        const lines = segments.map(function (segment) {
            return '<polyline class="nutrition-statistics-line" points="' + segment.join(" ") + '"></polyline>';
        }).join("");
        const labelStart = formatDate(labels[0]);
        const labelEnd = formatDate(labels[labels.length - 1]);
        chart.innerHTML = '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="' + metric + ' trend from ' + labelStart + ' to ' + labelEnd + '">' +
            '<line class="nutrition-statistics-axis" x1="42" y1="216" x2="678" y2="216"></line>' +
            lines +
            '<text class="nutrition-statistics-chart-label" x="42" y="235">' + labelStart + '</text>' +
            '<text class="nutrition-statistics-chart-label" x="678" y="235" text-anchor="end">' + labelEnd + '</text>' +
            '</svg>';
    }

    function render() {
        const range = getRange();
        if (!range) return;
        const result = aggregate(range);
        rangeLabel.textContent = range.label + " · " + formatDate(range.start) + " – " + formatDate(range.end);
        const hasData = result.nutritionEntries.length || result.weights.length;
        emptyState.hidden = !!hasData;
        report.hidden = !hasData;
        if (!hasData) {
            emptyState.textContent = "No nutrition or weight data is recorded for this range.";
            return;
        }
        renderMetrics(range, result);
        renderChart(range, result);
    }

    function setCustomVisibility() {
        customDates.hidden = rangeSelect.value !== "custom";
    }

    function openStatistics() {
        section.hidden = false;
        setCustomVisibility();
        render();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeStatistics() {
        section.hidden = true;
    }

    function applyCustomRange() {
        const start = parseDayKey(startDateInput.value);
        const end = parseDayKey(endDateInput.value);
        if (!start || !end || start > end) {
            rangeLabel.textContent = "Choose a valid start and end date.";
            return;
        }
        selectedRange = { start: start, end: end, label: "Custom" };
        render();
    }

    window.initNutritionStatistics = function () {
        if (!section || !openButton) return;
        openButton.addEventListener("click", openStatistics);
        closeButton.addEventListener("click", closeStatistics);
        rangeSelect.addEventListener("change", function () {
            setCustomVisibility();
            if (rangeSelect.value !== "custom") render();
        });
        applyCustomButton.addEventListener("click", applyCustomRange);
        chartMetric.addEventListener("change", render);
    };
})();
