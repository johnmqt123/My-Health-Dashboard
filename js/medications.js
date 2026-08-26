const medicationSchedule = [];

const medicationCapabilityDefinitions = [];
const MEDICATION_DEFINITIONS_STORAGE_KEY = "medicationDefinitions";
const INJECTABLE_REGIMENS_STORAGE_KEY = "injectableMedicationRegimens";
const LEGACY_ZEPBOUND_HISTORY_KEY = "zepboundInjectionHistory";

function loadB45Collection(storageKey) {
	if (storageKey !== MEDICATION_DEFINITIONS_STORAGE_KEY &&
		storageKey !== INJECTABLE_REGIMENS_STORAGE_KEY) {
		return [];
	}

	const rawValue = localStorage.getItem(storageKey);
	if (!rawValue) {
		return [];
	}

	try {
		const parsedValue = JSON.parse(rawValue);
		return Array.isArray(parsedValue) ? parsedValue : [];
	} catch (error) {
		return [];
	}
}

function normalizeMedicationDefinition(definition) {
	if (!definition || typeof definition !== "object") {
		return null;
	}

	const id = String(definition.id || "").trim();
	const name = String(definition.name || "").replace(/\s+/g, " ").trim();
	const route = normalizeMedicationRoute(definition.route);

	if (!id || !name) {
		return null;
	}

	const normalized = {
		id: id,
		name: name,
		route: route,
		active: definition.active !== false
	};

	const legacyHistoryKey = String(definition.legacyHistoryKey || "").trim();
	if (legacyHistoryKey) {
		normalized.legacyHistoryKey = legacyHistoryKey;
	}

	return normalized;
}

function normalizeMedicationDefinitions(source) {
	if (!Array.isArray(source)) {
		return [];
	}

	const seenIds = new Set();
	const seenNames = new Set();

	return source.map(normalizeMedicationDefinition).filter(function (definition) {
		if (!definition) {
			return false;
		}

		const nameKey = normalizeMedicationNameForCapabilityLookup(definition.name);
		if (seenIds.has(definition.id) || seenNames.has(nameKey)) {
			return false;
		}

		seenIds.add(definition.id);
		seenNames.add(nameKey);
		return true;
	});
}

function generateMedicationDefinitionId() {
	const randomPart = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2, 10);

	return "medication-" + Date.now() + "-" + randomPart;
}

function loadMedicationDefinitions() {
	return normalizeMedicationDefinitions(loadB45Collection(MEDICATION_DEFINITIONS_STORAGE_KEY));
}

function saveMedicationDefinitions(definitions) {
	const normalized = normalizeMedicationDefinitions(definitions);
	saveData(MEDICATION_DEFINITIONS_STORAGE_KEY, normalized);
	return normalized;
}

function normalizeInjectableRegimen(regimen) {
	if (!regimen || typeof regimen !== "object") {
		return null;
	}

	const medicationId = String(regimen.medicationId || "").trim();
	const dayOfWeek = Number(regimen.dayOfWeek);
	if (!medicationId || regimen.frequency !== "weekly" || !Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
		return null;
	}

	return {
		medicationId: medicationId,
		frequency: "weekly",
		dayOfWeek: dayOfWeek
	};
}

function normalizeInjectableRegimens(source) {
	if (!Array.isArray(source)) {
		return [];
	}

	const seenMedicationIds = new Set();
	return source.map(normalizeInjectableRegimen).filter(function (regimen) {
		if (!regimen || seenMedicationIds.has(regimen.medicationId)) {
			return false;
		}

		seenMedicationIds.add(regimen.medicationId);
		return true;
	});
}

function loadInjectableMedicationRegimens() {
	return normalizeInjectableRegimens(loadB45Collection(INJECTABLE_REGIMENS_STORAGE_KEY));
}

function saveInjectableMedicationRegimens(regimens) {
	const normalized = normalizeInjectableRegimens(regimens);
	saveData(INJECTABLE_REGIMENS_STORAGE_KEY, normalized);
	return normalized;
}

function getMedicationDefinitionById(definitions, medicationId) {
	const id = String(medicationId || "").trim();
	return normalizeMedicationDefinitions(definitions).find(function (definition) {
		return definition.id === id;
	}) || null;
}

function getLegacyHistoryKeyForMedication(definition) {
	const normalized = normalizeMedicationDefinition(definition);
	return normalized && normalized.legacyHistoryKey
		? normalized.legacyHistoryKey
		: "";
}

function hasLegacyZepboundHistory() {
	const rawHistory = localStorage.getItem(LEGACY_ZEPBOUND_HISTORY_KEY);
	if (!rawHistory) {
		return false;
	}

	try {
		const history = JSON.parse(rawHistory);
		return Array.isArray(history) && history.some(function (entry) {
			return entry && typeof entry === "object" && !Array.isArray(entry);
		});
	} catch (error) {
		return false;
	}
}

