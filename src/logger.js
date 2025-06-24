// Custom logger utility to add timestamps to console logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Override console.log to include timestamp
console.log = function() {
    const timestamp = new Date().toISOString();
    const args = Array.from(arguments);
    originalConsoleLog.apply(console, [`[${timestamp}]`, ...args]);
};

// Override console.error to include timestamp
console.error = function() {
    const timestamp = new Date().toISOString();
    const args = Array.from(arguments);
    originalConsoleError.apply(console, [`[${timestamp}]`, ...args]);
};

// Override console.warn to include timestamp
console.warn = function() {
    const timestamp = new Date().toISOString();
    const args = Array.from(arguments);
    originalConsoleWarn.apply(console, [`[${timestamp}]`, ...args]);
};

module.exports = {
    // Export the overridden console methods
    log: console.log,
    error: console.error,
    warn: console.warn
};