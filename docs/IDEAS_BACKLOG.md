## Guiding Principle

The application should minimize data entry while maximizing useful information. Whenever practical, the application should calculate values automatically instead of requiring the user to enter them manually.

# John's Assistant
## Ideas Backlog

This file contains ideas for future versions of the project.

Ideas are grouped by category and prioritized later.

---

# Health

- Medication logging
- Medication reminders
- Supplement timing
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
- Example medication A
- Example medication B
- Example medication C

Midday
- User-selected medication with optional quantity

Bedtime
- User-selected medication with optional quantity
- Example medication D
- Example medication E
- Example medication F

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
- For small fixed choices (e.g., user-selected medication quantity), consider direct selection buttons.
- For variable quantities, use larger +/- controls or other appropriate input methods.

Future Enhancement - Improve As-Needed Medication Logging UI

Priority: Medium

Status: Backlog

Goal

Redesign the as-needed medication logging dialog to be faster and easier to use on an iPhone while preserving the existing logging functionality.

Current Status
Supports a user-entered quantity.
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

Support user-managed as-needed medications in the "As Needed" medication section.

Allow any user-selected as-needed medication to be logged the same way.

### Medication Quantity Logging

Enhance medication logging to support recording quantities when needed.

Example:

- Example medication
  - Morning: user-selected quantity
  - Midday: user-selected quantity
  - Evening: user-selected quantity

Rather than only recording that a medication was taken, optionally record the quantity taken for medications where dosage may vary.

This enhancement should be optional and should not complicate medications that are always taken in fixed amounts.

### User-Configurable Specialized Medication Centers

Future architectural direction:

- Medication-specific centers (for example, Zepbound) should be configurable rather than hard-coded to one medication.
- Users should be able to enable specialized medication centers that match their own regimen.
- Potential examples include GLP-1 medications, insulin workflows, anticoagulant therapy, and other specialized medication tracking needs.
- The Medication Center should display only the specialized centers relevant to that user.
- The architecture should support adding specialized medication types without custom code changes for each individual user.

Design principle:

John's Assistant should adapt to the user's medication regimen rather than assuming every user takes Zepbound.
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

 make data entry seamless.

---

### 2. Automatic Focus
Improve data-entry speed by automatically placing the cursor in the first appropriate input field when a logging dialog opens.

Examples:
- Weight → focus Weight field and open decimal keypad.
- Blood Pressure → focus Systolic field.
- Exercise → after selecting Stationary Bike or E-Bike Ride, automatically focus the numeric entry field.
- As Needed Medications → focus the first editable field.

Goal:
Reduce taps and make data entry feel instantaneous.

---

### 2. Continue Quick Links Development
Implement the remaining Quick Links using the Nutrition link as the standard pattern.

Priority order:
1. Weather
2. Reminders
3. Calendar
4. Gmail
5. News

Requirements:
- Preserve the existing Quick Links architecture.
- Reuse the same implementation pattern established for Nutrition.
- Keep the Dashboard compact and optimized for iPhone.

Goal:
Make John's Assistant the primary starting point for the user's daily workflow.

## History Management

### Edit and Delete History Entries

Add the ability to edit or delete previously logged history entries throughout John's Assistant.

Purpose:
- Correct accidental duplicate entries created during testing.
- Fix incorrect values (weight, blood pressure, exercise, medications, etc.).
- Maintain accurate historical data for future reporting, averages, and trends.

Requirements:
- Allow individual history entries to be edited.
- Allow individual history entries to be deleted.
- Display a confirmation before deleting an entry.
- Immediately refresh any related Dashboard summaries after editing or deleting.
- Preserve chronological order after edits.
- Use a consistent editing experience across all history sections.

Applies to:
- Medication History
- Weight History
- Blood Pressure History
- Exercise History
- Zepbound History
- Future Nutrition History

Design goal:
Provide complete history management while keeping the interface simple and consistent.

## Application Branding

### Create a Custom John's Assistant App Icon

Replace the current default Home Screen "J" icon with a custom application icon.

Requirements:
- Create a clean, modern, and recognizable icon.
- Reflect John's Assistant as a personal daily assistant, not solely a health or medication app.
- Avoid medical-specific imagery (medical cross, heartbeat, stethoscope, etc.).
- Use a simple design that remains clear at small iPhone icon sizes.
- Support future branding across iPhone, iPad, desktop, and web.

Possible design directions:
- A stylized "J"
- A modern monogram
- A subtle assistant/dashboard concept
- Blue, white, or other clean professional color palette

Implementation:
- Add the icon to the web app manifest and favicon configuration.
- Verify it appears correctly when John's Assistant is added to the iPhone Home Screen.

Design goal:
Create an icon that represents John's Assistant as a polished personal assistant and daily command center.

## UI Consistency – Standardize Expand/Collapse Indicators

**Goal:**
Improve discoverability by making all expandable sections clearly identifiable and visually consistent.

**Implementation:**
- Use a disclosure arrow on every expandable section:
  - ▶ Collapsed
  - ▼ Expanded
- Make the entire header row tappable.
- Apply the same behavior throughout the application, including:
  - Wake-Up Medications
  - Breakfast Medications
  - Midday Medications
  - Evening Medications
  - Bedtime Medications
  - As-Needed Medications
  - Any future expandable sections
- Ensure the disclosure arrow automatically updates as each section expands or collapses.

**Design Goal:**
A first-time user should immediately recognize which sections can be expanded without needing to experiment or receive instructions.

**Priority:** Medium (UI Polish)

## UI Polish – Compact Blood Pressure Edit Dialog

**Goal:**
Reduce the height of the Blood Pressure edit dialog on desktop while preserving the current iPhone layout.

**Implementation Ideas:**
- Reduce unnecessary vertical spacing.
- Keep Save and Cancel visible without requiring scrolling on desktop.
- Preserve the current mobile-friendly layout.
- Do not modify any blood pressure logging or editing logic.

**Design Goal:**
Editing a blood pressure entry should feel compact and efficient, with all primary controls visible on a typical desktop display.

**Priority:** Medium (UI Polish)

## UI Polish – Simplify Exercise Edit Dialog

**Goal:**
Simplify the Exercise edit dialog by removing the exercise-type selector during edit mode.

**Implementation Ideas:**
- When logging a new exercise, continue allowing the user to choose the exercise type.
- When editing an existing exercise, display the exercise type as read-only text instead of a drop-down selector.
- Allow editing only the values associated with that exercise (minutes, miles, notes, etc.).
- Reduce dialog height and improve visibility of the "Edit Exercise" title.

**Design Goal:**
Editing should focus on correcting the existing record, not changing it into a different type of exercise. The dialog should be simpler, more compact, and less confusing.

**Priority:** Medium (UI Polish)

## Dashboard Enhancement – Evolve "At a Glance" into "Coming Up"

**Goal:**
Transform the current "At a Glance" card into a more helpful daily assistant by presenting upcoming items instead of focusing only on medication status.

**Implementation Ideas:**
- Consider renaming the card from **At a Glance** to **Coming Up**.
- Display the next several important items rather than a single status.
- Examples of future "Coming Up" items:
  - Next medication period
  - Weekly recurring events (e.g., Zepbound injection day)
  - Calendar appointments
  - Reminders and to-do items
  - Grocery reminders
  - Other important daily events
- Prioritize items by urgency and time.

**Design Goal:**
The dashboard should answer the question:
> **"What's coming up that I should know about?"**

