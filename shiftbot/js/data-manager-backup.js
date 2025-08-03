
import { generateId, deepClone } from './utils.js';

const LOCAL_STORAGE_KEY = 'shiftBotData';

const defaultData = {
    employees: [
        // NPE Team - Leads
        { 
            id: 'NPE001', 
            ctsId: 'EH0647',
            name: 'Dinesh Anbalagan', 
            department: 'NPE',
            position: 'Team Lead',
            skills: ['Java', 'API Testing', 'Leadership'], 
            daysOff: [0],
            role: 'Lead'
        },
        { 
            id: 'NPE002', 
            ctsId: 'EG4208',
            name: 'Mano Kumar', 
            department: 'NPE',
            position: 'Shift Lead',
            skills: ['Python', 'Performance Testing', 'Leadership'], 
            daysOff: [6],
            role: 'Lead'
        },
        { 
            id: 'NPE003', 
            ctsId: 'EH6832',
            name: 'Jeyakaran S', 
            department: 'NPE',
            position: 'Shift Lead',
            skills: ['Java', 'UI Testing', 'Leadership'], 
            daysOff: [0],
            role: 'Lead'
        },
        
        // NPE Team - Associates
        { 
            id: 'NPE004', 
            ctsId: 'C7H8KH',
            name: 'Karthikeyan R', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Java', 'API Testing'], 
            daysOff: [0, 6],
            role: 'Associate'
        },
        { 
            id: 'NPE005', 
            ctsId: 'C8G3CW',
            name: 'Jeeva Subramaniam', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Python', 'UI Testing'], 
            daysOff: [6],
            role: 'Associate'
        },
        { 
            id: 'NPE006', 
            ctsId: 'C8Q4SJ',
            name: 'Praveenkumar Sridharan', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Java', 'API Testing'], 
            daysOff: [0],
            role: 'Associate'
        },
        { 
            id: 'NPE007', 
            ctsId: 'C8Q6LM',
            name: 'Dinesh Kumar', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Python', 'Performance Testing'], 
            daysOff: [0, 6],
            role: 'Associate'
        },
        { 
            id: 'NPE008', 
            ctsId: 'C8Q7NP',
            name: 'Rajesh Kannan', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Java', 'UI Testing'], 
            daysOff: [6],
            role: 'Associate'
        },
        { 
            id: 'NPE009', 
            ctsId: 'C8Q8QR',
            name: 'Suresh Babu', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Python', 'API Testing'], 
            daysOff: [0],
            role: 'Associate'
        },
        { 
            id: 'NPE010', 
            ctsId: 'C8Q9ST',
            name: 'Venkatesh Kumar', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Java', 'Performance Testing'], 
            daysOff: [0, 6],
            role: 'Associate'
        },
        { 
            id: 'NPE011', 
            ctsId: 'C8R0UV',
            name: 'Arun Prakash', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Python', 'UI Testing'], 
            daysOff: [6],
            role: 'Associate'
        },
        { 
            id: 'NPE012', 
            ctsId: 'C8R1WX',
            name: 'Santhosh Kumar', 
            department: 'NPE',
            position: 'Associate',
            skills: ['Java', 'API Testing'], 
            daysOff: [0],
            role: 'Associate'
        }
    ],
    shifts: [
        { 
            id: 'S1', 
            name: 'S1 - Morning', 
            startTime: '06:00', 
            endTime: '14:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 2 }, 
            totalRequired: 3 
        },
        { 
            id: 'S2', 
            name: 'S2 - Afternoon', 
            startTime: '14:00', 
            endTime: '22:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 1 }, 
            totalRequired: 2 
        },
        { 
            id: 'S3', 
            name: 'S3 - Night', 
            startTime: '22:00', 
            endTime: '06:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 2 }, 
            totalRequired: 3 
        },
        { 
            id: 'S4', 
            name: 'S4 - Special', 
            startTime: '10:00', 
            endTime: '18:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 1 }, 
            totalRequired: 2, 
            isRare: true 
        }
    ],
    rules: [
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
