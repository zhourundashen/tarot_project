/**
 * 日志工具类
 * @description 提供统一的日志记录功能
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor(options = {}) {
        this.logDir = options.logDir || path.join(__dirname, '../../logs');
        this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024;
        this.maxFiles = options.maxFiles || 5;
        this.logLevel = options.logLevel || 'info';
        
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };

        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getLogFileName(level = 'app') {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDir, `${level}-${date}.log`);
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
    }

    writeToFile(filename, content) {
        try {
            const filePath = this.getLogFileName(filename);
            
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                if (stats.size >= this.maxFileSize) {
                    this.rotateLogs(filename);
                }
            }
            
            fs.appendFileSync(filePath, content);
        } catch (error) {
            console.error('写入日志文件失败:', error);
        }
    }

    rotateLogs(filename) {
        const baseFilename = this.getLogFileName(filename);
        
        for (let i = this.maxFiles - 1; i >= 1; i--) {
            const oldFile = `${baseFilename}.${i}`;
            const newFile = `${baseFilename}.${i + 1}`;
            
            if (fs.existsSync(oldFile)) {
                if (i === this.maxFiles - 1) {
                    fs.unlinkSync(oldFile);
                } else {
                    fs.renameSync(oldFile, newFile);
                }
            }
        }
        
        if (fs.existsSync(baseFilename)) {
            fs.renameSync(baseFile, `${baseFilename}.1`);
        }
    }

    shouldLog(level) {
        return this.levels[level] <= this.levels[this.logLevel];
    }

    log(level, message, meta = {}) {
        if (!this.shouldLog(level)) {
            return;
        }

        const formattedMessage = this.formatMessage(level, message, meta);

        console.log(formattedMessage.trim());

        this.writeToFile('app', formattedMessage);

        if (level === 'error') {
            this.writeToFile('error', formattedMessage);
        }
    }

    error(message, meta = {}) {
        this.log('error', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }

    logRequest(req, res, next) {
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const logData = {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent')
            };

            if (res.statusCode >= 400) {
                this.warn(`HTTP ${req.method} ${req.originalUrl}`, logData);
            } else {
                this.info(`HTTP ${req.method} ${req.originalUrl}`, logData);
            }
        });

        next();
    }

    logSecurity(event, details = {}) {
        const logData = {
            event,
            timestamp: new Date().toISOString(),
            ...details
        };

        this.warn(`安全事件: ${event}`, logData);
        this.writeToFile('security', this.formatMessage('SECURITY', event, logData));
    }
}

const logger = new Logger({
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || path.join(__dirname, '../../logs')
});

module.exports = logger;