rather than focusing on a single category such as medications.

**Priority:** Future Enhancement

## UI Enhancement – Add Back to Top Navigation

**Goal:**
Provide a quick way to return to the top of the dashboard after scrolling.

**Implementation Ideas:**
- Add a "↑ Back to Top" button at the bottom of the page.
- After the dashboard is renamed, consider "↑ Back to Coming Up."
- Smooth-scroll to the top of the page.

**Priority:** Medium

## Future Enhancement – Mobile Quantity Stepper

**Goal:**
Evaluate replacing the numeric quantity input for As-Needed Medications with a mobile-friendly stepper control.

**Implementation Ideas:**
- Display [-] Quantity [+].
- Minimize keyboard use on iPhone.
- Keep desktop behavior unchanged unless beneficial.

**Priority:** Future Enhancement

### Make "Coming Up" Items Actionable

Allow items shown in the dashboard's "Coming Up" (currently "At a Glance") section to be tappable.

Examples:
- "Midday Medications" opens the Medication Center with the Midday section expanded.
- "Zepbound Injection Today" opens the Zepbound Center.
- Future calendar appointments open the Calendar.
- Future reminders open the appropriate reminder or task.

Goal:
Transform the dashboard from an informational summary into an actionable command center, reducing navigation and making the next task only one tap away.

### Investigate Blood Pressure Auto-Focus on iPhone

Current behavior:
- Website correctly places the cursor in the Systolic field.
- iPhone opens the dialog but does not place the cursor in the Systolic field.

Goal:
Determine whether this is an iOS Safari limitation or whether the application can reliably improve the behavior without introducing side effects.

### Integrate Zepbound into Medication Center

Move the standalone Zepbound Center into the Medication Center as a dedicated long-term therapy section.

Goals:
- Treat Zepbound as a medication rather than a separate center.
- Consolidate all medication-related information into one location.
- Reduce dashboard complexity by eliminating a separate Zepbound Center.
- Preserve all existing Zepbound functionality, including:
  - Injection history
  - Injection site tracking
  - Dose information
  - Notes
  - Weekly schedule
- Present Zepbound as a collapsible section similar to other medication groups where appropriate.

Benefits:
- More intuitive organization.
- One destination for all medication management.
- Supports future user-profile architecture by keeping personal medication information together.
- Simplifies future navigation and dashboard integration.
## Ideas Backlog

### Export History Feature

Add the ability to export history data from selected modules, beginning with Blood Pressure.

Potential export formats:
- PDF (formatted report for healthcare providers)
- Plain text (easy to paste into MyChart messages)
- CSV (for Excel or other spreadsheet applications)

Initial target module:
- Blood Pressure History

Future candidates:
- Weight History
- Medication History
- Nutrition History
- Exercise History
- Sleep History

Design goals:
- Simple one-tap export.
- Professional, easy-to-read format.
- Date-range selection (optional for a future version).
- No redesign of the history screens required.

## Ideas Backlog

### Weight Edit Keyboard Behavior

Refine the Weight Edit screen to match the Blood Pressure Edit experience.

Design goal:
- Do not automatically focus the Weight field when opening the Edit screen.
- Do not automatically display the numeric keyboard.
- Open the Edit screen with the full form visible.
- Let the user tap the field they wish to edit before showing the keyboard.

This should make the Weight Edit experience consistent with Blood Pressure Edit and provide a more natural iPhone workflow.

## Ideas Backlog

### Recently Deleted

Add a Recently Deleted feature for history modules.

Design goals:
- Deleted entries are moved to Recently Deleted instead of being permanently removed.
- Entries are retained for a configurable period (e.g., 30 days).
- Users can:
  - Restore an entry.
  - Permanently delete an entry.
- Initially support:
  - Weight
  - Blood Pressure
  - Exercise
  - Nutrition
  - Medications
  - Sleep

This provides protection against accidental deletions while keeping the normal Delete workflow simple.

## Ideas Backlog

### Application Navigation Review

As John's Assistant grows, review the overall application architecture and navigation.

Topics to evaluate:
- Create a dedicated Nutrition Center.
- Determine whether Quick Links should evolve into a more structured navigation system.
- Organize modules into logical categories (Health, Lifestyle, Tools).
- Integrate Zepbound into the Medication Center.
- Reevaluate the Dashboard once all major modules have been implemented.

Goal:
Design a navigation system that scales naturally as new modules are added while keeping the app simple and easy to use.

## Zepbound History — Future Improvements

- **Edit/Delete button styling:** Replace the current generic baby-blue and baby-pink button colors with the app's current visual language.
- **Long-history usability:** Revisit the Zepbound injection history when it becomes substantially longer. Consider a more compact presentation and/or an easier way to close or navigate the history without requiring a long scroll.

## Zepbound Center — Future Robustness and Scheduling

### Goal

Develop the Zepbound Center into a complete, user-configurable medication-specific center rather than a simple injection log.

The current Zepbound Center successfully records injections and history, but future versions should provide configuration, scheduling, reminders, and better integration with the Medication Center.

### Current Dose / Medication Settings

Allow the user to configure the current Zepbound regimen without modifying historical records.

Possible settings:

- Current dose
- Injection frequency
- Next injection date
- Preferred injection time
- Preferred/allowed injection sites
- Injection rotation preferences
- Other medication-specific settings as appropriate

Important principle:

Changing the current dose or regimen must affect future injections only.

Historical injections must retain the dose, date, time, site, and notes that were actually recorded at the time.

Example:

- Previous injections: 2.5 mg
- Current dose: 5 mg

Changing the current dose to 5 mg must not change the previous 2.5 mg history entries.

### Injection Scheduling

Provide a user-configurable injection schedule.

Possible functionality:

- Set the recurring injection interval (for example, weekly).
- Set the next injection date.
- Optionally set a preferred injection time.
- Automatically calculate the next scheduled injection after an injection is logged.
- Display the upcoming injection date prominently in the Zepbound Center.

The schedule should remain editable by the user.

### Reminders and "What's Up Next"

Integrate scheduled Zepbound injections into John's Assistant's reminder system and/or "What's Up Next."

Examples:

- "Zepbound injection due today"
- "Zepbound injection tomorrow"
- "Next Zepbound injection: Monday, August 17"

The user should not have to rely solely on an external calendar to remember the injection.

Avoid creating duplicate reminders if the user already has an external calendar reminder; future integration should be considered carefully.

### Injection History

Continue maintaining a complete injection history including:

- Date
- Time
- Dose
- Injection site
- Notes

History should support:

- View
- Edit
- Delete
- Chronological ordering

Editing or deleting a history entry must not alter the user's current medication settings or future schedule unless explicitly intended.

### Injection Site Rotation

Provide a configurable rotation system.

Possible functionality:

- Track the last injection site.
- Show the recommended/next rotation site.
- Display a six-site or other user-configurable rotation.
- Allow the user to skip a site when necessary.
- Allow the user to manually select a different site.
- Preserve the actual site used in historical records.

The system should assist the user rather than force a specific site.

### Medication-Specific Information

Consider allowing the specialized medication center to contain information relevant to that medication, such as:

- Current dose
- Injection schedule
- Next injection
- Last injection
- Injection site
- Rotation status
- Injection history
- User notes

Do not add medical advice or dosing recommendations unless the feature is specifically designed and validated for that purpose.

### Future Architecture — User-Configurable Specialized Medication Centers

Zepbound should eventually become an example of a broader architecture rather than a hard-coded special case.

