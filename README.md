# Introduction

ssot is a tiny library for bringing together command-line-supplied config variables with environment variables from various sources into one immutable object, one single source of truth.

Readme clarity: wip.

# Sources

ssot uses three commonly used packages to collect configuration and/or environment variables:

- [yargs](https://www.npmjs.com/package/yargs) to collect arbitrary command line arguments, eg. `node server.js --port 3000`.
- [dotenv](https://www.npmjs.com/package/dotenv) to read environment variables from a file located at `./.env`.
- [config](https://www.npmjs.com/package/config) to read environment variables from json files within `./config`.

Note: `process.env` should also be considered a source of truth. It represents the user environment according to node and includes environment variables supplied in the command line, eg. `MY_VAR=some_string node server.js`.

More on [`process.env` here](https://nodejs.org/api/process.html#process_process_env).

# Precedence

None or all of these config/env var sources may be used.

If more than one is used and they define a value for the same variable, a static precedence hierarchy defines how such conflicts will be settled.

Precedence in brief:
### cli args > process.env > .env > .config/*.json
(highest)...........................................................(lowest)
## Precedence Hierarchy (descending)

## cli arguments

Arbitrarily supplied command line arguments win all arguments:

- will **never** be **over-written**
- will always **over-write**

See the [yargs readme](https://www.npmjs.com/package/yargs) for details on default behavior.

## process.env
`process.env` is node.js' representation of the user environment. It includes environment variables supplied in the commandline, eg. `MY_VAR=some_string node server.js`.

It:

- will be **over-written** by command line arguments.
- will **over-write** values stored in `./.env` or `./config/*.json` files.

See the [node docs](https://nodejs.org/api/process.html#process_process_env) for details on default behavior.

## .env
Variables loaded from the `./.env` file:

- will be **over-written** by command line arguments, and `process.env` variables (including environment variables supplied in the command-line: eg, `MY_VAR=some_string node server.js`).
- will **over-write** those values stored in `./config/*.json` files.

See the [dotenv readme](https://www.npmjs.com/package/dotenv) for details on expected setup and default behaviour.

## config
Environment variables loaded by config from `./config/*.json`:

- will be **over-written** by all other sources: `./.env` variables, command line arguments, and `process.env` variables (including environment variables supplied in the command-line: eg, `MY_VAR=some_string node server.js`).

The config folder is best used to supply variable templates and defaults for various environments.

The config source is sensitive to the `NODE_ENV` variable:
- If `NODE_ENV` is undefined, the `./config/development.json` or `./config/defaults.json` file will be loaded.
- If `NODE_ENV` is equal to `production`, the `./config/production.json` file will be loaded.
- Etc.

See the [config readme](https://www.npmjs.com/package/config) for details on expected setup and default behaviour.
