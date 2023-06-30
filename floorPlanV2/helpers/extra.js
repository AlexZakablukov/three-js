/**
 * JSON parser function with defender
 * @param {string|null} [data = '{}'] - data to parse
 * @param {any=} [plug = {}] - default value for not parsable data
 * @returns {any} parsed object from json
 */
export const jsonParser = (data = "{}", plug = {}) => {
  try {
    return JSON.parse(data) || plug;
  } catch (error) {
    return plug;
  }
};

/**
 * This function can check type of value is object
 * @param value value to check
 * @returns {boolean}
 */
export const isObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";
