/* tslint:disable */
/* eslint-disable */
/**
 * Congress.gov API
 * The Congress.gov API provides programmatic access to legislative data from the United States Congress. This API enables developers to search, retrieve, and analyze legislative data including bills, resolutions, amendments, and congressional records.  This is NOT the official congress.gov YAML and contains modifications.  Currently only supports 6/100 API operations.  Bill API: 0/16  Amendments API: 0/8  Summaries API: 0/3  Congress API: 0/3  Member API: 6/8  Committee API: 0/10  Committee Report API: 0/5  Committee Print API: 0/5  Committee Meeting API: 0/4  Hearing API: 0/4  Congressional Record API: 0/1  Daily Congressional Record API: 0/4  Bound Congressional Record API: 0/4  House Communication API: 0/4  House Requirement API: 0/3  Senate Communication API: 0/4  Nomination API: 0/7  Treaty API: 0/7
 *
 * The version of the OpenAPI document: 0.1.7
 * Contact: liudotjson@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';

export const BASE_PATH = "https://api.congress.gov/v3".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface RequestArgs
 */
export interface RequestArgs {
    url: string;
    options: RawAxiosRequestConfig;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration | undefined;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected axios: AxiosInstance = globalAxios) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath ?? basePath;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    constructor(public field: string, msg?: string) {
        super(msg);
        this.name = "RequiredError"
    }
}

interface ServerMap {
    [key: string]: {
        url: string,
        description: string,
    }[];
}

/**
 *
 * @export
 */
export const operationServerMap: ServerMap = {
}
