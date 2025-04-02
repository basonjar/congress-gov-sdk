/* tslint:disable */
/* eslint-disable */
/**
 * Congress.gov API
 * The Congress.gov API provides programmatic access to legislative data from the United States Congress. This API enables developers to search, retrieve, and analyze legislative data including bills, resolutions, amendments, and congressional records.  This is NOT the official congress.gov YAML and contains modifications.  Currently only supports 7/100 API operations.  Bill API: 0/16  Amendments API: 0/8  Summaries API: 0/3  Congress API: 0/3  Member API: 7/8  Committee API: 0/10  Committee Report API: 0/5  Committee Print API: 0/5  Committee Meeting API: 0/4  Hearing API: 0/4  Congressional Record API: 0/1  Daily Congressional Record API: 0/4  Bound Congressional Record API: 0/4  House Communication API: 0/4  House Requirement API: 0/3  Senate Communication API: 0/4  Nomination API: 0/7  Treaty API: 0/7
 *
 * The version of the OpenAPI document: 0.1.8
 * Contact: liudotjson@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface ConfigurationParameters {
  apiKey?:
    | string
    | Promise<string>
    | ((name: string) => string)
    | ((name: string) => Promise<string>);
  username?: string;
  password?: string;
  accessToken?:
    | string
    | Promise<string>
    | ((name?: string, scopes?: string[]) => string)
    | ((name?: string, scopes?: string[]) => Promise<string>);
  basePath?: string;
  serverIndex?: number;
  baseOptions?: any;
  formDataCtor?: new () => any;
}

export class Configuration {
  /**
   * parameter for apiKey security
   * @param name security name
   * @memberof Configuration
   */
  apiKey?:
    | string
    | Promise<string>
    | ((name: string) => string)
    | ((name: string) => Promise<string>);
  /**
   * parameter for basic security
   *
   * @type {string}
   * @memberof Configuration
   */
  username?: string;
  /**
   * parameter for basic security
   *
   * @type {string}
   * @memberof Configuration
   */
  password?: string;
  /**
   * parameter for oauth2 security
   * @param name security name
   * @param scopes oauth2 scope
   * @memberof Configuration
   */
  accessToken?:
    | string
    | Promise<string>
    | ((name?: string, scopes?: string[]) => string)
    | ((name?: string, scopes?: string[]) => Promise<string>);
  /**
   * override base path
   *
   * @type {string}
   * @memberof Configuration
   */
  basePath?: string;
  /**
   * override server index
   *
   * @type {number}
   * @memberof Configuration
   */
  serverIndex?: number;
  /**
   * base options for axios calls
   *
   * @type {any}
   * @memberof Configuration
   */
  baseOptions?: any;
  /**
   * The FormData constructor that will be used to create multipart form data
   * requests. You can inject this here so that execution environments that
   * do not support the FormData class can still run the generated client.
   *
   * @type {new () => FormData}
   */
  formDataCtor?: new () => any;

  constructor(param: ConfigurationParameters = {}) {
    this.apiKey = param.apiKey;
    this.username = param.username;
    this.password = param.password;
    this.accessToken = param.accessToken;
    this.basePath = param.basePath;
    this.serverIndex = param.serverIndex;
    this.baseOptions = param.baseOptions;
    this.formDataCtor = param.formDataCtor;
  }

  /**
   * Check if the given MIME is a JSON MIME.
   * JSON MIME examples:
   *   application/json
   *   application/json; charset=UTF8
   *   APPLICATION/JSON
   *   application/vnd.company+json
   * @param mime - MIME (Multipurpose Internet Mail Extensions)
   * @return True if the given MIME is JSON, false otherwise.
   */
  public isJsonMime(mime: string): boolean {
    const jsonMime: RegExp = new RegExp(
      "^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$",
      "i",
    );
    return (
      mime !== null &&
      (jsonMime.test(mime) ||
        mime.toLowerCase() === "application/json-patch+json")
    );
  }
}
