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

js/rule-engine.js

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
                violations.push({ ruleType: rule.type, message: result.message });
            }
        }
    });

    return violations;
}

// Helper function to get shift times on a specific date
function getShiftDateTime(shiftId, date) {
    const shift = shifts.getById(shiftId);
    if (!shift) return null;
    
    let start = DateTime.fromISO(date.toISODate() + 'T' + shift.startTime);
    let end = DateTime.fromISO(date.toISODate() + 'T' + shift.endTime);

    if (end < start) {
        end = end.plus({ days: 1 });
    }
    return { start, end };
}

const ruleCheckers = {
    MIN_REST_HOURS: (employee, newShift, date, schedule, ruleValue) => {
        const newShiftTimes = getShiftDateTime(newShift.id, date);
        if (!newShiftTimes) return { passed: true };

        const previousDay = date.minus({ days: 1 });
        const previousDayShiftId = schedule.assignments[employee.id]?.[previousDay.toISODate()];
        
        if (previousDayShiftId) {
            const prevShiftTimes = getShiftDateTime(previousDayShiftId, previousDay);
            if (prevShiftTimes) {
                const hoursBetween = newShiftTimes.start.diff(prevShiftTimes.end, 'hours').hours;
                if (hoursBetween < ruleValue) {
                    return { passed: false, message: `Less than ${ruleValue} hours rest (had ${hoursBetween.toFixed(1)}h).` };
                }
            }
        }
        return { passed: true };
    },

    MAX_CONSECUTIVE_DAYS: (employee, newShift, date, schedule, ruleValue) => {
        let consecutiveDays = 0;
        for (let i = 0; i < ruleValue + 1; i++) {
            const checkDate = date.minus({ days: i });
            if (schedule.assignments[employee.id]?.[checkDate.toISODate()]) {
                consecutiveDays++;
            } else {
                break;
            }
        }
        if (consecutiveDays >= ruleValue) {
            return { passed: false, message: `Exceeds max ${ruleValue} consecutive days.` };
        }
        return { passed: true };
    },

    REQUIRED_SKILL: (employee, newShift, date, schedule, ruleValue) => {
        // This is handled by pre-filtering candidates, but we can double check
        const hasSkill = newShift.requiredSkills.every(skill => employee.skills.includes(skill));
        if (!hasSkill) {
            return { passed: false, message: `Missing required skill for ${newShift.name}.` };
        }
        return { passed: true };
    },
    
    DAY_OFF: (employee, newShift, date, schedule, ruleValue) => {
        const dayOfWeek = date.weekday % 7; // Luxon: Mon=1, Sun=7. We use 0 for Sunday.
        if (employee.daysOff.includes(dayOfWeek)) {
            return { passed: false, message: `Scheduled on a preferred day off.` };
        }
        return { passed: true };
    }
};


js/schedule-generator.js

import { employees, shifts, rules } from './data-manager.js';
import { checkAllRules } from './rule-engine.js';
import { deepClone } from './utils.js';

const { DateTime } = luxon;

export function generateSchedule(startDateStr, numDays) {
    const log = [];
    const startDate = DateTime.fromISO(startDateStr);
    const allEmployees = employees.getAll();
    const allShifts = shifts.getAll();
    const allRules = rules.getAll();

    const schedule = {
        startDate: startDateStr,
        numDays,
        rules: allRules,
        assignments: {}, // { employeeId: { 'YYYY-MM-DD': shiftId } }
        violations: {}, // { 'YYYY-MM-DD': { employeeId: [violation messages] } }
    };
    allEmployees.forEach(e => {
        schedule.assignments[e.id] = {};
        schedule.violations[e.id] = {};
    });

    log.push(`Starting schedule generation from ${startDate.toISODate()} for ${numDays} days.`);

    for (let i = 0; i < numDays; i++) {
        const currentDate = startDate.plus({ days: i });
        const currentDateStr = currentDate.toISODate();
        log.push(`\n--- Processing ${currentDateStr} ---`);

        for (const shift of allShifts) {
            log.push(`Attempting to fill ${shift.name}...`);
            
            // 1. Find eligible candidates
            const candidates = allEmployees.filter(emp => 
                shift.requiredSkills.every(skill => emp.skills.includes(skill))
            );
            
            if (candidates.length === 0) {
                log.push(`WARNING: No employees found with required skills for ${shift.name}.`);
                continue;
            }

            // 2. Score candidates
            let bestCandidate = null;
            let minViolations = Infinity;

            for (const candidate of candidates) {
                // Already assigned today? Skip.
                if (schedule.assignments[candidate.id][currentDateStr]) {
                    continue;
                }

                // Create a temporary schedule to check rules
                const tempSchedule = deepClone(schedule);
                tempSchedule.assignments[candidate.id][currentDateStr] = shift.id;

                const violations = checkAllRules(candidate, shift, currentDate, tempSchedule);
                
                if (violations.length < minViolations) {
                    minViolations = violations.length;
                    bestCandidate = candidate;
                }
                
                // If a candidate has no violations, they are a great match
                if (violations.length === 0) {
                   bestCandidate = candidate;
                   break;
                }
            }
            
            // 3. Assign the best candidate
            if (bestCandidate) {
                schedule.assignments[bestCandidate.id][currentDateStr] = shift.id;
                const finalViolations = checkAllRules(bestCandidate, shift, currentDate, schedule);
                if (finalViolations.length > 0) {
                    schedule.violations[bestCandidate.id][currentDateStr] = finalViolations.map(v => v.message);
                    log.push(`Assigned ${bestCandidate.name} to ${shift.name} with ${finalViolations.length} violation(s).`);
                } else {
                    log.push(`Assigned ${bestCandidate.name} to ${shift.name}.`);
                }
            } else {
                log.push(`ERROR: Could not find any suitable candidate for ${shift.name}.`);
            }
        }
    }
    
    log.push('\nSchedule generation complete.');
    return { schedule, log };
}

