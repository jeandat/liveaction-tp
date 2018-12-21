// tslint:disable class-name

import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Site } from '../../core/model/site.model';


export enum SiteActionTypes {
    TOV_GetSiteList = '[Traffic Out View] Get Site List',
    SAPI_GetSiteListSuccess = '[Site API] Get Site List Success',
    SAPI_GetSiteListFailure = '[Site API] Get Site List Failure',
    TOV_GetSite = '[Traffic Out View] Get Site',
    SAPI_GetSiteSuccess = '[Site API] Get Site Success',
    SAPI_GetSiteFailure = '[Site API] Get Site Failure',
    ResetSiteList = 'Reset Site List'
}


// Get Site List
// -------------

export class TOV_GetSiteList implements Action {
    readonly type = SiteActionTypes.TOV_GetSiteList;

    constructor(public payload = {}) {
    }
}


export class SAPI_GetSiteListSuccess implements Action {
    readonly type = SiteActionTypes.SAPI_GetSiteListSuccess;

    constructor(public payload:{ sites:Site[] }) {
    }
}


export class SAPI_GetSiteListFailure implements Action {
    readonly type = SiteActionTypes.SAPI_GetSiteListFailure;

    constructor(public payload:{ error:HttpErrorResponse }) {
    }
}


// Get Site
// --------


export class TOV_GetSite implements Action {
    readonly type = SiteActionTypes.TOV_GetSite;

    constructor(public payload:{ id:string }) {
    }
}


export class SAPI_GetSiteSuccess implements Action {
    readonly type = SiteActionTypes.SAPI_GetSiteSuccess;

    constructor(public payload:{ site:Site }) {
    }
}


export class SAPI_GetSiteFailure implements Action {
    readonly type = SiteActionTypes.SAPI_GetSiteFailure;

    constructor(public payload:{ error:HttpErrorResponse }) {
    }
}


// Other
// -----

export class ResetSiteList implements Action {
    readonly type = SiteActionTypes.ResetSiteList;

    constructor(public payload = {}) {
    }
}


export type SiteActions =
    TOV_GetSiteList
    | SAPI_GetSiteListSuccess
    | SAPI_GetSiteListFailure
    | TOV_GetSite
    | SAPI_GetSiteSuccess
    | SAPI_GetSiteFailure
    | ResetSiteList;
