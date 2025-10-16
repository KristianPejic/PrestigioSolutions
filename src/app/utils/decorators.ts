export function Debounce(delay: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeout: any;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

export function Throttle(delay: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastRun = 0;
    let timeout: any;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      if (now - lastRun >= delay) {
        originalMethod.apply(this, args);
        lastRun = now;
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          originalMethod.apply(this, args);
          lastRun = Date.now();
        }, delay - (now - lastRun));
      }
    };

    return descriptor;
  };
}
