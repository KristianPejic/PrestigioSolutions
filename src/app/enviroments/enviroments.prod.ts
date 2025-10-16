export const environment = {
  production: true,
  enableDebugLogs: false,
  apiUrl: 'https://api.prestigiosolutions.com',
  version: '1.0.0'
};

export const debugLog = (...args: any[]) => {
  if (!environment.production && environment.enableDebugLogs) {
    console.log(...args);
  }
};
