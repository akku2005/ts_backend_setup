import { createLogger, format, transports } from 'winston';
import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { EApplicationEnvironment } from '../constants/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { blue, red, yellow, magenta } from 'colorette';
import 'winston-mongodb';
import { MongoDBTransportInstance } from 'winston-mongodb';

// Linking Trace Support
sourceMapSupport.install();

const colorizeLevel = (level: string) => {
  switch (level) {
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
    const customLevel = colorizeLevel(level.toUpperCase());
    const customTimestamp = magenta(timestamp as string);
    const customMeta =
      Object.keys(meta).length > 0
        ? util.inspect(meta, { colors: true, depth: null })
        : '{}';

    return `${customLevel}[${customTimestamp}] ${message}\n${magenta('META')}: ${customMeta}\n`;
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
const createConsoleTransport = (): Array<ConsoleTransportInstance> => {
  if (
    config.ENV === EApplicationEnvironment.DEVELOPMENT ||
    config.ENV === EApplicationEnvironment.PRODUCTION
  ) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }
  return [];
};

// Create a function to return an array of file transports
const createFileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ];
};

// MongoDB transport setup
const mongodbTransport = (): Array<MongoDBTransportInstance> => {
  if (config.DATABASE_URL) {
    return [
      new transports.MongoDB({
        level: 'info',
        db: config.DATABASE_URL as string, // Ensure the URL is correctly formatted
        metaKey: 'meta',
        expireAfterSeconds: 3600 * 24 * 30, // Expire logs after 30 days
        options: {
          useUnifiedTopology: true,
        },
        collection: 'application-log',
      }),
    ];
  }
  return [];
};

// Create and export the logger instance
const logger = createLogger({
  defaultMeta: {
    meta: {},
  },
  transports: [
    ...createConsoleTransport(),
    ...createFileTransport(),
    ...mongodbTransport(),
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
