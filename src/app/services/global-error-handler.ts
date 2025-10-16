import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { debugLog } from '../enviroments/enviroments';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: Error): void {
    this.zone.run(() => {
      debugLog('Global error caught:', error);

      if (error.message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
        debugLog('Change detection error - likely caused by async state updates');
        return;
      }

      this.logErrorToService(error);
      this.showUserFriendlyMessage(error);
    });
  }

  private logErrorToService(error: Error): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    debugLog('Error logged:', errorData);
  }

  private showUserFriendlyMessage(error: Error): void {
    debugLog('User-friendly error message should be shown here');
  }
}
