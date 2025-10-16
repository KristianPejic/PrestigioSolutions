export const environment = {
  production: false,
  enableDebugLogs: true,
  apiUrl: '',
  version: '1.0.0'
};

export const debugLog = (...args: any[]) => {
  if (!environment.production && environment.enableDebugLogs) {
    console.log(...args);
  }
};
