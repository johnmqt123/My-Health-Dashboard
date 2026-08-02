## Guiding Principle

The application should minimize data entry while maximizing useful information. Whenever practical, the application should calculate values automatically instead of requiring the user to enter them manually.

# My Health Dashboard
## Ideas Backlog

This file contains ideas for future versions of the project.

Ideas are grouped by category and prioritized later.

---

# Health

- Medication logging
- Medication reminders
- Psyllium fiber timing
- Weight tracking
- Blood pressure
- CPAP
- Exercise
- Meals
- Zepbound tracking

---

# Personal Assistant

- Daily briefing
- Tomorrow reminders
- Smart reminders
- Daily priorities
- ChatGPT integration
- Voice commands
- Voice logging

---

# Organization

- Calendar
- To-do list
- Grocery list
- Notes
- Contacts

---

# Life Log

- Gardening
- Home maintenance
- Vehicle maintenance
- American Legion events
- Personal accomplishments
- Photos
- Search by date

---

# Weather

- Automatic daily weather
- Historical weather
- Weather correlations

---

# Reports & Insights

- Trends
- Charts
- Doctor reports
- Compare years
- Correlations

---

# Future Ideas

(Add new ideas here as they occur.)

# Ideas Backlog

## User Interface

- Numeric keypad on iPhone for numeric fields
- Larger touch targets
- Faster data entry
- Better mobile layout

## Nutrition

- Daily calorie tracking
- Protein tracking
- Fruit servings
- Vegetable servings
- Fiber tracking
- Water tracking

## Exercise

- Calories burned
- Distance
- Heart rate
- Exercise history

## Medication

- Injection site rotation
- Refill reminders
- Medication history
- Missed dose tracking

## AI

- Analyze meals
- Analyze progress
- Voice entry
- Photo meal recognition

# Ideas Backlog

## Mobile User Interface

- Use the numeric keyboard on iPhone for all numeric fields.
- Weight should default to a numeric keypad.
- Exercise minutes should default to a numeric keypad.
- Calories should default to a numeric keypad.
- Distance should default to a numeric keypad.
- Heart rate should default to a numeric keypad.
- Blood pressure fields should default to a numeric keypad.

## Nutrition Tracking

- Track daily calories.
- Track daily protein intake.
- Track carbohydrates.
- Track fat.
- Track fiber.
- Track fruit servings.
- Track vegetable servings.
- Track water intake.
- Display running daily totals and progress toward goals.

## AI Nutrition Assistant

- Allow meals to be entered in plain English.
- Automatically estimate calories.
- Automatically estimate protein.
- Automatically estimate carbohydrates, fat, and fiber.
- Save meal totals with one tap.
- Future enhancement: analyze meals from a photo.

## Zepbound Support

- Help ensure adequate calorie intake while taking Zepbound.
- Help ensure adequate daily protein intake.
- Provide nutrition summaries focused on GLP-1 users.
- Show daily progress toward calorie and protein goals.

## General Usability

- Minimize typing whenever possible.
- Make the app easy to use on an iPhone.
- Prefer automatic calculations over manual entry.
- Reduce the number of taps required for common tasks.

## Low Priority

### Optional Bowel Movement Log

Potential one-tap health log for users who wish to track bowel movements.

Current approach:
- Use calendar entries to determine whether long-term tracking is useful.

If implemented:
- Date/time only
- Optional feature
- No reminders
- No analysis
- No recommendations

Priority: Low

## Medication Enhancements

### Flexible Medication Times

Allow medication groups to use descriptive times of day rather than requiring exact clock times.

Examples:

- Wake Up
- Breakfast (~8:00 AM)
- Midday (~12:00 PM)
- Evening Meal (~5:00 PM)
- Bedtime (~9:00 PM)

Approximate times should be shown in parentheses to help establish a routine while allowing flexibility.

---

### Medication Counts by Time Period

Allow users to record the quantity taken for each medication during its scheduled time period.

Examples:

Morning
- Pantoprazole (1)
- Hydrochlorothiazide (1)
- Metoprolol XR (1)

Midday
- Gabapentin (1 or 2)

Bedtime
- Gabapentin (1 or 2)
- Rosuvastatin (1)
- Nifedipine (1)
- Aspirin 81 mg (1)

The quantity control should be easy to read and easy to tap.

Future enhancements could include configurable quantities and optional notes.

## Quick Access / Morning Startup Ideas

