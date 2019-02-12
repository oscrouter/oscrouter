'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
silly
debug
verbose
info
warn
error
 */

const logger = _winston2.default.createLogger({
	level: 'silly',
	format: _winston2.default.format.json(),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		//new winston.transports.File({ filename: 'error.log', level: 'error' }),
		//new winston.transports.File({ filename: 'combined.log' })
	]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
//if (process.env.NODE_ENV !== 'production') {
/* jshint node: true, esversion: 6, -W027, -W119, -W033 */
logger.add(new _winston2.default.transports.Console({
	format: _winston2.default.format.simple()
}));
//}

exports.default = logger;
//# sourceMappingURL=logger.js.map
