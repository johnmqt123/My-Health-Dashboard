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