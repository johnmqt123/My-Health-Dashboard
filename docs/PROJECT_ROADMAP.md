# Project Roadmap

## Phase 1

- Medication Center
- Weight Center
- Exercise Center

## Phase 2

- Blood Pressure Center
- Nutrition Center
- Reports

## Phase 3

- Calendar
- Grocery List
- CPAP Tracking
- AI Meal Analysis

## Phase 4

- Voice Input
- Photo Recognition
- Cloud Backup
- Mobile App

## Architecture Initiative – Shared History Framework

Goal:
Replace duplicated history plumbing with a reusable shared history engine while preserving each center's unique rendering and business logic.

Priority:
High (before adding several new history-based features)

Benefits:
- One place to change disclosure behavior.
- One place to change Edit/Delete presentation.
- One place to change scrolling.
- One place to add animations.
- Consistent UI across all histories.
- Easier future development.

## Architecture Initiative – Separate Application from User Profile

Goal:
Refactor the application so that all personal information is stored in a user profile rather than embedded in the application.

Examples of personal information:
- Medication lists
- Medication schedules
- Zepbound therapy
- Weight history
- Blood pressure history
- Exercise history
- Goals
- Reminders
- Preferences

The application should provide generic functionality, while the user profile supplies the personal data.

Benefits:
- Makes the application reusable by other users.
- Simplifies future profile management.
- Reduces hard-coded personal information.
- Prepares for optional multi-user support.

### Shared History Framework – Standardized History Actions

As part of the Shared History Framework, all history views (Weight, Blood Pressure, Exercise, Medication, Zepbound, and future history modules) should use a common disclosure-style layout.

**Design Goals**
- Each history entry is collapsed by default.
- Tapping a history entry expands only that entry.
- Expanded entries reveal their available actions.
- Edit and Delete should be presented as a compact horizontal action row rather than stacked full-width buttons.
- Reuse a shared secondary button style throughout the application for these actions.
- Standardize spacing, typography, animations, and disclosure behavior across all history modules.
- The framework should allow future history types to inherit the same appearance and behavior without duplicating code.

**Benefits**
- Significantly reduces vertical scrolling.
- Eliminates repetitive "Edit / Delete" clutter.
- Creates a consistent user experience across all history views.
- Centralizes future UI changes into a shared component rather than requiring updates in multiple modules.
### Shared UI Design System

Continue standardizing reusable interface components throughout the application.

Areas to standardize include:
- Navigation buttons (Back to Dashboard, Back to Top)
- Primary action buttons
- Secondary action buttons
- Button sizing, spacing, and typography
- Card spacing and section spacing
- History disclosure rows
- Shared animations and scrolling behavior

Goal:
Create a consistent visual language so future UI improvements can be made centrally instead of independently in each feature.

### Shared History Framework – Phase 2

Convert one History module (Weight) into the new disclosure-style layout using the shared History Framework.

Objectives:
- Validate the new reusable architecture.
- Ensure the interaction works well on desktop and iPhone.
- Refine the shared framework before migrating additional History modules.

Migration order:
1. Weight
2. Blood Pressure
3. Exercise
4. Medication
5. Zepbound
1
