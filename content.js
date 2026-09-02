(() => {
  'use strict';

  const DEFAULTS = { enabled: true, settleMs: 1200, retryMs: 350, maxRetries: 18 };
  let settings = {...DEFAULTS};
  const processed = new WeakSet();
  const pending = new WeakMap();
  let lastAssistantSignature = '';

  chrome.storage.sync.get(DEFAULTS, (s) => {
    settings = {...DEFAULTS, ...s};
    start();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (const [k, v] of Object.entries(changes)) settings[k] = v.newValue;
  });

  function start() {
    scan();
    const obs = new MutationObserver(() => {
      if (!settings.enabled) return;
      scan();
    });
    obs.observe(document.body, {childList:true, subtree:true});
    setInterval(() => settings.enabled && scan(), 1800);
  }

  function visible(el) {
    return !!el && el.isConnected && !el.hidden && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden' && el.getBoundingClientRect().width > 0;
  }

  function assistantTurns() {
    const byRole = [...document.querySelectorAll('[data-message-author-role="assistant"]')];
    const turns = byRole.map(el => el.closest('[data-testid^="conversation-turn-"]') || el.closest('article') || el.parentElement).filter(Boolean);
    const uniq = [...new Set(turns)];
    if (uniq.length) return uniq;
    // Fallback: locate turns containing Copy response buttons.
    return [...document.querySelectorAll('[data-testid="copy-turn-action-button"]')]
      .map(btn => btn.closest('[data-testid^="conversation-turn-"]') || btn.closest('article') || btn.parentElement)
      .filter(Boolean);
  }

  function scan() {
    const turns = assistantTurns();
    const turn = turns.at(-1);
    if (!turn || processed.has(turn)) return;

    // Only act on a response that has completed. If the stop button exists,
    // ChatGPT is still generating (or the UI is in a transient state).
    if (document.querySelector('[data-testid="stop-button"]')) {
      schedule(turn, 700);
      return;
    }

    // Require a response action bar to exist; this keeps us from reacting to
    // partially rendered turns.
    const copy = turn.querySelector('[data-testid="copy-turn-action-button"], button[aria-label="Copy response"]');
    if (!copy) { schedule(turn, 500); return; }

    const sig = (turn.innerText || '').slice(-1200);
    if (!sig || sig === lastAssistantSignature) return;
    lastAssistantSignature = sig;
    schedule(turn, settings.settleMs);
  }

  function schedule(turn, delay) {
    clearTimeout(pending.get(turn));
    const id = setTimeout(() => run(turn, 0), delay);
    pending.set(turn, id);
  }

  function getMoreActions(turn) {
    const direct = [...turn.querySelectorAll('button[aria-label="More actions"], button')]
      .filter(b => (b.getAttribute('aria-label') || '').trim().toLowerCase() === 'more actions' || b.matches('[data-testid="more-actions"]'))
      .filter(visible);
    return direct.at(-1) || null;
  }

  function dispatchClick(el) {
    try {
      el.focus({preventScroll:true});
    } catch (_) {}
    // React responds reliably to a real sequence of mouse/pointer events.
    for (const type of ['pointerdown','mousedown','pointerup','mouseup','click']) {
      try { el.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, view:window, buttons:1})); } catch (_) {}
    }
    try { el.click(); } catch (_) {}
  }

  function findReadAloud() {
    const candidates = [
      ...document.querySelectorAll('[role="menuitem"], [role="option"], button, [role="button"], a, div')
    ].filter(visible);

    // Prefer exact/near-exact labels. aria-label is usually the most stable.
    const exact = candidates.find(el => {
      const a = (el.getAttribute('aria-label') || '').trim().toLowerCase();
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase();
      return a === 'read aloud' || a === 'read out loud' || t === 'read aloud' || t === 'read out loud';
    });
    if (exact) return exact;

    // Menu rows sometimes have extra hidden text/icons; allow a contained match.
    return candidates.find(el => {
      const a = (el.getAttribute('aria-label') || '').toLowerCase();
      const t = (el.textContent || '').replace(/\s+/g, ' ').toLowerCase();
      return a.includes('read aloud') || (t.includes('read aloud') && t.length < 80);
    }) || null;
  }

  function run(turn, attempt) {
    if (!settings.enabled || processed.has(turn) || !document.contains(turn)) return;

    if (document.querySelector('[data-testid="stop-button"]')) {
      return retry(turn, attempt, 700);
    }

    // Step 1: explicitly open the assistant response's More actions menu.
    let more = getMoreActions(turn);
    if (!more) {
      // ChatGPT may place the action button outside the exact turn wrapper.
      const copy = turn.querySelector('[data-testid="copy-turn-action-button"], button[aria-label="Copy response"]');
      if (copy) {
        const scope = copy.parentElement?.parentElement;
        more = [...(scope?.querySelectorAll?.('button[aria-label="More actions"]') || [])].filter(visible).at(-1) || null;
      }
    }

    if (!more) return retry(turn, attempt, settings.retryMs);

    dispatchClick(more);

    // Step 2: the menu is created asynchronously. Search repeatedly for the
    // visible Read aloud item. This also handles menus that animate in.
    let checks = 0;
    const look = () => {
      if (!settings.enabled || processed.has(turn)) return;
      const item = findReadAloud();
      if (item && visible(item)) {
        dispatchClick(item);
        processed.add(turn);
        return;
      }
      checks++;
      if (checks < 20) setTimeout(look, 100);
      else retry(turn, attempt, settings.retryMs);
    };
    setTimeout(look, 80);
  }

  function retry(turn, attempt, delay) {
    if (attempt >= settings.maxRetries) return;
    const id = setTimeout(() => run(turn, attempt + 1), delay);
    pending.set(turn, id);
  }
})();
