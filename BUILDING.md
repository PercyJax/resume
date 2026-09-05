# Building your resumes

This repo turns Markdown resumes into print-ready, ATS-friendly PDFs using a
small Node script (`build.mjs`) plus Chromium headless.

## How it works

1. `build.mjs` builds only the master `resume.md` and the `*.md` files inside
   the whitelisted directories `resumes/` and `covers/`. Anything else
   (`applications/`, notes, scratch) is never picked up.
2. Files under `covers/` are rendered as **cover letters**; everything else is
   rendered as a **resume**. The directory decides, no frontmatter needed.
3. Each resume file is parsed into a structured model (contact block, job
   entries, skills, education) and rendered into a styled HTML page.
4. Chromium headless converts the HTML to a PDF.
5. Output lands in `build/<source-name>.html` and `build/<source-name>.pdf`.
6. `resume.md` (the master resume) is copied to `README.md` so the repo home
   page shows the resume instead of build instructions.

## Requirements

- Node.js 18+ (or any version with global `fetch`/`fs/promises`; this script
  uses synchronous `fs` APIs only)
- Chromium on your `PATH` (used: `chromium --headless --print-to-pdf`). The
  binary can be overridden with `CHROME_BIN` (e.g.
  `CHROME_BIN=google-chrome-stable node build.mjs`), which CI relies on.

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
| `covers/` | Job-specific cover letters (not committed, gitignored) |
| `applications/` | Application question drafts per employer (not committed, gitignored, not built) |
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
- **Contact:** one item per paragraph (blank-line separated) right after the
  name, before the first `##` heading. Each contact item may be a location,
  phone number, email, or LinkedIn URL.
- **Jobs:** `**Job Title | Location**` as its own paragraph, a blank line, then
  each `_Role | Dates_` line as its own paragraph, then `-` bullets with
  optional `  -` sub-bullets. A single company can list several roles as
  separate paragraphs.
- **Education:** `**School | Location**`, `_Degree | Dates_`, optional GPA
  bullet. Grouped into each school until the next bold line.
- **Skills:** bullets of `**Label:** value`, rendered as labeled rows.

## Cover letters

Files in `covers/` are rendered as letters (not resumes). Their format is the
same header plus paragraphs:

```markdown
# Your Name

Location

you@example.com

linkedin.com/in/you

## September 5, 2026

Dear Hiring Team,

Paragraph one.

Paragraph two.

Best regards,

Your Name
```

- The `##` line right after the contact block becomes the date line.
- Everything else is one `<p>` per blank-line-separated paragraph.
- Sign-offs starting with "Sincerely"/"Best"/"Regards"/"Yours" get extra
  spacing, and the signature paragraph gets a bold class.

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

## GitHub Actions

`.github/workflows/build-resume.yml` auto-builds on every push that touches
`resume.md`, `build.mjs`, or `styles.css` (plus manual `workflow_dispatch`):

1. Checkout, Node 20, Google Chrome (`CHROME_BIN`), and Fira Sans/Noto Color
   Emoji fonts (for layout parity) are set up on `ubuntu-latest`.
2. `node build.mjs resume.md` builds only the master resume.
3. `build/resume.pdf` is uploaded as a `resume-pdf` artifact, labeled by run.

Artifacts are versioned per workflow run. A prune step deletes every prior
`resume-pdf` artifact after upload, so effectively only the latest is kept.
`retention-days: 30` bounds storage as a fallback.

## Privacy

- `/build/`, `/resumes/`, `/covers/`, and `/applications/` are gitignored.
- `build.mjs`, `styles.css`, and `.gitignore` contain no personal or
  job-application details and are safe to publish.