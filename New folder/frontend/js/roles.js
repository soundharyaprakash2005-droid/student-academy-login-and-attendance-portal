/* Roles page — card grid with live CRUD */

const ALL_PERMISSIONS = [
  "Manage Users",
  "Manage Roles",
  "Manage Settings",
  "View Reports",
];

let allRoles = [];
let editingRoleId = null;
let pendingRoleDeleteId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-slot").insertAdjacentHTML("afterbegin", ICONS.search);

  document.getElementById("perm-checks").innerHTML = ALL_PERMISSIONS.map(
    (perm) => `
    <label class="perm-check">
      <input type="checkbox" value="${perm}"> ${perm}
    </label>`
  ).join("");

  document.getElementById("role-grid").innerHTML =
    '<div class="card" style="height:190px"><div class="card-body"><div class="skeleton" style="height:100%;min-height:140px"></div></div></div>'.repeat(3);

  document.getElementById("add-role-btn").addEventListener("click", () => openRoleModal());
  document.getElementById("role-form").addEventListener("submit", saveRole);
  document.getElementById("confirm-delete-btn").addEventListener("click", confirmRoleDelete);
  document.getElementById("role-search").addEventListener("input", renderRoles);

  document.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.dataset.close))
  );

  loadRoles();
});

async function loadRoles() {
  try {
    const { data } = await api.getRoles();
    allRoles = data;
    renderRoles();
  } catch (error) {
    document.getElementById("role-grid").innerHTML = `<div class="card" style="grid-column:1/-1">
      <div class="empty-state">${ICONS.alert}<h3>Could not load roles</h3><p>${escapeHtml(error.message)}</p></div>
    </div>`;
    toast(error.message, "error");
  }
}

function renderRoles() {
  const grid = document.getElementById("role-grid");
  const query = document.getElementById("role-search").value.trim().toLowerCase();

  const filtered = allRoles.filter(
    (role) =>
      !query ||
      `${role.role_name} ${role.description}`.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1">
      <div class="empty-state">${ICONS.cloud}
        <h3>${allRoles.length ? "No matching roles" : "No roles yet"}</h3>
        <p>${allRoles.length ? "Try a different search." : "Click “Add Role” to create the first one."}</p>
      </div>
    </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (role, index) => `
    <div class="card hoverable role-card rise" style="--d:${index + 1}">
      <div class="role-card-top">
        <div>
          <div class="role-icon">${ICONS.roles}</div>
          <h3>${escapeHtml(role.role_name)}</h3>
        </div>
        <div class="row-actions">
          <button class="act-btn edit" title="Edit" onclick="openRoleModal('${role.id}')">${ICONS.edit}</button>
          <button class="act-btn del" title="Delete" onclick="askRoleDelete('${role.id}')">${ICONS.trash}</button>
        </div>
      </div>
      <p class="desc">${escapeHtml(role.description)}</p>
      <div class="perm-list">
        ${
          role.permissions.length
            ? role.permissions.map((perm) => `<span class="perm-chip">${escapeHtml(perm)}</span>`).join("")
            : '<span class="perm-chip" style="opacity:.6">No permissions</span>'
        }
      </div>
      <div class="role-card-foot">
        <span class="badge">${role.permissions.length} permission${role.permissions.length === 1 ? "" : "s"}</span>
        <small>Created ${formatDate(role.created_at)}</small>
      </div>
    </div>`
    )
    .join("");
}

function openRoleModal(id = null) {
  editingRoleId = id;
  const form = document.getElementById("role-form");
  form.reset();

  document.getElementById("role-modal-title").textContent = id ? "Edit Role" : "Add Role";
  document.getElementById("role-save-btn").textContent = id ? "Save Changes" : "Add Role";

  if (id) {
    const role = allRoles.find((r) => r.id === id);
    if (role) {
      document.getElementById("r-name").value = role.role_name;
      document.getElementById("r-desc").value = role.description;
      document
        .querySelectorAll("#perm-checks input")
        .forEach((box) => (box.checked = role.permissions.includes(box.value)));
    }
  }

  openModal("role-modal");
}

async function saveRole(event) {
  event.preventDefault();
  const saveBtn = document.getElementById("role-save-btn");
  saveBtn.disabled = true;

  const payload = {
    role_name: document.getElementById("r-name").value.trim(),
    description: document.getElementById("r-desc").value.trim(),
    permissions: Array.from(
      document.querySelectorAll("#perm-checks input:checked")
    ).map((box) => box.value),
  };

  try {
    if (editingRoleId) {
      const { message } = await api.updateRole(editingRoleId, payload);
      toast(message);
    } else {
      const { message } = await api.createRole(payload);
      toast(message);
    }
    closeModal("role-modal");
    await loadRoles();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    saveBtn.disabled = false;
  }
}

function askRoleDelete(id) {
  pendingRoleDeleteId = id;
  const role = allRoles.find((r) => r.id === id);
  document.getElementById("delete-name").textContent = role ? role.role_name : "this";
  openModal("delete-modal");
}

async function confirmRoleDelete() {
  if (!pendingRoleDeleteId) return;
  const btn = document.getElementById("confirm-delete-btn");
  btn.disabled = true;

  try {
    const { message } = await api.deleteRole(pendingRoleDeleteId);
    toast(message);
    closeModal("delete-modal");
    await loadRoles();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    btn.disabled = false;
    pendingRoleDeleteId = null;
  }
}
