
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 500);
    }, 3000);
}

// Simple deep copy for objects and arrays
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Utility functions for Shift Roster Bot
export function formatDate(date) {
    // Format a date as YYYY-MM-DD
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}
