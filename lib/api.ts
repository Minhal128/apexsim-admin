const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Convert body to JSON string if it's an object
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
        body = JSON.stringify(body);
    }

    console.log(`[ADMIN API] Request: ${options.method || 'GET'} ${endpoint}`, body ? JSON.parse(body as string) : '');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[ADMIN API] Error ${response.status} on ${endpoint}:`, errorData);
            throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json();
        console.log(`[ADMIN API] Success ${endpoint}:`, data);
        return data;
    } catch (err: any) {
        console.error(`[ADMIN API] Fetch Failure on ${endpoint}:`, err.message);
        throw err;
    }
};
