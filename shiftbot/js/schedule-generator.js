import { employees, shifts, rules, leaveRequests } from './data-manager.js';
import { checkAllRules } from './rule-engine.js';
import { deepClone } from './utils.js';

const { DateTime } = luxon;

// Helper function to get consecutive working days
function getConsecutiveDays(employeeId, currentDate, schedule) {
    let consecutive = 0;
    let checkDate = currentDate.minus({ days: 1 });
    
    while (checkDate >= DateTime.fromISO(schedule.startDate)) {
        const dateStr = checkDate.toISODate();
        if (schedule.assignments[employeeId][dateStr] && schedule.assignments[employeeId][dateStr] !== 'OFF') {
            consecutive++;
            checkDate = checkDate.minus({ days: 1 });
        } else {
            break;
        }
    }
    return consecutive;
}

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

    log.push(`Starting NPE team schedule generation from ${startDate.toISODate()} for ${numDays} days.`);
    log.push(`Team composition: ${allEmployees.filter(e => e.role === 'Lead').length} Leads, ${allEmployees.filter(e => e.role === 'Associate').length} Associates`);

    for (let i = 0; i < numDays; i++) {
        const currentDate = startDate.plus({ days: i });
        const currentDateStr = currentDate.toISODate();
        const dayName = currentDate.toFormat('cccc');
        log.push(`
--- Processing ${currentDateStr} (${dayName}) ---`);

        // Apply health protection rules to ensure work-life balance
        applyHealthProtectionRules(currentDateStr, schedule, allEmployees, log);

        // Process shifts in priority order (S1, S2, S3, then S4 if needed)
        const sortedShifts = allShifts.sort((a, b) => {
            if (a.isRare) return 1; // S4 goes last
            if (b.isRare) return -1;
            return a.id.localeCompare(b.id);
        });

        for (const shift of sortedShifts) {
            // Skip rare shifts most of the time
            if (shift.isRare && Math.random() > 0.1) {
                log.push(`Skipping rare shift ${shift.name} (10% chance only)`);
                continue;
            }

            log.push(`Filling ${shift.name} (requires ${JSON.stringify(shift.requiredRoles)})...`);
            
            const requiredRoles = shift.requiredRoles || {};
            let totalAssigned = 0;
            
            // Fill each required role
            for (const [requiredRole, requiredCount] of Object.entries(requiredRoles)) {
                log.push(`  Looking for ${requiredCount} ${requiredRole}(s)...`);
                
                // Find eligible candidates for this role
                const candidates = allEmployees.filter(emp => {
                    // Basic availability check
                    if (emp.role !== requiredRole || schedule.assignments[emp.id][currentDateStr]) {
                        return false;
                    }
                    
                    // Check if employee has approved leave for this date
                    const approvedLeaves = leaveRequests.getForDate(currentDateStr);
                    const hasLeave = approvedLeaves.some(leave => leave.employeeId === emp.id);
                    if (hasLeave) {
                        log.push(`  ${emp.name} has approved leave on ${currentDateStr}`);
                        return false;
                    }
                    
                    // Health check: prevent overwork (max 6 consecutive days)
                    const consecutiveDays = getConsecutiveDays(emp.id, currentDate, schedule);
                    if (consecutiveDays >= 6) {
                        log.push(`  ${emp.name} needs rest after ${consecutiveDays} consecutive days (health protection)`);
                        return false;
                    }
                    
                    return true;
                });
                
                if (candidates.length === 0) {
                    log.push(`  WARNING: No available ${requiredRole}s found for ${shift.name}.`);
                    continue;
                }

                // Sort candidates by suitability (health and work-life balance focused)
                candidates.sort((a, b) => {
                    // Priority 1: Work-life balance - fewer consecutive days worked
                    const aConsecutive = getConsecutiveDays(a.id, currentDate, schedule);
                    const bConsecutive = getConsecutiveDays(b.id, currentDate, schedule);
                    
                    // Priority 2: Stress management - avoid overworking
                    if (aConsecutive !== bConsecutive) {
                        return aConsecutive - bConsecutive; // Prefer fewer consecutive days
                    }
                    
                    // Priority 3: Respect preferred days off for mental health
                    const dayOfWeek = currentDate.weekday % 7; // Convert to 0-6 format
                    const aPreferredOff = a.daysOff.includes(dayOfWeek);
                    const bPreferredOff = b.daysOff.includes(dayOfWeek);
                    
                    if (aPreferredOff !== bPreferredOff) {
                        return aPreferredOff ? 1 : -1; // Prefer those not on preferred day off
                    }
                    
                    // Priority 4: Fair distribution - check total hours worked
                    // (This ensures everyone gets fair workload distribution)
                    const aTotalDays = Object.values(schedule.assignments[a.id]).filter(s => s && s !== 'OFF').length;
                    const bTotalDays = Object.values(schedule.assignments[b.id]).filter(s => s && s !== 'OFF').length;
                    
                    return aTotalDays - bTotalDays;
                });

                // Assign the required number of this role
                const assignedCount = Math.min(requiredCount, candidates.length);
                for (let j = 0; j < assignedCount; j++) {
                    const candidate = candidates[j];
                    schedule.assignments[candidate.id][currentDateStr] = shift.id;
                    totalAssigned++;
                    
                    const violations = checkAllRules(candidate, shift, currentDate, schedule);
                    if (violations.length > 0) {
                        schedule.violations[candidate.id][currentDateStr] = violations.map(v => v.message);
                        log.push(`  ✓ Assigned ${candidate.name} (${candidate.role}) to ${shift.name} [${violations.length} violation(s)]`);
                    } else {
                        log.push(`  ✓ Assigned ${candidate.name} (${candidate.role}) to ${shift.name}`);
                    }
                }
                
                if (assignedCount < requiredCount) {
                    log.push(`  ⚠️ Only assigned ${assignedCount}/${requiredCount} ${requiredRole}s to ${shift.name}`);
                }
            }
            
            log.push(`  Completed ${shift.name}: ${totalAssigned} employees assigned`);
        }
        
        // Mark unassigned employees as OFF for this day
        const unassigned = allEmployees.filter(emp => !schedule.assignments[emp.id][currentDateStr]);
        unassigned.forEach(emp => {
            schedule.assignments[emp.id][currentDateStr] = 'OFF';
        });
        
        if (unassigned.length > 0) {
            log.push(`  Marked ${unassigned.length} employees as OFF: ${unassigned.map(e => e.name).join(', ')}`);
        }
    }

    log.push(`
🎉 NPE team schedule generation complete!`);
    
    // Generate summary statistics
    const stats = generateScheduleStats(schedule, allEmployees);
    log.push(`
📊 Schedule Statistics:`);
    log.push(`Total shift assignments: ${stats.totalAssignments}`);
    log.push(`Total violations: ${stats.totalViolations}`);
    log.push(`Leads assigned: ${stats.leadsAssigned} shifts`);
    log.push(`Associates assigned: ${stats.associatesAssigned} shifts`);
    
    return { schedule, log };
}

