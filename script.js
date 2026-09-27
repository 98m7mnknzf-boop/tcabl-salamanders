document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});


document.querySelectorAll(".record-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".record-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".record-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.recordTarget);
    if (target) target.classList.add("active");
  });
});

document.querySelectorAll(".season-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".season-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".season-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.seasonTarget);
    if (target) target.classList.add("active");
  });
});

document.querySelectorAll(".pitch-season-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pitch-season-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".pitch-season-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.pitchTarget);
    if (target) target.classList.add("active");
  });
});


// Launch polish: close mobile menu on Escape or outside click.
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});

document.addEventListener("click", event => {
  if (!nav.classList.contains("open")) return;
  if (nav.contains(event.target) || toggle.contains(event.target)) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
});

// Highlight the section currently being viewed.
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.01, 0.2, 0.5] });
  sections.forEach(section => sectionObserver.observe(section));
}

// Back-to-top control.
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("visible", window.scrollY > 700);
  window.addEventListener("scroll", updateBackToTop, { passive:true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
}


// V20: sortable stat tables. Click/tap any column heading to sort; click again to reverse.
(() => {
  const tables = document.querySelectorAll("table.stats-table");
  if (!tables.length) return;

  const lowerIsLeader = new Set(["ERA", "WHIP", "BAA", "L", "CS", "BS"]);
  const textHeaders = new Set(["PLAYER", "PITCHER"]);

  const normalizedText = value => value
    .replace(/^#\d+\s*/, "")
    .trim()
    .toLocaleLowerCase();

  const numericValue = value => {
    const cleaned = value.replace(/,/g, "").replace(/%/g, "").trim();
    if (!cleaned || cleaned === "—" || cleaned === "-") return null;
    const number = Number.parseFloat(cleaned);
    return Number.isFinite(number) ? number : null;
  };

  tables.forEach((table, tableIndex) => {
    const body = table.tBodies[0];
    const headerRow = table.tHead?.rows[0];
    if (!body || !headerRow) return;

    [...body.rows].forEach((row, rowIndex) => {
      row.dataset.originalOrder = String(rowIndex);
    });

    [...headerRow.cells].forEach((th, columnIndex) => {
      const label = th.textContent.trim();
      if (!label) return;

      th.classList.add("sortable-header");
      th.setAttribute("aria-sort", "none");

      const button = document.createElement("button");
      button.type = "button";
      button.className = "stats-sort-button";
      button.dataset.column = String(columnIndex);
      button.dataset.direction = "";
      button.setAttribute("aria-label", `Sort by ${label}`);

      const labelSpan = document.createElement("span");
      labelSpan.className = "stats-sort-label";
      labelSpan.textContent = label;

      const indicator = document.createElement("span");
      indicator.className = "stats-sort-indicator";
      indicator.setAttribute("aria-hidden", "true");
      indicator.textContent = "↕";

      button.append(labelSpan, indicator);
      th.replaceChildren(button);

      button.addEventListener("click", () => {
        const previousDirection = button.dataset.direction;
        let direction;

        if (previousDirection === "asc") direction = "desc";
        else if (previousDirection === "desc") direction = "asc";
        else if (textHeaders.has(label.toUpperCase())) direction = "asc";
        else direction = lowerIsLeader.has(label.toUpperCase()) ? "asc" : "desc";

        headerRow.querySelectorAll("th").forEach(otherTh => {
          otherTh.setAttribute("aria-sort", "none");
          const otherButton = otherTh.querySelector(".stats-sort-button");
          const otherIndicator = otherTh.querySelector(".stats-sort-indicator");
          if (otherButton && otherButton !== button) otherButton.dataset.direction = "";
          if (otherIndicator && otherButton !== button) otherIndicator.textContent = "↕";
        });

        button.dataset.direction = direction;
        th.setAttribute("aria-sort", direction === "asc" ? "ascending" : "descending");
        indicator.textContent = direction === "asc" ? "↑" : "↓";
        button.setAttribute("aria-label", `Sort by ${label}, ${direction === "asc" ? "ascending" : "descending"}`);

        const rows = [...body.rows];
        const sampleValues = rows
          .map(row => row.cells[columnIndex]?.textContent.trim() ?? "")
          .filter(Boolean);
        const numericColumn = !textHeaders.has(label.toUpperCase()) &&
          sampleValues.length > 0 &&
          sampleValues.every(value => numericValue(value) !== null);

        rows.sort((a, b) => {
          const aText = a.cells[columnIndex]?.textContent.trim() ?? "";
          const bText = b.cells[columnIndex]?.textContent.trim() ?? "";
          let comparison = 0;

          if (numericColumn) {
            const aNum = numericValue(aText);
            const bNum = numericValue(bText);
            if (aNum === null && bNum === null) comparison = 0;
            else if (aNum === null) comparison = 1;
            else if (bNum === null) comparison = -1;
            else comparison = aNum - bNum;
          } else {
            comparison = normalizedText(aText).localeCompare(normalizedText(bText), undefined, {
              numeric: true,
              sensitivity: "base"
            });
          }

          if (comparison === 0) {
            return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
          }
          return direction === "asc" ? comparison : -comparison;
        });

        rows.forEach(row => body.appendChild(row));
        table.classList.add("stats-table-sorted");
      });
    });

    const wrap = table.closest(".stats-table-wrap");
    if (wrap && !wrap.previousElementSibling?.classList.contains("stats-sort-help")) {
      const help = document.createElement("p");
      help.className = "stats-sort-help";
      help.textContent = "Tap or click any column heading to sort. Tap it again to reverse the order.";
      help.id = `stats-sort-help-${tableIndex + 1}`;
      wrap.before(help);
      table.setAttribute("aria-describedby", help.id);
    }
  });
})();
