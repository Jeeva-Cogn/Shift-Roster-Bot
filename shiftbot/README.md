# ShiftBot - AI Roster Management

ShiftBot is a powerful, client-side web application for intelligently managing employee shift rosters. It features a customizable AI rule engine to automate scheduling while respecting complex constraints like labor laws, operational needs, and employee preferences.

## Features

- **Interactive Dashboard**: Real-time overview of key metrics like employee count, shift definitions, and schedule compliance scores.
- **Employee Management**: Create and manage detailed employee profiles, including skills, availability, and work constraints.
- **Shift Configuration**: Define various shift types (e.g., morning, evening, night) with specific times and skill requirements.
- **AI Rule Engine**: Train the bot with custom rules such as:
  - Minimum rest hours between shifts.
  - Maximum consecutive working days.
  - Required skills for specific shifts.
  - Employee day-off preferences.
- **Automated Schedule Generator**: A heuristic-based algorithm generates optimized rosters based on your defined rules, minimizing violations.
- **Detailed Reports**: Analyze workload distribution, scheduled hours per employee, and view a full compliance report identifying any rule violations in the generated schedule.
- **Data Management**: Easily import and export all your application data (employees, shifts, rules) in JSON format.

## Getting Started

This is a pure client-side application. No server or build process is needed.

1. **Clone the repository or download the files:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/shiftbot.git
   cd shiftbot
   ```

2. **Open index.html in your browser:**
   Simply double-click the `index.html` file or open it from your browser's "File -> Open" menu.

That's it! The application is ready to use.

## How It Works

- **Front-End**: The entire application is built with HTML, CSS, and modern JavaScript (ES6 Modules).
- **Data Storage**: All data is stored locally in your browser's localStorage. This means your data persists between sessions on the same computer and browser.
- **Scheduling "AI"**: The core logic in `schedule-generator.js` uses a constraint-based heuristic algorithm. It iterates through each shift that needs to be filled and assigns the "best" available employee by scoring them against the defined rules in `rule-engine.js`. This provides intelligent, automated scheduling without requiring a complex backend.
- **Dependencies**: Uses Chart.js for charts and Luxon for robust date/time handling, both loaded via CDN.

## Customization

All the code is provided and commented. You can easily customize it:

- **UI**: Modify `css/style.css` to change the look and feel.
- **Logic**: Extend the functionality by editing the JavaScript files in the `js/` directory. For example, you could add new rule types to `js/rule-engine.js`.

## License

MIT License - see LICENSE file for details.
