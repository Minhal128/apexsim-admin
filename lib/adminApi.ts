import { apiRequest } from './api';

// ==================== USERS MANAGEMENT ====================
export const getUsersList = async (page = 1, limit = 20, search = '') => {
    return apiRequest(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
};

export const createUser = async (userData: { name: string; email: string; phone?: string }) => {
    return apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const updateUser = async (userId: string, userData: any) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = async (userId: string) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
    });
};

export const getUserDetails = async (userId: string) => {
    return apiRequest(`/admin/users/${userId}`);
};

export const disableUser = async (userId: string) => {
    return apiRequest(`/admin/users/${userId}/disable`, {
        method: 'POST',
    });
};

export const resetUserPassword = async (userId: string) => {
    return apiRequest(`/admin/users/${userId}/reset-password`, {
        method: 'POST',
    });
};

export const enableUser = async (userId: string) => {
    return apiRequest(`/admin/users/${userId}/enable`, {
        method: 'POST',
    });
};

// ==================== ROLES & PERMISSIONS ====================
export const getAdminsList = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/admins?page=${page}&limit=${limit}`);
};

export const createAdmin = async (adminData: { name: string; email: string; role: string }) => {
    return apiRequest('/admin/admins', {
        method: 'POST',
        body: JSON.stringify(adminData),
    });
};

export const updateAdmin = async (adminId: string, adminData: any) => {
    return apiRequest(`/admin/admins/${adminId}`, {
        method: 'PUT',
        body: JSON.stringify(adminData),
    });
};

export const deleteAdmin = async (adminId: string) => {
    return apiRequest(`/admin/admins/${adminId}`, {
        method: 'DELETE',
    });
};

export const getRoles = async () => {
    return apiRequest('/admin/roles');
};

export const updateAdminRole = async (adminId: string, role: string) => {
    return apiRequest(`/admin/admins/${adminId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
    });
};

// ==================== MARKET PRICE FEEDS ====================
export const getMarketFeeds = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/market-feeds?page=${page}&limit=${limit}`);
};

export const getRealtimeMarketPrices = async () => {
    return apiRequest('/admin/market-feeds/realtime');
};

export const refreshMarketPrices = async () => {
    return apiRequest('/admin/market-feeds/refresh', {
        method: 'POST',
    });
};

export const createMarketFeed = async (feedData: any) => {
    return apiRequest('/admin/market-feeds', {
        method: 'POST',
        body: JSON.stringify(feedData),
    });
};

export const updateMarketFeed = async (feedId: string, feedData: any) => {
    return apiRequest(`/admin/market-feeds/${feedId}`, {
        method: 'PUT',
        body: JSON.stringify(feedData),
    });
};

export const deleteMarketFeed = async (feedId: string) => {
    return apiRequest(`/admin/market-feeds/${feedId}`, {
        method: 'DELETE',
    });
};

export const toggleMarketFeed = async (feedId: string, enabled: boolean) => {
    return apiRequest(`/admin/market-feeds/${feedId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ enabled }),
    });
};

// ==================== TRADING MANAGEMENT ====================
export const getTrades = async (page = 1, limit = 20, filter = '') => {
    return apiRequest(`/admin/trades?page=${page}&limit=${limit}&filter=${filter}`);
};

export const getSpotOrders = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/trades/spot?page=${page}&limit=${limit}`);
};

export const getFuturePositions = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/trades/futures?page=${page}&limit=${limit}`);
};

export const cancelOrder = async (orderId: string) => {
    return apiRequest(`/admin/trades/${orderId}/cancel`, {
        method: 'POST',
    });
};

export const closeFuturePosition = async (positionId: string) => {
    return apiRequest(`/admin/trades/${positionId}/close`, {
        method: 'POST',
    });
};

export const updateTrade = async (tradeId: string, tradeData: any) => {
    return apiRequest(`/admin/trades/${tradeId}`, {
        method: 'PUT',
        body: JSON.stringify(tradeData),
    });
};

export const updateTradeStatus = async (tradeId: string, status: string) => {
    return apiRequest(`/admin/trades/${tradeId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
};

// ==================== WALLET & TRANSACTIONS ====================
export const getWalletTransactions = async (page = 1, limit = 20, type = '') => {
    return apiRequest(`/admin/wallet/transactions?page=${page}&limit=${limit}&type=${type}`);
};

export const getDepositActivities = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/wallet/deposits?page=${page}&limit=${limit}`);
};