Users may take different specialized medications, such as:

- Zepbound or another GLP-1 medication
- Insulin
- Other injectable medications
- Anticoagulant therapy
- Other medications requiring specialized tracking

The application should eventually allow the user to enable/configure the appropriate specialized medication center.

Design principle:

"John's Assistant should adapt to the user's medication regimen rather than assuming every user takes Zepbound."

### Medication Center Integration

Future versions should consider integrating Zepbound into the Medication Center while preserving its specialized functionality.

Possible design:

- Zepbound appears as a specialized expandable section within Medication Center.
- Brief summary shown by default.
- Expanded section provides:
  - Next injection
  - Current dose
  - Last injection
  - Log Injection
  - Rotation information
  - History

The user should not need to navigate through multiple layers just to determine when the next injection is due.

### Priority

Future enhancement — Medium/High

Do not implement piecemeal unless a specific usability problem requires an isolated fix.

Prefer designing the complete user-configurable specialized-medication architecture before making major changes to the current Zepbound Center.

## Daily Diary — Long-Entry Display and History Readability

### Goal

Allow Daily Diary entries to contain as much information as the user wants without making the Diary History unnecessarily long or difficult to browse.

### Entry Length

Do not impose an arbitrary or restrictive character limit on individual diary entries.

A user may write:

- A sentence or two on a typical day.
- Several paragraphs on an important day.
- A longer personal account when desired.

The complete original entry should always be preserved.

### History Display

Long diary entries should not make the entire history excessively tall.

For longer entries, show a compact preview in the history list.

Example:

August 11, 2026

"Beautiful weather today. Played golf this afternoon and felt really good. My energy was excellent..."

[Read More]

Short entries may be displayed in their entirety without a Read More control.

### Full Entry

Tapping Read More should reveal the complete diary entry.

Possible approaches:

- Expand the entry inline.
- Open the entry in a larger view.
- Load the full entry into the existing editor/viewer.

Choose the approach that best fits the application's existing UI patterns.

### Editing

The complete original entry must remain available when the user chooses to edit it.

Editing a long entry must not truncate or otherwise alter text that was not intentionally changed.

### Design Principle

Separate the amount of information the user is allowed to STORE from the amount of information the interface initially SHOWS.

The user should never feel that they cannot write something because the diary has a short display limit.

### Future Consideration

As the Diary grows, consider adding:

- Search within diary entries.
- Date-based navigation.
- Calendar/date picker navigation.
- Automatic weather attached to the entry.
- Connections between diary entries and health/activity records.

Do not implement these features as part of this backlog item.

## Quick Links — Constrained Scrollable List

### Goal

Allow the Quick Links section of the Profile & Links Dashboard card to grow without allowing the entire card to consume excessive vertical space.

### Proposed Behavior

When the number of Quick Links becomes large enough to require significant vertical space:

- Make only the Quick Links list independently scrollable.
- Keep the Profile & Links editor button fixed and always visible.
- Keep the surrounding Dashboard card at a reasonable height.
- Allow the user to scroll through all Quick Links without scrolling the entire Dashboard card.

Conceptually:

    Profile & Links

    [ Quick Link ]
    [ Quick Link ]
    [ Quick Link ]
       ↕ scrollable
    [ Quick Link ]
    [ Quick Link ]

    [ Edit Profile & Links ]

### Design Considerations

- Do not impose an arbitrary limit on the number of Quick Links.
- Use a reasonable maximum height for the Quick Links scrolling area.
- Preserve the existing link ordering.
- Preserve existing Quick Link functionality.
- Keep touch targets comfortable on iPhone.
- Make the scrolling behavior obvious without making the list look like a separate application component.
- Keep the Profile & Links editor button outside the scrolling region so it remains immediately accessible.

### Future Enhancement

Consider whether the Quick Links list should automatically become scrollable only after it exceeds a certain height, allowing short lists to remain fully visible without an unnecessary scrollbar or nested scrolling area.

Do not implement until the Quick Links list has grown enough through actual use to determine an appropriate height and scrolling behavior.

## Dashboard History — Standardize Open/Close Scroll Behavior

### Goal

Standardize the History / Hide History behavior across all Dashboard sections so that users experience the same navigation pattern throughout the application.

### Current Behavior

History sections currently behave differently when History is opened and when Hide History is tapped:

- Nutrition — Hide History returns the user to the History button area.
- Weight — Hide History returns the user to the History button area.
- Daily Diary — Hide History currently returns the user to the History button area.
- Exercise — Hide History returns the user to the top/near-top of the entire Exercise card.
- Blood Pressure — Hide History returns the user to the top/near-top of the entire Blood Pressure card.

### Desired Future Behavior

Establish one consistent Dashboard-wide History interaction pattern.

Preferred behavior:

1. Tap History:
   - History expands.
   - The History control remains visible.
   - The beginning of the History content is visible.

2. Tap Hide History:
   - History collapses.
   - The viewport returns to the top of the entire parent Dashboard card, preferably positioned so the complete card is visible when practical.

This should apply consistently to:

- Nutrition
- Weight
- Daily Diary
- Exercise
- Blood Pressure
- Any future Dashboard section that includes History

### Implementation Considerations

- Inspect the existing Exercise and Blood Pressure implementations, since their current Hide History behavior appears closest to the desired final experience.
- Do not blindly replace each section's implementation; preserve each section's existing functionality and data handling.
- Prefer a shared helper/pattern if one can be introduced safely, but avoid changing global scrolling behavior unless thoroughly tested.
- Maintain comfortable iPhone behavior and avoid unexpected jumps.
- Verify both opening and closing History at a 390x844 viewport.
- Verify that individual history-row expansion/editing behavior remains unchanged.

### Priority

Future UX consistency improvement. Not urgent.

Do not implement until there is a good opportunity to address Dashboard History behavior as a single coordinated cleanup rather than changing individual sections one at a time.

## Quick Links — Make Built-In Links User Configurable

### Goal

Make the Quick Links system consistently user-configurable rather than having some links controlled by the user and others hardwired into the application code.

### Current Issue

User-created Quick Links can already be:

* Edited
* Deleted
* Added

However, several existing Quick Links such as:

* Weather
* News
* Calendar
* Gmail

appear to be hardwired into the application.

Changing or removing these currently requires modifying application code rather than using the Profile & Links editor.

### Desired Future Behavior

Ordinary Quick Links should be treated consistently.

The user should be able to:

* Add a Quick Link.
* Edit a Quick Link.
* Delete a Quick Link.
* Re-add a previously deleted Quick Link if desired.

The existing hardwired links should therefore be converted into normal user-configurable Quick Links where practical.

For example, if the user does not want Weather or News displayed, they should be able to delete them from the Quick Links editor without changing application code.

If they later want them again, they should be able to add them back through the normal Quick Link interface.

### Special Integrated Functions

Some links may represent application functionality rather than simple external URLs.

For example:

* Reminders
* Future integrated health/application functions

These should NOT simply be removed or converted without first determining the appropriate design.

For these specialized functions, determine whether they should:

* Remain as dedicated application buttons.
* Become configurable Quick Links backed by an internal application action.
* Be managed through another appropriate mechanism.

### Design Principle

Avoid having two different classes of Quick Links where some are user-managed and others secretly require code changes.

Where technically practical, the Quick Links editor should be the single place where the user manages the links that appear in the Quick Links section.

### Future Considerations

Coordinate this work with the existing backlog item:

