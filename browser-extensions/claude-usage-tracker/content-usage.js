(function () {
  const path = location.pathname;
  if (!path.includes("/settings/usage") && !path.includes("/settings/billing")) {
    return;
  }

  const USAGE_KEYWORDS = /usage|uso|l[ií]mite|limit|cuota|quota/i;
  const PERCENT_RE = /(\d{1,3})\s*%/;
  const RESET_RE = /(resets?|se reinicia|reinicio|renueva)[^.]{0,60}/i;

  function findPercentFromProgressbars() {
    const bars = document.querySelectorAll('[role="progressbar"]');
    for (const bar of bars) {
      const now = bar.getAttribute("aria-valuenow");
      const max = bar.getAttribute("aria-valuemax") || "100";
      if (now !== null) {
        const pct = Math.round((parseFloat(now) / parseFloat(max)) * 100);
        if (!Number.isNaN(pct)) return pct;
      }
    }
    return null;
  }

  function findPercentFromText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent;
      const match = text.match(PERCENT_RE);
      if (!match) continue;
      const container = node.parentElement ? node.parentElement.closest("div, section, li, article") : null;
      const context = container ? container.textContent : text;
      if (USAGE_KEYWORDS.test(context)) {
        return parseInt(match[1], 10);
      }
    }
    return null;
  }

  function findResetText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const match = node.textContent.match(RESET_RE);
      if (match) return match[0].trim();
    }
    return null;
  }

  function tryExtract(attemptsLeft) {
    const percent = findPercentFromProgressbars() ?? findPercentFromText();
    if (percent !== null) {
      chrome.runtime.sendMessage({
        type: "usageResult",
        payload: { percent, resetText: findResetText() },
      });
      return;
    }
    if (attemptsLeft <= 0) {
      chrome.runtime.sendMessage({ type: "usageResult", payload: null });
      return;
    }
    setTimeout(() => tryExtract(attemptsLeft - 1), 500);
  }

  // La página es una SPA: esperamos hasta ~8s a que el contenido se renderice.
  tryExtract(16);
})();
