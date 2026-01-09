/**
 * API configuration for mobile (Capacitor) and web builds
 */

// The deployed Vercel API endpoint - used by mobile builds
const PRODUCTION_API_URL = 'https://nakano-room.vercel.app';

/**
 * Check if running in a Capacitor native app context
 */
export function isNativeApp(): boolean {
    if (typeof window === 'undefined') return false;

    // Capacitor sets this when running in a native app
    return !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
        .Capacitor?.isNativePlatform?.();
}

/**
 * Get the base API URL for the current environment
 * - Native app: Use production Vercel endpoint
 * - Web: Use relative URL (same origin)
 */
export function getApiBaseUrl(): string {
    if (isNativeApp()) {
        return PRODUCTION_API_URL;
    }
    // For web, use relative path
    return '';
}

/**
 * Get the full API endpoint URL
 */
export function getApiUrl(path: string): string {
    const base = getApiBaseUrl();
    return `${base}${path}`;
}
