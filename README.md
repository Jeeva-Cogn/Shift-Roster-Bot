Here is the complete **ShiftBot** application.

### **Step 1: Create the Folder Structure**

First, create the following folders and empty files on your computer. You will then copy the content for each file from below.

```
shiftbot/
├── .gitignore
├── index.html
├── LICENSE
├── package.json
├── README.md
├── css/
│ └── style.css
└── js/
    ├── app.js
    ├── data-manager.js
    ├── reports.js
    ├── rule-engine.js
    ├── schedule-generator.js
    └── utils.js
```

### **Step 2: Copy the Content for Each File**

Copy the code from each block below and paste it into the corresponding empty file you created.

### **`index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShiftBot - AI Roster Management</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js"></script>
</head>
<body>
    <div class="app-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>ShiftBot</h1>
            </div>
            <nav class="sidebar-nav">
                <a href="#dashboard" class="nav-link active" data-section="dashboard">Dashboard</a>
                <a href="#employees" class="nav-link" data-section="employees">Employees</a>
                <a href="#shifts" class="nav-link" data-section="shifts">Shifts</a>
                <a href="#rules" class="nav-link" data-section="rules">AI Rules</a>
                <a href="#generator" class="nav-link" data-section="generator">Schedule Generator</a>
                <a href="#reports" class="nav-link" data-section="reports">Reports</a>
            </nav>
            <div class="sidebar-footer">
                <button id="export-data-btn">Export Data</button>
                <button id="import-data-btn">Import Data</button>
                <input type="file" id="import-file-input" style="display: none;" accept=".json">
            </div>
        </aside>

        <main class="main-content">
            <!-- Dashboard Section -->
            <section id="dashboard" class="content-section active">
                <h2>Dashboard</h2>
                <div class="stats-grid">
                    <div class="stat-card"><h3>Total Employees</h3><p id="total-employees-stat">0</p></div>
                    <div class="stat-card"><h3>Defined Shifts</h3><p id="total-shifts-stat">0</p></div>
                    <div class="stat-card"><h3>Active Rules</h3><p id="total-rules-stat">0</p></div>
                    <div class="stat-card"><h3>Compliance Score</h3><p id="compliance-score-stat">N/A</p></div>
                </div>
                <div class="chart-container">
                    <h3>Workload Distribution</h3>
                    <canvas id="workload-chart"></canvas>
                </div>
            </section>

            <!-- Employees Section -->
            <section id="employees" class="content-section">
                <h2>Employee Management</h2>
                <button id="add-employee-btn">Add New Employee</button>
                <div id="employee-list" class="card-grid"></div>
            </section>

            <!-- Shifts Section -->
            <section id="shifts" class="content-section">
                <h2>Shift Management</h2>
                <button id="add-shift-btn">Add New Shift</button>
                <div id="shift-list" class="card-grid"></div>
            </section>

            <!-- AI Rules Section -->
            <section id="rules" class="content-section">
                <h2>AI Bot Training Rules</h2>
                <button id="add-rule-btn">Add New Rule</button>
                <div id="rule-list" class="card-grid"></div>
            </section>

            <!-- Schedule Generator Section -->
            <section id="generator" class="content-section">
                <h2>Schedule Generator</h2>
                <div class="generator-controls">
                    <label for="schedule-start-date">Start Date:</label>
                    <input type="date" id="schedule-start-date">
                    <label for="schedule-days">Number of Days:</label>
                    <input type="number" id="schedule-days" value="7" min="1" max="31">
                    <button id="generate-schedule-btn">Generate Schedule</button>
                </div>
                <div id="schedule-output" class="schedule-output-container">
                    <h3>Generated Schedule</h3>
                    <div id="schedule-table-container"></div>
                </div>
                 <div id="generation-log"></div>
            </section>

            <!-- Reports Section -->
            <section id="reports" class="content-section">
                <h2>Reports & Analytics</h2>
                <div id="reports-content">
                    <div class="report-item">
                        <h3>Compliance Report</h3>
                        <ul id="compliance-report-list"></ul>
                    </div>
                    <div class="report-item">
                        <h3>Employee Hours</h3>
                        <table id="employee-hours-table">
                           <thead><tr><th>Employee</th><th>Scheduled Hours</th></tr></thead>
                           <tbody></tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modals -->
    <div id="modal-backdrop" class="modal-backdrop hidden"></div>
    <div id="main-modal" class="modal hidden">
        <div class="modal-header">
            <h3 id="modal-title">Modal Title</h3>
            <button id="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
    </div>
    
    <div id="toast-container"></div>

    <script type="module" src="js/app.js"></script>
