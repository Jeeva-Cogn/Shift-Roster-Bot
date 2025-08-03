// Excel Import/Export functionality for NPE Team roster
import { employees, shifts, schedule } from './data-manager.js';
import { showToast } from './utils.js';

const { DateTime } = luxon;

// Excel export functionality
export function exportToExcel() {
    try {
        console.log('Starting Excel export...');
        
        const currentSchedule = schedule.get();
        if (!currentSchedule) {
            showToast('No schedule to export. Generate a schedule first.', 'error');
            return;
        }

        console.log('Schedule data found:', currentSchedule);
        
        // Check if XLSX is available
        if (typeof XLSX === 'undefined') {
            showToast('Excel library not loaded. Please refresh the page.', 'error');
            return;
        }

        console.log('Creating Excel workbook...');
        const workbook = createExcelWorkbook(currentSchedule);
        
        const filename = `NPE-Team-Roster-${DateTime.now().toFormat('yyyy-MM-dd')}.xlsx`;
        console.log('Downloading file:', filename);
        
        downloadExcelFile(workbook, filename);
        showToast('Excel file exported successfully! Check your downloads folder.', 'success');
        
    } catch (error) {
        console.error('Excel export error:', error);
        showToast(`Failed to export Excel file: ${error.message}`, 'error');
        throw error;
    }
}

// Excel import functionality
export function importFromExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const scheduleData = parseExcelWorkbook(workbook);
                
                if (scheduleData) {
                    schedule.set(scheduleData);
                    showToast('Excel roster imported successfully!', 'success');
                    resolve(scheduleData);
                } else {
                    showToast('Invalid Excel format. Please use the NPE Team roster template.', 'error');
                    reject(new Error('Invalid Excel format'));
                }
            } catch (error) {
                console.error('Excel import error:', error);
                showToast('Failed to import Excel file.', 'error');
                reject(error);
            }
        };
        reader.onerror = () => {
            showToast('Failed to read Excel file.', 'error');
            reject(new Error('File read error'));
        };
        reader.readAsArrayBuffer(file);
    });
}

// Create Excel workbook from schedule data
function createExcelWorkbook(scheduleData) {
    const workbook = XLSX.utils.book_new();
    
    // Main schedule sheet
    const scheduleSheet = createScheduleSheet(scheduleData);
    XLSX.utils.book_append_sheet(workbook, scheduleSheet, 'NPE Team Roster');
    
    // Employee details sheet
    const employeeSheet = createEmployeeSheet();
    XLSX.utils.book_append_sheet(workbook, employeeSheet, 'Employee Details');
    
    // Shift details sheet
    const shiftSheet = createShiftSheet();
    XLSX.utils.book_append_sheet(workbook, shiftSheet, 'Shift Details');
    
    return workbook;
}

// Create the main schedule sheet
function createScheduleSheet(scheduleData) {
    const startDate = DateTime.fromISO(scheduleData.startDate);
    const allEmployees = employees.getAll();
    
    // Create header row
    const headers = ['Employee ID', 'CTS ID', 'Name', 'Role'];
    for (let i = 0; i < scheduleData.numDays; i++) {
        const date = startDate.plus({ days: i });
        headers.push(date.toFormat('dd-MMM-yyyy (ccc)'));
    }
    
    // Create data rows
    const rows = [headers];
    
    allEmployees.forEach(emp => {
        const row = [emp.id, emp.ctsId, emp.name, emp.role];
        
        for (let i = 0; i < scheduleData.numDays; i++) {
            const date = startDate.plus({ days: i });
            const dateStr = date.toISODate();
            const shiftId = scheduleData.assignments[emp.id]?.[dateStr];
            
            if (shiftId) {
                const shift = shifts.getById(shiftId);
                let cellValue = shift ? shift.name : shiftId;
                
                // Add violation indicator
                if (scheduleData.violations[emp.id]?.[dateStr]?.length > 0) {
                    cellValue += ' ⚠️';
                }
                row.push(cellValue);
            } else {
                row.push('OFF');
            }
        }
        rows.push(row);
    });
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    
    // Set column widths
    const colWidths = [
        { wch: 12 }, // Employee ID
        { wch: 10 }, // CTS ID
        { wch: 20 }, // Name
        { wch: 12 }, // Role
    ];
    
    // Add date column widths
    for (let i = 0; i < scheduleData.numDays; i++) {
        colWidths.push({ wch: 18 });
    }
    
    worksheet['!cols'] = colWidths;
    
    // Style the header row
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '2563EB' } },
            alignment: { horizontal: 'center' }
        };
    }
    
    return worksheet;
}

