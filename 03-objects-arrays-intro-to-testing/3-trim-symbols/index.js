/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (!string || size === 0) return '';
    if (!size && size !== 0) return string;

    const uniqueLetters = new Set(string);
    let resultString = string;

    for (let item of uniqueLetters) {
        let wrongSubstr = '';
        
        for (let i = 0; i <= size; i++) {
            wrongSubstr += item;
        }
        
        while (resultString.indexOf(wrongSubstr) >= 0) {
            resultString = resultString.slice(0, resultString.indexOf(wrongSubstr)) + resultString.slice(resultString.indexOf(wrongSubstr) + 1);
        }
    }

    return resultString;
}
