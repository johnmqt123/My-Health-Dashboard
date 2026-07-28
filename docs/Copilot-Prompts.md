# GitHub Copilot Prompt Library

These prompts have been tested on the My Health Dashboard project.

---

## Review Architecture

Review the existing project architecture. Do not modify any files.
Explain how the feature currently works, identify duplicate code,
and recommend how it should fit into the existing modular architecture.

---

## Refactor a Module

Implement the refactor according to the plan, but do not change
the data model or storage architecture.

Continue using loadData() and saveData() exactly as they exist.

After the refactor:
- preserve existing functionality
- do not modify unrelated code
- expose a single initialization function
- remove duplicate logic from script.js

---

## Compatibility Check

Before I apply these changes, verify that existing data already
stored in localStorage will continue to load correctly.

Explain any compatibility issues before making changes.

Do not modify any files.

---

## Find Unused Files

Review the entire project and determine whether any backup or duplicate
JavaScript files are still referenced.

Search index.html and all project files.

List each file and whether it is safe to delete.

Do not modify any files.

---

## Debug a Feature

Trace the complete execution flow for this feature.

Verify:
1. Event listeners
2. DOM elements
3. Storage updates
4. Rendering functions
5. Initialization

Identify the exact point where execution stops.

Do not modify any files.