### Quick Access Shortcuts
- Add Apple Weather as a one-tap shortcut.
- Add Apple News as a one-tap shortcut.
- Add Apple Messages as a one-tap shortcut.
- Add Gmail as a one-tap shortcut.
- Add ChatGPT as a one-tap shortcut.
- Consider additional shortcuts for Google Calendar, Apple Reminders, MyChart, Medicare, Social Security, and other frequently used services.

### User Customization
- Allow users to reorder Quick Access buttons using drag-and-drop.
- Allow users to hide or show individual Quick Access buttons.
- Allow users to add custom shortcuts to installed apps or websites.
- Support multiple Quick Access layouts for different routines (Morning, Evening, Travel, etc.).

### Morning Startup Routine
- Create an optional Morning Startup mode that guides users through their preferred daily routine.
- Allow users to define the order of Quick Access items.
- Visually indicate the next recommended item in the routine.
- Allow users to mark steps as completed.
- Optionally remember the user's progress if they leave John's Assistant and later return.

### Future Enhancements
- Display notification badges where supported by the operating system (for example, unread email or upcoming calendar events).
- Add optional widgets showing today's weather, next calendar event, or medication reminders.
- Allow Quick Access shortcuts to launch apps using native deep links when available.
- Explore in-app browser support for compatible web services to simplify returning to John's Assistant.

## Session – July 30, 2026

High Priority

Add approximate times to each Medication Center section (Wake Up, Breakfast, Midday, Evening).
Use user-friendly 12-hour time formatting throughout the app.
Keep Medication Center visible near the top of the dashboard to minimize scrolling.

Medium Priority

Revisit Daily Routine layout after more real-world usage.
Consider expandable Daily Routine sections once enough content exists to justify them.

Design Notes

Daily Routine answers: "What part of my day am I in?"
Medication Center answers: "What medications should I be thinking about now?"
Global items like Weather should remain independently accessible and not belong to a single routine period.

## Future Vision

### Trusted Caregiver Access
- Role-based permissions.
- Caregiver Mode with limited access.
- Emergency Information screen.
- User-controlled sharing of sensitive information.
- Separate private information from shared health information.

### Medication Center
- Integrate Zepbound into the Medication Center rather than creating a separate Zepbound Center.
- Display only a brief summary by default (e.g., next injection date/status).
- Expand to show detailed information (dose, injection site, weight, side effects, history) only when the user taps or clicks the Zepbound section.
- Keep the Medication Center focused on daily medications while providing quick access to weekly medications like Zepbound.

### Future UI Modernization
- Reevaluate input controls based on the type of information being entered rather than using a single control style everywhere.
- For small fixed choices (e.g., Tylenol 1–3 tablets), consider direct selection buttons.
- For variable quantities, use larger +/- controls or other appropriate input methods.

Future Enhancement – Improve Tylenol Logging UI

Priority: Medium

Status: Backlog

Goal

Redesign the Tylenol logging dialog to be faster and easier to use on an iPhone while preserving the existing logging functionality.

Current Status
Supports 1–3 tablets.
Automatically records the date and time.
Optional note field.
History displays the correct timestamp and tablet count.
Functionally complete.
Planned Improvements
1. Replace the tablet drop-down

Replace the current drop-down list with large − and + buttons and a large centered number.

Example:

Tablets

   −    2    +

Benefits:

Easier one-handed operation.
Larger touch targets.
More modern appearance.
Faster logging.
2. Improve button appearance

Make:

Save button larger and more prominent.
Cancel button secondary.

Increase spacing between controls.

3. Mobile-friendly layout

Optimize spacing, font sizes, and touch targets for iPhone use.

4. Optional future enhancements

Possible additions:

Remember the previously selected tablet count.
Quick buttons for common doses.
Medication-specific icons.
Optional voice entry.
Estimated Priority

Implement after higher-priority health tracking features are complete.

Medication Center – Heading Formatting Bug

When a medication group (Wake-Up, Breakfast, Midday, Dinner, or Evening) is expanded and collapsed, the approximate time loses its custom formatting and becomes full-size text.

Likely Cause:
The JavaScript that expands/collapses medication groups appears to rebuild or replace the heading instead of preserving the <span class="approx-time"> element.

Future Fix:
Update the expand/collapse code to preserve the heading HTML and CSS formatting.

Medication Schedule Customization

Allow users to customize each medication group.

Configuration should include:
• Group name (Wake-Up, Breakfast, etc.)
• Approximate time
• Display order
• Enable/disable group

