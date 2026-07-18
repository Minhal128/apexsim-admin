const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apexsim-backend.onrender.com/api";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    // Improved token retrieval with validation
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        
        // Validate token exists and is not empty
        if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
            console.warn('[ADMIN API] Token not found or invalid in localStorage');
            token = null;
            
            // Only throw error for protected endpoints (not login/public endpoints)
            if (!endpoint.includes('/login') && !endpoint.includes('/public')) {
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Redirect to login if not already there
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
                    window.location.href = '/signin';
                }
                throw new Error('Token not found, authorization denied.');
            }
        }
    }

    // Convert body to JSON string if it's an object
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
        body = JSON.stringify(body);
    }

    console.log(`[ADMIN API] Request: ${options.method || 'GET'} ${endpoint}`, body ? JSON.parse(body as string) : '');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    // Only add Authorization header if token exists
    if (token && token.trim() !== '') {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            body,
        });

        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
            console.error('[ADMIN API] Unauthorized - Token expired or invalid');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
                window.location.href = '/signin';
            }
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[ADMIN API] Error ${response.status} on ${endpoint}:`, errorData);
            throw new Error(errorData.message || errorData.error || 'Something went wrong');
        }

        const data = await response.json();
        console.log(`[ADMIN API] Success ${endpoint}:`, data);
        return data;
    } catch (err: any) {
        console.error(`[ADMIN API] Fetch Failure on ${endpoint}:`, err.message);
        throw err;
    }
};
