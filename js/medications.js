const medicationSchedule = [];

const medicationCapabilityDefinitions = [];

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