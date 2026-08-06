const DEFAULTS = {
  usageUrl: "https://claude.ai/settings/usage",
  intervalMinutes: 15,
  lastPercent: null,
  lastChecked: null,
  lastResetText: null,
  lastError: null,
};

async function render() {
  const s = { ...DEFAULTS, ...(await chrome.storage.local.get(DEFAULTS)) };

  document.getElementById("percent").textContent =
    s.lastPercent !== null && s.lastPercent !== undefined ? `${s.lastPercent}%` : "--%";

  const when = s.lastChecked ? new Date(s.lastChecked).toLocaleTimeString() : "nunca";
  document.getElementById("meta").textContent =
    `Actualizado: ${when}` + (s.lastResetText ? ` · ${s.lastResetText}` : "");

  const errorEl = document.getElementById("error");
  if (s.lastError) {
    errorEl.textContent = s.lastError;
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }

  document.getElementById("url").value = s.usageUrl;
  document.getElementById("interval").value = s.intervalMinutes;
}

document.getElementById("refresh").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "manualRefresh" });
  document.getElementById("meta").textContent = "Revisando...";
  setTimeout(render, 3000);
});

document.getElementById("save").addEventListener("click", async () => {
  const usageUrl = document.getElementById("url").value.trim();
  const intervalMinutes = Math.max(5, parseInt(document.getElementById("interval").value, 10) || 15);
  await chrome.storage.local.set({ usageUrl, intervalMinutes });
  chrome.runtime.sendMessage({ type: "settingsUpdated", intervalMinutes });
  render();
});

render();