**Quick Links — Constrained Scrollable List**

As the number of configurable Quick Links grows, the Quick Links section may eventually need its own constrained scrolling area while keeping the Profile & Links editor button fixed and accessible.

### Priority

Future UX/architecture improvement.

Do not implement until there is an opportunity to address the Quick Links system as a coordinated improvement rather than making isolated changes.

## Daily Diary — Redesign Entry Workflow and Fix Historical Editing State

### Goal

Improve the Daily Diary workflow so the Dashboard remains compact and easy to scan while providing a dedicated, comfortable editing area for the current day's diary.

Also fix the existing bug where editing a historical diary entry leaves that historical text in the main Diary editor after saving.

---

### BUG — Historical Entry Persists in Today's Editor

#### Current Behavior

When the user:

1. Opens Daily Diary History.
2. Selects a historical entry from a previous date.
3. Expands/views the entry.
4. Taps Edit Entry.
5. Adds or changes text.
6. Saves the historical entry.
7. Closes History.

The edited historical entry remains loaded in the main Diary editor.

This makes it appear that the historical entry is now the current day's diary entry.

#### Desired Behavior

A historical entry must remain associated with its original date.

After saving a historical entry:

* The historical record is updated for its original date.
* The main "today" Diary editor must NOT be populated with the historical entry.
* Today's entry should remain today's entry.
* If today's entry exists, it should remain unchanged.
* If today's entry does not exist, the editor should remain empty for today.
* Closing History should return the user to the normal Daily Diary state without accidentally changing the active date.

The application should clearly distinguish:

```
Today's Diary
```

from:

```
Editing a Historical Diary Entry
```

Do not create duplicate entries.

Do not change the existing one-entry-per-day storage model.

---

# FUTURE UX REDESIGN — DAILY DIARY

### Design Goal

Make the Dashboard Daily Diary card compact and make the actual diary editor a dedicated larger editing/viewing experience.

The Dashboard should provide a quick summary and entry point rather than permanently displaying a large text editor.

### Proposed Dashboard Design

The Daily Diary card should remain relatively small.

Conceptually:

```
Daily Diary

August 13, 2026

[ Today's diary preview... ]

[ Open Today's Diary ]

[ History ]
```

The exact wording and layout can be determined during implementation.

The goal is to keep the Dashboard compact while making it obvious how to enter or edit today's diary.

### Dedicated Diary Editor

When the user taps the button to open today's Diary:

* Open a dedicated larger Diary editing view/modal/page.
* Clearly display the current date.
* Provide a substantially larger text area.
* Allow comfortable entry of several sentences or multiple paragraphs.
* Support iPhone keyboard and voice dictation comfortably.
* Provide an obvious Save action.
* Provide an obvious Close/Cancel action.
* Keep the underlying Dashboard stationary.
* Return the user to the Dashboard when finished.

The dedicated editor should be designed for writing rather than merely displaying a small text field.

### Today's Diary Workflow

Preferred workflow:

```
Dashboard
    ↓
Daily Diary card
    ↓
Open Today's Diary
    ↓
Large dedicated editor
    ↓
Write / edit
    ↓
Save
    ↓
Close / return to Dashboard
```

The Dashboard card can then show a concise preview of today's entry.

### Historical Diary Workflow

Historical entries should remain separate from today's editing workflow.

Preferred workflow:

```
Dashboard
    ↓
History
    ↓
Historical entry preview
    ↓
Tap entry
    ↓
View complete entry
    ↓
Edit Entry if desired
    ↓
Save historical date
    ↓
Return to History
```

Editing a historical entry must never change the active/current today's Diary editor.

### Long Entries

Do not impose an arbitrary character limit.

The dedicated editor should allow:

* Short entries.
* Normal two- or three-sentence entries.
* Multiple paragraphs.
* Long entries when desired.

The complete entry must be preserved.

The Dashboard should use a compact preview when an entry is long.

### History

Preserve the existing useful History features:

* Newest-first ordering.
* Month/year grouping.
* Expandable history rows.
* Full historical entry viewing.
* Explicit Edit Entry action.
* One entry per calendar day.

### Data Model

Preserve the existing:

* `dailyDiaryEntries` storage.
* Date + text record structure.
* One-entry-per-day architecture.
* Local date normalization.
* Existing localStorage persistence.

Do not create a second Diary storage model simply to support the new editor.

### Important State Management Requirement

Clearly separate these states:

1. Viewing today's Diary.
2. Editing today's Diary.
3. Viewing a historical Diary entry.
4. Editing a historical Diary entry.

The active date must always be explicit.

Saving a historical entry must update only that historical date.

Opening/closing History must not accidentally leave a historical date as the active date for today's editor.

### Dashboard Placement

Keep Daily Diary directly below Weight and above Exercise.

The Dashboard order remains:

```
Weight
Daily Diary
Exercise
```

### Future Enhancements

Keep these as separate future ideas rather than implementing them as part of this redesign:

* Search Diary History.
* Date picker/calendar navigation.
* Automatic weather information.
* Automatic activity information.
* Other health-data connections.
* Long-entry Read More presentation improvements.

### Priority

This should be treated as a planned Daily Diary UX revision rather than an emergency feature change.

The historical-entry state bug should be fixed as part of the redesign.

Before implementation, review the current Diary code and existing behavior carefully so the redesign does not disturb the established storage model or other Dashboard sections.

## Daily Diary — Search History

### Goal

Add a search function to Daily Diary History so the user can quickly find past diary entries by words or phrases.

### Desired Behavior

Add a clearly visible Search Diary control within the Diary History area.

Conceptually:

    Diary History

    [ 🔍 Search diary... ]

The user can enter a word or phrase such as:

- golf
- vacation
- doctor
- snow
- family
- Christmas

The search should return matching diary entries, preferably newest-first.

### Search Results

Each matching result should show:

- Date
- Concise preview containing the matching text

Example:

    August 12, 2026
    "...played golf in the afternoon..."

    July 28, 2026
    "...another beautiful day for golf..."

Tapping a result should allow the user to view the complete diary entry using the existing History view behavior.

An Edit Entry action should remain available when appropriate.

### Search Scope

Initial version should search the diary entry text.

The search should be:

- Case-insensitive.
- Able to match words or phrases.
- Fast enough for a large collection of locally stored diary entries.
- Performed entirely against the existing local Daily Diary data.

No external search service or server-side database is needed.

### Date Searching

Consider supporting dates/year/month searches in a future enhancement.

Examples:

- 2026
- August
- August 2026
- 08/12/2026

This does not need to be part of Version 1 unless it is simple to implement naturally.

### Data Model

Do not change the existing:

- `dailyDiaryEntries` storage key.
- Date + text record structure.
- One-entry-per-day model.
- Local date normalization.
- localStorage persistence.

Search should operate directly against the existing Diary data.

### User Experience

Search should not interfere with the existing Diary workflows:

- Today's Diary remains separate.
- Historical entries remain view-first.
- Historical editing remains explicitly initiated through Edit Entry.
- Search results must not accidentally populate Today's Diary.
- Clearing the search should restore the normal History list.

### Future Enhancements

Potential future improvements:

- Search by date.
- Search by date range.
- Search by multiple terms.
- Highlight matching words in results.
- Filters by year/month.
- A "No matching entries found" state.

### Priority

Future Daily Diary enhancement.

Do not implement until the user has had sufficient time to use the current Diary V2 in normal daily use.

