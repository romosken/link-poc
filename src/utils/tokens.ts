// Token management utilities
export const TOKEN_COSTS = {
    PROPERTY_ANALYSIS: 5,
    CONSULTANT_REQUEST: 15,
} as const;

export const INITIAL_TOKENS = 50;

export function getTokens(): number {
    if (typeof window === 'undefined') return INITIAL_TOKENS;
    const tokens = localStorage.getItem('userTokens');
    return tokens ? parseInt(tokens, 10) : INITIAL_TOKENS;
}

export function setTokens(tokens: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userTokens', tokens.toString());
}

export function consumeTokens(amount: number): boolean {
    const currentTokens = getTokens();
    if (currentTokens < amount) {
        return false; // Not enough tokens
    }
    setTokens(currentTokens - amount);
    return true;
}

export function addTokens(amount: number): void {
    const currentTokens = getTokens();
    setTokens(currentTokens + amount);
}

export function resetTokens(): void {
    setTokens(INITIAL_TOKENS);
}
