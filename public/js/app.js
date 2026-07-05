// ============================================================
// APP — routing + rendering, generic across every entity
// ============================================================

const mainEl = document.getElementById("main");
const sidebarNav = document.getElementById("sidebar-nav");

function buildUrl(url, id) {
  return id !== undefined ? url.replace(":id", id) : url;
}

async function apiRequest(method, url, body) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data;
}

// ---------------- Toast ----------------
function toast(message, isError) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = "toast show" + (isError ? " toast-error" : "");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2800);
}

// ---------------- Sidebar ----------------
function renderSidebar() {
  const manageItems = Object.entries(ENTITIES).filter(([, e]) => e.group === "manage");
  const otherItems = Object.entries(ENTITIES).filter(([, e]) => e.group === "other");

  const item = ([key, e]) =>
    `<a href="#/${key}" class="nav-link" data-key="${key}">
       <span class="nav-icon">${icon(e.icon, 16)}</span><span>${e.label}</span>
     </a>`;

  sidebarNav.innerHTML = `
    <a href="#/" class="nav-link" data-key="">
      <span class="nav-icon">${icon("grid", 16)}</span><span>Dashboard</span>
    </a>
    <div class="nav-section-label">Manage</div>
    ${manageItems.map(item).join("")}
    <div class="nav-section-label">Other Tables</div>
    ${otherItems.map(item).join("")}
  `;
}

function setActiveNav(key) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.key === (key || ""));
  });
}

// ---------------- Dashboard home ----------------
async function renderDashboard() {
  const cards = DASHBOARD_CARDS.map((key) => {
    const e = ENTITIES[key];
    return `
      <a href="#/${key}" class="dash-card">
        <span class="dash-card-icon">${icon(e.icon, 20)}</span>
        <div>
          <div class="dash-card-title">${e.label}</div>
          <div class="dash-card-sub">Manage records</div>
        </div>
        <span class="dash-card-arrow">${icon("plus", 14)}</span>
      </a>`;
  }).join("");

  const otherRows = Object.entries(ENTITIES)
    .filter(([, e]) => e.group === "other")
    .map(([key, e]) => `
      <a href="#/${key}" class="other-row">
        <span class="other-row-icon">${icon(e.icon, 15)}</span>
        <span class="other-row-label">${e.label}</span>
        <span class="other-row-arrow">View</span>
      </a>`)
    .join("");

  mainEl.innerHTML = `
    <div class="hero">
      <div class="hero-eyebrow">System Overview</div>
      <h1>Food Ordering Management</h1>
      <p>Live status of every table in your database, in one place.</p>
      <div id="hero-stats" class="hero-stats">
        ${OVERVIEW_STATS.map((k) => `
          <div class="hero-stat">
            <span class="hero-stat-value" data-stat="${k}">—</span>
            <span class="hero-stat-label">${ENTITIES[k].label}</span>
          </div>`).join("")}
      </div>
    </div>

    <div class="section-label">Manage</div>
    <div class="dash-grid">${cards}</div>

    <div class="section-label">Other Tables</div>
    <div class="other-list">${otherRows}</div>
  `;

  // Fetch live counts without blocking the rest of the page
  OVERVIEW_STATS.forEach(async (key) => {
    const entity = ENTITIES[key];
    const target = mainEl.querySelector(`[data-stat="${key}"]`);
    try {
      const rows = await apiRequest(entity.endpoints.list.method, entity.endpoints.list.url);
      target.textContent = Array.isArray(rows) ? rows.length : "—";
    } catch (e) {
      target.textContent = "—";
    }
  });
}

// ---------------- Generic entity table ----------------
async function renderEntity(key) {
  const entity = ENTITIES[key];
  if (!entity) { renderDashboard(); return; }

  mainEl.innerHTML = `
    <div class="page-header">
      <div class="page-header-title">
        <span class="page-icon">${icon(entity.icon, 20)}</span>
        <div>
          <h2>${entity.label}</h2>
          <p class="muted mono">${entity.endpoints.list.url}</p>
        </div>
      </div>
      ${entity.endpoints.create ? `<button class="btn btn-primary" id="add-btn">${icon("plus", 15)} Add ${singular(entity.label)}</button>` : ""}
    </div>
    <div id="table-wrap" class="table-wrap"><div class="loading">Loading…</div></div>
  `;

  if (entity.endpoints.create) {
    document.getElementById("add-btn").addEventListener("click", () => openFormModal(key));
  }

  try {
    const rows = await apiRequest(entity.endpoints.list.method, entity.endpoints.list.url);
    renderTable(key, rows);
  } catch (err) {
    document.getElementById("table-wrap").innerHTML =
      `<div class="empty-state">Couldn't load data.<br><span class="muted">${err.message}</span></div>`;
  }
}

function singular(label) {
  return label.endsWith("s") && !label.endsWith("ss") ? label.slice(0, -1) : label;
}

