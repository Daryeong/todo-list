# Design

## Overview
The current app already has a slide-over settings panel, so this change keeps the same interaction pattern and updates the content structure inside it.

The design goal is to make the settings feel like they belong to the page, not like a separate admin dialog. The panel should mirror the app's organization:
- how tasks are classified
- how those groups are labeled
- how the coaching voice sounds

## Panel Structure
The panel will be divided into three sections.

### 1. Classification Rules
This section will expose the threshold-based task grouping controls already present in the settings model.

It should include:
- numeric inputs for threshold values
- a short description of how each threshold affects the task list
- validation that keeps cleared fields from turning into `NaN`

### 2. Label Copy
This section will let users rename the visible bucket labels for the main task list.

It should include:
- text inputs for the labels
- a compact helper line explaining where the labels appear in the app
- sensible defaults from `createDefaultSettings()`

### 3. Coach Tone
This section will keep the tone selector, but give it equal visual weight with the other settings rather than making it the only visible control.

It should include:
- the tone dropdown
- a short preview or hint copy so users understand the tone choice

## Interaction Model
The panel stays modal and side-docked on desktop. On mobile, it should expand to a full-height sheet, matching the existing responsive behavior.

Save behavior stays the same:
- edits are made in a local draft state
- clicking Save commits the draft through `onSave`
- clicking Close dismisses the panel without persisting draft changes

## Implementation Notes
- Keep the settings surface aligned with the existing `Settings` type rather than introducing a new model.
- Reuse the existing overlay and side-panel structure so the change stays consistent with the rest of the app.
- Keep form controls accessible with explicit labels and predictable keyboard navigation.
- Preserve the current "save and close" flow from `App.tsx`.

## Testing
The tests should cover:
- changing a numeric threshold and saving it
- clearing a numeric field and ensuring it is normalized safely
- editing one of the label fields
- changing tone and saving
- canceling without saving

## Risks
- The current settings UI only exposes tone, so expanding it may require small CSS adjustments to fit more fields cleanly.
- If the panel becomes too tall on smaller screens, the mobile sheet needs careful spacing and scrolling behavior.
