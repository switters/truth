/**
 * SSOT: Tiny env var resolver
 *
 * !!! PRECEDENCE MATTERS !!!
 *
 * Variable precedence (lower precedence sources will be
 * over-written by higher precedence sources):
 *
 *  0. process.env
 *  1. ```MY_VAR=false node server.js```
 *  2. ./config/*.json
 *  3. ./.env
 *  4. ```node server.js --my_var true```
 *
 * Keys supplied in any manner will be upper-cased.
 */

/**
 * Make new object with all keys in UPPERCASE
 *
 * @param  {Object} obj Target object
 * @return {Object}     Copy of target with UPPERCASE keys
 */
function uppercase_obj (obj) {
  const uc = {};
  Object.keys(obj).forEach(k => uc[k.toUpperCase()] = obj[k]);

  return uc;
}

/**
 * process.env serves as the defaults
 *
 * This also means that COMMAND_LINE_DECLARED=true node server.js
 * will be overwritten if variable of same name (case-insensitive)
 * defined in config folder, .env file, or as a cli argument.
 *
 * @type {Object}
 */
const node_env = process.env;

/**
 * config overwrites defaults
 *
 * config/default.json || config/development.json (higher precedence)
 * will be used if NODE_ENV not defined.
 *
 * Use config/production.json if NODE_ENV === 'production'
 *
 * See config documentation for details on default behavior:
 *   https://www.npmjs.com/package/config
 *
 * NOTES:
 *  - Case is insensitive: all keys will be upper-cased
 *  - config/*.json files should be flat, having depth === 1.
 *
 * @type {Object}
 */
const config = uppercase_obj(require('config'));

/**
 * .env file will overwrite config/*.json files and defaults
 *
 * Case is insensitive: all keys will be upper-cased
 *
 * @type {Object}
 */
const dotenv = uppercase_obj(require('dotenv').config().parsed);


/**
 * command line arguments will overwrite all other variables
 *
 * NOTES:
 *  - See yargs documentation for details on default behavior:
 *    https://www.npmjs.com/package/yargs
 *  - Case is insensitive: all keys will be uppercased
 *
 * @type {Object}
 */
const argv = uppercase_obj(require('yargs').argv);

/**
 * export ssot
 *
 * @type {Object}
 */
module.exports = Object.freeze(Object.assign({}, node_env, config, dotenv, argv));
