let panelRoot = null;
let shadow = null;
let activeInput = null;

function isEditable(el) {
  if (!el) return false;
  if (el.tagName === "INPUT" && el.type !== "password") return true;
  if (el.tagName === "TEXTAREA") return true;
  if (el.isContentEditable) return true;
  return false;
}

/* COPY LISTENER */
document.addEventListener("copy", () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (!text) return;

  chrome.runtime.sendMessage({
    type: "SAVE_CLIP",
    text
  });
});

/* ALT + RIGHT CLICK */
document.addEventListener("contextmenu", async (e) => {
  if (!e.altKey) return; // Only Alt + Right Click

  activeInput = document.activeElement;

  const clips = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_CLIPS" }, resolve);
  });

  showPanel(clips.slice(0, 10));
});

/* PANEL */
function showPanel(clips) {
  removePanel();

  panelRoot = document.createElement("div");
  panelRoot.style.position = "fixed";
  panelRoot.style.top = "20px";
  panelRoot.style.right = "20px";
  panelRoot.style.zIndex = "2147483647";

  shadow = panelRoot.attachShadow({ mode: "open" });

  const container = document.createElement("div");
  container.style.width = "320px";
  container.style.maxHeight = "400px";
  container.style.overflowY = "auto";
  container.style.background = "#1e1e2f";
  container.style.border = "1px solid #333";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
  container.style.padding = "10px";
  container.style.fontFamily = "sans-serif";

  if (!clips.length) {
    container.innerHTML = `<div style="color:#aaa;text-align:center;padding:20px;">No history</div>`;
  }

  clips.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item.text.length > 100
      ? item.text.substring(0, 100) + "..."
      : item.text;

    el.style.padding = "8px";
    el.style.marginBottom = "6px";
    el.style.background = "#2a2a3a";
    el.style.borderRadius = "8px";
    el.style.cursor = "pointer";
    el.style.color = "#fff";
    el.style.fontSize = "13px";

    el.addEventListener("mouseenter", () => {
      el.style.background = "#3a3a4a";
    });

    el.addEventListener("mouseleave", () => {
      el.style.background = "#2a2a3a";
    });

    el.addEventListener("click", () => {
      handleInsert(item.text);
      removePanel();
    });

    container.appendChild(el);
  });

  shadow.appendChild(container);
  document.body.appendChild(panelRoot);

  document.addEventListener("click", outsideClose);
  document.addEventListener("keydown", escClose);
}

function removePanel() {
  if (panelRoot) {
    panelRoot.remove();
    panelRoot = null;
  }
  document.removeEventListener("click", outsideClose);
  document.removeEventListener("keydown", escClose);
}

function outsideClose(e) {
  if (!panelRoot) return;
  if (!panelRoot.contains(e.target)) removePanel();
}

function escClose(e) {
  if (e.key === "Escape") removePanel();
}

/* INSERT LOGIC */
function handleInsert(text) {
  if (!isEditable(activeInput)) {
    navigator.clipboard.writeText(text);
    return;
  }

  if (activeInput.tagName === "INPUT" ||
      activeInput.tagName === "TEXTAREA") {

    const start = activeInput.selectionStart;
    const end = activeInput.selectionEnd;
    const value = activeInput.value;

    activeInput.value =
      value.substring(0, start) +
      text +
      value.substring(end);

    activeInput.selectionStart =
      activeInput.selectionEnd =
      start + text.length;

    activeInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  else if (activeInput.isContentEditable) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const node = document.createTextNode(text);
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}
