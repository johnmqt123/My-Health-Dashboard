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


### Medication Center – Redesign Edit & Notes Workflow (High Priority)

**Problem**

The current Edit and Notes workflow is unintuitive on iPhone.

Current behavior requires the user to:
- Tap Edit or Notes.
- Scroll to another location on the page.
- Make changes.
- Scroll back to continue using the Medication Center.

This creates unnecessary movement and makes the interface feel clunky.

**Goals**

- Eliminate unnecessary scrolling.
- Keep the editing interface with the meal being edited.
- Make Edit and Notes feel immediate and intuitive.
- Reduce taps and page movement.
- Improve the daily medication logging experience.

**Recommended Design**

When the user taps **Edit** or **Notes** for Breakfast, Lunch, Dinner, or Bedtime:

- Display the editing interface immediately below that meal section, **or**
- Open an iPhone-style modal sheet dedicated to that meal.

The user should never have to search the page for the editing controls.

**Notes**

The current Notes workflow has the same usability problem as Edit and should be redesigned at the same time.

Edit and Notes should follow the same interaction model and remain visually connected to the meal being edited.

**Possible Future Enhancement**

Evaluate combining Edit and Notes into a single **Manage** button that opens one interface for:
- Editing medications
- Adding or removing medications
- Editing meal notes

This would simplify the interface and reduce user confusion.

**Priority:** High

**Reason**

Medication logging is one of the app's primary daily workflows. Improving this interaction will significantly improve the overall user experience.

### Medication Center – Medication Notes Architecture (Phase 2)

**Design Principle**

Medication notes should be attached to a **specific medication log event**, not to the medication definition itself.

The medication record defines what should be taken.

The medication log records what actually happened on a particular date and time.

The note belongs to that log event.

---

### Example

Wake Up

- Pantoprazole
- Metoprolol
- Hydrochlorothiazide

[Log Medication]

↓

Medication log created:

- Date
- Time
- Medications logged
- Optional note

Example note:

> "Took medications 30 minutes late due to oversleeping."

The following day's medication log should have its own independent note (or no note at all).

---

### Medication Center UI

Within each expanded medication section:

- Log Medication
- Edit Medications
- Add Note

Rename **Edit Notes** to **Add Note** because, in most cases, no note exists yet.

If a note already exists for the current medication log, the button may dynamically change to:

- Edit Note

or

- View / Edit Note

---

### History Integration

Medication History should display:

- Date
- Time
- Medications logged
- Associated note (if present)

Editing a historical medication log should allow:

- Editing the note for that specific log event.
- Correcting the logged time (if appropriate).
- Future consideration: correcting medications included in that log entry.

The note should remain permanently associated with that historical medication event.

---

### Design Principle

Medication definitions are long-term records.

Medication notes are short-term observations about a specific medication event.

Never store daily notes on the medication definition itself.

Store them with the medication log history.

### Shared History Framework – Expand/Collapse Interaction Standard

**Design Principle**

All History modules should use a consistent accordion-style interaction.

Applicable to:

- Weight History
- Blood Pressure History
- Exercise History
- Medication History
- Zepbound History
- Nutrition History (future)

---

### Default View

Display a compact, scrollable list of history entries.

Each entry shows only summary information such as:

- Date
- Time
- Primary value(s)

Examples:

- Blood Pressure: 126/78 • Pulse 64
- Weight: 228.4 lbs
- Exercise: Stationary Bike • 63 minutes
- Medication: Wake Up medications logged

No Edit or Delete buttons should be visible by default.

---

### Expand Behavior

Tapping a history entry expands only that entry.

The expanded view displays:

- Complete details
- Optional notes
- Small side-by-side action buttons:

[ Edit ]   [ Delete ]

The buttons should never span the full width of the screen.

---

### Collapse Behavior

Tapping the expanded history entry again collapses it.

No separate detail page or Back button should be required.

This keeps users in the history list while minimizing scrolling and unnecessary navigation.

---

### Shared UI Standard

This expand/collapse pattern should become the standard interaction model for every History module throughout John's Assistant.

Benefits:

- Cleaner interface
- Less scrolling
- Faster editing
- Consistent behavior across all modules
- Reduced visual clutter

### Shared UI Theme – Professional Color Palette

**Design Principle**

John's Assistant should use a professional, modern color palette rather than pastel colors.

Avoid light pastel blues and pinks for action buttons.

---

### Primary Actions

Examples:

- Log Medication
- Save
- Add Entry
- Continue

Style:

- Dark blue
- White text

---

### Secondary Actions

Examples:

- Edit
- View
- Cancel

Style:

- White or light neutral background
- Dark blue border
- Dark blue text

---

### Destructive Actions

Examples:

- Delete
- Remove Entry
- Reset

Style:

- White background
- Red border
- Red text

Avoid solid pastel pink buttons.

---

### Shared Design Goal

All modules should use the same color language so users immediately recognize:

- Blue = Primary action
- Gray/White = Secondary action
- Red = Destructive action
- Green = Success
- Yellow = Warning

This creates a more professional appearance while improving usability and consistency throughout John's Assistant.

## Weight History Cleanup

### Phase 1

- [ ] Group history entries by month
- [ ] Remove year from individual entries
- [ ] Remove time from history rows
- [ ] Remove Edit button from history rows
- [ ] Remove Delete button from history rows
- [ ] Make entire history row tappable
- [ ] Add chevron to each history row
- [ ] Add tap highlight animation
- [ ] Enable unlimited scrolling

### Phase 2

- [ ] Create Weight Detail screen
- [ ] Display weight, date, time, and notes
- [ ] Add Edit button
- [ ] Add Delete button

### Phase 3

- [ ] Create Edit Weight screen
- [ ] Save changes
- [ ] Delete entry