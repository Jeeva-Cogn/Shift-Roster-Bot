import { employees, shifts } from './data-manager.js';
const { Duration } = luxon;

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
