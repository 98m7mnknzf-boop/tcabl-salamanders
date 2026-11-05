// Keep earlier homepage bookmarks working after the page split.
(() => {
  if (!['/', '/index', '/index.html'].includes(window.location.pathname)) return;
  const destinations = {"stats": "/stats", "stats-2026-panel": "/stats", "stats-2025-panel": "/stats", "stats-2026-post-panel": "/stats", "pitching": "/stats", "pitch-2026-panel": "/stats", "pitch-2026-post-panel": "/stats", "pitch-2025-panel": "/stats", "history": "/history", "records": "/records", "roster": "/roster", "new-additions": "/roster"};
  const followBookmark = () => {
    const destination = destinations[window.location.hash.slice(1)];
    if (destination) window.location.replace(destination + window.location.hash);
  };
  followBookmark();
  window.addEventListener('hashchange', followBookmark);
})();

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

let menuOpenedAtScrollY = window.scrollY;
const closeMenu = () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
};
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) menuOpenedAtScrollY = window.scrollY;
});
// Let readers resume scrolling without leaving a menu covering the page.
window.addEventListener("scroll", () => {
  if (nav.classList.contains("open") && Math.abs(window.scrollY - menuOpenedAtScrollY) > 20) closeMenu();
}, { passive: true });
window.addEventListener("resize", closeMenu, { passive: true });

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
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


// V41: one set of season/category controls for both stat books.
// The existing leaderboards, data tables, and table-sort functionality remain intact.
const unifiedSeason = document.getElementById("unified-stat-season");
const unifiedCategory = document.getElementById("unified-stat-category");
if (unifiedSeason && unifiedCategory) {
  const battingSection = document.getElementById("stats");
  const pitchingSection = document.getElementById("pitching");
  const filterBar = document.getElementById("stat-filters");
  const seasonTargets = {
    batting: {"2026": "stats-2026-panel", "2026-post": "stats-2026-post-panel", "2025": "stats-2025-panel"},
    pitching: {"2026": "pitch-2026-panel", "2026-post": "pitch-2026-post-panel", "2025": "pitch-2025-panel"}
  };

  const updateUnifiedStats = () => {
    const category = unifiedCategory.value;
    const season = unifiedSeason.value;
    battingSection.classList.toggle("unified-hidden-section", category !== "batting");
    pitchingSection.classList.toggle("unified-hidden-section", category !== "pitching");
    const selectedId = seasonTargets[category][season];
    const chosenPanel = document.getElementById(selectedId);
    const panels = (category === "batting")
      ? document.querySelectorAll(".season-panel")
      : document.querySelectorAll(".pitch-season-panel");
    panels.forEach(panel => panel.classList.toggle("active", panel === chosenPanel));
  };

  unifiedSeason.addEventListener("change", updateUnifiedStats);
  unifiedCategory.addEventListener("change", updateUnifiedStats);
  document.querySelectorAll(".stats-category-shortcut").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      unifiedCategory.value = link.dataset.statCategory;
      updateUnifiedStats();
      filterBar.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
  // An existing /stats#pitching link should still open pitching rather than a hidden section.
  if (window.location.hash === "#pitching" || window.location.hash.startsWith("#pitch-")) {
    unifiedCategory.value = "pitching";
  }
  document.body.classList.add("has-unified-stats");
  updateUnifiedStats();
}

// Launch polish: close mobile menu on Escape or outside click.
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    toggle.focus();
  }
});

document.addEventListener("click", event => {
  if (!nav.classList.contains("open")) return;
  if (nav.contains(event.target) || toggle.contains(event.target)) return;
  closeMenu();
});

// Dedicated pages provide their current-page marker in HTML. Avoid a second
// section marker that made Home and Team appear selected simultaneously.

