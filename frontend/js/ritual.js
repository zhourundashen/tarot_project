const RitualEffects = {
    enabled: true,
    
    init() {
        this.loadSettings();
        this.createRitualContainer();
        this.updateVisibility();
    },
    
    loadSettings() {
        const saved = localStorage.getItem('ritualSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.enabled = settings.enabled !== false;
            } catch (e) {
                this.enabled = true;
            }
        }
    },
    
    saveSettings() {
        localStorage.setItem('ritualSettings', JSON.stringify({
            enabled: this.enabled
        }));
    },
    
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        this.updateVisibility();
        return this.enabled;
    },
    
    createRitualContainer() {
        if (document.getElementById('ritual-container')) {
            return true;
        }
        
        const container = document.createElement('div');
        container.id = 'ritual-container';
        container.className = 'ritual-container';
        container.innerHTML = `
            <div class="mystical-hexagram">
                <svg viewBox="0 0 400 400" class="hexagram-svg" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="mysticGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#9a7b2c;stop-opacity:0.8" />
                        </linearGradient>
                        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style="stop-color:#6b5b95;stop-opacity:0.15" />
                            <stop offset="100%" style="stop-color:#0a0a0f;stop-opacity:0" />
                        </radialGradient>
                        <filter id="mysticGlow">
                            <feGaussianBlur stdDeviation="1.5" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <circle cx="200" cy="200" r="180" fill="url(#centerGlow)" class="bg-glow"/>
                    
                    <circle cx="200" cy="200" r="170" fill="none" stroke="url(#mysticGold)" stroke-width="0.5" opacity="0.3"/>
                    <circle cx="200" cy="200" r="140" fill="none" stroke="url(#mysticGold)" stroke-width="0.3" opacity="0.2"/>
                    
                    <g class="hexagram-main" filter="url(#mysticGlow)">
                        <polygon points="200,30 347,270 53,270" 
                            fill="none" stroke="url(#mysticGold)" stroke-width="1.5" class="triangle-up"/>
                        <polygon points="200,370 53,130 347,130" 
                            fill="none" stroke="url(#mysticGold)" stroke-width="1.5" class="triangle-down"/>
                    </g>
                    
                    <g class="inner-hexagram" opacity="0.5">
                        <polygon points="200,70 310,250 90,250" 
                            fill="none" stroke="url(#mysticGold)" stroke-width="0.8"/>
                        <polygon points="200,330 90,150 310,150" 
                            fill="none" stroke="url(#mysticGold)" stroke-width="0.8"/>
                    </g>
                    
                    <g class="hexagram-center" fill="#d4af37" opacity="0.6">
                        <circle cx="200" cy="200" r="5"/>
                    </g>
                    
                    <g class="hexagram-points" fill="#d4af37" opacity="0.4">
                        <circle cx="200" cy="30" r="3"/>
                        <circle cx="347" cy="270" r="3"/>
                        <circle cx="53" cy="270" r="3"/>
                        <circle cx="200" cy="370" r="3"/>
                        <circle cx="53" cy="130" r="3"/>
                        <circle cx="347" cy="130" r="3"/>
                    </g>
                </svg>
            </div>
        `;
        
        document.body.appendChild(container);
        return true;
    },
    
    getCurrentPhase() {
        if (typeof app !== 'undefined' && app.currentPhase) {
            return app.currentPhase;
        }
        
        const phases = ['shuffle', 'cut', 'draw', 'result'];
        for (const phase of phases) {
            const phaseEl = document.getElementById(`phase-${phase}`);
            if (phaseEl && phaseEl.style.display !== 'none' && phaseEl.style.display !== '') {
                return phase;
            }
        }
        return null;
    },
    
    shouldShowRitual() {
        if (!this.enabled) return false;
        
        const phase = this.getCurrentPhase();
        return phase === 'draw' || phase === 'result';
    },
    
    updateVisibility() {
        const container = document.getElementById('ritual-container');
        if (!container) return;
        
        const shouldShow = this.shouldShowRitual();
        
        if (shouldShow) {
            container.style.display = 'flex';
            setTimeout(() => container.classList.add('visible'), 10);
        } else {
            container.classList.remove('visible');
            setTimeout(() => container.style.display = 'none', 300);
        }
        
        const toggleBtn = document.getElementById('btn-ritual');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active', this.enabled);
        }
    }
};

window.RitualEffects = RitualEffects;