Use sensible defaults for new users while allowing complete personalization later.

Development Principle

Whenever possible, place reusable formatting, colors, sizes, and layout rules in CSS rather than inline HTML.

Benefits:
• One change updates the entire application.
• Easier maintenance.
• Consistent appearance.
• Cleaner HTML.

## Dashboard Layout Redesign – Quick Access

### Background

As John's Assistant has evolved, the original "Daily Routine" card has become redundant. The Medication Center now provides the time-of-day organization for medications, making the Daily Routine timeline unnecessary.

### Proposed Changes

- Move the **Medication Center** directly below the **At a Glance** card.
- Replace the **Daily Routine** card with a **Quick Access** section.
- Design Quick Access as a compact horizontal row of icons or buttons to minimize scrolling.
- Keep the Medication Center visible without requiring the user to scroll.

### Initial Quick Access Items

- Nutrition Center
- Weight Center
- Weather
- MyChart
- Google Calendar
- Gmail
- Grocery List
- Financial Spreadsheet
- Additional user-configurable links

### Future Enhancement

Allow users to customize:
- Which Quick Access items are displayed.
- The order of the items.
- Icons and labels for each shortcut.

### Design Principle

Design the dashboard based on **frequency of use**, not time of day.

Features used multiple times per day should require the fewest taps and the least scrolling.

### Priority

Medium-High

Implement after the Nutrition Center and Weight Center are functional.
Real-world usage should drive dashboard layout. As new features are added, the Home screen should be reorganized based on how frequently they are used rather than preserving the original layout.
## Medication Center Enhancements

### Zepbound Integration

Move Zepbound into the Medication Center instead of maintaining a separate Zepbound Center.

- Remove the standalone "Zepbound Center."
- Add a collapsible "Zepbound" section within the Medication Center.
- Since Zepbound is currently the only weekly medication, a separate "Weekly Medications" section is not necessary.
- Display:
  - Last injection date
  - Next scheduled injection
  - Log Injection button
  - Injection history

### As-Needed Medications

Add Alpha-Lipoic Acid (ALA) to the "As Needed" medication section.

Allow ALA to be logged the same way as other as-needed medications.

### Medication Quantity Logging

Enhance medication logging to support recording quantities when needed.

Example:

- Gabapentin
  - Morning: 1 capsule
  - Midday: 2 capsules
  - Evening: 1 capsule

Rather than only recording that a medication was taken, optionally record the quantity taken for medications where dosage may vary.

This enhancement should be optional and should not complicate medications that are always taken in fixed amounts.
## Quick Links Customization

Allow users to customize the order of Quick Links.

Requirements:

- Press and hold to reorder Quick Links.
- Support drag-and-drop on desktop and iPhone.
- Automatically save the new order.
- Preserve the customized layout between sessions.

Design Principle:

Quick Links should reflect each user's workflow rather than a fixed priority established by the application.

## Dashboard Layout Refinements

### Reorder Dashboard Sections

Reorder the dashboard to better reflect daily usage.

Proposed order:

1. At a Glance
2. Medication Center
3. Quick Links
4. Weight
5. Exercise
6. Blood Pressure
7. Other tracking sections as added

### Rationale

Weight is logged almost every day.

Exercise is reviewed and logged more frequently than blood pressure.

Blood pressure is typically recorded only once or twice per week and therefore should appear below Weight and Exercise.

### Design Principle

Arrange Dashboard sections according to actual user workflow and frequency of interaction rather than the order in which features were originally developed.
Redefine the At a Glance card as an exception and status summary rather than a collection of dashboard information.

The card should highlight items requiring attention today, while routine information belongs in its own center or section.
## User-Managed As Needed Medications

Replace hard-coded as-needed medications with a user-managed list.

Requirements:

- Add new as-needed medications.
- Rename medications.
- Delete or archive medications that are no longer used.
- Preserve each medication's independent history and Last Taken information.
- No code changes should be required when the user's medication list changes.

Design Principle:

The Medication Center should adapt to the user's medication regimen rather than requiring application changes whenever medications change.

## Floating Back to Top Button

Add a floating "Back to Top" button that appears after the user scrolls down the Dashboard.

Requirements:
- Fixed in the lower-right corner.
- Visible only after scrolling beyond a threshold.
- Smoothly scrolls to the top.
- Works on desktop and iPhone.
- Replaces the need for multiple "Back to Top" links throughout the Dashboard.

Design goal:
Provide quick navigation while keeping the interface clean and uncluttered.