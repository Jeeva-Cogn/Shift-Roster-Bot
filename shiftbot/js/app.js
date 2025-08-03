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
    card.innerHTML = `<h4>${title}</h4> ${content} <div class="card-actions">${actions}</div>`;
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
            <p><strong>Employee ID:</strong> ${emp.id}</p>
            <p><strong>CTS ID:</strong> ${emp.ctsId || 'Not specified'}</p>
            <p><strong>Department:</strong> ${emp.department || 'Not specified'}</p>
            <p><strong>Position:</strong> ${emp.position || 'Not specified'}</p>
            <p><strong>Role:</strong> ${emp.role || 'Not specified'}</p>
            <p><strong>Skills:</strong> ${emp.skills.join(', ')}</p>
            <p><strong>Days Off:</strong> ${emp.daysOff.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'None'}</p>`;
        const actions = `<button class="edit-btn" data-id="${emp.id}">Edit</button> <button class="delete-btn danger" data-id="${emp.id}">Delete</button>`;
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
    const formHtml = `<form id="employee-form">
        <input type="hidden" name="id" value="${emp?.id || ''}">
        <div class="form-group">
            <label>Employee ID</label>
            <input type="text" name="employeeId" value="${emp?.id || ''}" ${emp ? 'readonly' : ''} placeholder="e.g., 593300">
        </div>
        <div class="form-group">
            <label>CTS ID</label>
            <input type="text" name="ctsId" value="${emp?.ctsId || ''}" placeholder="e.g., EH0647">
        </div>
        <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${emp?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Department</label>
            <input type="text" name="department" value="${emp?.department || 'QA&DOD'}" placeholder="e.g., QA&DOD">
        </div>
        <div class="form-group">
            <label>Position</label>
            <input type="text" name="position" value="${emp?.position || ''}" placeholder="e.g., Lead, Shift Lead, Executive">
        </div>
        <div class="form-group">
            <label>Role</label>
            <select name="role">
                <option value="Lead" ${emp?.role === 'Lead' ? 'selected' : ''}>Lead</option>
                <option value="Shift Lead" ${emp?.role === 'Shift Lead' ? 'selected' : ''}>Shift Lead</option>
                <option value="Executive" ${emp?.role === 'Executive' ? 'selected' : ''}>Executive</option>
            </select>
        </div>
        <div class="form-group">
            <label>Skills (comma-separated)</label>
            <input type="text" name="skills" value="${emp?.skills?.join(', ') || 'General, UAT'}">
        </div>
        <button type="submit">${emp ? 'Update' : 'Add'} Employee</button>
    </form>`;
    openModal(emp ? 'Edit Employee' : 'Add Employee', formHtml);
    document.getElementById('employee-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
        data.daysOff = emp?.daysOff || [0, 6]; // Default weekend off
        
        // Handle custom ID for new employees
        if (!emp && data.employeeId) {
            data.id = data.employeeId;
            delete data.employeeId;
        }

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
            <p><strong>Shift Code:</strong> ${s.shiftCode || s.id}</p>
            <p><strong>Time:</strong> ${s.startTime} - ${s.endTime}</p>
            <p><strong>Duration:</strong> ${s.duration || '8'} hours</p>
            <p><strong>Required Skills:</strong> ${s.requiredSkills.join(', ')}</p>
            <p><strong>Description:</strong> ${s.description || 'No description'}</p>
            <p><strong>Break Times:</strong> ${s.breakTime || 'Not specified'}</p>`;
        const actions = `<button class="edit-btn" data-id="${s.id}">Edit</button> <button class="delete-btn danger" data-id="${s.id}">Delete</button>`;
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
    const formHtml = `<form id="shift-form">
        <input type="hidden" name="id" value="${s?.id || ''}">
        <div class="form-group"><label>Name</label><input type="text" name="name" value="${s?.name || ''}" required></div>
        <div class="form-group"><label>Start Time</label><input type="time" name="startTime" value="${s?.startTime || ''}" required></div>
        <div class="form-group"><label>End Time</label><input type="time" name="endTime" value="${s?.endTime || ''}" required></div>
        <div class="form-group"><label>Required Skills (comma-separated)</label><input type="text" name="requiredSkills" value="${s?.requiredSkills.join(', ') || ''}"></div>
        <button type="submit">${s ? 'Update' : 'Add'} Shift</button>
    </form>`;
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
        const actions = `<button class="edit-btn" data-id="${r.id}">Edit</button> <button class="delete-btn danger" data-id="${r.id}">Delete</button>`;
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
    const ruleTypes = { 'MIN_REST_HOURS': 'Minimum Rest Hours', 'MAX_CONSECUTIVE_DAYS': 'Max Consecutive Days' };
    const formHtml = `<form id="rule-form">
        <input type="hidden" name="id" value="${r?.id || ''}">
        <div class="form-group">
            <label>Rule Type</label>
            <select name="type" required ${r ? 'disabled' : ''}>
                ${Object.entries(ruleTypes).map(([key, value]) => `<option value="${key}" ${r?.type === key ? 'selected' : ''}>${value}</option>`).join('')}
            </select>
        </div>
        <div class="form-group"><label>Value (e.g., hours, days)</label><input type="number" name="value" value="${r?.value || ''}" required></div>
        <button type="submit">${r ? 'Update' : 'Add'} Rule</button>
    </form>`;
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
        container.innerHTML = '<div class="schedule-table">No schedule generated yet. Go to the Generator to create one.</div>';
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
        document.getElementById('reports-content').innerHTML = '<div>Generate a schedule to see reports.</div>';
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
