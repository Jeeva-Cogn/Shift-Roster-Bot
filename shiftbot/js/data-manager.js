
import { generateId, deepClone } from './utils.js';

const LOCAL_STORAGE_KEY = 'shiftBotData';

const defaultData = {
    employees: [
        { 
            id: '593300', 
            ctsId: 'EH0647',
            name: 'Dinesh Anbalagan', 
            department: 'QA&DOD',
            position: 'Lead',
            skills: ['General', 'Lead', 'QA'], 
            daysOff: [0, 6],
            role: 'Lead'
        },
        { 
            id: '560008', 
            ctsId: 'EG4208',
            name: 'Mano', 
            department: 'QA&DOD',
            position: 'Lead',
            skills: ['General', 'Lead', 'QA'], 
            daysOff: [0, 6],
            role: 'Lead'
        },
        { 
            id: '410093', 
            ctsId: 'EH6832',
            name: 'Jeyakaran', 
            department: 'QA&DOD',
            position: 'Shift Lead',
            skills: ['General', 'Shift Lead', 'UAT'], 
            daysOff: [0, 6],
            role: 'Shift Lead'
        },
        { 
            id: '2167353', 
            ctsId: 'C7H8KH',
            name: 'Karthikeyan', 
            department: 'QA&DOD',
            position: 'Shift Lead',
            skills: ['General', 'Shift Lead', 'UAT'], 
            daysOff: [0, 6],
            role: 'Shift Lead'
        },
        { 
            id: '2136623', 
            ctsId: 'C8G3CW',
            name: 'Manoj', 
            department: 'QA&DOD',
            position: 'Shift Lead',
            skills: ['General', 'Shift Lead', 'UAT'], 
            daysOff: [0, 6],
            role: 'Shift Lead'
        },
        { 
            id: '2054459', 
            ctsId: 'C6X8FS',
            name: 'Panner', 
            department: 'QA&DOD',
            position: 'Shift Lead',
            skills: ['General', 'Shift Lead', 'UAT'], 
            daysOff: [0, 6],
            role: 'Shift Lead'
        },
        { 
            id: '2240608', 
            ctsId: 'C7T7SF',
            name: 'SaiKumar', 
            department: 'QA&DOD',
            position: 'Shift Lead',
            skills: ['General', 'Shift Lead', 'UAT'], 
            daysOff: [0, 6],
            role: 'Shift Lead'
        },
        { 
            id: '2054433', 
            ctsId: 'C6X7K5',
            name: 'Sai Krishna', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2299004', 
            ctsId: 'C8N5H4',
            name: 'Jeeva', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2309236', 
            ctsId: 'C8S7B6',
            name: 'Saran', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2328010', 
            ctsId: 'C8W2BD',
            name: 'Akshay', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2378392', 
            ctsId: 'C9B7ZT',
            name: 'Murugan', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2411200', 
            ctsId: 'C9G7D2',
            name: 'Sahana P', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        },
        { 
            id: '2389541', 
            ctsId: 'C9H4JZ',
            name: 'Rengadurai', 
            department: 'QA&DOD',
            position: 'Executive',
            skills: ['General', 'UAT', 'Testing'], 
            daysOff: [0, 6],
            role: 'Executive'
        }
    ],
    shifts: [
        { 
            id: 'S1', 
            name: 'S1 - Morning Shift', 
            startTime: '06:00', 
            endTime: '16:00', 
            duration: 10,
            requiredSkills: ['General', 'UAT'], 
            description: '06:00 AM TO 04:00 PM IST',
            breakTime: '10:00-10:30, 12:00-13:00',
            shiftCode: 'S1'
        },
        { 
            id: 'S2', 
            name: 'S2 - Afternoon Shift', 
            startTime: '13:00', 
            endTime: '23:00', 
            duration: 10,
            requiredSkills: ['General', 'UAT'], 
            description: '01:00 PM TO 11:00 PM IST',
            breakTime: '16:00-16:30, 19:00-20:00',
            shiftCode: 'S2'
        },
        { 
            id: 'S3', 
            name: 'S3 - Night Shift', 
            startTime: '22:00', 
            endTime: '08:00', 
            duration: 10,
            requiredSkills: ['General', 'UAT'], 
            description: '10:00 PM TO 08:00 AM IST',
            breakTime: '01:00-01:30, 04:00-05:00',
            shiftCode: 'S3'
        },
        { 
            id: 'S4', 
            name: 'S4 - Extended Afternoon', 
            startTime: '12:30', 
            endTime: '22:30', 
            duration: 10,
            requiredSkills: ['General', 'UAT'], 
            description: '12:30 PM TO 10:30 PM IST',
            breakTime: '15:30-16:00, 18:30-19:30',
            shiftCode: 'S4'
        },
        { 
            id: 'G', 
            name: 'G - General Shift', 
            startTime: '09:00', 
            endTime: '19:00', 
            duration: 10,
            requiredSkills: ['General'], 
            description: '09:00 AM TO 07:00 PM IST',
            breakTime: '12:00-13:00, 15:30-16:00',
            shiftCode: 'G'
        },
        { 
            id: 'P', 
            name: 'P - Production Shift', 
            startTime: '18:30', 
            endTime: '04:30', 
            duration: 10,
            requiredSkills: ['General', 'Production'], 
            description: '06:30 PM TO 04:30 AM IST',
            breakTime: '21:30-22:00, 01:00-02:00',
            shiftCode: 'P'
        },
        { 
            id: 'HIH', 
            name: 'HIH - Hybrid Shift', 
            startTime: '11:30', 
            endTime: '20:30', 
            duration: 9,
            requiredSkills: ['General'], 
            description: '11:30 AM TO 08:30 PM IST',
            breakTime: '14:30-15:00, 17:30-18:00',
            shiftCode: 'HIH'
        }
    ],
    rules: [
        { 
            id: 'RUL001', 
            type: 'MIN_REST_HOURS', 
            value: 12, 
            description: 'Minimum 12 hours rest between shifts',
            priority: 'High',
            category: 'Labor Law'
        },
        { 
            id: 'RUL002', 
            type: 'MAX_CONSECUTIVE_DAYS', 
            value: 6, 
            description: 'Maximum 6 consecutive work days',
            priority: 'High',
            category: 'Labor Law'
        },
        { 
            id: 'RUL003', 
            type: 'MAX_HOURS_PER_DAY', 
            value: 12, 
            description: 'Maximum 12 hours work per day',
            priority: 'High',
            category: 'Labor Law'
        },
        { 
            id: 'RUL004', 
            type: 'SKILL_REQUIREMENT', 
            value: true, 
            description: 'Employee must have required skills for shift',
            priority: 'Medium',
            category: 'Operational'
        },
        { 
            id: 'RUL005', 
            type: 'DAY_OFF_PREFERENCE', 
            value: true, 
            description: 'Respect employee day-off preferences',
            priority: 'Medium',
            category: 'Employee Preference'
        },
        { 
            id: 'RUL006', 
            type: 'SUPERVISOR_REQUIRED', 
            value: true, 
            description: 'At least one supervisor per shift',
            priority: 'High',
            category: 'Operational'
        }
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
