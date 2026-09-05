#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync, readdirSync, existsSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const STYLES = readFileSync(join(ROOT, "styles.css"), "utf8");

const SKIP_DIRS = new Set([".git", "node_modules", "build"]);
const SKIP_MD = new Set(["README.md", "BUILDING.md"]);

function isMd(file) {
  return extname(file) === ".md" && readFileSync(file, "utf8").trim();
}

function discoverMd(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...discoverMd(full));
    else if (entry.isFile() && extname(entry.name) === ".md" && !SKIP_MD.has(entry.name)) out.push(full);
  }
  return out;
}

const args = process.argv.slice(2).map((p) => join(ROOT, p));
const sources = (args.length ? args : discoverMd(ROOT)).filter(isMd);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function parseFrontmatter(lines) {
  const overrides = {};
  if (lines[0].trim() === "---") {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    const block = end === -1 ? lines.slice(1) : lines.slice(1, end);
    for (const line of block) {
      const m = line.match(/^(\w+)\s*:\s*(.*)$/);
      if (m) overrides[m[1].trim()] = m[2].trim();
    }
    return { overrides, consumed: end === -1 ? lines.length : end + 1 };
  }
  return { overrides, consumed: 0 };
}

function parse(md) {
  const lines = md.split("\n");
  let name = "";
  let contact = [];
  let i = 0;

  if (lines[0].startsWith("# ")) {
    name = lines[0].slice(2).trim();
    i = 1;
  }
  while (i < lines.length && !lines[i].trim()) i++;
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith("## ")) break;
    contact.push(t);
  }

  const sections = [];
  let current = null;
  let curJob = null;
  let lastItem = null;

  const closeJob = () => {
    curJob = null;
    lastItem = null;
  };

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    if (!t) continue;

    if (t.startsWith("## ")) {
      closeJob();
      current = { title: t.slice(3).trim(), blocks: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;

    const isEducation = current.title === "Education";

    const jobMatch = t.match(/^\*\*(.+?)\*\* \| (.+)$/);
    const roleMatch = t.match(/^_(.+?)_ \| (.+)$/);
    const bulletKind = raw.startsWith("  - ")
      ? "sub"
      : raw.startsWith("- ")
        ? "main"
        : null;

    if (isEducation) {
      if (jobMatch) {
        current.blocks.push({ kind: "edu-row", company: jobMatch[1], meta: jobMatch[2] });
      } else if (roleMatch) {
        current.blocks.push({ kind: "edu-degree", degree: roleMatch[1], dates: roleMatch[2] });
      } else if (bulletKind) {
        current.blocks.push({ kind: "edu-gpa", text: inline(t.replace(/^-\s*/, "")) });
      }
      continue;
    }

    if (jobMatch) {
      closeJob();
      curJob = { kind: "job", company: jobMatch[1], location: jobMatch[2], children: [] };
      current.blocks.push(curJob);
      continue;
    }

    if (roleMatch) {
      if (curJob) curJob.children.push({ kind: "role", text: roleMatch[1], meta: roleMatch[2] });
      continue;
    }

    const noDash = (s) => s.replace(/^-\s*/, "");

    if (bulletKind === "sub" && curJob && lastItem) {
      lastItem.sub.push({ kind: "sub", text: inline(noDash(t)) });
      continue;
    }
    if (bulletKind === "main" && curJob) {
      lastItem = { kind: "item", text: inline(noDash(t)), sub: [] };
      curJob.children.push(lastItem);
      continue;
    }
    if (bulletKind === "main" && !curJob) {
      lastItem = { kind: "item", text: inline(noDash(t)), sub: [] };
      current.blocks.push({ kind: "loose-item", items: [lastItem] });
      continue;
    }

    current.blocks.push({ kind: "para", text: inline(t) });
  }

  return { name, contact, sections };
}

const SECTION_ICONS = {
  Summary: "\u{1F4DC}",
  "Professional Experience": "\u{1F4BC}",
  "Technical Skills": "\u{1F527}",
  Education: "\u{1F393}",
};

const CONTACT_DEFS = {
  location: { icon: "\u{1F4CD}" },
  phone: { icon: "\u{1F4DE}" },
  email: { icon: "\u2709\uFE0F" },
  linkedin: { icon: "svg" },
};

const LINKEDIN_SVG =
  '<svg class="icon" width="8.5" height="8.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" fill="currentColor"/></svg>';

function classifyContactLine(line) {
  const low = line.toLowerCase();
  if (low.includes("@")) return "email";
  if (low.includes("linkedin.com")) return "linkedin";
  if (/\d/.test(line)) return "phone";
  return "location";
}

function renderContact(contactLines) {
  const items = contactLines.map((line, i) => {
    const kind = classifyContactLine(line);
    if (kind === "linkedin") {
      const href = /^https?:\/\//i.test(line) ? line : `https://${line}`;
      return ["linkedin", line, href];
    }
    return [kind, line];
  });
  return items
    .map(([kind, text, href], idx) => {
      const def = CONTACT_DEFS[kind];
      const icon =
        def.icon === "svg"
          ? LINKEDIN_SVG
          : `<span class="icon" aria-hidden="true">${def.icon}</span>`;
      const label = href ? `<a href="${href}">${icon}${esc(text)}</a>` : `${icon}${esc(text)}`;
      const sep = idx < items.length - 1 ? `<span class="sep">&bull;</span>` : "";
      return `<span class="item">${label}</span>${sep}`;
    })
    .join("\n");
}