// Create employee details sheet
function createEmployeeSheet() {
    const allEmployees = employees.getAll();
    const headers = ['Employee ID', 'CTS ID', 'Name', 'Department', 'Position', 'Role', 'Days Off'];
    
    const rows = [headers];
    
    allEmployees.forEach(emp => {
        const daysOffText = emp.daysOff.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
        rows.push([
            emp.id,
            emp.ctsId,
            emp.name,
            emp.department,
            emp.position,
            emp.role,
            daysOffText || 'None'
        ]);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [
        { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, 
        { wch: 15 }, { wch: 12 }, { wch: 15 }
    ];
    
    return worksheet;
}

// Create shift details sheet
function createShiftSheet() {
    const allShifts = shifts.getAll();
    const headers = ['Shift ID', 'Name', 'Start Time', 'End Time', 'Required Roles', 'Description'];
    
    const rows = [headers];
    
    allShifts.forEach(shift => {
        const requiredRolesText = Object.entries(shift.requiredRoles || {})
            .map(([role, count]) => `${role}: ${count}`)
            .join(', ');
            
        rows.push([
            shift.id,
            shift.name,
            shift.startTime,
            shift.endTime,
            requiredRolesText,
            shift.description || ''
        ]);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [
        { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, 
        { wch: 15 }, { wch: 30 }
    ];
    
    return worksheet;
}

// Parse Excel workbook to extract schedule data
function parseExcelWorkbook(workbook) {
    try {
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (data.length < 2) {
            throw new Error('Invalid Excel format - insufficient data');
        }
        
        const headers = data[0];
        const employeeRows = data.slice(1);
        
        // Find date columns (skip first 4 columns: Employee ID, CTS ID, Name, Role)
        const dateColumns = headers.slice(4);
        if (dateColumns.length === 0) {
            throw new Error('No date columns found');
        }
        
        // Parse dates and create schedule structure
        const startDate = parseDateFromHeader(dateColumns[0]);
        const numDays = dateColumns.length;
        
        const scheduleData = {
            startDate: startDate.toISODate(),
            numDays: numDays,
            rules: [],
            assignments: {},
            violations: {}
        };
        
        // Parse employee assignments
        employeeRows.forEach(row => {
            if (row.length < 4) return; // Skip invalid rows
            
            const empId = row[0];
            const empName = row[2];
            
            if (!empId || !empName) return;
            
            scheduleData.assignments[empId] = {};
            scheduleData.violations[empId] = {};
            
            // Parse shift assignments for each date
            for (let i = 0; i < numDays; i++) {
                const dateValue = startDate.plus({ days: i }).toISODate();
                const shiftValue = row[4 + i];
                
                if (shiftValue && shiftValue !== 'OFF' && shiftValue.trim() !== '') {
                    // Extract shift ID from shift name
                    let shiftId = null;
                    const cleanShiftValue = shiftValue.replace('⚠️', '').trim();
                    
                    if (cleanShiftValue.startsWith('S1')) shiftId = 'S1';
                    else if (cleanShiftValue.startsWith('S2')) shiftId = 'S2';
                    else if (cleanShiftValue.startsWith('S3')) shiftId = 'S3';
                    else if (cleanShiftValue.startsWith('S4')) shiftId = 'S4';
                    
                    if (shiftId) {
                        scheduleData.assignments[empId][dateValue] = shiftId;
                        
                        // Check for violation indicator
                        if (shiftValue.includes('⚠️')) {
                            scheduleData.violations[empId][dateValue] = ['Imported with violation'];
                        }
                    }
                }
            }
        });
        
        return scheduleData;
        
    } catch (error) {
        console.error('Error parsing Excel workbook:', error);
        return null;
    }
}

// Parse date from Excel header
function parseDateFromHeader(headerText) {
    try {
        // Try to extract date from various formats
        const dateMatch = headerText.match(/(\d{1,2}[-\/]\w{3}[-\/]\d{4})/);
        if (dateMatch) {
            return DateTime.fromFormat(dateMatch[1], 'dd-MMM-yyyy');
        }
        
        // Try ISO format
        const isoMatch = headerText.match(/(\d{4}-\d{2}-\d{2})/);
        if (isoMatch) {
            return DateTime.fromISO(isoMatch[1]);
        }
        
        // Default to today if parsing fails
        return DateTime.now();
    } catch (error) {
        console.error('Date parsing error:', error);
        return DateTime.now();
    }
}

// Download Excel file
function downloadExcelFile(workbook, filename) {
    try {
        // Write workbook to array buffer
        const wbout = XLSX.write(workbook, { 
            bookType: 'xlsx', 
            type: 'array',
            compression: true
        });
        
        // Create blob with proper MIME type for Excel
        const blob = new Blob([wbout], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log(`Excel file ${filename} downloaded successfully`);
    } catch (error) {
        console.error('Error downloading Excel file:', error);
        throw error;
    }
}

// Initialize Excel functionality (XLSX library loaded via HTML)
export function initializeExcelSupport() {
    return new Promise((resolve, reject) => {
        if (typeof XLSX !== 'undefined') {
            resolve();
        } else {
            reject(new Error('XLSX library not loaded'));
        }
    });
}

// Create sample Excel template
export function downloadTemplate() {
    const sampleSchedule = {
        startDate: DateTime.now().toISODate(),
        numDays: 7,
        assignments: {},
        violations: {}
    };
    
    // Add sample assignments
    const allEmployees = employees.getAll();
    allEmployees.forEach(emp => {
        sampleSchedule.assignments[emp.id] = {};
        sampleSchedule.violations[emp.id] = {};
    });
    
    const workbook = createExcelWorkbook(sampleSchedule);
    downloadExcelFile(workbook, 'NPE-Team-Roster-Template.xlsx');
    showToast('Template downloaded successfully!', 'success');
}
