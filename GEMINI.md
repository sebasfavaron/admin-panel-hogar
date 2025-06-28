# Gemini Project Rules

- Always check tsc for errors after a code change
- After any significant change, update this `GEMINI.md` file to reflect learnings or new best practices. Also remove any rules that no longer apply or haven't made a big difference in a while

## Learnings from Removing Role-Based Permissions:

- **Cascading Effects of Core Feature Removal:** Removing a core feature (like role-based permissions) can have widespread impacts across both frontend and backend, leading to numerous related errors.
- **Importance of `tsc` for Error Resolution:** Running `tsc` frequently is crucial for identifying and resolving TypeScript errors, especially after significant code changes.
- **Precision with `replace` Tool:** The `replace` tool requires highly precise `old_string` values, including surrounding context, to ensure accurate modifications and prevent failures.
- **Managing Deleted/Recreated Files:** When a file is deleted and later found to be necessary (even in a modified form), it must be carefully recreated, ensuring all necessary imports and exports are correctly handled.
- **Updating Type Declarations:** Modifying middleware that adds properties to the `Express.Request` object (or similar global objects) requires updating or creating global type declarations to avoid TypeScript errors.