function initializeMedicationDefinitionFoundation(schedule) {
	const definitionsRaw = loadB45Collection(MEDICATION_DEFINITIONS_STORAGE_KEY);
	const definitions = normalizeMedicationDefinitions(definitionsRaw);
	const scheduleItems = Array.isArray(schedule) ? schedule : [];
	const hasZepboundSchedule = scheduleItems.some(function (group) {
		return Array.isArray(group && group.medications) && group.medications.some(function (medicationName) {
			return normalizeMedicationNameForCapabilityLookup(medicationName) === "zepbound";
		});
	});
	const hasZepboundHistory = hasLegacyZepboundHistory();
	const zepboundDefinition = definitions.find(function (definition) {
		return normalizeMedicationNameForCapabilityLookup(definition.name) === "zepbound";
	});
	if (zepboundDefinition && zepboundDefinition.route === "injection" &&
		!zepboundDefinition.legacyHistoryKey) {
		zepboundDefinition.legacyHistoryKey = LEGACY_ZEPBOUND_HISTORY_KEY;
	}

	if (!zepboundDefinition && (hasZepboundSchedule || hasZepboundHistory)) {
		definitions.push({
			id: generateMedicationDefinitionId(),
			name: "Zepbound",
			route: "injection",
			active: true,
			legacyHistoryKey: LEGACY_ZEPBOUND_HISTORY_KEY
		});
	}

	const normalizedDefinitions = normalizeMedicationDefinitions(definitions);
	if (JSON.stringify(definitionsRaw) !== JSON.stringify(normalizedDefinitions) &&
		(normalizedDefinitions.length || definitionsRaw.length)) {
		saveData(MEDICATION_DEFINITIONS_STORAGE_KEY, normalizedDefinitions);
	}

	return normalizedDefinitions;
}

window.medicationDefinitionCompat = {
	definitionsStorageKey: MEDICATION_DEFINITIONS_STORAGE_KEY,
	regimensStorageKey: INJECTABLE_REGIMENS_STORAGE_KEY,
	legacyZepboundHistoryKey: LEGACY_ZEPBOUND_HISTORY_KEY,
	normalizeMedicationDefinition: normalizeMedicationDefinition,
	normalizeMedicationDefinitions: normalizeMedicationDefinitions,
	generateMedicationDefinitionId: generateMedicationDefinitionId,
	loadMedicationDefinitions: loadMedicationDefinitions,
	saveMedicationDefinitions: saveMedicationDefinitions,
	normalizeInjectableRegimen: normalizeInjectableRegimen,
	normalizeInjectableRegimens: normalizeInjectableRegimens,
	loadInjectableMedicationRegimens: loadInjectableMedicationRegimens,
	saveInjectableMedicationRegimens: saveInjectableMedicationRegimens,
	getMedicationDefinitionById: getMedicationDefinitionById,
	getLegacyHistoryKeyForMedication: getLegacyHistoryKeyForMedication,
	initializeMedicationDefinitionFoundation: initializeMedicationDefinitionFoundation
};

function normalizeMedicationNameForCapabilityLookup(medicationName) {
	return String(medicationName || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeMedicationRoute(route) {
	return route === "injection" ? "injection" : "oral";
}

function registerMedicationDefinition(definition) {
	if (!definition || typeof definition !== "object") {
		return null;
	}

	const name = String(definition.name || "").replace(/\s+/g, " ").trim();
	const lookupName = normalizeMedicationNameForCapabilityLookup(name);

	if (!lookupName) {
		return null;
	}

	const normalizedDefinition = {
		name: name,
		route: normalizeMedicationRoute(definition.route)
	};
	const existingIndex = medicationCapabilityDefinitions.findIndex(function (item) {
		return item.lookupName === lookupName;
	});

	normalizedDefinition.lookupName = lookupName;

	if (existingIndex >= 0) {
		medicationCapabilityDefinitions[existingIndex] = normalizedDefinition;
	} else {
		medicationCapabilityDefinitions.push(normalizedDefinition);
	}

	return {
		name: normalizedDefinition.name,
		route: normalizedDefinition.route
	};
}

function getMedicationDefinition(medicationName) {
	const lookupName = normalizeMedicationNameForCapabilityLookup(medicationName);
	const definition = medicationCapabilityDefinitions.find(function (item) {
		return item.lookupName === lookupName;
	});

	if (definition) {
		return {
			name: definition.name,
			route: definition.route
		};
	}

	return {
		name: String(medicationName || "").trim(),
		route: "oral"
	};
}

function getMedicationRoute(medicationName) {
	return getMedicationDefinition(medicationName).route;
}

function isInjectableMedication(medicationName) {
	return getMedicationRoute(medicationName) === "injection";
}