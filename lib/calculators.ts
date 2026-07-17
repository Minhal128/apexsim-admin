/**
 * Trading Calculator Utilities
 * Calculates Equity, Free Margin, Margin Level, and other trading metrics
 */

export interface Position {
    symbol: string;
    type: 'buy' | 'sell';
    entryPrice: number;
    currentPrice: number;
    amount: number;
    leverage?: number;
}

export interface AccountBalance {
    balance: number;
    positions: Position[];
}

/**
 * Calculate unrealized P&L for a position
 */
export const calculatePnL = (position: Position): number => {
    const { type, entryPrice, currentPrice, amount } = position;
    
    if (type === 'buy') {
        return (currentPrice - entryPrice) * amount;
    } else {
        return (entryPrice - currentPrice) * amount;
    }
};

/**
 * Calculate Equity
 * Equity = Balance + Unrealized P&L
 */
export const calculateEquity = (account: AccountBalance): number => {
    const { balance, positions } = account;
    
    const totalPnL = positions.reduce((sum, position) => {
        return sum + calculatePnL(position);
    }, 0);
    
    return balance + totalPnL;
};

/**
 * Calculate Margin Used
 * For leveraged positions: Margin = (Position Size * Entry Price) / Leverage
 * For spot: Margin = Position Size * Entry Price
 */
export const calculateMarginUsed = (positions: Position[]): number => {
    return positions.reduce((sum, position) => {
        const leverage = position.leverage || 1;
        const positionValue = position.amount * position.entryPrice;
        return sum + (positionValue / leverage);
    }, 0);
};

/**
 * Calculate Free Margin
 * Free Margin = Equity - Margin Used
 */
export const calculateFreeMargin = (account: AccountBalance): number => {
    const equity = calculateEquity(account);
    const marginUsed = calculateMarginUsed(account.positions);
    
    return equity - marginUsed;
};

/**
 * Calculate Margin Level
 * Margin Level = (Equity / Margin Used) * 100
 * Returns percentage (e.g., 250 means 250%)
 */
export const calculateMarginLevel = (account: AccountBalance): number => {
    const equity = calculateEquity(account);
    const marginUsed = calculateMarginUsed(account.positions);
    
    if (marginUsed === 0) {
        return 0; // No positions, no margin used
    }
    
    return (equity / marginUsed) * 100;
};

/**
 * Calculate total unrealized P&L across all positions
 */
export const calculateTotalPnL = (positions: Position[]): number => {
    return positions.reduce((sum, position) => {
        return sum + calculatePnL(position);
    }, 0);
};

/**
 * Check if account is at risk of margin call
 * Typically margin call happens at 100% margin level
 */
export const isMarginCallRisk = (account: AccountBalance, threshold: number = 100): boolean => {
    const marginLevel = calculateMarginLevel(account);
    return marginLevel > 0 && marginLevel <= threshold;
};

/**
 * Calculate liquidation risk
 * Returns percentage (0-100) indicating how close to liquidation
 */
export const calculateLiquidationRisk = (account: AccountBalance): number => {
    const marginLevel = calculateMarginLevel(account);
    
    if (marginLevel <= 0) return 100; // Already liquidated
    if (marginLevel >= 200) return 0; // Safe
    
    // Linear scale: 100% margin level = 100% risk, 200% = 0% risk
    return Math.max(0, Math.min(100, (200 - marginLevel)));
};

/**
 * Format currency with proper decimals
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`;
};
