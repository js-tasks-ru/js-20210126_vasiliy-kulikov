/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if (!obj) return obj;
    let result = {};
    Object.entries(obj).forEach(item => result[item[1]] = item[0]);
    return result;
}
