import { createLogger, format, transports } from 'winston';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { blue, red, yellow, green, magenta } from 'colorette';
import 'winston-mongodb';
import { MongoDBTransportInstance } from 'winston-mongodb';
import config from '../config/config';

// Linking Trace Support
sourceMapSupport.install();

// Helper function to colorize log levels for the console output
const colorizeLevel = (level: string): string => {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return red(level);
    case 'INFO':
      return blue(level);
    case 'WARN':
      return yellow(level);
    default:
      return level;
  }
};

// Define the log format for the console output
const consoleLogFormat = format.printf(
  ({ level, message, timestamp, meta = {} }) => {
    const customLevel = colorizeLevel(level);
    const customTimestamp = green(timestamp as string);
    const formattedMeta = util.inspect(meta, {
      showHidden: false,
      depth: null,
      colors: true,
    });

    return `${customLevel} [${customTimestamp}] ${message}\n${magenta('META')}: ${formattedMeta}\n`;
  },
);

// Define the log format for the file output
const fileLogFormat = format.printf(
  ({ level, message, timestamp, meta = {} }) => {
    const logMeta: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(meta)) {
      if (value instanceof Error) {
        logMeta[key] = {
          name: value.name,
          message: value.message,
          trace: value.stack || '',
        };
      } else {
        logMeta[key] = value;
      }
    }
    const logData = {
      level: level.toUpperCase(),
      message,
      timestamp,
      meta: logMeta,
    };
    return JSON.stringify(logData, null, 4);
  },
);

// Create a function to return an array of console transports
const createConsoleTransport = () => [
  new transports.Console({
    level: 'info',
    format: format.combine(format.timestamp(), consoleLogFormat),
  }),
];

// Create a function to return an array of file transports
const createFileTransport = () => [
  new transports.File({
    filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
    level: 'info',
    format: format.combine(format.timestamp(), fileLogFormat),
  }),
];

// Create a function to return an array of MongoDB transports
const createMongoDBTransport = () => [
  new transports.MongoDB({
    level: 'info',
    db: config.DATABASE_URL as string,
    metaKey: 'meta',
    expireAfterSeconds: 3600 * 24 * 30, // 30 days expiration
    options: {
      useUnifiedTopology: true,
    },
    collection: 'application-log',
  }),
];

// Create and export the logger instance
const logger = createLogger({
  defaultMeta: {
    meta: {},
  },
  transports: [
    ...createConsoleTransport(), // Include console transport
    ...createFileTransport(), // Include file transport
    ...createMongoDBTransport(), // Include MongoDB transport
  ],
});

export default logger;

// import { createLogger, format, transports } from 'winston';
// import {
//   ConsoleTransportInstance,
//   FileTransportInstance,
// } from 'winston/lib/winston/transports';
// import util from 'util';
// import config from '../config/config';
// // import { EApplicationEnvironment } from '../constants/application';
// import path from 'path';

// // Define the log format for the console output
// const consoleLogFormat = format.printf(
//   ({ level, message, timestamp, meta = {} }) => {
//     const customLevel = level.toUpperCase();
//     const customTimestamp = timestamp;
//     const customMeta = util.inspect(meta, { showHidden: false, depth: null });

//     return `${customLevel}[${customTimestamp}] ${message}\nMETA: ${customMeta}\n`;
//   },
// );

// // Define the log format for the file output
// const fileLogFormat = format.printf((info) => {
//   const { level, message, timestamp, meta = {} } = info;
//   const logMeta: Record<string, unknown> = {};

//   for (const [key, value] of Object.entries(meta)) {
//     if (value instanceof Error) {
//       logMeta[key] = {
//         name: value.name,
//         message: value.message,
//         trace: value.stack || '',
//       };
//     } else {
//       logMeta[key] = value;
//     }
//   }

//   const logData = {
//     level: level.toUpperCase(),
//     message,
//     timestamp,
//     meta: logMeta,
//   };

//   return JSON.stringify(logData, null, 4);
// });

// // Create a function to return an array of console transports
// const createConsoleTransport = (): Array<ConsoleTransportInstance> => {
//   return [
//     new transports.Console({
//       level: 'info',
//       format: format.combine(format.timestamp(), consoleLogFormat),
//     }),
//   ];
// };

// // Create a function to return an array of file transports
// const createFileTransport = (): Array<FileTransportInstance> => {
//   return [
//     new transports.File({
//       filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
//       level: 'info',
//       format: format.combine(format.timestamp(), fileLogFormat),
//     }),
//   ];
// };

// // Create and export the logger instance
// const logger = createLogger({
//   defaultMeta: {
//     meta: {},
//   },
//   transports: [
//     ...createConsoleTransport(), // Always include console transport
//     ...createFileTransport(), // Always include file transport
//   ],
// });

// export default logger;
