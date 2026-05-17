import { strict as assert } from 'assert';
/**
 * Safely parses a value to an integer.
 * Returns the default value if parsing fails or value is None.
 */
function parseInt(value,  = 0) {
    if (value === null || value === undefined) {
        return ;
        ;
    }
    try {
        // Handle string stripping and potential float-like strings
        const s = String(value).trim();
        if (!s) {
            return ;
            ;
        }
        // If there's a dot, it might be a string float "1.0", convert to float first
        if (s.includes('.')) {
            return parseInt(float(s), 10);
        }
        return parseInt(s);
    }
    catch (error) {
        return ;
        ;
    }
}
/**
 * Safely parses a value to an integer.
 * Returns None if parsing fails, value is None, or value is an empty string.
 */
function parseIntOptional(value) {
    if (value === null || value === undefined) {
        return null;
    }
    try {
        const s = String(value).trim();
        if (!s) {
            return null;
        }
        // If there's a dot, it might be a string float "1.0", convert to float first
        if (s.includes('.')) {
            return parseInt(float(s), 10);
        }
        return parseInt(s);
    }
    catch (error) {
        return null;
    }
}
// Check function to verify the correctness of the parseInt and parseIntOptional functions
function check() {
    assert(parseInt(5, 10) === 5, 'Test case 1 failed');
    assert(parseInt(3.5, 20) === 20, 'Test case 2 failed');
    assert(parseInt('abc', 42) === 42, 'Test case 3 failed');
    assert(parseIntOptional(null) === null, 'Test case 4 failed');
    assert(parseIntOptional(undefined) === undefined, 'Test case 5 failed');
    console.log('All test cases passed!');
}
//# sourceMappingURL=parsing.js.map