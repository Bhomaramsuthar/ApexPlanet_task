# TaskMinder - Task Management Dashboard

A premium, production-ready, performant, and fully responsive Task Management Dashboard built entirely with HTML, CSS, and Vanilla JavaScript.

## 🚀 Project Overview

TaskMinder is designed as a capstone web application demonstrating high-quality frontend development practices. It provides a sleek, glassmorphic UI, smooth micro-interactions, dark/light mode switching, and persistent local storage data handling.

## ✨ Features

- **Advanced UI/UX**: Custom premium design with a dark mode base utilizing CSS glassmorphism (`backdrop-filter`) and vibrant gradients.
- **Responsive Layout**: Utilizing CSS Flexbox and Grid, the dashboard gracefully scales from desktop all the way down to a mobile app-like interface.
- **Local Storage Integration**: All tasks, their completion status, and the user's selected theme are persisted using the browser's `localStorage` API. No backend needed!
- **Theme Toggling**: Users can easily switch between fully customized light and dark themes spanning across custom CSS variables.
- **Dynamic Filtering & Sorting**: Sort tasks by Newest, Oldest, or Priority. Filter views dynamically by Pending, completed, or specific project types.
- **Custom Toasts & Validation**: Beautiful custom toast notification system and real-time form validations.

## 📁 File Structure

```text
/Task_5
├── index.html           # Main markup file and entry point
├── css/
│   ├── main.css         # CSS Variables (Theme Data) & Base resets
│   └── dashboard.css    # Layout shell and Component-level styles
├── js/
│   ├── storage.js       # LocalStorage CRUD operations wrapper
│   ├── components.js    # Secure dynamic HTML generation methods
│   └── app.js           # Core event listeners and view controllers
├── images/              # Assets directory
└── README.md            # Project Documentation
```

## ⚡ Performance Optimization Techniques Used

1. **Render Blocking Reduction**: All JavaScript files (`storage.js`, `components.js`, `app.js`) are loaded with the `defer` attribute instead of placing them at the end of the body or blocking the header.
2. **Resource Hints**: Implemented `<link rel="preconnect">` for third-party web fonts (Google Fonts) to establish early connections.
3. **Lazy Loading Images**: Added `<img loading="lazy">` to the profile avatars, so off-screen or low-priority images don't block the initial page rendering load.
4. **Optimized CSS**: Split CSS into modular chunks (`main.css`, `dashboard.css`) and utilized CSS Custom Properties heavily to reduce selector specificity and calculation times.
5. **Efficient DOM Updates**: Leveraging Event Delegation for dynamically generated content (like the entire Task List) instead of attaching standard event listeners to every single node.
6. **Cross-Site Scripting (XSS) Prevention**: A custom `escapeHTML` helper was implemented before injecting any text inputs via `.innerHTML` to prevent script injections.

## 🌐 Browser Compatibility Testing

The application has been tested and ensures functioning fallbacks across:
- **Chrome / Edge / Brave (Chromium)**: Full support for animations, transitions, and CSS Grid.
- **Firefox**: `backdrop-filter` natively supported on newer versions, with seamless graceful degradation for older versions lacking `blur()` filters.
- **Safari / iOS Mobile**: Utilized `-webkit-` prefixes where strictly required (e.g. for `-webkit-backdrop-filter: blur()`).
- Responsive Media Queries specifically tested on simulated viewports for iPhone 14/15, iPad (Tablet), and standard 1080p Desktop.

## 🛠️ Setup Instructions

1. Clone or download the repository.
2. Unzip the project folder if downloaded.
3. You do not need Node.js or a build step to view this app.
4. You can simply double click `index.html` to open it locally within any modern browser.
5. **(Recommended)**: For the best experience (especially concerning module loading / local storage caching), use an extension like VSCode's **Live Server** to run it on `http://127.0.0.1:5500`.

---
*Built as a frontend capstone project demonstrating modern, Vanilla web development mastery.*
