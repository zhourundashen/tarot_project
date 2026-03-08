/**
 * 图片懒加载工具
 * @description 使用 Intersection Observer 实现图片懒加载
 */

const LazyLoader = {
    observer: null,
    placeholderClass: 'card-placeholder',
    loadedClass: 'card-loaded',
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
        
        console.log('LazyLoader 初始化完成');
    },
    
    observe(imgElement) {
        if (this.observer) {
            this.observer.observe(imgElement);
        } else {
            this.loadImage(imgElement);
        }
    },
    
    loadImage(imgElement) {
        const src = imgElement.dataset.src;
        if (!src) return;
        
        const parent = imgElement.closest('.result-card-front, .modal-card');
        if (parent) {
            parent.classList.add(this.placeholderClass);
        }
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            imgElement.src = src;
            imgElement.removeAttribute('data-src');
            imgElement.classList.add(this.loadedClass);
            
            if (parent) {
                parent.classList.remove(this.placeholderClass);
                parent.classList.add(this.loadedClass);
            }
            
            imgElement.style.opacity = '1';
            imgElement.style.transition = 'opacity 0.5s ease';
        };
        
        tempImg.onerror = () => {
            imgElement.style.display = 'none';
            console.warn('图片加载失败:', src);
        };
        
        tempImg.src = src;
    },
    
    createPlaceholderSVG() {
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="215" viewBox="0 0 140 215">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#2a2a3e;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="140" height="215" fill="url(#grad)"/>
                <text x="70" y="107" text-anchor="middle" font-size="48" fill="#d4af37" opacity="0.5">🔮</text>
            </svg>
        `)}`;
    },
    
    getPlaceholder() {
        return this.createPlaceholderSVG();
    },
    
    setupLazyImage(imgElement, realSrc) {
        imgElement.dataset.src = realSrc;
        imgElement.src = this.getPlaceholder();
        imgElement.style.opacity = '0.8';
        
        this.observe(imgElement);
    },
    
    loadAll() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    },
    
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

if (typeof window !== 'undefined') {
    window.LazyLoader = LazyLoader;
    LazyLoader.init();
}
