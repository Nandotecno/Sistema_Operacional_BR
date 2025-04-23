// Simple utility functions for managing login attempts and lockout in localStorage

const ATTEMPTS_KEY = 'loginAttempts';
const LOCKOUT_TIMESTAMP_KEY = 'lockoutTimestamp';

/**
 * Checks if the user is currently locked out based on the timestamp and duration.
 * Also clears lockout if the duration has passed.
 * @param {number} lockoutDurationMs - The lockout duration in milliseconds.
 * @returns {boolean} True if locked out, false otherwise.
 */
export function checkLockout(lockoutDurationMs) {
    const lockoutTimestamp = parseInt(localStorage.getItem(LOCKOUT_TIMESTAMP_KEY) || '0', 10);
    if (!lockoutTimestamp) {
        return false; // Not locked out if no timestamp
    }

    const now = Date.now();
    if (now < lockoutTimestamp + lockoutDurationMs) {
        return true; // Still within lockout period
    } else {
        // Lockout period expired, clear lockout state
        localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
        localStorage.removeItem(ATTEMPTS_KEY); // Also reset attempts count
        return false;
    }
}

/**
 * Records a failed login attempt and returns the number of remaining attempts.
 * @param {number} maxAttempts - The maximum allowed attempts before lockout.
 * @returns {number} The number of attempts remaining (0 if lockout should occur).
 */
export function recordFailedAttempt(maxAttempts) {
    let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10);
    attempts++;
    localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

    if (attempts >= maxAttempts) {
        return 0; // Indicate lockout should occur
    } else {
        return maxAttempts - attempts; // Return remaining attempts
    }
}

/**
 * Resets the login attempt counter.
 */
export function resetAttempts() {
    localStorage.removeItem(ATTEMPTS_KEY);
    // Note: We don't necessarily remove the lockout timestamp here,
    // as checkLockout handles expiry. Resetting attempts is usually
    // done on successful login.
}