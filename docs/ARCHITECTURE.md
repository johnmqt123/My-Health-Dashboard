# My Health Dashboard Architecture

## Purpose

This document describes how the application is organized and why it is structured this way.

---

# Project Structure

My Health Dashboard

- index.html
- css/
- js/
- docs/

---

# HTML

index.html contains the structure of the application.

It defines the dashboard layout but contains very little application logic.

---

# CSS

styles.css controls the appearance of the application.

It contains colors, spacing, fonts, cards, buttons, and layout.

---

# JavaScript

## script.js

Contains the application's behavior.

Examples:

- Greeting
- Current date
- Button actions
- Dashboard updates

---

## userProfile.js

Contains information about the current user.

Examples:

- Name
- Wake-up time
- Enabled features
- Preferences

Eventually this information will be created by a setup wizard.

---

## medications.js

Contains the medication schedule.

Medication information is stored separately from the application's logic.

Eventually medications will include:

- Name
- Time of day
- Instructions
- Notes
- Reminder rules

---

# Documentation

## DEVELOPMENT_JOURNAL.md

Daily development log.

---

## CHANGELOG.md

Summary of changes between versions.

---

## PROJECT_ROADMAP.md

Major milestones and future plans.

---

## IDEAS_BACKLOG.md

Ideas that are worth considering later.

---

## Future Direction

The long-term goal is to create a configurable personal assistant.

The assistant should adapt to each user rather than requiring changes to the application's code.

---

# Design Principles

These principles guide every design decision made in this project.

## 1. If the computer already knows it, don't ask the user to type it.

Examples:

- Current date
- Current time
- Day of the week
- Medication schedule
- Weather
- Reminder history

The assistant should automatically provide information whenever possible.

---

## 2. Show the next important thing.

The assistant should always answer:

> "What should I do next?"

Examples:

- Morning medications due
- Blood pressure not logged
- Weight not recorded
- Weather is favorable for a bike ride

---

## 3. Minimize typing.

Whenever practical:

- Use buttons
- Use checkboxes
- Use dropdown lists

Typing should be the exception rather than the rule.

---

## 4. Build for real life.

The assistant should adapt to the user's routine instead of forcing the user into a predefined workflow.

Medication schedules, reminders, and daily tasks should reflect how the user actually lives.

---

## 5. Keep it simple.

The dashboard should remain clean and uncluttered.

Only the most important information should appear on the main screen.

# Architecture

Current Architecture

HTML
│
├── CSS
│
├── JavaScript Modules
│   ├── medicationCenter.js
│   ├── weightCenter.js
│   ├── exercise.js
│   ├── bloodPressureCenter.js
│   └── storage.js
│
└── Local Storage

Future

Database
Cloud Sync
Authentication
# Application Architecture

*Created 2026-07-30*

This document defines the major functional areas of My Assistant. It serves as the high-level blueprint for organizing features and guiding future development.

---

# Home

The Home screen ("At a Glance") is the primary entry point into the assistant.

It should answer three questions within a few seconds:

- What needs my attention?
- What have I already completed today?
- What's coming up next?

---

# Health

Health-related information.

Potential sections:

- Medications
- Weight
- Blood Pressure
- Exercise
- Nutrition
- CPAP
- Symptoms
- Medical History
- Appointments

---

# Daily Life

Information that helps organize everyday activities.

Potential sections:

- Calendar
- Tasks
- Shopping
- Weather
- Notes
- Habits

---

# Information

Reference material the user wants available.

Potential sections:

- Quick Access
- Important Documents
- Contacts
- Emergency Information
- Insurance
- Medical Providers

---

# Reports

Historical information and trends.

Examples:

- Weight history
- Medication history
- Exercise history
- Nutrition history
- Blood pressure trends
- Custom reports

---

# Assistant

Personalization and assistant behavior.

Examples:

- User profile
- Assistant name
- Reminder settings
- Notification preferences
- Themes
- Units
- Backup and restore

---

# Future Areas

These are ideas that may eventually become major parts of the assistant.

Examples:

- AI Assistant
- Voice interaction
- Smart recommendations
- Home maintenance
- Vehicle maintenance
- Financial tracking
- Travel planning

## Home

The Home screen is the heart of My Assistant.

It should provide a quick, easy-to-understand overview of the information most relevant to the user at that moment.

The Home screen should answer three questions within a few seconds:

- What needs my attention?
- What have I already completed today?
- What's coming up next?

The Home screen should never feel cluttered or overwhelming.

It should provide summary information and easy access to additional detail when needed.

The Home screen should be personalized based on the user's preferences and priorities.
## Home Design Philosophy

The Home screen should answer the user's most common daily questions rather than simply displaying available information.

Each section should help answer a real-life question.

Examples:

- Did I take my medications?
- What's on my schedule today?
- What's the weather?
- How am I progressing toward today's goals?
- Is there anything important I should know?
- Where do I want to go next?

The Home screen should present summary information only.

Detailed information should always be available by selecting the appropriate section.