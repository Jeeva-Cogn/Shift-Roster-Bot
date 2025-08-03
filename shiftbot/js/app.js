import { employees, shifts, rules, schedule, getData } from './data-manager.js';
import { generateSchedule } from './schedule-generator.js';
import { generateComplianceReport, generateEmployeeHoursReport } from './reports.js';
import { exportToExcel, importFromExcel, initializeExcelSupport, downloadTemplate } from './excel-manager.js';
import { showToast } from './utils.js';

const { DateTime } = luxon;
let workloadChart = null;

// --- Navigation ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Excel support
    try {
        await initializeExcelSupport();
        console.log('Excel support initialized');
    } catch (error) {
        console.error('Failed to initialize Excel support:', error);
        showToast('Excel functionality unavailable', 'error');
    }
    
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
});function initNav() {
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
        document.getElementById('schedule-status-stat').textContent = 'Loaded';
        
        // Show analytics section
        document.getElementById('schedule-analytics').style.display = 'block';
        
        // Update analytics
        updateScheduleAnalytics(currentSchedule);
        
        // Update workload chart
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
                    backgroundColor: 'rgba(139, 95, 191, 0.7)',
                    borderColor: 'rgba(139, 95, 191, 1)',
                    borderWidth: 1
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#6b4c87'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#6b4c87'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#6b4c87'
                        }
                    }
                }
            }
        });
    } else {
        document.getElementById('schedule-status-stat').textContent = 'No Schedule';
        document.getElementById('schedule-analytics').style.display = 'none';
    }
}

// Schedule Analytics Functions
function updateScheduleAnalytics(currentSchedule) {
    try {
        const allEmployees = employees.getAll();
        
        // Generate team summary chart
        updateTeamSummaryChart(currentSchedule, allEmployees);
        
        // Generate individual member analysis
        updateMemberAnalysis(currentSchedule, allEmployees);
    } catch (error) {
        console.error('Error updating analytics:', error);
        showToast('Error updating analytics dashboard', 'error');
    }
}

