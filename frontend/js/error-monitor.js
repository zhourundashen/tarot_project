/**
 * 错误监控系统 - 捕获、记录和上报前端错误
 * @namespace ErrorMonitor
 * @description 全局错误捕获器，支持自动捕获和手动上报
 */
const ErrorMonitor = {
    /**
     * 是否启用错误监控
     * @type {boolean}
     */
    enabled: true,
    
    /**
     * 数据源名称（上报服务地址）
     * @type {string|null}
     */
    dsn: null,
    
    /**
     * 当前用户ID
     * @type {string|null}
     */
    userId: null,
    
    /**
     * 运行环境
     * @type {string}
     */
    environment: 'production',
    
    /**
     * 应用版本号
     * @type {string}
     */
    version: '1.5.0',
    
    /**
     * 错误记录队列
     * @type {Array<Object>}
     */
    errors: [],
    
    /**
     * 最大错误记录数
     * @type {number}
     */
    maxErrors: 50,
    
    /**
     * 配置选项
     * @type {Object}
     */
    config: {
        captureGlobalErrors: true,
        capturePromiseRejections: true,
        captureConsoleErrors: false,
        reportInterval: 60000,
        maxQueueSize: 20
    },
    
    /**
     * 初始化错误监控
     * @param {Object} options - 配置选项
     * @param {string} [options.dsn] - 上报服务地址
     * @param {string} [options.environment='production'] - 环境标识
     * @param {string} [options.version] - 应用版本
     * @param {boolean} [options.enabled=true] - 是否启用
     * @param {Object} [options.config] - 详细配置
     * @example
     * ErrorMonitor.init({
     *     environment: 'development',
     *     version: '1.5.0',
     *     config: { captureConsoleErrors: true }
     * });
     */
    init(options = {}) {
        if (options.dsn) this.dsn = options.dsn;
        if (options.environment) this.environment = options.environment;
        if (options.version) this.version = options.version;
        if (options.enabled !== undefined) this.enabled = options.enabled;
        
        Object.assign(this.config, options.config || {});
        
        if (this.enabled) {
            this.setupGlobalHandlers();
            this.startReportInterval();
        }
        
        this.userId = this.getUserId();
        console.log('[ErrorMonitor] Initialized', { enabled: this.enabled });
    },
    
    /**
     * 设置全局错误处理器
     * @private
     */
    setupGlobalHandlers() {
        if (this.config.captureGlobalErrors) {
            window.addEventListener('error', (event) => {
                this.captureError(event.error || new Error(event.message), {
                    type: 'global',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            });
            
            window.addEventListener('unhandledrejection', (event) => {
                const error = event.reason instanceof Error 
                    ? event.reason 
                    : new Error(String(event.reason));
                this.captureError(error, { type: 'unhandledrejection' });
            });
        }
        
        if (this.config.captureConsoleErrors) {
            const originalError = console.error;
            console.error = (...args) => {
                this.captureError(new Error(args.join(' ')), { type: 'console' });
                originalError.apply(console, args);
            };
        }
    },
    
    /**
     * 捕获错误并记录
     * @param {Error} error - 错误对象
     * @param {Object} [context={}] - 附加上下文信息
     * @returns {Object} 错误数据对象
     * @example
     * try {
     *     riskyOperation();
     * } catch (error) {
     *     ErrorMonitor.captureError(error, { operation: 'riskyOperation' });
     * }
     */
    captureError(error, context = {}) {
        if (!this.enabled) return;
        
        const errorData = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            message: error.message || 'Unknown error',
            name: error.name || 'Error',
            stack: error.stack || '',
            context: {
                ...context,
                url: window.location.href,
                userAgent: navigator.userAgent,
                userId: this.userId,
                environment: this.environment,
                version: this.version
            }
        };
        
        this.errors.push(errorData);
        
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        this.saveToStorage();
        
        console.error('[ErrorMonitor]', errorData.message, errorData);
        
        return errorData;
    },
    
    /**
     * 捕获自定义消息
     * @param {string} message - 消息内容
     * @param {string} [level='info'] - 日志级别 (info/warning/error)
     * @param {Object} [extra={}] - 附加数据
     * @returns {Object} 消息数据对象
     * @example
     * ErrorMonitor.captureMessage('用户登录成功', 'info', { userId: '123' });
     */
    captureMessage(message, level = 'info', extra = {}) {
        if (!this.enabled) return;
        
        const data = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            type: 'message',
            level: level,
            message: message,
            context: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                userId: this.userId,
                ...extra
            }
        };
        
        this.errors.push(data);
        this.saveToStorage();
        
        return data;
    },
    
    /**
     * 上报错误到服务器
     * @async
     * @returns {Promise<void>}
     */
    async report() {
        if (!this.dsn || this.errors.length === 0) return;
        
        const unsentErrors = this.errors.filter(e => !e.sent);
        if (unsentErrors.length === 0) return;
        
        try {
            const response = await fetch(this.dsn, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    errors: unsentErrors,
                    environment: this.environment,
                    version: this.version
                })
            });
            
            if (response.ok) {
                unsentErrors.forEach(e => e.sent = true);
                this.saveToStorage();
                console.log('[ErrorMonitor] Reported', unsentErrors.length, 'errors');
            }
        } catch (e) {
            console.warn('[ErrorMonitor] Failed to report errors:', e.message);
        }
    },
    
    /**
     * 启动定时上报
     * @private
     */
    startReportInterval() {
        if (this.config.reportInterval > 0) {
            setInterval(() => this.report(), this.config.reportInterval);
        }
    },
    
    /**
     * 保存错误到localStorage
     * @private
     */
    saveToStorage() {
        try {
            const toSave = this.errors.slice(-this.config.maxQueueSize);
            localStorage.setItem('errorMonitor_errors', JSON.stringify(toSave));
        } catch (e) {
            console.warn('[ErrorMonitor] Failed to save errors:', e.message);
        }
    },
    
    /**
     * 从localStorage加载错误记录
     * @private
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('errorMonitor_errors');
            if (saved) {
                this.errors = JSON.parse(saved);
            }
        } catch (e) {
            this.errors = [];
        }
    },
    
    /**
     * 获取所有错误记录
     * @returns {Array<Object>} 错误记录数组
     */
    getErrors() {
        return [...this.errors];
    },
    
    /**
     * 清除所有错误记录
     */
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('errorMonitor_errors');
    },
    
    /**
     * 获取或创建用户ID
     * @private
     * @returns {string} 用户ID
     */
    getUserId() {
        let userId = localStorage.getItem('errorMonitor_userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('errorMonitor_userId', userId);
        }
        return userId;
    },
    
    /**
     * 生成唯一ID
     * @private
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * 设置用户信息
     * @param {string} userId - 用户ID
     * @param {Object} [userData={}] - 用户附加数据
     */
    setUser(userId, userData = {}) {
        this.userId = userId;
        this.userData = userData;
    },
    
    /**
     * 添加面包屑（用户行为追踪）
     * @param {string} category - 分类
     * @param {string} message - 消息
     * @param {Object} [data={}] - 附加数据
     * @example
     * ErrorMonitor.addBreadcrumb('navigation', '用户进入解读页面');
     */
    addBreadcrumb(category, message, data = {}) {
        const breadcrumb = {
            timestamp: new Date().toISOString(),
            category,
            message,
            data
        };
        
        if (!this.breadcrumbs) this.breadcrumbs = [];
        this.breadcrumbs.push(breadcrumb);
        
        if (this.breadcrumbs.length > 100) {
            this.breadcrumbs.shift();
        }
    },
    
    /**
     * 获取面包屑记录
     * @returns {Array<Object>} 面包屑数组
     */
    getBreadcrumbs() {
        return this.breadcrumbs || [];
    },
    
    /**
     * 包装函数，自动捕获错误
     * @param {Function} fn - 要包装的函数
     * @param {Object} [context={}] - 错误上下文
     * @returns {Function} 包装后的函数
     * @example
     * const safeFunction = ErrorMonitor.wrap(riskyFunction, { name: 'riskyFunction' });
     * safeFunction();
     */
    wrap(fn, context = {}) {
        return (...args) => {
            try {
                const result = fn.apply(this, args);
                if (result && typeof result.then === 'function') {
                    return result.catch((error) => {
                        this.captureError(error, { ...context, async: true });
                        throw error;
                    });
                }
                return result;
            } catch (error) {
                this.captureError(error, context);
                throw error;
            }
        };
    }
};

ErrorMonitor.loadFromStorage();
