# NPE ShiftBot - AI Roster Management (Public Domain)

NPE ShiftBot is a powerful, client-side web application for intelligently managing NPE team shift rosters. It features Excel integration, analytics dashboard, and a customizable AI rule engine to automate scheduling while respecting complex constraints like labor laws, operational needs, and employee preferences.

## Features

- **Interactive Dashboard**: Real-time overview of key metrics with beautiful purple theme and analytics charts.
- **NPE Team Management**: Manage 12 NPE team members (3 Leads + 9 Associates) with role-based assignments.
- **Excel Integration**: Complete Excel import/export functionality (no more JSON files).
- **Analytics Dashboard**: Interactive charts showing team statistics, workload distribution, and member analysis.
- **Shift Configuration**: Define various shift types (S1-S4, General, Production, HIH) with specific times and requirements.
- **AI Rule Engine**: Smart scheduling based on roles and availability without complex skills management.
- **Mobile Responsive**: Works perfectly on all devices with purple theme and touch-friendly controls.
- **PWA Support**: Can be installed as a native app on mobile devices.
- **Data Management**: Excel-based import/export with local storage persistence.

## Getting Started

This is a pure client-side application. No server or build process is needed.

1. **Clone the repository or download the files:**
   ```bash
   git clone https://github.com/Jeeva-Cogn/Shift-Roster-Bot.git
   cd Shift-Roster-Bot/shiftbot
   ```

2. **Open index.html in your browser:**
   Simply double-click the `index.html` file or open it from your browser's "File -> Open" menu.

That's it! The NPE ShiftBot is ready to use with all Excel functionality and analytics.

## How It Works

- **Front-End**: Built with HTML, CSS, and modern JavaScript with beautiful purple theme.
- **Data Storage**: All data stored locally in browser's localStorage with Excel export capability.
- **Excel Integration**: Uses XLSX library for complete Excel file handling.
- **Analytics**: Chart.js for interactive charts and data visualization.
- **Scheduling "AI"**: Smart role-based assignment algorithm optimized for NPE team structure.
- **Dependencies**: Chart.js, Luxon, and XLSX library loaded via CDN.

## Customization

All code is provided and commented. You can easily customize it:

- **UI**: Modify `css/style.css` to change colors or layout (currently beautiful purple theme).
- **Logic**: Extend functionality by editing JavaScript files in the `js/` directory.
- **Team Structure**: Easily modify NPE team members in `js/data-manager.js`.

## Public Domain

**This software is released into the public domain.** You are free to use, modify, distribute, and sell this software without any restrictions or attribution requirements. See the UNLICENSE file for details.

For more information about public domain software, visit: https://unlicense.org
