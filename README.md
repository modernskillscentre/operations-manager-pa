# 👔 Operations Manager & PA + 2-Way Multi-Device Cloud Sync

A zero-friction idea triage system and executive planner powered by Google's Gemini API, with built-in **2-Way Multi-Device Cloud Sync (Google Sheets)**, **Time-Synced Focus Tracker**, and **Excel (.xlsx)** export.

Built specifically for creative entrepreneurs who get flooded with ideas while on the move, saving cognitive energy and willpower so you can focus on shipping your primary goals across all your devices.

---

## 🌐 📱 True Multi-Device 2-Way Sync (Phone, PC, Tablet, Laptop)

Every device you own stays in 100% synchronization:

1. **How It Works**:
   - Your Google Sheet acts as your **free, private cloud database**.
   - When you dump an idea on your phone outside, it pushes to your Google Sheet in real time.
   - When you sit down at your PC, your dashboard automatically pulls the new ideas.
   - When you update your **Goals & Deadlines** on PC, your phone immediately adopts the new goals.
   - When you check off tasks or complete sprints, status updates across all screens.

2. **How to Connect a New Device in 5 Seconds (QR Code & Instant Link)**:
   - In Settings (or on the pairing screen), click **"📱 Pair Device (QR)"**.
   - Scan the QR code with your phone camera (or open the pairing link).
   - The new device **automatically configures your Gemini API key, imports your cloud database link, and loads all your ideas** with zero manual typing!

---

## 🚀 Setting Up Your Free Cloud Backend (30 Seconds)

1. Open a new spreadsheet at [sheets.new](https://sheets.new).
2. Click **Extensions $\rightarrow$ Apps Script**.
3. Open the file `google_apps_script.js` located in your `tools/brain-dump-manager` folder.
4. Copy all the code, delete whatever is in the Apps Script editor, and paste the code.
5. Click **Deploy $\rightarrow$ New Deployment $\rightarrow$ Web App**.
   - Set "Execute as": **Me**
   - Set "Who has access": **Anyone**
6. Click **Deploy**, grant permissions, and copy the **Web App URL**.
7. In your Brain Dump web app, open **Settings (⚙️)**, paste the Web App URL into **"Multi-Device Google Sheet Cloud Sync"**, and click **Save Settings**!

---

## 🎯 ⏱️ Time-Synced Focus Mode Tracker

Once your ideas are triaged, execute with zero distraction:

1. **Auto-Focus Top Priority**:
   - Tap **"Auto-Focus Top Task"** or click **"Focus"** on any card.
   - Launches an active focus sprint immediately.
2. **True Wall-Clock Time-Sync (Zero Timer Drift)**:
   - Uses real wall-clock timestamps (`Date.now()`), so the countdown **never drifts or freezes**, even if your phone screen goes to sleep, you switch apps, or refresh the page.
   - Synchronizes remaining time straight into your **browser tab title** (e.g. `(18:24) 🎯 English Idiom Reel`), so you always see remaining time while working in Premiere Pro, CapCut, or Canva!
3. **Interactive 3-Step Execution Checklist**:
   - Check off Step 1 (5-minute kickoff), Step 2 (Core action), and Step 3 (Done definition) in real-time.
4. **Completion Chime & Auto-Sync**:
   - Clicking **"Complete Task & Sync"** marks the task finished, plays a pleasant Web Audio chord chime, and automatically updates **`ideas.xlsx`** and your Google Sheet!
5. **Sticky Mini-Tracker**:
   - When scrolling down the board to review notes or dump a thought, a floating mini tracker stays pinned at the bottom of the screen with quick Pause/Done controls.

---

## 📊 3 Ways It Connects to Excel & Spreadsheets

1. **Live Multi-Device Google Sheet Sync**:
   - Accessible from any phone, laptop, or desktop in real-time.
   - Visual spreadsheet you can view, sort, or download as Excel anytime.

2. **Automatic Local Excel Sync (`ideas.xlsx`)**:
   - Double-click `start.bat`.
   - Every idea automatically appends as a new row to `ideas.xlsx` in your folder.

3. **Instant 1-Click Excel Export (`.xlsx`)**:
   - Tap the **"Excel"** button in the top navigation bar at any time (on desktop or mobile).
   - Downloads a cleanly styled, auto-formatted `.xlsx` spreadsheet directly to your device.

---

## 📱 How to Use on Your Phone While Outside

1. Put the `tools/brain-dump-manager` folder on [Netlify Drop](https://app.netlify.com/drop) or [Vercel](https://vercel.com) (free).
2. Open the link on your phone, scan your **Pairing QR Code** (or paste your link), and tap **"Add to Home Screen"**.
3. It now works as a full mobile app on your phone with voice dictation, full AI triage, and real-time sync with your PC!