export const getWithdrawActivities = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/wallet/withdrawals?page=${page}&limit=${limit}`);
};

export const approveDeposit = async (depositId: string) => {
    return apiRequest(`/admin/wallet/deposits/${depositId}/approve`, {
        method: 'POST',
    });
};

export const rejectDeposit = async (depositId: string, reason: string) => {
    return apiRequest(`/admin/wallet/deposits/${depositId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
    });
};

export const approveWithdrawal = async (withdrawalId: string) => {
    return apiRequest(`/admin/wallet/withdrawals/${withdrawalId}/approve`, {
        method: 'POST',
    });
};

export const rejectWithdrawal = async (withdrawalId: string, reason: string) => {
    return apiRequest(`/admin/wallet/withdrawals/${withdrawalId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
    });
};

export const refundTransaction = async (transactionId: string) => {
    return apiRequest(`/admin/wallet/transactions/${transactionId}/refund`, {
        method: 'POST',
    });
};

// ==================== NOTIFICATIONS ====================
export const getNotifications = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/notifications?page=${page}&limit=${limit}`);
};

export const sendNotification = async (notificationData: any) => {
    return apiRequest('/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(notificationData),
    });
};

export const markNotificationAsRead = async (notificationId: string) => {
    return apiRequest(`/admin/notifications/${notificationId}/read`, {
        method: 'POST',
    });
};

// ==================== DASHBOARD STATS ====================
export const getDashboardStats = async () => {
    return apiRequest('/admin/stats');
};

export const getDashboardCharts = async (timeFrame = '24h') => {
    return apiRequest(`/admin/charts?timeFrame=${timeFrame}`);
};

export const getRecentUsers = async (limit = 10) => {
    return apiRequest(`/admin/recent-users?limit=${limit}`);
};

export const getRecentTransactions = async (limit = 10) => {
    return apiRequest(`/admin/recent-transactions?limit=${limit}`);
};

// ==================== SETTINGS ====================
export const getSettings = async () => {
    return apiRequest('/admin/settings');
};

export const updateSettings = async (settings: any) => {
    return apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
    });
};

export const updateSystemSettings = async (key: string, value: any) => {
    return apiRequest(`/admin/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
    });
};

// ==================== SYSTEM OPERATIONS ====================
export const getSystemStatus = async () => {
    return apiRequest('/admin/system/status');
};

export const restartServices = async () => {
    return apiRequest('/admin/system/restart', {
        method: 'POST',
    });
};

export const getSystemLogs = async (page = 1, limit = 50) => {
    return apiRequest(`/admin/system/logs?page=${page}&limit=${limit}`);
};

export const clearCache = async () => {
    return apiRequest('/admin/system/cache/clear', {
        method: 'POST',
    });
};

// ==================== REPORTS ====================
export const generateReport = async (reportType: string, dateRange: { start: string; end: string }) => {
    return apiRequest('/admin/reports/generate', {
        method: 'POST',
        body: JSON.stringify({ reportType, dateRange }),
    });
};

export const getReports = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/reports?page=${page}&limit=${limit}`);
};

export const downloadReport = async (reportId: string) => {
    return apiRequest(`/admin/reports/${reportId}/download`);
};

// ==================== KYCK & VERIFICATION ====================
export const getPendingKYC = async (page = 1, limit = 20) => {
    return apiRequest(`/admin/kyc/pending?page=${page}&limit=${limit}`);
};

export const approveKYC = async (userId: string) => {
    return apiRequest(`/admin/kyc/${userId}/approve`, {
        method: 'POST',
    });
};

export const rejectKYC = async (userId: string, reason: string) => {
    return apiRequest(`/admin/kyc/${userId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
    });
};

// ==================== SECURITY ====================
export const changePassword = async (oldPassword: string, newPassword: string) => {
    return apiRequest('/admin/security/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
    });
};

export const enableTwoFactor = async () => {
    return apiRequest('/admin/security/2fa/enable', {
        method: 'POST',
    });
};

export const disableTwoFactor = async () => {
    return apiRequest('/admin/security/2fa/disable', {
        method: 'POST',
    });
};

export const getAuditLogs = async (page = 1, limit = 50) => {
    return apiRequest(`/admin/audit-logs?page=${page}&limit=${limit}`);
};