js/reports.js

import { employees, shifts } from './data-manager.js';
const { Duration } = luxon;

export function generateComplianceReport(schedule) {
    if (!schedule) return [];
    const report = [];
    for (const empId in schedule.violations) {
        for (const date in schedule.violations[empId]) {
            const violations = schedule.violations[empId][date];
            if (violations && violations.length > 0) {
                const employee = employees.getById(empId);
                report.push(`- ${date}: ${employee.name} - ${violations.join(', ')}`);
            }
        }
    }
    return report.length > 0 ? report : ['No violations found.'];
}

export function generateEmployeeHoursReport(schedule) {
    if (!schedule) return [];
    const employeeHours = {};
    employees.getAll().forEach(e => employeeHours[e.id] = 0);

    for (const empId in schedule.assignments) {
        for (const date in schedule.assignments[empId]) {
            const shiftId = schedule.assignments[empId][date];
            if (shiftId) {
                const shift = shifts.getById(shiftId);
                const start = Duration.fromISOTime(shift.startTime);
                const end = Duration.fromISOTime(shift.endTime);
                let duration = end.minus(start);
                if (duration.as('hours') < 0) {
                    duration = duration.plus({ days: 1 });
                }
                employeeHours[empId] += duration.as('hours');
            }
        }
    }
    
    return Object.entries(employeeHours).map(([empId, hours]) => ({
        name: employees.getById(empId).name,
        hours: hours.toFixed(1)
    }));
}

js/app.js


import { employees, shifts, rules, schedule, getData, importData } from './data-manager.js';
import { generateSchedule } from './schedule-generator.js';
import { generateComplianceReport, generateEmployeeHoursReport } from './reports.js';
import { showToast } from './utils.js';

const { DateTime } = luxon;
let workloadChart = null;

// --- Navigation ---
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDashboard();
    initEmployees();
    initShifts();
    initRules();
    initGenerator();
    initReports();
    initDataIO();
    
    // Initial Render
    renderAll();
});

function initNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');

            if (sectionId === 'dashboard') updateDashboard();
            if (sectionId === 'reports') renderReports();
        });
    });
}

// --- Render Functions ---
function renderAll() {
    renderEmployeeList();
    renderShiftList();
    renderRuleList();
    updateDashboard();
    renderSchedule();
    renderReports();
}

