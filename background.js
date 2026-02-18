const MAX_ITEMS = 500;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("clips", (res) => {
    if (!res.clips) chrome.storage.local.set({ clips: [] });
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_CLIP") {
    chrome.storage.local.get("clips", (res) => {
      let clips = res.clips || [];

      if (clips.some(c => c.text === msg.text)) {
        sendResponse({ success: false });
        return;
      }

      const item = {
        id: Date.now().toString(),
        text: msg.text,
        url: sender.tab?.url || "",
        timestamp: Date.now()
      };

      clips.unshift(item);

      if (clips.length > MAX_ITEMS) {
        clips = clips.slice(0, MAX_ITEMS);
      }

      chrome.storage.local.set({ clips });
      sendResponse({ success: true });
    });
    return true;
  }

  if (msg.type === "GET_CLIPS") {
    chrome.storage.local.get("clips", (res) => {
      sendResponse(res.clips || []);
    });
    return true;
  }
});
