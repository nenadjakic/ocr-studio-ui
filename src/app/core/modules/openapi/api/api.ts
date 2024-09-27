export * from './analytics-controller.service';
import { AnalyticsControllerService } from './analytics-controller.service';
export * from './config-controller.service';
import { ConfigControllerService } from './config-controller.service';
export * from './ocr-controller.service';
import { OcrControllerService } from './ocr-controller.service';
export * from './task-controller.service';
import { TaskControllerService } from './task-controller.service';
export const APIS = [AnalyticsControllerService, ConfigControllerService, OcrControllerService, TaskControllerService];
