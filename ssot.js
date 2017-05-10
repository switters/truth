/**
 * Tiny env var resolver
 *
 * !!! PRECEDENCE MATTERS !!!
 *
 * example (from lowest priority to highest):
 *     .env
 *     < ```COMMAND_LINE_DECLARED node server.js```
 *     < ```node server.js --command_line_declared``` (case-insensitive)
 */

// precedence 0 (defaults)
const dotenv = require('dotenv').config().parsed;

// precedence 1 (COMMAND_LINE_DECLARED=true node server.js)
//  (and node globals)
const node_env = process.env;

// precedence 2 (node server.js --command_line_declared true)
const argv = require('yargs').argv;
// add upper-cased versions of command-line-supplied arguments
Object.keys(argv).forEach(k => argv[k.toUpperCase()] = argv[k]);

// export a new object
module.exports = Object.assign({}, dotenv, node_env, argv);
