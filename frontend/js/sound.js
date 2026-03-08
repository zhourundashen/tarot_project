const SoundManager = {
    enabled: true,
    audioContext: null,
    volume: 0.5,

    init() {
        const saved = localStorage.getItem('soundEnabled');
        this.enabled = saved === null ? true : saved === 'true';
        
        const savedVolume = localStorage.getItem('soundVolume');
        this.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
    },

    getAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
                return null;
            }
        }
        return this.audioContext;
    },

    play(soundType) {
        if (!this.enabled) return;
        
        const ctx = this.getAudioContext();
        if (!ctx) return;

        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        switch (soundType) {
            case 'shuffle':
                this.playShuffle(ctx);
                break;
            case 'draw':
                this.playDraw(ctx);
                break;
            case 'reveal':
                this.playReveal(ctx);
                break;
            case 'click':
                this.playClick(ctx);
                break;
            case 'success':
                this.playSuccess(ctx);
                break;
        }
    },

    playShuffle(ctx) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (!this.enabled) return;
                
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200 + Math.random() * 100, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
            }, i * 80);
        }
    },

    playDraw(ctx) {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);
        
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        noise.start(ctx.currentTime);
    },

    playReveal(ctx) {
        const notes = [523.25, 659.25, 783.99];
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                if (!this.enabled) return;
                
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
                
                gainNode.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            }, i * 100);
        });
    },

    playClick(ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    },

    playSuccess(ctx) {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, i) => {
            setTimeout(() => {
                if (!this.enabled) return;
                
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
                
                gainNode.gain.setValueAtTime(this.volume * 0.12, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.4);
            }, i * 120);
        });
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        return this.enabled;
    },

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        localStorage.setItem('soundVolume', this.volume);
    },

    isEnabled() {
        return this.enabled;
    }
};

SoundManager.init();
