/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    
    switch (param) { 
        case 'asc':
            return makeOrder(arr, 1);
        case 'desc':
            return makeOrder(arr, -1);
        default:
            return arr;
    }

    function makeOrder(array, direction) { 
        return [...array].sort((a, b) => { 
            return direction * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
        })
    }      
        
    /*    
    if (param === 'asc') { 
        arrCopy.sort((a, b) => {
            if (a[0].toLowerCase() === b[0].toLowerCase() && a[0] !== b[0]) return b.localeCompare(a);
            return a.localeCompare(b);
        });
    }

    if (param === 'desc') { 
        arrCopy.sort((a, b) => {
            if (a[0].toLowerCase() === b[0].toLowerCase() && a[0] !== b[0]) return a.localeCompare(b);
            return b.localeCompare(a);
        });
    }

    return arrCopy;
    */
}