function renderTable(key, rows) {
  const entity = ENTITIES[key];
  const wrap = document.getElementById("table-wrap");

  if (!rows || rows.length === 0) {
    wrap.innerHTML = `<div class="empty-state">No records yet.<br><span class="muted">Add one to get started.</span></div>`;
    return;
  }

  const columns = entity.fields
    ? [entity.idField, ...entity.fields.map((f) => f.name)]
    : Object.keys(rows[0]);

  const canEdit = !!entity.endpoints.update;
  const canDelete = !!entity.endpoints.remove;
  const showActions = canEdit || canDelete;

  wrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>${columns.map((c) => `<th>${prettify(c)}</th>`).join("")}${showActions ? "<th></th>" : ""}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => rowHtml(row, columns, key, canEdit, canDelete)).join("")}
      </tbody>
    </table>
  `;

  wrap.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const row = rows.find((r) => String(r[entity.idField]) === btn.dataset.edit);
      openFormModal(key, row);
    })
  );
  wrap.querySelectorAll("[data-delete]").forEach((btn) =>
    btn.addEventListener("click", () => confirmDelete(key, btn.dataset.delete))
  );
}

function rowHtml(row, columns, key, canEdit, canDelete) {
  const entity = ENTITIES[key];
  const cells = columns.map((c) => `<td class="${isNumericCol(c) ? "mono" : ""}">${formatCell(row[c])}</td>`).join("");
  const actions = canEdit || canDelete
    ? `<td class="actions-cell">
        ${canEdit ? `<button class="btn-icon" data-edit="${row[entity.idField]}" title="Edit">${icon("edit", 14)}</button>` : ""}
        ${canDelete ? `<button class="btn-icon btn-icon-danger" data-delete="${row[entity.idField]}" title="Delete">${icon("trash", 14)}</button>` : ""}
       </td>`
    : "";
  return `<tr>${cells}${actions}</tr>`;
}

function isNumericCol(name) {
  return /_id$|price|amount|total|contact_no/.test(name);
}

function formatCell(val) {
  if (val === null || val === undefined) return `<span class="muted">—</span>`;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
}

function prettify(str) {
  return String(str).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------- Add / Edit modal ----------------
function openFormModal(key, record) {
  const entity = ENTITIES[key];
  const isEdit = !!record;
  const modal = document.getElementById("modal");
  const form = document.getElementById("modal-form");

  document.getElementById("modal-title").textContent =
    (isEdit ? "Edit " : "Add ") + singular(entity.label);

  form.innerHTML = entity.fields.map((f) => {
    const val = isEdit && record[f.name] !== undefined ? record[f.name] : "";
    if (f.type === "select") {
      return `
        <label class="form-field">
          <span>${f.label}</span>
          <select name="${f.name}" ${f.required ? "required" : ""}>
            ${f.options.map((o) => `<option value="${o.value}" ${String(val) === o.value ? "selected" : ""}>${o.label}</option>`).join("")}
          </select>
        </label>`;
    }
    return `
      <label class="form-field">
        <span>${f.label}</span>
        <input type="${f.type}" name="${f.name}" value="${val}" ${f.step ? `step="${f.step}"` : ""} ${f.required ? "required" : ""}>
      </label>`;
  }).join("");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const body = {};
    entity.fields.forEach((f) => {
      let v = formData.get(f.name);
      if (f.type === "number") v = v === "" ? null : Number(v);
      if (f.type === "select" && (v === "true" || v === "false")) v = v === "true";
      body[f.name] = v;
    });

    try {
      if (isEdit) {
        const url = buildUrl(entity.endpoints.update.url, record[entity.idField]);
        await apiRequest(entity.endpoints.update.method, url, body);
        toast(`${singular(entity.label)} updated.`);
      } else {
        await apiRequest(entity.endpoints.create.method, entity.endpoints.create.url, body);
        toast(`${singular(entity.label)} added.`);
      }
      closeModal();
      renderEntity(key);
    } catch (err) {
      toast(err.message, true);
    }
  };

  modal.classList.add("show");
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

// ---------------- Delete confirm ----------------
function confirmDelete(key, id) {
  const entity = ENTITIES[key];
  const confirmModal = document.getElementById("confirm-modal");
  document.getElementById("confirm-text").textContent =
    `Delete this ${singular(entity.label).toLowerCase()}? This can't be undone.`;

  const yesBtn = document.getElementById("confirm-yes");
  yesBtn.onclick = async () => {
    try {
      const url = buildUrl(entity.endpoints.remove.url, id);
      await apiRequest(entity.endpoints.remove.method, url);
      toast(`${singular(entity.label)} deleted.`);
      confirmModal.classList.remove("show");
      renderEntity(key);
    } catch (err) {
      toast(err.message, true);
    }
  };
  confirmModal.classList.add("show");
}

// ---------------- Auth guard ----------------
function currentAdmin() {
  try {
    return JSON.parse(sessionStorage.getItem("admin"));
  } catch (e) {
    return null;
  }
}

function requireAuth() {
  const admin = currentAdmin();
  if (!admin) {
    window.location.href = "login.html";
    return null;
  }
  return admin;
}

function initTopbar(admin) {
  const nameEl = document.getElementById("admin-name");
  const avatarEl = document.getElementById("admin-avatar");
  if (nameEl) nameEl.textContent = admin.admin_name || "Admin";
  if (avatarEl) avatarEl.textContent = (admin.admin_name || "A").charAt(0).toUpperCase();

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("admin");
      window.location.href = "login.html";
    });
  }
}

// ---------------- Router ----------------
function route() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const key = hash || "";
  setActiveNav(key);
  if (!key) renderDashboard();
  else renderEntity(key);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  const admin = requireAuth();
  if (!admin) return;

  initTopbar(admin);
  renderSidebar();
  route();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeModal);
  document.getElementById("confirm-cancel").addEventListener("click", () =>
    document.getElementById("confirm-modal").classList.remove("show")
  );
  document.getElementById("confirm-backdrop").addEventListener("click", () =>
    document.getElementById("confirm-modal").classList.remove("show")
  );
});
