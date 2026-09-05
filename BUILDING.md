# Building your resumes

This repo turns Markdown resumes into print-ready, ATS-friendly PDFs using a
small Node script (`build.mjs`) plus Chromium headless.

## How it works

1. `build.mjs` discovers every `*.md` file under the repo root, skipping
   `.git/`, `node_modules/`, `build/`, and the documentation files
   (`README.md`, `BUILDING.md`).
2. Each resume file is parsed into a structured model (contact block, job
   entries, skills, education) and rendered into a styled HTML page.
3. Chromium headless converts the HTML to a PDF.
4. Output lands in `build/<source-name>.html` and `build/<source-name>.pdf`.
5. `resume.md` (the master resume) is copied to `README.md` so the repo home
   page shows the resume instead of build instructions.

## Requirements

- Node.js 18+ (or any version with global `fetch`/`fs/promises`; this script
  uses synchronous `fs` APIs only)
- Chromium on your `PATH` (used: `chromium --headless --print-to-pdf`)

## Rebuild everything

```sh
node build.mjs
```

## Rebuild specific files

```sh
node build.mjs resume.md
node build.mjs resumes/resume_tailscale_strategic.md
```

## File layout

| Path | Purpose |
| --- | --- |
| `build.mjs` | The build script (safe to publish; no personal/job data) |
| `styles.css` | Shared page styling (fonts, colors, spacing, print rules) |
| `resume.md` | Master resume; source of truth for `README.md` |
| `resumes/` | Job-specific resume variants (not committed, gitignored) |
| `build/` | Generated HTML/PDF output (gitignored) |
| `README.md` | Auto-generated copy of `resume.md`; what GitHub shows first |

## Markdown format

Resumes are plain Markdown with a few conventions:

```markdown
# Your Name

Location
(555) 123-4567
you@example.com
linkedin.com/in/you

## Summary

One-paragraph summary.

## Professional Experience

**Employer | Remote**
_Job Title | Jan 2020 - Dec 2023_
- An achievement
  - A sub-bullet under that achievement

## Technical Skills

- **Languages:** Rust, Go
- **Networking:** ...

## Education

**University | City**
_Degree | Year_
- GPA
```

Conventions:

- **Name:** first line, `# Name`.
- **Contact:** one item per line right after the name (each may carry a
  location, phone, email, or LinkedIn URL). No delimiter needed.
- **Jobs:** `**Job Title | Location**`, followed by a `_Role | Dates_` line,
  then `-` bullets with optional `  -` sub-bullets.
- **Education:** `**School | Location**`, `_Degree | Dates_`, optional GPA
  bullet. Grouped into each school until the next bold line.
- **Skills:** bullets of `**Label:** value`, rendered as labeled rows.

## Per-file configuration

Optional YAML frontmatter at the top of any resume file controls its build:

```markdown
---
title: Percy Yeung - Strategic Projects   # overrides the HTML <title>
name: strategic                          # overrides the output filename
accent: "#2f6fed"                        # accent color (any CSS color)
base_size: "10.5pt"                      # base font size
name_size: "25pt"                        # name size
extra_css: |
  /* anything else, appended as-is */
---
```

Frontmatter is stripped before parsing, so it never leaks into the output.

## Tuning the look

- Global styling lives in `styles.css` (colors, fonts, margins, print rules).
- Per-file tweaks go in frontmatter (`accent`, `base_size`, etc.).
- Page count is controlled by font size / margins, not by forcing breaks.
  Keep `@page` margins and font sizes where they are and the content flows to
  a clean 2 pages.

## ATS notes

- Section headings keep normal letter-spacing so `pdftotext` extraction stays
  clean.
- Contact items are plain text (JSON-safe); icons are `aria-hidden`.
- PDFs are text-selectable (generated from real text, not images).

## Privacy

- `/build/` and `/resumes/` are gitignored.
- `build.mjs`, `styles.css`, and `.gitignore` contain no personal or
  job-application details and are safe to publish.