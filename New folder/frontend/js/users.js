/* Users page — live CRUD against the backend */

let allUsers = [];
let editingId = null;
let pendingDeleteId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-slot").insertAdjacentHTML("afterbegin", ICONS.search);

  document.getElementById("users-body").innerHTML = skeletonRows(7, 5);

  document.getElementById("add-user-btn").addEventListener("click", () => openUserModal());
  document.getElementById("user-form").addEventListener("submit", saveUser);
  document.getElementById("confirm-delete-btn").addEventListener("click", confirmDelete);
  document.getElementById("user-search").addEventListener("input", renderUsers);
  document.getElementById("status-filter").addEventListener("change", renderUsers);

  document.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.dataset.close))
  );

  loadRolesIntoSelect();
  loadUsers();
});

async function loadUsers() {
  try {
    const { data } = await api.getUsers();
    allUsers = data;
    renderUsers();
  } catch (error) {
    document.getElementById("users-body").innerHTML = `<tr><td colspan="7">
      <div class="empty-state">${ICONS.alert}<h3>Could not load users</h3><p>${escapeHtml(error.message)}</p></div>
    </td></tr>`;
    toast(error.message, "error");
  }
}

async function loadRolesIntoSelect() {
  const select = document.getElementById("f-role");
  const fallback = ["Admin", "Mentor", "Student"];
  try {
    const { data } = await api.getRoles();
    const names = data.length ? data.map((role) => role.role_name) : fallback;
    select.innerHTML = names
      .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
      .join("");
  } catch (_) {
    select.innerHTML = fallback
      .map((name) => `<option value="${name}">${name}</option>`)
      .join("");
  }
}

function renderUsers() {
  const body = document.getElementById("users-body");
  const query = document.getElementById("user-search").value.trim().toLowerCase();
  const status = document.getElementById("status-filter").value;

  const filtered = allUsers.filter((user) => {
    const haystack = `${user.full_name} ${user.email} ${user.role} ${user.department}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!status || user.status === status);
  });

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">${ICONS.cloud}
        <h3>${allUsers.length ? "No matching users" : "No users yet"}</h3>
        <p>${allUsers.length ? "Try a different search or filter." : "Click “Add User” to create the first one."}</p>
      </div>
    </td></tr>`;
    return;
  }

  body.innerHTML = filtered
    .map(
      (user, index) => `
    <tr style="animation-delay:${index * 45}ms">
      <td>
        <div class="cell-user">
          <div class="avatar ${avatarTone(user.full_name)}">${initials(user.full_name)}</div>
          <div><b>${escapeHtml(user.full_name)}</b><small>${escapeHtml(user.email)}</small></div>
        </div>
      </td>
      <td>${escapeHtml(user.phone)}</td>
      <td><span class="badge">${escapeHtml(user.role)}</span></td>
      <td>${escapeHtml(user.department)}</td>
      <td><span class="pill ${user.status === "Active" ? "active" : "inactive"}">${escapeHtml(user.status)}</span></td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <div class="row-actions">
          <button class="act-btn edit" title="Edit" onclick="openUserModal('${user.id}')">${ICONS.edit}</button>
          <button class="act-btn del" title="Delete" onclick="askDelete('${user.id}')">${ICONS.trash}</button>
        </div>
      </td>
    </tr>`
    )
    .join("");
}

function openUserModal(id = null) {
  editingId = id;
  const form = document.getElementById("user-form");
  form.reset();

  document.getElementById("user-modal-title").textContent = id ? "Edit User" : "Add User";
  document.getElementById("user-save-btn").textContent = id ? "Save Changes" : "Add User";

  if (id) {
    const user = allUsers.find((u) => u.id === id);
    if (user) {
      document.getElementById("f-name").value = user.full_name;
      document.getElementById("f-email").value = user.email;
      document.getElementById("f-phone").value = user.phone;
      document.getElementById("f-role").value = user.role;
      document.getElementById("f-dept").value = user.department;
      document.getElementById("f-status").value = user.status;
    }
  }

  openModal("user-modal");
}

async function saveUser(event) {
  event.preventDefault();
  const saveBtn = document.getElementById("user-save-btn");
  saveBtn.disabled = true;

  const payload = {
    full_name: document.getElementById("f-name").value.trim(),
    email: document.getElementById("f-email").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    role: document.getElementById("f-role").value,
    department: document.getElementById("f-dept").value.trim(),
    status: document.getElementById("f-status").value,
  };

  try {
    if (editingId) {
      const { message } = await api.updateUser(editingId, payload);
      toast(message);
    } else {
      const { message } = await api.createUser(payload);
      toast(message);
    }
    closeModal("user-modal");
    await loadUsers();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    saveBtn.disabled = false;
  }
}

function askDelete(id) {
  pendingDeleteId = id;
  const user = allUsers.find((u) => u.id === id);
  document.getElementById("delete-name").textContent = user ? user.full_name : "this user";
  openModal("delete-modal");
}

async function confirmDelete() {
  if (!pendingDeleteId) return;
  const btn = document.getElementById("confirm-delete-btn");
  btn.disabled = true;

  try {
    const { message } = await api.deleteUser(pendingDeleteId);
    toast(message);
    closeModal("delete-modal");
    await loadUsers();
  } catch (error) {
    toast(error.message, "error");
  } finally {
    btn.disabled = false;
    pendingDeleteId = null;
  }
}
