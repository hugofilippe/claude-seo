const DEFAULTS = {
  usageUrl: "https://claude.ai/settings/usage",
  intervalMinutes: 15,
  lastPercent: null,
  lastChecked: null,
  lastResetText: null,
  lastError: null,
};

const ALARM_NAME = "checkUsage";
const CHECK_TIMEOUT_MS = 12000;

async function getSettings() {
  const stored = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...stored };
}

async function setBadge(percent, errorLabel) {
  if (percent === null || percent === undefined) {
    await chrome.action.setBadgeText({ text: errorLabel ? "!" : "?" });
    await chrome.action.setBadgeBackgroundColor({ color: "#888888" });
    await chrome.action.setTitle({
      title: errorLabel
        ? `Claude Usage Tracker: ${errorLabel}`
        : "Claude Usage Tracker: no se encontró el dato de uso todavía",
    });
    return;
  }
  const color = percent >= 90 ? "#c53030" : percent >= 70 ? "#d4740e" : "#2d6a4f";
  await chrome.action.setBadgeText({ text: `${percent}%` });
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setTitle({ title: `Claude - uso actual: ${percent}%` });
}

function waitForUsageResult(tabId, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      chrome.runtime.onMessage.removeListener(listener);
      clearTimeout(timer);
      resolve(value);
    };
    const listener = (message, sender) => {
      if (sender.tab && sender.tab.id === tabId && message && message.type === "usageResult") {
        finish(message.payload);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    const timer = setTimeout(() => finish(null), timeoutMs);
  });
}

async function refreshUsage() {
  const settings = await getSettings();
  let win;
  try {
    win = await chrome.windows.create({
      url: settings.usageUrl,
      focused: false,
      type: "popup",
      state: "minimized",
    });
  } catch (e) {
    await chrome.storage.local.set({ lastError: `No se pudo abrir la página de uso: ${e.message}` });
    await setBadge(null, "error al abrir la página");
    return;
  }

  const tab = win.tabs && win.tabs[0];
  const result = tab ? await waitForUsageResult(tab.id, CHECK_TIMEOUT_MS) : null;

  try {
    await chrome.windows.remove(win.id);
  } catch (e) {
    // la ventana puede haberse cerrado sola
  }

  if (result && typeof result.percent === "number") {
    await chrome.storage.local.set({
      lastPercent: result.percent,
      lastResetText: result.resetText || null,
      lastChecked: Date.now(),
      lastError: null,
    });
    await setBadge(result.percent, null);
  } else {
    await chrome.storage.local.set({
      lastError: "No se encontró el porcentaje de uso en la página (¿URL correcta? ¿sesión iniciada?)",
    });
    await setBadge(null, "no se encontró el dato");
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) refreshUsage();
});

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: settings.intervalMinutes });
  refreshUsage();
});

chrome.runtime.onStartup.addListener(() => {
  refreshUsage();
});

chrome.runtime.onMessage.addListener((message) => {
  if (!message) return;
  if (message.type === "manualRefresh") {
    refreshUsage();
  }
  if (message.type === "settingsUpdated") {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: message.intervalMinutes });
  }
});