function updateTeamSummaryChart(currentSchedule, allEmployees) {
    try {
        const shiftCounts = { S1: 0, S2: 0, S3: 0, S4: 0, OFF: 0 };
        
        // Count all shift assignments safely
        allEmployees.forEach(emp => {
            const assignments = currentSchedule.assignments[emp.id] || {};
            Object.values(assignments).forEach(assignment => {
                if (assignment && shiftCounts.hasOwnProperty(assignment)) {
                    shiftCounts[assignment]++;
                }
            });
        });
        
        const chartElement = document.getElementById('team-summary-chart');
        if (!chartElement) return;
        
        // Destroy existing chart if it exists
        if (window.teamSummaryChart) {
            window.teamSummaryChart.destroy();
        }
        
        const ctx = chartElement.getContext('2d');
        window.teamSummaryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['S1 - Morning', 'S2 - Afternoon', 'S3 - Night', 'S4 - Special', 'Off Days'],
                datasets: [{
                    data: [shiftCounts.S1, shiftCounts.S2, shiftCounts.S3, shiftCounts.S4, shiftCounts.OFF],
                    backgroundColor: [
                        '#8b5fbf',
                        '#a374d0',
                        '#6b4c87',
                        '#b794d1',
                        '#e8dff0'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#6b4c87',
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error updating team summary chart:', error);
    }
}

function updateMemberAnalysis(currentSchedule, allEmployees) {
    try {
        const memberAnalysisList = document.getElementById('member-analysis-list');
        if (!memberAnalysisList) return;
        
        memberAnalysisList.innerHTML = '';
        
        allEmployees.forEach(emp => {
            const assignments = currentSchedule.assignments[emp.id] || {};
            const analysis = analyzeEmployeeSchedule(emp, assignments);
            
            const memberItem = document.createElement('div');
            memberItem.className = 'member-analysis-item';
            memberItem.innerHTML = `
                <div class="member-name">${emp.name} (${emp.role})</div>
                <div class="member-stats">
                    <div class="stat-item night-shifts">
                        <span class="label">Night Shifts</span>
                        <span class="value">${analysis.nightShifts}</span>
                    </div>
                    <div class="stat-item off-days">
                        <span class="label">Off Days</span>
                        <span class="value">${analysis.offDays}</span>
                    </div>
                    <div class="stat-item leaves">
                        <span class="label">Total Shifts</span>
                        <span class="value">${analysis.totalShifts}</span>
                    </div>
                </div>
            `;
            
            memberAnalysisList.appendChild(memberItem);
        });
    } catch (error) {
        console.error('Error updating member analysis:', error);
    }
}

function analyzeEmployeeSchedule(employee, assignments) {
    let nightShifts = 0;
    let offDays = 0;
    let totalShifts = 0;
    
    try {
        Object.values(assignments).forEach(assignment => {
            if (assignment === 'S3') {
                nightShifts++;
                totalShifts++;
            } else if (assignment === 'OFF') {
                offDays++;
            } else if (assignment && assignment !== 'OFF') {
                totalShifts++;
            }
        });
    } catch (error) {
        console.error('Error analyzing employee schedule:', error);
    }
    
    return {
        nightShifts,
        offDays,
        totalShifts
    };
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
            <p><strong>CTS ID:</strong> ${emp.ctsId || 'Not specified'}</p>
            <p><strong>Department:</strong> ${emp.department || 'NPE'}</p>
            <p><strong>Position:</strong> ${emp.position || 'Not specified'}</p>
            <p><strong>Role:</strong> ${emp.role || 'Associate'}</p>
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
            <input type="text" name="employeeId" value="${emp?.id || ''}" ${emp ? 'readonly' : ''} placeholder="e.g., NPE001">
        </div>
        <div class="form-group">
            <label>CTS ID</label>
            <input type="text" name="ctsId" value="${emp?.ctsId || ''}" placeholder="e.g., EH0647" required>
        </div>
        <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${emp?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Department</label>
            <input type="text" name="department" value="${emp?.department || 'NPE'}" readonly>
        </div>
        <div class="form-group">
            <label>Position</label>
            <select name="position" required>
                <option value="Team Lead" ${emp?.position === 'Team Lead' ? 'selected' : ''}>Team Lead</option>
                <option value="Shift Lead" ${emp?.position === 'Shift Lead' ? 'selected' : ''}>Shift Lead</option>
                <option value="Associate" ${emp?.position === 'Associate' ? 'selected' : ''}>Associate</option>
            </select>
        </div>
        <div class="form-group">
            <label>Role</label>
            <select name="role" required>
                <option value="Lead" ${emp?.role === 'Lead' ? 'selected' : ''}>Lead</option>
                <option value="Associate" ${emp?.role === 'Associate' ? 'selected' : ''}>Associate</option>
            </select>
        </div>
        <div class="form-group">
            <label>Days Off</label>
            <div class="checkbox-group">
                ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => `
                    <label>
                        <input type="checkbox" name="daysOff" value="${index}" ${emp?.daysOff?.includes(index) ? 'checked' : ''}>
                        ${day}
                    </label>
                `).join('')}
            </div>
        </div>
        <button type="submit">${emp ? 'Update' : 'Add'} Employee</button>
    </form>`;
    openModal(emp ? 'Edit Employee' : 'Add Employee', formHtml);
    document.getElementById('employee-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Handle days off checkboxes
        const daysOffCheckboxes = e.target.querySelectorAll('input[name="daysOff"]:checked');
        data.daysOff = Array.from(daysOffCheckboxes).map(cb => parseInt(cb.value));
        
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
        const requiredRolesText = s.requiredRoles ? 
            Object.entries(s.requiredRoles).map(([role, count]) => `${role}: ${count}`).join(', ') : 
            'Not specified';
        
        const content = `
            <p><strong>Time:</strong> ${s.startTime} - ${s.endTime}</p>
            <p><strong>Required Roles:</strong> ${requiredRolesText}</p>
            <p><strong>Total Required:</strong> ${s.totalRequired || 'Not specified'}</p>
            <p><strong>Description:</strong> ${s.description || 'No description'}</p>
            ${s.isRare ? '<p><strong>⚠️ Rare/Special Shift</strong></p>' : ''}`;
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
    const formHtml = `<form id="shift-form">
        <input type="hidden" name="id" value="${s?.id || ''}">
        <div class="form-group"><label>Name</label><input type="text" name="name" value="${s?.name || ''}" required></div>
        <div class="form-group"><label>Start Time</label><input type="time" name="startTime" value="${s?.startTime || ''}" required></div>
        <div class="form-group"><label>End Time</label><input type="time" name="endTime" value="${s?.endTime || ''}" required></div>
        <button type="submit">${s ? 'Update' : 'Add'} Shift</button>
    </form>`;
    openModal(s ? 'Edit Shift' : 'Add Shift', formHtml);
    document.getElementById('shift-form').addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
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
    // Export to Excel
    document.getElementById('export-data-btn').addEventListener('click', () => {
        try {
            exportToExcel();
        } catch (error) {
            console.error('Export error:', error);
            showToast('Failed to export Excel file.', 'error');
        }
    });

    // Import from Excel
    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's an Excel file
            if (!file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
                showToast('Please select an Excel file (.xlsx or .xls)', 'error');
                return;
            }
            
            try {
                await importFromExcel(file);
                renderAll();
                updateDashboard(); // Update analytics after import
            } catch (error) {
                console.error('Import error:', error);
                // Error message is already shown in importFromExcel
            }
        }
    });
    
    // Add download template button functionality if it exists
    const templateBtn = document.getElementById('download-template-btn');
    if (templateBtn) {
        templateBtn.addEventListener('click', () => {
            try {
                downloadTemplate();
            } catch (error) {
                console.error('Template download error:', error);
                showToast('Failed to download template.', 'error');
            }
        });
    }
}

// Load NPE sample roster for testing
async function loadNPESampleRoster() {
    try {
        const response = await fetch('./npe-august-2025-roster.json');
        const rosterData = await response.json();
        schedule.set(rosterData);
        showToast('NPE August 2025 roster loaded successfully!', 'success');
        updateRosterView();
        return true;
    } catch (error) {
        console.error('Failed to load NPE sample roster:', error);
        showToast('Failed to load sample roster.', 'error');
        return false;
    }
}

// Add button to load sample roster (for testing)
document.addEventListener('DOMContentLoaded', () => {
    // Add load sample button after other initialization
    setTimeout(() => {
        const dataIOSection = document.querySelector('#settings .data-section');
        if (dataIOSection) {
            const loadButton = document.createElement('button');
            loadButton.textContent = 'Load NPE Sample Roster';
            loadButton.className = 'btn btn-secondary';
            loadButton.style.marginTop = '10px';
            loadButton.onclick = loadNPESampleRoster;
            dataIOSection.appendChild(loadButton);
        }
    }, 1000);
});

function initDashboard() {
    // Initial setup for dashboard elements if needed
}