function render({ name, contact, sections }) {
  const parts = [];
  parts.push(`<header>
    <div class="name">${esc(name)}</div>
    <div class="contact">${renderContact(contact)}</div>
  </header>`);

  for (const sec of sections) {
    const cls = sec.title === "Summary" ? ' class="summary"' : "";
    const icon = SECTION_ICONS[sec.title];
    const h2icon = icon ? `<span class="sicon" aria-hidden="true">${icon}</span>` : "";
    parts.push(`  <section${cls}>
    <h2>${h2icon}${esc(sec.title)}</h2>`);

    if (sec.title === "Technical Skills") {
      parts.push(`    <ul class="skills">`);
      for (const b of sec.blocks) {
        if (b.kind === "loose-item") {
          for (const it of b.items) {
            const m = it.text.match(/^<strong>(.+?):<\/strong>\s?(.*)$/);
            if (m) {
              parts.push(`      <li><span class="label">${m[1]}:</span> ${m[2]}</li>`);
            } else {
              parts.push(`      <li>${it.text}</li>`);
            }
          }
        }
      }
      parts.push(`    </ul>`);
      parts.push(`  </section>`);
      continue;
    }

    if (sec.title === "Professional Experience") {
      for (const b of sec.blocks) {
        if (b.kind === "job") {
          parts.push(`    <div class="job">
      <div class="job-title"><span>${esc(b.company)} | ${esc(b.location)}</span></div>`);
          for (const c of b.children) {
            if (c.kind === "role") {
              parts.push(`      <div class="job-sub">${esc(c.text)}${c.meta ? `<span class="dates">${esc(c.meta)}</span>` : ""}</div>`);
            }
          }
          parts.push(`      <ul>`);
          for (const c of b.children) {
            if (c.kind === "item") {
              parts.push(`        <li>${c.text}`);
              if (c.sub.length) {
                parts.push(`          <ul>`);
                for (const s of c.sub) parts.push(`            <li class="sub">${s.text}</li>`);
                parts.push(`          </ul>`);
              }
              parts.push(`        </li>`);
            }
          }
          parts.push(`      </ul>
    </div>`);
        }
      }
      parts.push(`  </section>`);
      continue;
    }

    if (sec.title === "Education") {
      for (const b of sec.blocks) {
        if (b.kind === "edu-row") {
          parts.push(`    <div class="row">
      <span class="school">${esc(b.company)} | ${esc(b.meta)}</span>
    </div>`);
        } else if (b.kind === "edu-degree") {
          parts.push(`    <div class="job-sub">${esc(b.degree)}<span class="dates">${esc(b.dates)}</span></div>`);
        } else if (b.kind === "edu-gpa") {
          parts.push(`    <div class="gpa">${b.text}</div>`);
        }
      }
      parts.push(`  </section>`);
      continue;
    }

    for (const b of sec.blocks) {
      if (b.kind === "para") parts.push(`    <p>${b.text}</p>`);
    }
    parts.push(`  </section>`);
  }

  return parts.join("\n");
}

function overrideCss(overrides) {
  const vars = [];
  if (overrides.accent) vars.push(`  --accent: ${overrides.accent};`);
  if (overrides.base_size) vars.push(`  --base-size: ${overrides.base_size};`);
  if (overrides.name_size) vars.push(`  --name-size: ${overrides.name_size};`);
  const runtime = overrides.extra_css ? `\n${overrides.extra_css}` : "";
  if (!vars.length && !runtime) return "";
  return `:root {\n${vars.join("\n")}\n}${runtime}`;
}

function buildHtml(data, title, overrides) {
  const css = overrideCss(overrides);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${STYLES}</style>
<style>${css}</style>
</head>
<body>
${render(data)}
</body>
</html>`;
}

const outDir = join(ROOT, "build");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const mdPath of sources) {
  const md = readFileSync(mdPath, "utf8");
  const lines = md.split("\n");
  const { overrides, consumed } = parseFrontmatter(lines);
  const body = lines.slice(consumed).join("\n");
  const data = parse(body);
  const title = overrides.title || `${data.name || basename(mdPath, ".md")} - Resume`;
  const name = overrides.name || basename(mdPath, ".md");
  const html = buildHtml(data, title, overrides);
  const htmlPath = join(outDir, `${name}.html`);
  writeFileSync(htmlPath, html);

  const pdfPath = join(outDir, `${name}.pdf`);
  execSync(
    `chromium --headless --disable-gpu --no-sandbox --print-to-pdf=${pdfPath} --no-pdf-header-footer ${htmlPath}`,
    { stdio: "ignore" }
  );
  console.log(`wrote ${pdfPath}`);
}

// Keep the repo home page rendered resume in sync with the master resume.md.
const MASTER = join(ROOT, "resume.md");
if (existsSync(MASTER)) {
  writeFileSync(join(ROOT, "README.md"), readFileSync(MASTER, "utf8"));
  console.log("wrote README.md");
}