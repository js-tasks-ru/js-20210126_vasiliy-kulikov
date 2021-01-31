/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    const arrFields = [...fields];
    const resultObj = {};
    
    for (let key in obj) { 
        if (arrFields.includes(key)) continue;
        resultObj[key] = obj[key];
    }

    return resultObj;
};
