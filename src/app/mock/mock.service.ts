import { Injectable } from '@angular/core';
import { getStatusText, InMemoryDbService, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { RequestInfo } from 'angular-in-memory-web-api/interfaces';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Site } from '../core/model/site.model';
import { sitesMock } from './sites.mock';


export interface MockDb {
    sites:Site[];
}

const sites = sitesMock;

@Injectable({
    providedIn:'root'
})
export class MockService implements InMemoryDbService {

    constructor() {
    }

    createDb(reqInfo?:RequestInfo):{} | Observable<{}> | Promise<{}> {

        // Default returnType
        let returnType = 'object';
        // let returnType  = 'observable';
        // let returnType  = 'promise';

        // Clears the collections if the request body tells it to do so
        if (reqInfo) {
            const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
            if (body.clear === true) {
                sites.length = 0;
            }
            // 'returnType` can be 'object' | 'observable' | 'promise'
            returnType = body.returnType || 'object';
        }
        const db:MockDb = {
            sites
        };

        switch (returnType) {
            case ('observable'):
                return of(db).pipe(delay(10));
            case ('promise'):
                return new Promise(resolve => {
                    setTimeout(() => resolve(db), 10);
                });
            default:
                return db;
        }
    }

    // HTTP GET interceptor
    get(reqInfo:RequestInfo) {
        const collectionName = reqInfo.collectionName;
        if (collectionName === 'sites' && !reqInfo.id) {
            return this.getSites(reqInfo);
        }
        return undefined; // let the default GET handle the rest
    }

    // The objective is to serve different objects to mimic a true backend.
    responseInterceptor(resOptions:ResponseOptions, reqInfo:RequestInfo) {
        if (resOptions.body) {
            resOptions.body = JSON.parse(JSON.stringify(resOptions.body));
        }
        return resOptions;
    }

    private getSites(reqInfo:RequestInfo) {
        return reqInfo.utils.createResponse$(() => {
            console.log('HTTP GET override');

            // tslint:disable-next-line
            const collection = sites.map(({id, name}) => ({id, name})) as Site[];
            const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;

            // tslint:disable-next-line:triple-equals
            const data = collection;

            const options:ResponseOptions = {
                body:dataEncapsulation ? {data} : data,
                status:STATUS.OK
            };
            return this.finishOptions(options, reqInfo);
        });
    }

    private finishOptions(options:ResponseOptions, {headers, url}:RequestInfo) {
        // @ts-ignore
        options.statusText = getStatusText(options.status);
        options.headers = headers;
        options.url = url;
        return options;
    }


}