The basic text-search version should remain intentionally simple when eventually implemented.

## What's Up Next — Unresolved Landing Position

### Issue

When the user taps a medication period from the Dashboard's "What's Up Next" section, the application does not consistently land at the desired location.

For example, tapping Breakfast currently lands too low in the Breakfast card, with the user seeing:

- Not Logged
- Log Breakfast Medications

while the Breakfast heading and scheduled time are above the viewport.

The destination card correctly remains collapsed, but the landing position is still wrong.

### Investigation Completed

Multiple focused attempts have been made to correct the behavior:

1. Direct navigation was changed to target the actual schedule heading.
2. The heading was positioned using a deterministic top inset.
3. Delayed settle/correction passes were added.
4. Navigation-run IDs and timer cancellation were added to prevent stale navigation callbacks.
5. Real click-path testing was performed in the development environment.
6. GitHub Pages deployment was independently verified.
7. The deployed `script.js` and `index.html` were confirmed to be byte-for-byte identical to the current committed files.
8. The deployed JavaScript contains all of the latest navigation fixes.

Despite this, real-world testing on both:

- iPhone Safari
- Desktop/laptop browser

still shows the landing position too low.

### Current Status

Do NOT make additional blind adjustments to scroll offsets.

The issue is considered an unresolved UI/navigation issue rather than a deployment or stale-code problem.

The current implementation should remain unchanged until this issue is revisited.

### Future Investigation

When revisiting this issue, use a different diagnostic/implementation approach rather than another small `scrollTo()` offset adjustment.

The next investigation should focus on the actual browser/runtime behavior and compare:

- `window.scrollY`
- `visualViewport.offsetTop`
- `visualViewport.height`
- Target heading `getBoundingClientRect().top`
- Target card `getBoundingClientRect().top`
- Final viewport position after all navigation and rendering has settled

Prefer testing the actual deployed site on a real browser/device if possible.

### Potential Future Approach

Consider positioning the entire collapsed destination card rather than simply scrolling to the heading element.

Possible approach:

1. Open Medication Center.
2. Identify the destination schedule card.
3. Allow the card to finish rendering.
4. Measure its actual rendered position.
5. Position the collapsed card so its heading and scheduled time are visible near the top of the viewport.
6. Do not automatically expand the card.
7. Remove any temporary navigation state afterward.

The user should ultimately see something like:

    Breakfast
    ~8:00 AM
    ›

with the card still collapsed.

The user can then tap the Breakfast heading if they want to expand it.

### Scope

This remains a separate What's Up Next/navigation issue.

Do not combine it with:

- As-Needed Medication improvements
- Zepbound
- Daily Diary
- Medication History
- Other History landing behavior

### Priority

Deferred until a later focused investigation.

Do not spend additional development time on this issue until it is intentionally revisited.

FUTURE UI IMPROVEMENT — DASHBOARD CARD DESIGN

Redesign the dashboard module cards to improve visual hierarchy and readability.

Modules affected include:
- Nutrition
- Weight
- Exercise
- Blood Pressure
- Medication
- Daily Diary
- Other similar dashboard modules

Goals:
- Make each module title more visually prominent and easier to identify.
- Reduce the visual dominance of the large dark-blue action buttons.
- Arrange related action buttons side-by-side where appropriate instead of stacking full-width buttons.
- Establish one consistent card/button design across the dashboard.
- Consider subtle card or header styling to make each module easier to distinguish.
- Keep the overall dashboard clean, cohesive, and mobile-friendly.

Important:
- Do NOT give each individual card a different background color.
- Do NOT redesign individual cards independently; develop a consistent dashboard-wide pattern.
- Preserve all existing functionality and navigation.

This is a future UI/design project, not an immediate change.

## Future UI Idea — Modern Dashboard Card Redesign

Redesign the My Health Dashboard modules to give the app a cleaner, more modern, native-app appearance, especially on iPhone.

### Current Issue
The dashboard cards are currently dominated by large dark-blue, full-width action buttons. In some modules the buttons are stacked vertically, which makes the interface feel crowded and somewhat "cartoonish." The actual module titles, such as Nutrition, Weight, Daily Diary, Exercise, and Blood Pressure, don't have enough visual prominence.

### Desired Direction
Use a design similar to the recent iPhone mockups, particularly Options A and B.

- Make each module title much more prominent.
- Use a small, consistent icon beside each module title.
- Give each module a cleaner card structure with more whitespace.
- Reduce the visual dominance of the action buttons.
- Arrange related action buttons side-by-side where practical instead of stacking them vertically.
- Use smaller, cleaner buttons while keeping them easy to tap on an iPhone.
- Consider a subtle, consistent card/header background treatment to help distinguish modules.
- Do NOT give every module a different color.
- Maintain a consistent overall blue/neutral visual language.
- Preserve all existing functionality, navigation, data, and workflows.
- Design primarily for comfortable iPhone use while maintaining a good desktop experience.

### Examples
Exercise: [Log Exercise] [History]

Weight: [Log Weight] [History]

Nutrition: [Log Food] [History] [Goals] [Reference]

The goal is for the dashboard to feel more like a polished health app and less like a collection of large web-page buttons.

### Implementation Approach
Treat this as a future UI redesign project rather than a quick isolated CSS change. Review all dashboard modules together so the final design is consistent across the entire Home screen.
Idea: Make Medication Center expand in place

Change Medication Center navigation so tapping the Medication Center chevron expands/collapses the section in its current position rather than jumping the user to the bottom of the application. Preserve the existing close/back-to-top functionality as a secondary navigation option. Audit the current implementation before changing it, and consider whether this should become the standard expandable-section pattern across the dashboard.

### Product Goal: Move Zepbound into Medication Center and remove the Zepbound default

**Status:** Future work / deferred

**Goal:** Complete the original Zepbound architecture objective without expanding the product into support for multiple injectable medications yet.

#### 1. Move Zepbound into Medication Center
- Make Medication Center the user-facing home for Zepbound.
- The existing generic Injection Center/controller should provide the injection logging and history functionality behind that experience.
- Preserve the existing Zepbound injection history and behavior during the transition.
- Do not introduce support for additional injectable medications as part of this work.

#### 2. New users should not see Zepbound by default
- A new user with no configured medication should not see the word "Zepbound" anywhere in the application.
- The application must not silently assume or display Zepbound when no medication has been configured.
- Zepbound should appear only when it has been explicitly configured as the user's medication.
- Existing Zepbound users and their local injection history must continue to work without data loss.

**Acceptance criteria:**
- Medication Center is the primary user-facing entry point for Zepbound.
- Zepbound injection logging/history continues to work through the generic injection architecture.
- A fresh installation/user sees no Zepbound-specific UI or default medication.
- Existing Zepbound history remains readable and intact.
- No support for additional injectable medications is required at this stage; that can be considered later as a separate product decision.

## Injectable Medications — Final UI Cleanup

### Current Status

The injectable-medication functionality is working again and the shared injection controller/history architecture is intact.

The current Medication Center now places an `Injectable Medications` section immediately above `As-Needed Medications`.

The remaining work is primarily presentation and workflow cleanup. The functionality is close, but the current UI gives injectable medications too little visual prominence and creates some unnecessary duplication.

### Current UI Problems

The current Medication Center presentation has these issues:

1. `Injectable Medications` appears directly above `As-Needed Medications`, which is the correct general location, but the section has substantially less visual weight than the other medication sections.

