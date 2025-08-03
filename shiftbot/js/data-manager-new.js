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
            totalRequired: 3,
            description: '06:00 AM TO 02:00 PM IST'
        },
        { 
            id: 'S2', 
            name: 'S2 - Afternoon', 
            startTime: '14:00', 
            endTime: '22:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 1 }, 
            totalRequired: 2,
            description: '02:00 PM TO 10:00 PM IST'
        },
        { 
            id: 'S3', 
            name: 'S3 - Night', 
            startTime: '22:00', 
            endTime: '06:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 2 }, 
            totalRequired: 3,
            description: '10:00 PM TO 06:00 AM IST'
        },
        { 
            id: 'S4', 
            name: 'S4 - Special', 
            startTime: '10:00', 
            endTime: '18:00', 
            requiredSkills: ['Java', 'Python'], 
            requiredRoles: { 'Lead': 1, 'Associate': 1 }, 
            totalRequired: 2, 
            isRare: true,
            description: '10:00 AM TO 06:00 PM IST (Rare/Special Coverage)'
        }
    ],
    rules: [
        { id: generateId(), type: 'MIN_REST_HOURS', value: 10, description: 'Minimum 10 hours rest between shifts' },
        { id: generateId(), type: 'MAX_CONSECUTIVE_DAYS', value: 5, description: 'Maximum 5 consecutive work days' },
        { id: generateId(), type: 'REQUIRED_SKILL', value: 1, description: 'Employee must have required skills for shift' },
        { id: generateId(), type: 'DAY_OFF', value: 1, description: 'Respect employee preferred days off' }
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
