/**
 * 模块加载器 - 实现按需加载JavaScript模块
 * @namespace ModuleLoader
 * @description 动态加载非核心模块，减少首屏加载时间
 */
const ModuleLoader = {
    /**
     * 已加载的模块集合
     * @type {Set<string>}
     */
    loadedModules: new Set(),
    
    /**
     * 正在加载中的Promise对象
     * @type {Object<string, Promise>}
     */
    loadingPromises: {},
    
    /**
     * 模块路径映射表
     * @type {Object<string, string>}
     */
    modules: {
        share: 'js/share.js',
        ritual: 'js/ritual.js',
        loadingWheel: 'js/loading-wheel.js'
    },
    
    /**
     * 异步加载指定模块
     * @async
     * @param {string} moduleName - 模块名称（share/ritual/loadingWheel）
     * @returns {Promise<boolean>} 加载成功返回true，失败抛出错误
     * @example
     * await ModuleLoader.load('share');
     * // 现在可以使用 TarotShare
     */
    async load(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return true;
        }
        
        if (this.loadingPromises[moduleName]) {
            return this.loadingPromises[moduleName];
        }
        
        const path = this.modules[moduleName];
        if (!path) {
            console.error(`Unknown module: ${moduleName}`);
            return false;
        }
        
        this.loadingPromises[moduleName] = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path;
            script.async = true;
            
            script.onload = () => {
                this.loadedModules.add(moduleName);
                delete this.loadingPromises[moduleName];
                console.log(`[ModuleLoader] Loaded: ${moduleName}`);
                resolve(true);
            };
            
            script.onerror = () => {
                delete this.loadingPromises[moduleName];
                console.error(`[ModuleLoader] Failed to load: ${moduleName}`);
                reject(new Error(`Failed to load module: ${moduleName}`));
            };
            
            document.head.appendChild(script);
        });
        
        return this.loadingPromises[moduleName];
    },
    
    /**
     * 批量加载多个模块
     * @async
     * @param {string[]} moduleNames - 模块名称数组
     * @returns {Promise<boolean[]>} 每个模块的加载结果
     * @example
     * await ModuleLoader.loadMultiple(['share', 'ritual']);
     */
    async loadMultiple(moduleNames) {
        return Promise.all(moduleNames.map(name => this.load(name)));
    },
    
    /**
     * 检查模块是否已加载
     * @param {string} moduleName - 模块名称
     * @returns {boolean} 已加载返回true
     */
    isLoaded(moduleName) {
        return this.loadedModules.has(moduleName);
    },
    
    /**
     * 预加载模块（静默加载，不等待结果）
     * @param {string} moduleName - 模块名称
     * @example
     * // 在空闲时预加载分享模块
     * ModuleLoader.preload('share');
     */
    preload(moduleName) {
        if (!this.loadedModules.has(moduleName) && !this.loadingPromises[moduleName]) {
            this.load(moduleName).catch(() => {});
        }
    }
};