2. The configured injectable medication currently appears as a simple bullet/list item. Although it is actionable, it does not visually communicate that it is a medication entry that can be tapped to open the injection experience.

3. The user currently has to conceptually go through:
   
   `Injectable Medications -> Zepbound`

   rather than seeing the injectable medication presented as a first-class medication entry.

4. Injectable medications may still appear redundantly inside the `Manage Medications` medication list after they have been configured. The main Medication Center should become the normal access point for configured injectable medications without creating a confusing duplicate presentation.

5. The injectable area should feel like a normal medication section, not like a secondary compatibility feature.

### Desired Final Presentation

The Medication Center should have this hierarchy:

```text
Scheduled Medications
    ordinary scheduled medications

Injectable Medications
    configured injectable medications

As-Needed Medications
    existing PRN medications

    ## Injectable Medications — Final UI and Workflow Cleanup

### Current Status

The injectable-medication functionality is working again and the existing shared injection controller, Zepbound compatibility provider, and legacy history architecture are intact.

The current Medication Center now has an `Injectable Medications` section immediately above `As-Needed Medications`.

The remaining work is primarily UI and workflow cleanup. The functionality is close, but the current presentation makes injectable medications feel secondary and introduces an extra navigation step.

### Current UI Problems

The current Medication Center has these issues:

1. The `Injectable Medications` section is immediately above `As-Needed Medications`, which is the desired general location, but it has substantially less visual weight than the other medication sections.

2. The configured injectable medication currently appears visually like a simple bullet/list item. Although it is actionable, it does not clearly communicate that the medication itself can be tapped to open the injection experience.

3. The user currently has to conceptually navigate through:

   `Injectable Medications -> Zepbound`

   before reaching the injection functionality.

   The desired behavior is that the injectable medication itself should be an obvious, directly actionable medication entry.

4. The current design has introduced an additional conceptual "Injectable Medications" layer for the user. The user has expressed concern that this means an additional tap/navigation step compared with having Zepbound directly available as a medication.

5. Zepbound may still appear in the `Manage Medications` area as a configured medication. This creates duplication between configuration and daily-use presentation.

6. The user specifically observed that an injectable medication such as Zepbound can now appear in two places:
   - under the injectable-medication area in the main Medication Center;
   - inside Manage Medications.

   The final design should make the distinction between configuration and daily use clear and should avoid unnecessary duplication.

### Desired Medication Center Hierarchy

The preferred main Medication Center hierarchy is:

    Scheduled Medications
        ordinary scheduled medications

    Injectable Medications
        configured injectable medications

    As-Needed Medications
        existing PRN medications

The `Injectable Medications` section should remain immediately above `As-Needed Medications`.

However, the section should visually feel like a first-class medication section rather than a small informational box.

### Desired Injectable Medication Presentation

When an injectable medication is configured, its actual medication name should appear directly in the Injectable Medications section.

For example:

    Injectable Medications

        Zepbound   >

The medication entry itself should be clearly tappable/actionable.

The user should NOT have to tap a generic `Injectable Medications` heading/card first and then discover another control before reaching the injection experience.

The preferred interaction is:

    Medication Center
        -> Injectable Medications
            -> Zepbound

where `Zepbound` is immediately presented as the actionable medication entry.

The visual treatment should be consistent with the existing Medication Center medication surfaces.

### Important UX Question: The Extra Injectable Layer

The introduction of the generic `Injectable Medications` section creates an additional navigation concept that did not previously exist.

The current implementation effectively adds:

    Medication Center
        -> Injectable Medications
            -> Zepbound

This may be acceptable as a generic architecture because future injectable medications could use the same section.

However, the additional layer should not become an unnecessary burden for a user who has only one configured injectable medication.

During the next cleanup phase, evaluate whether the section can remain a generic organizational heading while making the configured medication immediately prominent and actionable.

Do NOT automatically remove the generic Injectable Medications concept without considering the broader goal of making injectable medications a generic part of the application.

The goal is to balance:

- generic injectable-medication support;
- privacy and non-advertising of specific medications;
- simple daily access;
- minimal navigation;
- consistency with the existing Medication Center design.

### Configuration Workflow

The existing Manage Medications editor remains the configuration surface.

Users must still be able to manually enter and save an injectable medication through the existing medication workflow.

The application must NOT unsolicitedly advertise Zepbound or another specific injectable medication to a new user.

Do NOT restore the previously removed Zepbound suggestion/datalist mechanism.

A new user should not see Zepbound merely because the application supports injectable medications.

The existing free-text medication workflow should remain available.

When a user independently enters and saves an injectable medication, the generic injectable capability path should recognize it and place it in the Injectable Medications area.

### Manage Medications Duplication

The current implementation leaves Zepbound visible in Manage Medications after it has been configured.

This needs to be evaluated and cleaned up.

The final workflow should clearly distinguish:

    Manage Medications
        = configure, edit, or remove medications

    Medication Center
        = daily access to medications and medication-specific actions

A configured injectable medication should not unnecessarily appear as a duplicate daily-use entry in the ordinary scheduled-medication presentation.

Users must still be able to configure, edit, and remove the medication.

Do not remove the underlying configuration capability simply to eliminate visual duplication.

If the existing Manage Medications surface is the only place where the medication can be edited or removed, preserve that capability.

### History-Only Compatibility

Existing users with legacy Zepbound injection history but no current Zepbound schedule must NOT be stranded.

A history-only user must continue to have access to the existing injection history and injection functionality.

Do not automatically create a new medication schedule entry for history-only users.

Do not migrate, rename, delete, rewrite, or transform:

    zepboundInjectionHistory

The existing Zepbound compatibility provider and generic injection controller remain responsible for history persistence and injection behavior.

If a history-only compatibility entry is needed in the Injectable Medications area, it should be presented there without modifying the user's medication schedule.

### Privacy Requirements

The application must not advertise Zepbound to a new or unconfigured user.

Do NOT add:

- a Zepbound card;
- a Zepbound dashboard section;
- a Zepbound suggestion;
- a Zepbound dropdown;
- a Zepbound-specific generic Medication Center section;
- unsolicited Zepbound text outside a user-configured or history-derived context.

Zepbound should appear when the user has independently configured it or when existing legacy Zepbound history justifies preserving access.

The generic application should communicate the capability as injectable medication functionality rather than as a Zepbound-specific feature.

### Generic Capability Architecture

Continue using the existing generic capability path:

    window.medicationCenterCapabilities.isInjectableMedication(medicationName)

Medication Center must remain unaware of the Zepbound identity and legacy storage key.

Zepbound-specific identity and compatibility behavior must remain inside the Zepbound compatibility boundary.

Do not add direct comparisons such as:

    medicationName === "Zepbound"

to generic Medication Center code.

Do not introduce another capability registry.

Do not introduce medication IDs or replace the existing string-based medication schedule model.

The existing schedule representation remains:

    medications: ["Zepbound"]

### Injection Controller Ownership

Continue reusing the existing injection controller instance.

Do NOT create:

- a second controller;
- a second injection modal;
- a second history renderer;
- a second event-handler path;
- a second storage mechanism.

The existing generic injection controller remains the sole owner of:

- injection modal behavior;
- Add;
- Edit;
- Delete;
- delete confirmation;
- history rendering;
- lifecycle;
- scrolling/touch behavior.

The existing Zepbound compatibility provider remains responsible for the legacy history mapping and provider-specific behavior.

### Storage Preservation

The existing legacy history key remains:

    zepboundInjectionHistory

Do not:

- migrate it;
- rename it;
- delete it;
- duplicate it;
- rewrite its structure;
- transform its existing entries.

The existing history shape remains:

    date
    time
    dose
    site
    notes

The existing `personalMedicationSchedule` remains string-based.

No new storage mechanism is needed.

### Standalone Zepbound Card

The standalone Zepbound card has already been removed.

Do NOT restore it.

The underlying Zepbound compatibility provider, injection modal, and generic injection controller must remain because Medication Center now uses them.

The goal is to remove the standalone entry point, not the underlying functionality.

### Ordinary Medications

Ordinary medications must remain unchanged.

They should:

- remain in their normal scheduled/as-needed presentation;
- remain non-actionable unless they resolve through the generic injectable capability;
- receive no injection-specific controls;
- receive no Zepbound-specific behavior.

### Files / Scope

The next implementation should be limited to the smallest files necessary to improve:

- Injectable Medications visual prominence;
- direct medication-row interaction;
- placement immediately above As-Needed Medications;
- unnecessary duplication between daily-use presentation and Manage Medications;
- configuration/editing workflow.

Do not modify generic architecture unless a concrete implementation blocker is discovered.

Avoid changes to:

- medications.js
- injectionCenter.js
- storage.js

unless explicitly required and approved.

Do not introduce CSS architecture changes unless existing styles cannot provide the required visual treatment.

### Validation Requirements

Before considering this cleanup complete, verify all of the following.

#### 1. New / Unconfigured User

Verify:

- no Zepbound-specific text appears;
- no standalone Zepbound card exists;
- no Injectable Medications section appears;
- no injection controller is initialized;
- no injection bridge is exposed;
- no schedule data is created;
- no history data is created.

#### 2. Configured Injectable User

Using a disposable test fixture:

- configure Zepbound through the existing medication editor;
- verify it is stored as the existing medication string;
- verify it appears in Injectable Medications;
- verify the section is immediately above As-Needed Medications;
- verify Zepbound is visually prominent;
- verify Zepbound itself is directly actionable;
- verify tapping Zepbound opens the existing injection experience;
- verify Enter/Space activation where applicable;
- verify Zepbound does not remain duplicated in the ordinary scheduled-medication presentation.

#### 3. Manage Medications

Verify:

- users can still configure injectable medications;
- users can still edit injectable medications;
- users can still remove injectable medications;
- no unsolicited Zepbound suggestion or dropdown appears;
- the UI does not create unnecessary duplicate daily-use representations.

The configuration surface must not be broken merely to improve the main Medication Center presentation.

#### 4. History-Only User

Using a disposable history fixture:

- provide valid existing `zepboundInjectionHistory`;
- provide a schedule without Zepbound;
- verify Injectable Medications access remains available;
- verify the existing history renders;
- verify the injection modal opens;
- verify no new schedule entry is automatically created;
- verify the legacy history remains unchanged.

#### 5. Ordinary Medication

Verify:

- ordinary medications remain in their normal sections;
- ordinary medications remain non-actionable;
- no injection-specific UI appears for them;
- no Zepbound-specific behavior leaks into generic medication handling.

#### 6. Injection Behavior

Verify that the existing shared injection experience remains unchanged:

- same modal;
- same controller instance;
- same Add behavior;
- same Edit behavior;
- same Delete behavior;
- same confirmation;
- same history rendering;
- same persistence;
- same scrolling;
- same touch behavior.

#### 7. Storage Safety

Verify:

- no migration;
- no rename;
- no deletion;
- no history rewrite;
- no second history store;
- no schedule serialization changes.

#### 8. Architecture

Verify:

- `createInjectionController(...)` remains the sole production controller construction;
- `initialize()` remains the sole production controller initialization;
- no second capability registry exists;
- generic files contain no Zepbound-specific references;
- Medication Center continues to use the generic injectable capability resolver;
- Zepbound identity remains inside the compatibility boundary.

### Validation Commands

Run:

    git diff --check

Run VS Code diagnostics on every modified JavaScript/HTML file.

Run a generic-file search for:

    Zepbound
    zepbound
    zepboundInjectionHistory

against:

    medications.js
    medicationCenter.js
    injectionCenter.js
    storage.js

Confirm that generic files do not acquire Zepbound-specific references.

Confirm:

    git diff --name-only

contains only the files intentionally modified for this cleanup.

After runtime testing, verify the real browser profile contains no disposable test schedule or history data.

### Important Stop Point

This phase is ONLY about cleaning up the existing injectable-medication presentation and workflow.

Do NOT begin:

- multi-injectable expansion beyond the existing generic capability architecture;
- medication-model redesign;
- storage migration;
- restoration of the standalone Zepbound card;
- unrelated Medication Center redesign;
- unrelated styling cleanup;
- new injectable-specific features.

The goal is:

    Make injectable medications feel like a first-class part of Medication Center,
    make the configured injectable medication itself obvious and directly actionable,
    minimize unnecessary navigation,
    eliminate confusing duplicate presentation,
    preserve the existing Zepbound functionality and history,
    and preserve privacy for users who have not configured an injectable medication.

### Final Desired Experience

For a user who has configured Zepbound:

    Medication Center

        Scheduled Medications
            ordinary medications

        Injectable Medications
            Zepbound  -> tap directly to injection experience

        As-Needed Medications
            existing PRN medications

For a new user:

    Medication Center

        Scheduled Medications
            ordinary medications

        As-Needed Medications
            existing PRN medications

    No Zepbound
    No unsolicited injectable-specific medication name
    No injection controller
    No injection history UI

For a history-only user:

    Medication Center

        Injectable Medications
            existing injection-history access

        As-Needed Medications

    No automatic Zepbound schedule entry

This is the final cleanup direction to revisit in the next implementation phase.

## Future Idea — Generic Injectable Medication Support

### Purpose

Expand the existing Medication Center so injectable medications can be supported generically rather than being individually hard-coded.

The current implementation should remain focused on the already-supported Zepbound experience. Broader injectable support should be deferred until explicitly approved.

### Desired Future Behavior

A user should be able to configure an injectable medication through the normal Medication Center workflow.

The medication name should function primarily as the user's label for that medication, rather than exposing a specific medication as a built-in application feature.

Once an injectable medication is configured:

- it should appear in the main Medication Center under the existing `Injectable Medications` section;
- it should be directly actionable from that section;
- it should open the shared generic injection experience;
- the medication should remain editable/removable through Manage Medications;
- ordinary medications should remain unchanged;
- As-Needed medications should remain separate and below the injectable section.

### Important Privacy / Product Principle

Do not unsolicitedly advertise specific injectable medications to new users.

For example, the application should not display Zepbound, insulin, Xembify, or another medication as a suggested built-in feature simply because the application supports injectable functionality.

The medication name should become visible as a configured medication only after the user independently adds it.

### Architecture Direction

Reuse the existing generic capability path:

```js
window.medicationCenterCapabilities.isInjectableMedication(medicationName)

