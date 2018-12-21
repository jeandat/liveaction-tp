import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Site } from '../../core/model/site.model';
import { SiteActions, SiteActionTypes } from './site.actions';


// This structure is hypothetical based on naive assumptions.
// Depending on data model and volumetry, we could have done something else entirely.
export interface SiteState extends EntityState<Site> {
    // additional entities state properties
    error?:HttpErrorResponse;
    current?:Site;
}


export const siteAdapter:EntityAdapter<Site> = createEntityAdapter<Site>();

export const siteInitialState:SiteState = siteAdapter.getInitialState({
    // additional entity state properties
    error:undefined,
    current:undefined
});

export function siteReducer(state = siteInitialState, action:SiteActions):SiteState {

    switch (action.type) {

        case SiteActionTypes.ResetSiteList: {
            const newState = siteAdapter.removeAll(state);
            return Object.assign(newState, {error:undefined, current:undefined});
        }

        case SiteActionTypes.SAPI_GetSiteListSuccess: {
            const newState = siteAdapter.addAll(action.payload.sites, state);
            return Object.assign(newState, {error:undefined});
        }

        case SiteActionTypes.SAPI_GetSiteListFailure: {
            console.log('error:', action);
            const diff = {error:action.payload.error};
            return {...state, ...diff} as SiteState;
        }

        case SiteActionTypes.SAPI_GetSiteSuccess: {
            const diff = {current:action.payload.site};
            return {...state, ...diff} as SiteState;
        }

        case SiteActionTypes.SAPI_GetSiteFailure: {
            console.log('error:', action);
            const diff = {error:action.payload.error};
            return {...state, ...diff} as SiteState;
        }

        default: {
            return state;
        }
    }
}
