const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);

/**
 * JSON.parse that keeps integers outside ±(2^53-1) as strings so precision
 * isn't lost. Safe integers stay numbers.
 */
export function jsonParseSafeIntegers(text: string): any {
    return JSON.parse(
        text.replace(/([:\[,]\s*)(-?\d+)(\s*[,\]}])/g, (full, pre, digits, post) => {
            try {
                const value = BigInt(digits);
                if (value > MAX_SAFE || value < MIN_SAFE) {
                    return `${pre}"${digits}"${post}`;
                }
            } catch {
                // leave unchanged
            }
            return full;
        })
    );
}