function updateDashboard() {
    document.getElementById('total-employees-stat').textContent = employees.getAll().length;
    document.getElementById('total-shifts-stat').textContent = shifts.getAll().length;
    document.getElementById('total-rules-stat').textContent = rules.getAll().length;

    const currentSchedule = schedule.get();
    if(currentSchedule) {
        const complianceReport = generateComplianceReport(currentSchedule);
        const totalViolations = complianceReport.filter(r => r !== 'No violations found.').length;
        const totalAssignments = Object.values(currentSchedule.assignments).flatMap(Object.values).filter(Boolean).length;
        const score = totalAssignments > 0 ? Math.max(0, 100 * (1 - totalViolations / totalAssignments)) : 100;
        document.getElementById('compliance-score-stat').textContent = `${score.toFixed(0)}%`;
        
        // Update chart
        const hoursReport = generateEmployeeHoursReport(currentSchedule);
        if (workloadChart) workloadChart.destroy();
        const ctx = document.getElementById('workload-chart').getContext('2d');
        workloadChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hoursReport.map(r => r.name),
                datasets: [{
                    label: 'Scheduled Hours',
                    data: hoursReport.map(r => r.hours),
                    backgroundColor: 'rgba(74, 144, 226, 0.7)',
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } else {
        document.getElementById('compliance-score-stat').textContent = 'N/A';
    }
}

// --- CRUD UI ---
function openModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.getElementById('main-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
    document.getElementById('main-modal').classList.add('hidden');
}

document.getElementById('modal-close-btn').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

function createCard(title, content, actions) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h4>${title}</h4>
        ${content}
        <div class="card-actions">${actions}</div>
    `;
    return card;
}

// --- Employees ---
function initEmployees() {
    document.getElementById('add-employee-btn').addEventListener('click', () => showEmployeeForm());
}
function renderEmployeeList() {
    const list = document.getElementById('employee-list');
    list.innerHTML = '';
    employees.getAll().forEach(emp => {
        const content = `
            <p><strong>Skills:</strong> ${emp.skills.join(', ')}</p>
            <p><strong>Max Hours/Week:</strong> ${emp.maxHoursPerWeek}</p>
            <p><strong>Days Off:</strong> ${emp.daysOff.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'None'}</p>
        `;
        const actions = `
            <button class="edit-btn" data-id="${emp.id}">Edit</button>
            <button class="delete-btn danger" data-id="${emp.id}">Delete</button>
        `;
        const card = createCard(emp.name, content, actions);
        list.appendChild(card);
    });

    list.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', e => showEmployeeForm(employees.getById(e.target.dataset.id))));
    list.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', e => {
        if(confirm('Are you sure you want to delete this employee?')) {
            employees.delete(e.target.dataset.id);
            renderAll();
            showToast('Employee deleted.', 'success');
        }
    }));
}
function showEmployeeForm(emp = null) {
    const formHtml = `
        <form id="employee-form">
            <input type="hidden" name="id" value="${emp?.id || ''}">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" value="${emp?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Skills (comma-separated)</label>
                <input type="text" name="skills" value="${emp?.skills.join(', ') || ''}">
            </div>
            <div class="form-group">
                <label>Max Hours/Week</label>
                <input type="number" name="maxHoursPerWeek" value="${emp?.maxHoursPerWeek || 40}">
            </div>
            <button type="submit">${emp ? 'Update' : 'Add'} Employee</button>
        </form>
    `;
    openModal(emp ? 'Edit Employee' : 'Add Employee', formHtml);
    document.getElementById('employee-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
        data.maxHoursPerWeek = parseInt(data.maxHoursPerWeek);
        data.daysOff = emp?.daysOff || []; // Not editable in this simple form
        
        if (emp) {
            employees.update(emp.id, data);
            showToast('Employee updated.', 'success');
        } else {
            employees.create(data);
            showToast('Employee added.', 'success');
        }
        closeModal();
        renderAll();
    });
}

// --- Shifts ---
function initShifts() {
    document.getElementById('add-shift-btn').addEventListener('click', () => showShiftForm());
}
function renderShiftList() {
    const list = document.getElementById('shift-list');
    list.innerHTML = '';
    shifts.getAll().forEach(s => {
        const content = `
            <p><strong>Time:</strong> ${s.startTime} - ${s.endTime}</p>
            <p><strong>Required Skills:</strong> ${s.requiredSkills.join(', ')}</p>
        `;
        const actions = `
            <button class="edit-btn" data-id="${s.id}">Edit</button>
            <button class="delete-btn danger" data-id="${s.id}">Delete</button>
        `;
        const card = createCard(s.name, content, actions);
        list.appendChild(card);
    });
    list.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', e => showShiftForm(shifts.getById(e.target.dataset.id))));
    list.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', e => {
        if(confirm('Are you sure?')) {
            shifts.delete(e.target.dataset.id);
            renderAll();
            showToast('Shift deleted.', 'success');
        }
    }));
}
function showShiftForm(s = null) {
    const formHtml = `
        <form id="shift-form">
             <input type="hidden" name="id" value="${s?.id || ''}">
            <div class="form-group"><label>Name</label><input type="text" name="name" value="${s?.name || ''}" required></div>
            <div class="form-group"><label>Start Time</label><input type="time" name="startTime" value="${s?.startTime || ''}" required></div>
            <div class="form-group"><label>End Time</label><input type="time" name="endTime" value="${s?.endTime || ''}" required></div>
            <div class="form-group"><label>Required Skills (comma-separated)</label><input type="text" name="requiredSkills" value="${s?.requiredSkills.join(', ') || ''}"></div>
            <button type="submit">${s ? 'Update' : 'Add'} Shift</button>
        </form>
    `;
    openModal(s ? 'Edit Shift' : 'Add Shift', formHtml);
    document.getElementById('shift-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.requiredSkills = data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
        if (s) {
            shifts.update(s.id, data);
            showToast('Shift updated.', 'success');
        } else {
            shifts.create(data);
            showToast('Shift added.', 'success');
        }
        closeModal();
        renderAll();
    });
}

// --- Rules ---
function initRules() {
    document.getElementById('add-rule-btn').addEventListener('click', () => showRuleForm());
}
function renderRuleList() {
    const list = document.getElementById('rule-list');
    list.innerHTML = '';
    rules.getAll().forEach(r => {
        const content = `<p><strong>Parameter:</strong> ${r.value}</p>`;
        const actions = `
            <button class="edit-btn" data-id="${r.id}">Edit</button>
            <button class="delete-btn danger" data-id="${r.id}">Delete</button>
        `;
        const card = createCard(r.description, content, actions);
        list.appendChild(card);
    });
    list.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', e => showRuleForm(rules.getById(e.target.dataset.id))));
    list.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', e => {
        if(confirm('Are you sure?')) {
            rules.delete(e.target.dataset.id);
            renderAll();
            showToast('Rule deleted.', 'success');
        }
    }));
}
function showRuleForm(r = null) {
    const ruleTypes = {
        'MIN_REST_HOURS': 'Minimum Rest Hours',
        'MAX_CONSECUTIVE_DAYS': 'Max Consecutive Days'
    };
    const formHtml = `
        <form id="rule-form">
            <input type="hidden" name="id" value="${r?.id || ''}">
            <div class="form-group">
                <label>Rule Type</label>
                <select name="type" required ${r ? 'disabled' : ''}>
                    ${Object.entries(ruleTypes).map(([key, value]) => `<option value="${key}" ${r?.type === key ? 'selected' : ''}>${value}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Value (e.g., hours, days)</label><input type="number" name="value" value="${r?.value || ''}" required></div>
            <button type="submit">${r ? 'Update' : 'Add'} Rule</button>
        </form>
    `;
    openModal(r ? 'Edit Rule' : 'Add Rule', formHtml);
    document.getElementById('rule-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.value = parseInt(data.value);
        const selected = e.target.querySelector('select[name="type"]');
        data.description = selected.options[selected.selectedIndex].text.replace('...', data.value);

        if (r) {
            rules.update(r.id, data);
            showToast('Rule updated.', 'success');
        } else {
            rules.create(data);
            showToast('Rule added.', 'success');
        }
        closeModal();
        renderAll();
    });
}

// --- Generator ---
function initGenerator() {
    document.getElementById('schedule-start-date').value = DateTime.now().toISODate();
    document.getElementById('generate-schedule-btn').addEventListener('click', () => {
        const startDate = document.getElementById('schedule-start-date').value;
        const numDays = parseInt(document.getElementById('schedule-days').value);
        if (!startDate || !numDays) {
            showToast('Please provide a start date and number of days.', 'error');
            return;
        }

        const logContainer = document.getElementById('generation-log');
        logContainer.innerHTML = '<p>Generating schedule, please wait...</p>';
        
        setTimeout(() => {
            const { schedule: newSchedule, log } = generateSchedule(startDate, numDays);
            schedule.set(newSchedule);
            logContainer.innerHTML = log.map(l => `<p>${l}</p>`).join('');
            renderSchedule();
            updateDashboard();
            renderReports();
            showToast('Schedule generated successfully!', 'success');
        }, 50); // Timeout to allow UI update
    });
}
function renderSchedule() {
    const currentSchedule = schedule.get();
    const container = document.getElementById('schedule-table-container');
    if (!currentSchedule) {
        container.innerHTML = '<p>No schedule generated yet. Go to the Generator to create one.</p>';
        return;
    }

    const startDate = DateTime.fromISO(currentSchedule.startDate);
    let table = '<table class="schedule-table"><thead><tr><th>Employee</th>';
    for (let i = 0; i < currentSchedule.numDays; i++) {
        const date = startDate.plus({ days: i });
        table += `<th>${date.toFormat('ccc, L/d')}</th>`;
    }
    table += '</tr></thead><tbody>';

    employees.getAll().forEach(emp => {
        table += `<tr><td>${emp.name}</td>`;
        for (let i = 0; i < currentSchedule.numDays; i++) {
            const date = startDate.plus({ days: i });
            const dateStr = date.toISODate();
            const shiftId = currentSchedule.assignments[emp.id]?.[dateStr];
            let cellContent = '&ndash;';
            let cellClass = 'off-day';
            if (shiftId) {
                const shift = shifts.getById(shiftId);
                cellContent = shift.name;
                cellClass = '';
                if (currentSchedule.violations[emp.id]?.[dateStr]?.length > 0) {
                    cellClass = 'violation';
                    cellContent += `<span title="${currentSchedule.violations[emp.id][dateStr].join('\n')}">⚠️</span>`;
                }
            }
            table += `<td class="${cellClass}">${cellContent}</td>`;
        }
        table += '</tr>';
    });

    table += '</tbody></table>';
    container.innerHTML = table;
}

// --- Reports ---
function initReports() { /* Event listeners can be added here if reports become interactive */ }
function renderReports() {
    const currentSchedule = schedule.get();
    if (!currentSchedule) {
        document.getElementById('reports-content').innerHTML = '<p>Generate a schedule to see reports.</p>';
        return;
    }

    // Compliance Report
    const complianceList = document.getElementById('compliance-report-list');
    const complianceReport = generateComplianceReport(currentSchedule);
    complianceList.innerHTML = complianceReport.map(item => `<li>${item}</li>`).join('');

    // Employee Hours
    const hoursTableBody = document.getElementById('employee-hours-table').querySelector('tbody');
    const hoursReport = generateEmployeeHoursReport(currentSchedule);
    hoursTableBody.innerHTML = hoursReport.map(item => `<tr><td>${item.name}</td><td>${item.hours}</td></tr>`).join('');
}


// --- Data I/O ---
function initDataIO() {
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const dataStr = JSON.stringify(getData(), null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shiftbot-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported.', 'success');
    });
    
    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (importData(event.target.result)) {
                    renderAll();
                    showToast('Data imported successfully!', 'success');
                } else {
                    showToast('Invalid or corrupted data file.', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
}

function initDashboard() {
    // Initial setup for dashboard elements if needed
}


README.md

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
    ```
    git clone https://github.com/YOUR_USERNAME/shiftbot.git
    cd shiftbot
    ```
2. **Open `index.html` in your browser:**
    Simply double-click the `index.html` file or open it from your browser's "File -> Open" menu.

That's it! The application is ready to use.

## How It Works

- **Front-End**: The entire application is built with HTML, CSS, and modern JavaScript (ES6 Modules).
- **Data Storage**: All data is stored locally in your browser's `localStorage`. This means your data persists between sessions on the same computer and browser.
- **Scheduling "AI"**: The core logic in `schedule-generator.js` uses a constraint-based heuristic algorithm. It iterates through each shift that needs to be filled and assigns the "best" available employee by scoring them against the defined rules in `rule-engine.js`. This provides intelligent, automated scheduling without requiring a complex backend.
- **Dependencies**: Uses [Chart.js](https://www.chartjs.org/) for charts and [Luxon](https://moment.github.io/luxon/) for robust date/time handling, both loaded via CDN.

## Customization

All the code is provided and commented. You can easily customize it:
- **UI**: Modify `css/style.css` to change the look and feel.
- **Logic**: Extend the functionality by editing the JavaScript files in the `js/` directory. For example, you could add new rule types to `js/rule-engine.js`.
```

### **`package.json`**

```json
{
  "name": "shiftbot",
  "version": "1.0.0",
  "description": "AI-powered shift roster management system",
  "main": "index.html",
  "scripts": {
    "start": "echo \"Open index.html in your browser to start.\" && exit 0"
  },
  "keywords": [
    "roster",
    "schedule",
    "workforce-management",
    "ai",
    "javascript"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/shiftbot.git"
  },
  "homepage": "https://YOUR_USERNAME.github.io/shiftbot"
}
```

### **`.gitignore`**

```
# IDE files
.idea/
.vscode/

# Node modules
node_modules/

# Build artifacts
dist/
build/

# Log files
*.log

# OS-generated files
.DS_Store
Thumbs.db
```

### **`LICENSE`**

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

You now have all the files and content needed for your **ShiftBot** project. Just create the files and folders as instructed, copy and paste the code, and open `index.html` in your web browser. The application will be fully functional.



