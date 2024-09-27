import { OcrProgress } from '../core/modules/openapi';

export class Utils {
  static getOcrStatusText(status?: OcrProgress.StatusEnum) {
    if (status) {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    return 'Unknown';
  }

  static getOcrStatusSeverity(status?: OcrProgress.StatusEnum) {
    switch (status) {
      case OcrProgress.StatusEnum.Created:
      case OcrProgress.StatusEnum.Triggered:
      case OcrProgress.StatusEnum.Started:
        return 'info';
      case OcrProgress.StatusEnum.Failed:
        return 'danger';
      case OcrProgress.StatusEnum.Interrupted:
      case OcrProgress.StatusEnum.Canceled:
        return 'warn';
      case OcrProgress.StatusEnum.Finished:
        return 'success';
      default:
        return 'secondary';
    }
  }
}
