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