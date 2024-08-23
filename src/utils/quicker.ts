// src/utils/quicker.ts
import os from 'os';
import config from '../config/config';

export default {
  getSystemHealth: () => {
    const data = {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)}MB`,
    };
    console.log('System Health Data:', data); // Debug log
    return data;
  },
  getApplicationHealth: () => {
    const data = {
      environment: config.ENV,
      uptime: `${process.uptime().toFixed(2)} seconds`,
      memoryUsage: {
        heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
      },
    };
    console.log('Application Health Data:', data); // Debug log
    return data;
  },
};
