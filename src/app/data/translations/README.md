Bilingual translations

Place two files per page in this folder using the pattern:

- `pagename-english.json`
- `pagename-bangla.json`

Example: `navbar-english.json` and `navbar-bangla.json`.

Each JSON should export a flat map of string keys used by components, for example:

{
"home": "Home",
"courses": "Courses"
}

In components you can use the `useLanguage` hook:

import { useLanguage } from '@/app/context/LanguageContext';

const { t, isBangla, toggleLanguage } = useLanguage();

Then reference keys like `t.courses` (it will fallback to default English/Bangla provided by the context while JSON is loading).

Theme colors

The `ThemeContext` exposes CSS variables you can use in your styles:

--color-primary ( #f3066e )
--color-secondary ( #204186 )
--color-accent ( #ffc500 )
--color-background
--color-foreground
--color-card
--color-border

You can use these variables in CSS or inline styles: `color: var(--color-primary)` or `background: var(--color-primary)`.

To add translations for a new page, create both JSON files and include all keys your component expects. Update the components to read from `t.<key>`.
