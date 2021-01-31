/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const arrKeysValues = Object.entries(obj);
    const resultObj = {};
    
    for (let item of fields) { 
        arrKeysValues.forEach(element => {
            if (element[0] === item) resultObj[item] = element[1];
        });
    }; 

    return resultObj;
};
