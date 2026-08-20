# Dashboard UI Mockups

This document records dashboard UI mockups as future design references. The images remain in `docs/DESIGN/mockups/`; this document describes the design ideas shown in them and does not prescribe an immediate implementation.

---

## Scope

The four dashboard-specific references are:

- `dashboard-current.png`
- `dashboard-design-comparison.png`
- `dashboard-option-a.png`
- `dashboard-option-b.png`

`Johns Assistant Mockups.png` is a combined presentation sheet and is not treated as a separate dashboard direction here.

---

## `dashboard-current.png`

### Overall Visual Approach

This is the current dashboard direction: a bright white surface, a dark navy application header, and a row of uniformly styled white cards. The interface is functional and organized, but its repeated full-width dark-blue controls give the modules a more web-form-like feel than a native app feel.

### Card and Title Treatment

Cards are white with soft corners, light borders or shadows, and mostly dark navy titles. The title sits at the top of each card with a small icon, while the module content and actions are placed below. The cards share a common visual treatment, but the titles do not strongly distinguish the different health modules.

### Button Arrangement

Most actions use large dark-blue buttons. Nutrition has four stacked actions; Weight, Exercise, Blood Pressure, and Daily Diary use vertically stacked action buttons; Medication Center has two side-by-side buttons.

### Icons, Spacing, Borders, Typography, and Color

Icons are present in titles and button labels, but the dark-blue buttons dominate the visual hierarchy. Spacing between cards is clean and generous. Rounded cards, subtle shadowing, and white backgrounds create separation, but button color is used heavily across all modules. Typography is clear but comparatively uniform, with limited title-level emphasis beyond size and weight.

### Why a Future Direction Would Feel More Polished

The current layout is readable and touch-friendly, but the repeated dark-blue full-width buttons create visual weight and make unrelated modules look alike. More selective color, stronger title hierarchy, and action groupings would make the dashboard feel more deliberate, calmer, and closer to a cohesive mobile app.

---

## `dashboard-design-comparison.png`

### Overall Visual Approach

This comparison sheet presents the current dashboard alongside two future directions. It makes the intended progression explicit: retain the existing dashboard structure while reducing action-button dominance, introducing clearer module identities, and tightening the visual system.

### Card and Title Treatment

The comparison contrasts the current modest title treatment with two stronger approaches:

- **Option A - Clean & Modern:** bold, uppercase, color-coded module titles with matching circular icons.
- **Option B - Subtle Accent:** prominent color-coded titles with softer title casing, matching icons, and gentle tinted card backgrounds.

Both future directions make a card's purpose recognizable before the user reads its detail text or actions.

### Button Arrangement

Option A and Option B place paired actions side-by-side where practical, especially for Log and History actions. Nutrition uses a compact two-by-two action grid. This reduces vertical length and lets users scan related choices as a group.

### Icons, Spacing, Borders, Typography, and Color

The sheet uses familiar module icons, generous white space, gentle card separation, and distinct accent colors for Nutrition, Weight, Exercise, Blood Pressure, Daily Diary, and Medications. Option A relies on clean white cards with outlined accent buttons. Option B adds restrained tinted backgrounds to reinforce module identity without requiring dark filled controls.

### Why a Future Direction Would Feel More Polished

The comparison shows how consistent colored titles, compact action groups, and outlined buttons create hierarchy without overwhelming the screen. The card grid looks more intentional and app-like because each module has a stable identity while still following one shared layout system.

---

## `dashboard-option-a.png`

### Overall Visual Approach

Option A is the cleanest, highest-contrast modern direction. It keeps a white dashboard and card surfaces, then assigns each module a clear accent color. The design feels structured and efficient rather than decorative.

### Card and Title Treatment

Each card has a large, bold, uppercase module title paired with a circular colored icon. Supporting text is compact and sits below the title. The title and icon establish the card's purpose immediately, while white space keeps the content uncluttered.

### Button Arrangement

Related actions are arranged side-by-side in two-column groups when practical:

- Nutrition: Log Food, History, Goals, and Reference form a compact grid.
- Weight, Exercise, Blood Pressure, and Daily Diary: primary action and History are paired.
- Medications: All Medications and Medication History are paired.

The buttons are outlined with the module accent color rather than filled dark navy. They remain clear touch targets while taking less visual precedence than the card title.

### Icons, Spacing, Borders, Typography, and Color

The module icon appears in a solid circular accent badge. Accent colors are distinctive but controlled: green for Nutrition, purple for Weight, teal for Exercise, red for Blood Pressure, orange for Daily Diary, and blue for Medications. Cards use modest rounded corners, faint borders or shadows, balanced padding, and strong title typography. The layout has generous module separation without excessive decoration.

### Why a Future Direction Would Feel More Polished

Option A replaces a single global action-button color with meaningful module identity. The prominent titles, consistent two-column actions, and restrained outlines make the dashboard easier to scan and more like a purpose-built iPhone app. It preserves usability while reducing the heavy visual density of full-width navy buttons.

---

## `dashboard-option-b.png`

### Overall Visual Approach

Option B uses the same modern structure as Option A but softens it with subtle module-tinted card backgrounds. It is a gentler, more expressive iPhone-style direction while remaining readable and organized.

### Card and Title Treatment

Titles are prominent, compact, and color-coded, using title case rather than the all-uppercase style of Option A. Each title is paired with a matching colored icon badge. The supporting description remains concise, allowing the card to communicate its purpose without looking crowded.

### Button Arrangement

Buttons use the same practical side-by-side grouping as Option A. Paired Log and History controls sit together, while Nutrition uses a two-by-two action grid. The arrangement reduces scrolling and makes commonly related actions easy to compare and tap.

### Icons, Spacing, Borders, Typography, and Color

Cards have pale, restrained color washes matched to their module accent. Buttons are white or near-white with colored outlines and matching icons. Borders, gaps, and padding clearly separate each module. Typography is slightly softer than Option A, with the colored title carrying the primary hierarchy rather than heavy all-caps lettering.

### Why a Future Direction Would Feel More Polished

Option B adds personality and visual grouping without returning to large solid-color buttons. The tinted modules make the dashboard easier to scan, while its common card geometry and button system keep it cohesive. It feels more contemporary and less like a collection of generic panels.

---

# Preferred Direction

The current preferred direction is the cleaner, more modern iPhone-style approach represented by the strongest Option A and Option B concepts.

Future dashboard work should favor:

- Prominent but compact card titles paired with meaningful module icons.
- Buttons arranged side-by-side when practical, especially for related primary and history actions.
- Restrained use of accent color instead of repeated large dark-blue filled buttons.
- Clear visual separation between modules through spacing, card boundaries, and consistent action groups.
- Less dependence on large dark-blue full-width buttons.
- Consistent styling across all dashboard modules, even when each module has its own accent color and icon.

Option A is the best baseline for its clarity, strong hierarchy, and minimal white-card presentation. Option B is a useful secondary reference when subtle tinted backgrounds improve module recognition without reducing readability. The final implementation may combine the clean structure of Option A with the gentle visual warmth of Option B, provided the dashboard remains calm, touch-friendly, and consistent.
