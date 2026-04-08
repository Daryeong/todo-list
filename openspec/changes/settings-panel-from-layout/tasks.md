# Tasks

1. [x] Update `SettingsPanel` to use a sectioned layout.
   - Add a section for classification thresholds.
   - Add a section for label copy.
   - Keep tone selection as its own section.
   - Preserve local draft state and the existing save/close actions.

2. [x] Wire the full `Settings` model into the form.
   - Add inputs for the numeric threshold fields.
   - Add inputs for the label text fields.
   - Keep default values and field updates safe when inputs are cleared.

3. [x] Refresh panel styling in `index.css`.
   - Create section spacing and visual grouping.
   - Make the panel readable with the extra fields.
   - Preserve the current desktop side-sheet and mobile full-screen behavior.

4. [x] Update or add tests for the new settings form behavior.
   - Verify numeric fields normalize safely.
   - Verify label edits persist through save.
   - Verify tone changes still work.
   - Verify cancel does not persist draft changes.

5. Run verification.
   - Run the test suite.
   - Run the production build.
   - Fix any regressions before marking the change ready.