// Back-to-top control.
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("visible", window.scrollY > 700);
  window.addEventListener("scroll", updateBackToTop, { passive:true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
}


// V42: Put the most useful stat columns first without altering any source values.
// Every row is reordered with its matching header, so existing sortable columns still work.
(() => {
  const preferred = {
    Player: ["Player", "AVG", "OBP", "OPS", "H", "RBI", "HR", "R", "SB", "GP", "PA", "AB", "SLG"],
    Pitcher: ["Pitcher", "IP", "ERA", "WHIP", "SO", "W", "L", "GP", "GS", "H", "BB"]
  };
  document.querySelectorAll("table.stats-table").forEach(table => {
    const header = table.tHead?.rows[0];
    const body = table.tBodies[0];
    if (!header || !body) return;
    const labels = [...header.cells].map(cell => cell.textContent.trim());
    const order = preferred[labels[0]];
    if (!order) return; // Detail tables retain their established column order.
    const indices = labels.map((label, index) => index).sort((a, b) => {
      const ai = order.indexOf(labels[a]), bi = order.indexOf(labels[b]);
      return (ai === -1 ? order.length + a : ai) - (bi === -1 ? order.length + b : bi);
    });
    [header, ...body.rows].forEach(row => {
      const cells = [...row.cells];
      if (cells.length !== labels.length) return;
      indices.forEach(i => row.append(cells[i]));
    });
    table.classList.add("stats-priority-table");
  });
})();

// V42: Player hub generated from the existing stat book (no duplicated data).
(() => {
  const tables = [...document.querySelectorAll("table.stats-table")].filter(table => {
    const h = table.tHead?.rows[0]?.cells[0]?.textContent.trim();
    return (h === "Player" || h === "Pitcher") && !!table.closest(".season-panel, .pitch-season-panel");
  });
  if (!tables.length) return;

  const normalize = text => text.replace(/^#\d+\s*/, "").trim().toLocaleLowerCase();
  const personIndex = new Map();
  for (const table of tables) {
    const panel = table.closest(".season-panel, .pitch-season-panel");
    const period = panel?.id.includes("2026-post") ? "2026 Playoffs" :
      panel?.id.includes("2025") ? "2025 Regular" : "2026 Regular";
    const type = table.tHead.rows[0].cells[0].textContent.trim() === "Player" ? "Batting" : "Pitching";
    const headers = [...table.tHead.rows[0].cells].map(cell => cell.textContent.trim());
    for (const row of table.tBodies[0]?.rows || []) {
      const raw = row.cells[0]?.textContent.trim() || "";
      const key = normalize(raw);
      if (!key) continue;
      const data = headers.map((label,i) => ({label, value:row.cells[i]?.textContent.trim() ?? "—"}));
      const entry = personIndex.get(key) || {name: raw.replace(/^#\d+\s*/, ""), number:raw.match(/^#(\d+)/)?.[1]||"", seasons:[]};
      if (!entry.number) entry.number=raw.match(/^#(\d+)/)?.[1] || "";
      entry.seasons.push({period,type,data});
      personIndex.set(key,entry);
      const cell = row.cells[0];
      cell.textContent = "";
      const link = document.createElement("button");
      link.type="button";
      link.className="stats-player-link";
      link.textContent=raw;
      link.setAttribute("aria-label", "View statistical profile for "+entry.name);
      link.addEventListener("click",()=>openProfile(key));
      cell.append(link);
    }
  }

  const dialog=document.createElement("dialog");
  dialog.className="stats-player-dialog";
  dialog.setAttribute("aria-label","Player statistical profile");
  dialog.innerHTML='<div class="stats-profile-shell"><div class="stats-profile-header"><div><div class="eyebrow">SALAMANDERS PLAYER HUB</div><h2 class="stats-profile-name"></h2><p class="stats-profile-subtitle"></p></div><button type="button" class="stats-profile-close" aria-label="Close player profile">×</button></div><div class="stats-profile-content"></div></div>';
  document.body.append(dialog);
  dialog.querySelector(".stats-profile-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click", event => {if (event.target === dialog) dialog.close()});

  function openProfile(key){
    const entry=personIndex.get(key);
    if (!entry) return;
    dialog.querySelector(".stats-profile-name").textContent=(entry.number ? "#"+entry.number+"  " : "")+entry.name;
    dialog.querySelector(".stats-profile-subtitle").textContent="Season-by-season batting and pitching · Regular season and playoffs shown separately";
    const content=dialog.querySelector(".stats-profile-content");
    content.replaceChildren();
    const periods=["2026 Regular","2026 Playoffs","2025 Regular"];
    for (const season of entry.seasons.sort((a,b)=>periods.indexOf(a.period)-periods.indexOf(b.period) || a.type.localeCompare(b.type))) {
      const section=document.createElement("section");
      section.className="stats-profile-season";
      const heading=document.createElement("h3");
      heading.textContent=season.period+" · "+season.type;
      section.append(heading);
      const grid=document.createElement("div");
      grid.className="stats-profile-grid";
      for(const stat of season.data.slice(1)){
        const item=document.createElement("div");
        item.className="stats-profile-stat";
        const value=document.createElement("strong");
        value.textContent=stat.value;
        const label=document.createElement("span");
        label.textContent=stat.label;
        item.append(value,label);
        grid.append(item);
      }
      section.append(grid);
      content.append(section);
    }
    dialog.showModal();
  }

  // The same profile action works from the season leader cards.
  document.querySelectorAll(".stat-leaders li").forEach(item=>{
    const span=item.querySelector("span");
    if(!span)return;
    const key=normalize(span.textContent);
    if(!personIndex.has(key))return;
    const button=document.createElement("button");
    button.type="button";
    button.className="stats-leader-link";
    button.textContent=span.textContent;
    button.addEventListener("click",()=>openProfile(key));
    span.replaceWith(button);
  });
})();

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

// Open the completed-season archive when linked directly, including from history.
(() => {
  const showArchive = () => {
    if (window.location.hash !== '#archive-2026') return;
    const archive = document.getElementById('archive-2026');
    if (archive) archive.open = true;
  };
  showArchive();
  window.addEventListener('hashchange', showArchive);
})();