</body>
</html>
```

### **`css/style.css`**

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #50e3c2;
    --background-color: #f4f7f9;
    --sidebar-bg: #ffffff;
    --card-bg: #ffffff;
    --text-color: #333;
    --text-light: #888;
    --border-color: #e0e6ed;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    margin: 0;
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.app-container {
    display: flex;
    height: 100vh;
}

/* Sidebar */
.sidebar {
    width: 250px;
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.sidebar-header h1 {
    margin: 0;
    color: var(--primary-color);
    font-size: 24px;
}

.sidebar-nav {
    flex-grow: 1;
    padding: 20px 0;
}

.nav-link {
    display: block;
    padding: 12px 20px;
    color: var(--text-light);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    border-left: 3px solid transparent;
}

.nav-link:hover {
    background-color: var(--background-color);
    color: var(--primary-color);
}

.nav-link.active {
    color: var(--primary-color);
    border-left-color: var(--primary-color);
    background-color: #e9f2fe;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid var(--border-color);
}

.sidebar-footer button {
    display: block;
    width: 100%;
    margin-bottom: 10px;
}

/* Main Content */
.main-content {
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
}

.content-section {
    display: none;
}

.content-section.active {
    display: block;
    animation: fadeIn 0.5s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

h2 {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
}

/* Dashboard */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background-color: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow);
    border-left: 5px solid var(--primary-color);
}

.stat-card:nth-child(2) { border-color: var(--secondary-color); }
.stat-card:nth-child(3) { border-color: #f5a623; }
.stat-card:nth-child(4) { border-color: #d0021b; }

.stat-card h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: var(--text-light);
}

.stat-card p {
    margin: 0;
    font-size: 36px;
    font-weight: bold;
    color: var(--text-color);
}

.chart-container {
    background-color: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

/* Cards */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.card {
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 20px;
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

.card h4 {
    margin-top: 0;
    color: var(--primary-color);
}

.card p {
    margin: 5px 0;
    font-size: 14px;
}

.card-actions {
    margin-top: 15px;
    text-align: right;
}

/* Buttons */
button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--font-family);
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #357ABD;
}

button.secondary {
    background-color: #7f8c8d;
}

button.secondary:hover {
    background-color: #6c7a7b;
}

button.danger {
    background-color: #e74c3c;
}

button.danger:hover {
    background-color: #c0392b;
}

/* Forms */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-sizing: border-box;
}

/* Modal */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    width: 90%;
    max-width: 500px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
}

#modal-close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-light);
}

.hidden {
    display: none !important;
}

/* Generator and Schedule Table */
.generator-controls {
    background-color: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

#schedule-table-container {
    overflow-x: auto;
    background-color: var(--card-bg);
    padding: 10px;
    border-radius: 8px;
}

.schedule-table {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap;
}

.schedule-table th, .schedule-table td {
    border: 1px solid var(--border-color);
    padding: 10px;
    text-align: center;
}

.schedule-table th {
    background-color: #f2f2f2;
}

.schedule-table td.off-day {
    background-color: #f9f9f9;
    color: #aaa;
}
.schedule-table td.violation {
    background-color: #ffdddd;
    font-weight: bold;
}

#generation-log {
    margin-top: 20px;
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 15px;
    border-radius: 5px;
    font-family: 'Courier New', Courier, monospace;
    max-height: 200px;
    overflow-y: auto;
}
#generation-log p {
    margin: 2px 0;
}

/* Reports */
#reports-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.report-item {
    background-color: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow);
}
#compliance-report-list {
    padding-left: 20px;
}
#employee-hours-table {
    width: 100%;
    border-collapse: collapse;
}
#employee-hours-table th, #employee-hours-table td {
    border: 1px solid var(--border-color);
    padding: 8px;
    text-align: left;
}

/* Toast Notifications */
#toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000;
}
.toast {
    background-color: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: var(--shadow);
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s;
    transform: translateX(100%);
}
.toast.show {
    opacity: 1;
    transform: translateX(0);
}
.toast.success { background-color: #2ecc71; }
.toast.error { background-color: #e74c3c; }
.toast.info { background-color: var(--primary-color); }

/* Responsive */
@media (max-width: 768px) {
    .app-container {
        flex-direction: column;
    }
    .sidebar {
        width: 100%;
        height: auto;
        flex-direction: row;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        overflow-x: auto;
    }
    .sidebar-header {
        display: none;
    }
    .sidebar-nav {
        display: flex;
        flex-direction: row;
        padding: 0;
    }
    .nav-link {
        padding: 15px;
        border-left: none;
        border-bottom: 3px solid transparent;
    }
    .nav-link.active {
        border-bottom-color: var(--primary-color);
    }
    .sidebar-footer {
        display: none;
    }
    #reports-content {
        grid-template-columns: 1fr;
    }
}
```