function generateScheduleStats(schedule, allEmployees) {
    let totalAssignments = 0;
    let totalViolations = 0;
    let leadsAssigned = 0;
    let associatesAssigned = 0;
    
    allEmployees.forEach(emp => {
        Object.values(schedule.assignments[emp.id]).forEach(assignment => {
            if (assignment && assignment !== 'OFF') {
                totalAssignments++;
                if (emp.role === 'Lead') leadsAssigned++;
                if (emp.role === 'Associate') associatesAssigned++;
            }
        });
        
        Object.values(schedule.violations[emp.id]).forEach(dayViolations => {
            if (dayViolations && dayViolations.length > 0) {
                totalViolations += dayViolations.length;
            }
        });
    });
    
    return { totalAssignments, totalViolations, leadsAssigned, associatesAssigned };
}

/**
 * Apply health protection rules to ensure work-life balance
 */
function applyHealthProtectionRules(currentDateStr, schedule, allEmployees, log) {
    allEmployees.forEach(employee => {
        const consecutiveDays = getConsecutiveDaysWorked(employee.id, currentDateStr, schedule);
        
        // HEALTH RULE: Mandatory rest after 5-6 consecutive work days
        if (consecutiveDays >= 5) {
            // Force rest day for this employee
            schedule.assignments[employee.id][currentDateStr] = 'OFF';
            log.push(`  Health Protection: ${employee.name} forced OFF (${consecutiveDays} consecutive days)`);
            
            // Also force rest for the next day if they've worked 6+ consecutive days
            if (consecutiveDays >= 6) {
                const nextDate = DateTime.fromISO(currentDateStr).plus({ days: 1 });
                const nextDateStr = nextDate.toISODate();
                schedule.assignments[employee.id][nextDateStr] = 'OFF';
                log.push(`  Health Protection: ${employee.name} also OFF tomorrow (burnout prevention)`);
            }
        }
    });
}

/**
 * Count consecutive days worked leading up to a specific date
 */
function getConsecutiveDaysWorked(employeeId, currentDateStr, schedule) {
    let consecutiveDays = 0;
    const currentDate = DateTime.fromISO(currentDateStr);
    
    // Look backwards from current date
    for (let i = 1; i <= 10; i++) { // Check up to 10 days back
        const checkDate = currentDate.minus({ days: i });
        const checkDateStr = checkDate.toISODate();
        const assignment = schedule.assignments[employeeId][checkDateStr];
        
        if (assignment && assignment !== 'OFF') {
            consecutiveDays++;
        } else {
            break; // Hit a day off, stop counting
        }
    }
    
    return consecutiveDays;
}
