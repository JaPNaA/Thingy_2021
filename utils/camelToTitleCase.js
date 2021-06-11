const beforeUppercase = /(.)(?=[A-Z])/g;

/**
 * Converts `camelCase` into `Title Case`
 * @param {string} camelCase
 */
export function camelToTitleCase(camelCase) {
    const spacedStr = camelCase.replace(beforeUppercase, "$1 ");
    return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);
}