IDEA: Future Dashboard Card Redesign — Collapsible, Uniform Module Cards

STATUS:
Future idea — NOT approved for implementation yet.

BACKGROUND:
The current dashboard has become visually stronger as the color system has evolved, but the top of the application still feels less polished and less differentiated than the lower dashboard cards.

The current top area contains:
- Greeting / Welcome card
- Medication Center entry card
- Quick Links card

These three currently share closely related blue treatments, which makes them visually read as a family. This is not necessarily wrong, but the distinction between the three surfaces is weaker than the deliberate color differentiation used farther down the application.

A future dashboard redesign should consider making the overall dashboard more visually cohesive and polished without turning it into a "rainbow" of unrelated colors.

REFERENCE MOCKUP:
The generated mockup "Top-of-Dashboard Design Options" should be preserved as the primary visual reference for this idea.

The mockup presents three possible directions:
1. Stronger Header + neutral functional cards
2. Color accents in Quick Links
3. Soft Gradient Header + outlined Quick Links

The first option is currently the most appealing overall direction because it creates clearer hierarchy without adding excessive color.

IMPORTANT:
Do not implement the mockup literally without reviewing the existing application first. The mockup is a design reference, not an implementation specification.

FUTURE DESIGN DIRECTION — TOP OF DASHBOARD:
Consider establishing this hierarchy:

