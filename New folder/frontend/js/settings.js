/* Settings page — load and save system settings via the API */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("settings-form").addEventListener("submit", saveSettings);
  loadSettings();
});

async function loadSettings() {
  try {
    const { data } = await api.getSettings();

    document.getElementById("s-name").value = data.application_name;
    document.getElementById("s-email").value = data.admin_email;
    document.getElementById("s-lang").value = data.language;
    document.getElementById("s-tz").value = data.timezone;
    document.getElementById("s-notify").checked = data.email_notifications;
    document.getElementById("s-2fa").checked = data.two_factor_authentication;
    document.getElementById("s-maintenance").checked = data.maintenance_mode;

    if (data.updated_at) {
      document.getElementById("settings-updated").textContent =
        `Last updated ${timeAgo(data.updated_at)}`;
    }
  } catch (error) {
    toast(error.message, "error");
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const btn = document.getElementById("settings-save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";

  const payload = {
    application_name: document.getElementById("s-name").value.trim(),
    admin_email: document.getElementById("s-email").value.trim(),
    language: document.getElementById("s-lang").value,
    timezone: document.getElementById("s-tz").value,
    email_notifications: document.getElementById("s-notify").checked,
    two_factor_authentication: document.getElementById("s-2fa").checked,
    maintenance_mode: document.getElementById("s-maintenance").checked,
  };

  try {
    const { message, data } = await api.updateSettings(payload);
    toast(message);
    if (data.updated_at) {
      document.getElementById("settings-updated").textContent =
        `Last updated ${timeAgo(data.updated_at)}`;
    }
  } catch (error) {
    toast(error.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
}
