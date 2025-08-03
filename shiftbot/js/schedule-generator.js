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
