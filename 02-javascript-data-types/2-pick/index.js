/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const arrFields = [...fields];
    const resultObj = {};
    
    for (let key in obj) { 
        if (arrFields.includes(key)) resultObj[key] = obj[key];  
    }

    return resultObj;
};
