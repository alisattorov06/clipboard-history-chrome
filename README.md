# Clipboard History Pro

Clipboard History Pro — Chrome Extension bo‘lib, brauzer ichida nusxa olingan matnlarni saqlaydi va Alt + Right Click orqali tezkor panelda ko‘rsatadi. Tanlangan elementni bir bosishda joriy input maydoniga joylashtirish mumkin.

---

## 🚀 Features

* Automatic clipboard capture (browser context)
* FIFO-based history (max 500 items)
* Duplicate prevention
* Alt + Right Click quick-access panel
* Insert at cursor position
* Works with:

  * input
  * textarea
  * contenteditable
* Shadow DOM overlay (no CSS conflicts)
* Lightweight, no external libraries
* No external API calls (local storage only)

---

## ⚙️ How It Works

1. Copy any text inside Chrome.
2. Press **Alt + Right Click** anywhere on the page.
3. A floating history panel appears.
4. Click an item:

   * If input field is focused → inserts at cursor
   * If no input focused → copies back to clipboard
5. Press **ESC** or click outside to close.

---

## 🔒 Privacy & Security

* All data stored locally using `chrome.storage.local`
* No external servers
* No analytics
* No data collection
* Password fields are ignored

---

## 📦 Installation

### Method 1 — Load Unpacked (Developer Mode)

1. Download ZIP file
   👉 **Download:** [https://drive.google.com/file/d/1uMs0RQx8FhFXOqT9IXv58KwdiEmIeKAc/view?usp=sharing]

2. Extract the folder.

3. Open Chrome and go to:

   chrome://extensions/

4. Enable **Developer mode** (top right).

5. Click **Load unpacked**.

6. Select the extracted folder.

Extension is now active.

---

## 📁 Project Structure

```
clipboard-history-pro/
  manifest.json
  background.js
  content.js
```

---

## 🧠 Technical Overview

* Manifest V3
* Background Service Worker
* Content Script Injection
* Shadow DOM Overlay Panel
* FIFO History Management
* Cursor-aware text insertion
* No external dependencies

---

## 📌 Limitations

* Only captures clipboard events inside Chrome.
* Does not monitor OS-level clipboard.
* Global desktop clipboard monitoring requires native application integration.

---

## 🛠 Development

No build step required.
Pure Vanilla JavaScript + Manifest V3.

To modify:

* Edit files
* Reload extension in `chrome://extensions/`

---

## 📄 License

MIT License — Free to use and modify.
