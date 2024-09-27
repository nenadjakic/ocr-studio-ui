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


export interface OcrProgress { 
    status?: OcrProgress.StatusEnum;
    progress?: string;
    description?: string;
}
export namespace OcrProgress {
    export type StatusEnum = 'CREATED' | 'TRIGGERED' | 'STARTED' | 'FAILED' | 'INTERRUPTED' | 'CANCELED' | 'FINISHED';
    export const StatusEnum = {
        Created: 'CREATED' as StatusEnum,
        Triggered: 'TRIGGERED' as StatusEnum,
        Started: 'STARTED' as StatusEnum,
        Failed: 'FAILED' as StatusEnum,
        Interrupted: 'INTERRUPTED' as StatusEnum,
        Canceled: 'CANCELED' as StatusEnum,
        Finished: 'FINISHED' as StatusEnum
    };
}

