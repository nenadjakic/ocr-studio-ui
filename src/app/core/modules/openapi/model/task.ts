/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { OcrProgress } from './ocr-progress';
import { Document } from './document';
import { OcrConfig } from './ocr-config';
import { SchedulerConfig } from './scheduler-config';


export interface Task { 
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    version?: number;
    id?: string;
    name?: string;
    ocrConfig?: OcrConfig;
    schedulerConfig?: SchedulerConfig;
    ocrProgress?: OcrProgress;
    inDocuments?: Array<Document>;
}

