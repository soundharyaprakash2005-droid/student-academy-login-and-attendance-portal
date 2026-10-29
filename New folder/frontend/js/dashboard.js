/* Dashboard — live stats from the backend */

document.addEventListener("DOMContentLoaded", () => {
  // fill stat icons
  document.querySelectorAll(".stat-icon[data-icon]").forEach((el) => {
    el.innerHTML = ICONS[el.dataset.icon] || "";
  });

  const recentBody = document.getElementById("recent-users-body");
  const feed = document.getElementById("activity-feed");
  recentBody.innerHTML = skeletonRows(5, 4);
  feed.innerHTML =
    '<div class="skeleton" style="height:52px;margin-bottom:10px"></div>'.repeat(4);

  loadDashboard();
});

async function loadDashboard() {
  const recentBody = document.getElementById("recent-users-body");
  const feed = document.getElementById("activity-feed");

  try {
    const { data } = await api.getDashboardStats();

    countUp(document.getElementById("stat-total"), data.total_users);
    countUp(document.getElementById("stat-active"), data.active_users);
    countUp(document.getElementById("stat-roles"), data.total_roles);
    countUp(document.getElementById("stat-inactive"), data.inactive_users);

    if (!data.recent_users.length) {
      recentBody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state">${ICONS.cloud}<h3>No users yet</h3><p>Add your first user from the Users page.</p></div>
      </td></tr>`;
    } else {
      recentBody.innerHTML = data.recent_users
        .map(
          (user, index) => `
        <tr style="animation-delay:${index * 60}ms">
          <td>
            <div class="cell-user">
              <div class="avatar ${avatarTone(user.full_name)}">${initials(user.full_name)}</div>
              <div><b>${escapeHtml(user.full_name)}</b><small>${escapeHtml(user.email)}</small></div>
            </div>
          </td>
          <td><span class="badge">${escapeHtml(user.role)}</span></td>
          <td>${escapeHtml(user.department)}</td>
          <td><span class="pill ${user.status === "Active" ? "active" : "inactive"}">${escapeHtml(user.status)}</span></td>
          <td>${formatDate(user.created_at)}</td>
        </tr>`
        )
        .join("");
    }

    if (!data.recent_activity.length) {
      feed.innerHTML = `<div class="empty-state">${ICONS.cloud}<h3>No activity yet</h3><p>Actions will show up here.</p></div>`;
    } else {
      const verbs = { created: "was added to", updated: "was updated in", deleted: "was removed from" };
      feed.innerHTML = data.recent_activity
        .map(
          (log, index) => `
        <div class="feed-item" style="animation-delay:${index * 70}ms">
          <div class="feed-dot ${escapeHtml(log.action)}">${ICONS.activity}</div>
          <div class="feed-text">
            <b>${escapeHtml(log.user_name)}</b> ${verbs[log.action] || log.action} <b>${escapeHtml(log.module)}</b>
            <small>${timeAgo(log.timestamp)}</small>
          </div>
        </div>`
        )
        .join("");
    }
  } catch (error) {
    recentBody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state">${ICONS.alert}<h3>Could not load data</h3><p>${escapeHtml(error.message)}</p></div>
    </td></tr>`;
    feed.innerHTML = "";
    toast(error.message, "error");
  }
}
