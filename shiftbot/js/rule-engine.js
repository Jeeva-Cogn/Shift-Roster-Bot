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

// Apply rules to a schedule
export function applyRules(schedule, rules) {
    // For each assignment, check all rules
    schedule.assignments.forEach(assignment => {
        const employee = schedule.employees.find(e => e.id === assignment.employeeId);
        const shift = schedule.shifts.find(s => s.id === assignment.shiftId);
        const violations = checkAllRules(employee, shift, assignment.date, schedule);
        assignment.violations = violations;
    });
    return schedule;
}
