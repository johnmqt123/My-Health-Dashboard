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