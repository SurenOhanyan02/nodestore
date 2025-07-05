class Logger {
    static error(message, meta = {}) {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, meta);
    }

    static info(message, meta = {}) {
        console.log(`[${new Date().toISOString()}] INFO: ${message}`, meta);
    }

    static warn(message, meta = {}) {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`, meta);
    }
}

export default Logger;