### **`js/utils.js`**

```javascript
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 500);
    }, 3000);
}

// Simple deep copy for objects and arrays
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
```

### **`js/data-manager.js`**

```javascript
import { generateId, deepClone } from './utils.js';

const LOCAL_STORAGE_KEY = 'shiftBotData';

const defaultData = {
    employees: [
        { id: generateId(), name: 'Alice Johnson', skills: ['Cashier', 'Stocker'], maxHoursPerWeek: 40, daysOff: [0, 6] },
        { id: generateId(), name: 'Bob Williams', skills: ['Manager', 'Cashier'], maxHoursPerWeek: 40, daysOff: [] },
        { id: generateId(), name: 'Charlie Brown', skills: ['Stocker'], maxHoursPerWeek: 20, daysOff: [1, 2] },
        { id: generateId(), name: 'Diana Prince', skills: ['Manager'], maxHoursPerWeek: 40, daysOff: [5,6] },
    ],
    shifts: [
        { id: generateId(), name: 'Morning Shift', startTime: '08:00', endTime: '16:00', requiredSkills: ['Cashier', 'Stocker'] },
        { id: generateId(), name: 'Evening Shift', startTime: '15:00', endTime: '23:00', requiredSkills: ['Cashier', 'Manager'] },
        { id: generateId(), name: 'Night Shift', startTime: '22:00', endTime: '06:00', requiredSkills: ['Stocker', 'Manager'] },
    ],
    rules: [
        { id: generateId(), type: 'MIN_REST_HOURS', value: 10, description: 'Minimum 10 hours rest between shifts' },
        { id: generateId(), type: 'MAX_CONSECUTIVE_DAYS', value: 5, description: 'Maximum 5 consecutive work days' },
    ],
    schedule: null,
};

let appData = loadData();

function loadData() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // If no data, save and return default data
    saveData(defaultData);
    return deepClone(defaultData);
}

function saveData(data = appData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export function getData() {
    return appData;
}

export function importData(jsonData) {
    try {
        const newData = JSON.parse(jsonData);
        // Basic validation
        if (newData.employees && newData.shifts && newData.rules) {
            appData = newData;
            saveData();
            return true;
        }
        return false;
    } catch (e) {
        console.error("Failed to parse import data", e);
        return false;
    }
}

// --- CRUD Operations ---

function createItem(type, itemData) {
    const newItem = { id: generateId(), ...itemData };
    appData[type].push(newItem);
    saveData();
    return newItem;
}

function updateItem(type, itemId, updateData) {
    const itemIndex = appData[type].findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        appData[type][itemIndex] = { ...appData[type][itemIndex], ...updateData };
        saveData();
        return appData[type][itemIndex];
    }
    return null;
}

function deleteItem(type, itemId) {
    const initialLength = appData[type].length;
    appData[type] = appData[type].filter(item => item.id !== itemId);
    if (appData[type].length < initialLength) {
        saveData();
        return true;
    }
    return false;
}

export const employees = {
    getAll: () => appData.employees,
    getById: (id) => appData.employees.find(e => e.id === id),
    create: (data) => createItem('employees', data),
    update: (id, data) => updateItem('employees', id, data),
    delete: (id) => deleteItem('employees', id),
};

export const shifts = {
    getAll: () => appData.shifts,
    getById: (id) => appData.shifts.find(s => s.id === id),
    create: (data) => createItem('shifts', data),
    update: (id, data) => updateItem('shifts', id, data),
    delete: (id) => deleteItem('shifts', id),
};

export const rules = {
    getAll: () => appData.rules,
    getById: (id) => appData.rules.find(r => r.id === id),
    create: (data) => createItem('rules', data),
    update: (id, data) => updateItem('rules', id, data),
    delete: (id) => deleteItem('rules', id),
};

export const schedule = {
    get: () => appData.schedule,
    set: (newSchedule) => {
        appData.schedule = newSchedule;
        saveData();
    },
};
```

### **`js/rule-engine.js`**

```javascript
import { shifts } from './data-manager.js';

const { DateTime } = luxon;

// Main function to check all rules for a given schedule assignment
export function checkAllRules(employee, shift, date, schedule) {
    const allRules = schedule.rules;
    const violations = [];

    allRules.forEach(rule => {
        const checkFunction = ruleCheckers[rule.type];
        if (checkFunction) {
            const result = checkFunction(employee, shift, date, schedule, rule.value);
            if (!result.passed) {
                violations.push({