1. Greeting / Welcome
   - Strongest visual anchor at the top.
   - Clearly distinct from the cards immediately below it.
   - Should feel intentional and welcoming rather than simply being another pale-blue card.

2. Medication Center
   - Primarily a clean, neutral/white navigation card.
   - Should not simply look like a lighter version of the greeting card.
   - Existing Medication Center functionality remains unchanged.
   - The card remains a clear entry point.

3. Quick Links
   - Primarily a clean/neutral card rather than another large blue surface.
   - Individual Quick Link buttons could carry restrained accent colors.
   - Color should be useful for differentiation without becoming visually noisy.
   - Existing Quick Link labels, destinations, ordering, handlers, and accessibility must be preserved.

GENERAL VISUAL GOAL:
Create a progression such as:

Strong Greeting
    ->
Clean Navigation / Medication Center
    ->
Distinctive Quick Links
    ->
Color-coded health modules

Rather than:

Blue Greeting
    ->
Lighter Blue Medication Center
    ->
Even Lighter Blue Quick Links
    ->
Green / Purple / Teal / Red / Orange health modules

FUTURE DASHBOARD CARD MODEL:
Consider changing the individual health-module cards so they have a more uniform, compact appearance when collapsed.

Potential modules include:
- Nutrition
- Weight
- Exercise
- Blood Pressure
- Daily Diary
- Other applicable dashboard modules

COLLAPSED STATE:
Each module could become a consistent navigation-style row/card containing:

[icon] Module Name                         >

The card would use:
- consistent dimensions;
- consistent typography;
- consistent spacing;
- consistent icon treatment;
- a clear chevron/disclosure affordance;
- the module's existing accent color in a restrained way.

EXPANDED STATE:
Tapping/clicking the module would expand that card and reveal its existing:
- current information;
- logging controls;
- history controls;
- goals/reference controls where applicable;
- existing functionality.

No underlying health-data behavior should need to change merely because the presentation changes.

ALTERNATIVE — COMPACT SUMMARY STATE:
Before choosing a fully collapsed model, consider a middle-ground approach.

Instead of hiding all information, a collapsed card could show a one-line summary:

Nutrition
    0 / 1,700 kcal · 0 / 100 g protein                    >

Weight
    228 lb                                                   >

Blood Pressure
    122 / 74 · 55 bpm                                      >

Exercise
    Stationary Bike · 63 min                              >

The card would still expand when tapped to reveal the complete existing module.

ADVANTAGES OF THE COLLAPSIBLE MODEL:
- Much shorter dashboard.
- Less scrolling.
- More uniform visual language.
- Dashboard becomes easier to scan.
- Individual modules feel like organized sections rather than separate mini-applications.
- More closely resembles the polished mobile-navigation treatment shown in the mockup.
- Creates a clearer distinction between dashboard navigation and detailed module content.

TRADEOFFS:
- Adds an additional tap to access detailed information.
- Users cannot see all current module information at once.
- Frequently used information may become less immediately visible.
- Existing users may initially need to adjust to the interaction model.
- Accessibility and keyboard behavior must be carefully preserved.
- Mobile interaction needs particular attention because the iPhone is a primary use case.

DESIGN DECISION REQUIRED BEFORE IMPLEMENTATION:
Choose between:

OPTION A — FULLY COLLAPSED:
Module cards show only the module identity and chevron until opened.

OPTION B — COMPACT SUMMARY:
Module cards show the module identity plus a very small amount of useful current information, then expand to show the complete module.

OPTION B is currently considered the more conservative and potentially more usable direction, but no decision has been made.

SCOPE WARNING:
This should be treated as a MEDIUM/LARGE future UI project, not a small styling change.

Potentially affected files could include:
- index.html
- script.js
- styles.css

The exact files must be determined only after inspecting the existing implementation.

DO NOT:
- change medication data structures;
- change storage;
- change health-history formats;
- change injection/Zepbound architecture;
- introduce duplicate controllers;
- alter existing logging/history functionality unnecessarily;
- implement the mockup literally without first determining how the current application is structured.

PRESERVATION REQUIREMENTS:
Any future implementation must preserve:
- existing data;
- existing localStorage behavior;
- existing logging functionality;
- existing history functionality;
- existing navigation;
- existing accessibility;
- existing mobile behavior;
- existing module-specific colors where appropriate;
- existing Medication Center and Injectable Medication functionality.

CURRENT DECISION:
Do NOT implement this redesign now.

Continue with the current application and address the top-of-dashboard color hierarchy separately.

The mockup is retained as inspiration/reference material for a future dashboard redesign.

FUTURE VALIDATION:
Any future implementation should be tested at minimum on:
- desktop browser;
- iPhone-sized viewport;
- expanded and collapsed states;
- keyboard interaction where applicable;
- touch interaction;
- long-page scrolling;
- existing module functionality;
- accessibility semantics;
- no horizontal overflow.

FINAL FUTURE STOP POINT:
Do not continue into additional dashboard redesign work after the agreed card model and visual hierarchy have been implemented and validated.

Create a separate follow-up idea for any additional redesign discovered afterward rather than expanding the scope of the original implementation.

IDEA — Personalize Dashboard Greeting from Personal Profile

Current behavior:

The dashboard greeting currently uses a hardcoded first name:

- Good morning, John
- Good afternoon, John
- Good evening, John

Future behavior:

The greeting should obtain the user's first name from the Personal Profile rather than having the name hardcoded in the application.

Personal Profile should eventually contain a First Name field, and the dashboard greeting should dynamically use that value.

Examples:

- First Name = John → Good morning, John
- First Name = Mary → Good afternoon, Mary
- First Name = Alex → Good evening, Alex

The same first-name value should be used regardless of the time-of-day greeting.

Fallback behavior:

If no first name has been entered, the application should display a sensible greeting without a blank or undefined name.

For example:

- Good morning
- Good afternoon
- Good evening

Design intent:

The dashboard should obtain identity information from Personal Profile rather than embedding a specific person's name in the application code.

This should be a relatively small, self-contained enhancement once the Personal Profile structure is established.

Preserve the existing:

- time-of-day greeting logic;
- greeting layout and styling;
- Personal Profile storage architecture;
- existing dashboard behavior.

Do not undertake the larger Personal Profile redesign as part of this idea.

Suggested future implementation:

1. Add a First Name field to Personal Profile.
2. Store it using the established Personal Profile mechanism.
3. Update the dashboard greeting to read the first name dynamically.
4. Provide the no-name fallback.
5. Verify desktop and iPhone behavior.

Status: Ideas backlog — future enhancement.