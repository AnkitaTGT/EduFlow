## 2024-05-17 - Added Form Labels and ARIA properties to Login
**Learning:** Found that the login form in `eduflow/app/login/page.tsx` lacked `<label>` elements for inputs, making it difficult for screen readers and reducing click targets. Also added `aria-invalid` and `aria-describedby` for validation errors. This pattern might be missing in other forms across the app.
**Action:** When adding new forms or inputs, always ensure `<label>` is associated via `htmlFor`, and use `aria-invalid`/`aria-describedby` to link validation errors for screen readers.
