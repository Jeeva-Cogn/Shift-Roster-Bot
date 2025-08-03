import { employees, shifts } from './data-manager.js';
const { DateTime } = luxon;

// Compliance report module for Shift Roster Bot
export function generateComplianceReport(schedule) {
    if (!schedule) return [];
    const report = [];
    for (const empId in schedule.violations) {
        for (const date in schedule.violations[empId]) {
            const violations = schedule.violations[empId][date];
            if (violations && violations.length > 0) {
                const employee = employees.getById(empId);
                report.push(`${date}: ${employee.name} - ${violations.join(', ')}`);
            }
        }
    }
    return report.length > 0 ? report : ['No violations found.'];
}

// Employee hours report module for Shift Roster Bot
export function generateEmployeeHoursReport(schedule) {
    if (!schedule) return [];
    const employeeHours = {};
    employees.getAll().forEach(e => employeeHours[e.id] = 0);

    for (const empId in schedule.assignments) {
        for (const date in schedule.assignments[empId]) {
            const shiftId = schedule.assignments[empId][date];
            if (shiftId && shiftId !== 'OFF') {
                const shift = shifts.getById(shiftId);
                if (shift) {
                    // Calculate shift duration (8 hours for most shifts)
                    let duration = 8; // Default 8 hours
                    try {
                        const startTime = DateTime.fromFormat(shift.startTime, 'HH:mm');
                        const endTime = DateTime.fromFormat(shift.endTime, 'HH:mm');
                        
                        if (startTime.isValid && endTime.isValid) {
                            let diff = endTime.diff(startTime, 'hours').hours;
                            if (diff < 0) diff += 24; // Handle overnight shifts
                            duration = diff;
                        }
                    } catch (error) {
                        console.warn(`Error calculating hours for shift ${shiftId}:`, error);
                    }
                    
                    employeeHours[empId] += duration;
                }
            }
        }
    }

    return Object.entries(employeeHours).map(([empId, hours]) => {
        const employee = employees.getById(empId);
        return {
            name: employee ? employee.name : 'Unknown',
            hours: parseFloat(hours.toFixed(1))
        };
    }).filter(item => item.name !== 'Unknown');
}
