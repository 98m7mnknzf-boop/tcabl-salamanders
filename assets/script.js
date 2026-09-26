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
