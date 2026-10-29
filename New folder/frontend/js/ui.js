/* ============================================================
   UI shell + shared helpers
   Renders the sidebar/topbar (single source for every page),
   plus toasts, modals, avatars, count-up and date formatting.
   ============================================================ */

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  roles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-.42-8.98 6 6 0 1 0-11.06 3.15A3.5 3.5 0 0 0 7 19.5h10.5z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "index.html", icon: "dashboard" },
  { id: "users", label: "Users", href: "users.html", icon: "users" },
  { id: "roles", label: "Roles", href: "roles.html", icon: "roles" },
  { id: "settings", label: "Settings", href: "settings.html", icon: "settings" },
];

const PAGE_META = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back — here's what's happening today." },
  users: { title: "User Management", subtitle: "Add, edit and manage every member of the academy." },
  roles: { title: "Role Management", subtitle: "Define roles and control what each one can do." },
  settings: { title: "System Settings", subtitle: "Configure how the platform behaves." },
};

/* ---- Shell (sidebar + topbar) ---- */

function renderShell() {
  const page = document.body.dataset.page || "dashboard";
  const meta = PAGE_META[page] || PAGE_META.dashboard;

  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="15.5" cy="7.5" r="3.2"/>
            <path d="M17.5 19a4.5 4.5 0 1 0-.42-8.98 6 6 0 1 0-11.06 3.15A3.5 3.5 0 0 0 7 19.5h10.5z" fill="rgba(255,255,255,.25)"/>
          </svg>
        </div>
        <div class="brand-name">Internship<br>Academy <span>Admin Panel</span></div>
      </div>
      <nav class="nav">
        <div class="nav-label">Menu</div>
        ${NAV_ITEMS.map(
          (item) => `
          <a href="${item.href}" class="${item.id === page ? "active" : ""}">
            ${ICONS[item.icon]} ${item.label}
          </a>`
        ).join("")}
      </nav>
      <div class="sidebar-foot">
        <strong>Clear skies ahead ☀️</strong>
        Manage users, roles &amp; settings from one calm place.
      </div>`;
  }

  const topbar = document.getElementById("topbar");
  if (topbar) {
    topbar.className = "topbar rise";
    topbar.innerHTML = `
      <div class="topbar-title">
        <h1>${meta.title}</h1>
        <p>${meta.subtitle}</p>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications">${ICONS.bell}<span class="ping"></span></button>
        <div class="profile-chip">
          <div class="avatar tone-1">AD</div>
          <div><b>Admin</b><small>Administrator</small></div>
        </div>
        <button class="icon-btn" id="logout-btn" title="Logout">${ICONS.logout}</button>
      </div>`;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () =>
        toast("You have been logged out (demo)", "success")
      );
    }
  }
}

/* ---- Toasts ---- */

function toast(message, type = "success") {
  let zone = document.querySelector(".toast-zone");
  if (!zone) {
    zone = document.createElement("div");
    zone.className = "toast-zone";
    document.body.appendChild(zone);
  }

  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `
    <div class="toast-icon">${type === "success" ? ICONS.check : ICONS.alert}</div>
    <div>${message}</div>`;
  zone.appendChild(el);

  setTimeout(() => {
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

/* ---- Modals ---- */

function openModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) backdrop.classList.add("open");
}

function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) backdrop.classList.remove("open");
}

function wireModalDismiss() {
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) backdrop.classList.remove("open");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document
        .querySelectorAll(".modal-backdrop.open")
        .forEach((b) => b.classList.remove("open"));
    }
  });
}

/* ---- Small helpers ---- */

function initials(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function avatarTone(name) {
  let hash = 0;
  for (const char of name || "") hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return `tone-${(hash % 5) + 1}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(value) {
  if (!value) return "";
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function countUp(element, target, duration = 900) {
  if (document.hidden) {
    element.textContent = target;
    return;
  }
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  // safety net: always land exactly on the target
  setTimeout(() => (element.textContent = target), duration + 120);
}

function skeletonRows(columns, rows = 4) {
  return Array.from({ length: rows })
    .map(
      () =>
        `<tr>${Array.from({ length: columns })
          .map(
            () =>
              '<td><div class="skeleton" style="height:15px;width:70%"></div></td>'
          )
          .join("")}</tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  wireModalDismiss();
});
