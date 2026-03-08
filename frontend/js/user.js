const UserService = {
    token: null,
    user: null,
    backendUrl: 'http://localhost:3000',

    init() {
        this.token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
            } catch (e) {
                this.user = null;
            }
        }
    },

    isLoggedIn() {
        return !!this.token && !!this.user;
    },

    async register(phone, password, nickname) {
        const response = await fetch(`${this.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password, nickname })
        });

        const data = await response.json();
        
        if (data.success) {
            this.token = data.data.token;
            this.user = data.data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        return data;
    },

    async login(phone, password) {
        const response = await fetch(`${this.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        const data = await response.json();
        
        if (data.success) {
            this.token = data.data.token;
            this.user = data.data.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        return data;
    },

    async guestLogin() {
        const response = await fetch(`${this.backendUrl}/api/auth/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        if (data.success) {
            this.token = data.data.token;
            this.user = { isGuest: true };
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        return data;
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'X-User-Id': this.user?.id || 'guest'
        };
    },

    async getProfile() {
        if (!this.user?.id) return null;
        
        const response = await fetch(`${this.backendUrl}/api/user/profile`, {
            headers: this.getAuthHeaders()
        });

        const data = await response.json();
        
        if (data.success) {
            this.user = { ...this.user, ...data.data };
            localStorage.setItem('user', JSON.stringify(this.user));
        }
        
        return data;
    },

    async saveReading(spreadId, question, cards) {
        const response = await fetch(`${this.backendUrl}/api/reading/create`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ spreadId, question, cards })
        });

        return await response.json();
    },

    async getReadingHistory(page = 1, limit = 20) {
        const response = await fetch(
            `${this.backendUrl}/api/reading/list?page=${page}&limit=${limit}`,
            { headers: this.getAuthHeaders() }
        );

        return await response.json();
    }
};

UserService.init();
