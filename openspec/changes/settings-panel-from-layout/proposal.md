# Settings Panel From Layout

## What
Rework the existing settings drawer into a structured settings panel that reflects the app's current page composition instead of presenting a single tone selector.

The new panel will organize the available settings into clear sections:
- task classification thresholds
- label copy for the task buckets
- coaching tone

## Why
Right now, the settings UI hides most of the available configuration behind one tone dropdown, even though the data model already supports task thresholds and custom labels. That makes the panel feel disconnected from the rest of the app and harder to scan.

This change will:
- make the configuration surface match the app's information structure
- expose the settings that already exist in the data model
- improve clarity for users who want to tune how the task list is grouped and labeled
- keep the same save flow, but with a more understandable layout

## Success Criteria
- The settings panel is broken into readable sections instead of a single flat form.
- Existing settings fields are visible and editable in the UI.
- Saving settings still updates the app state and closes the panel.
- The layout works on both desktop and mobile sizes.

## Non-Goals
- Redesigning the rest of the app shell
- Adding new settings beyond the fields already supported by the model
- Changing storage format or backend behavior
