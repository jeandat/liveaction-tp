import { HttpErrorResponse } from '@angular/common/http';
import { Site } from '../../core/model/site.model';
import { SAPI_GetSiteListFailure, SAPI_GetSiteListSuccess, ResetSiteList, SAPI_GetSiteSuccess } from './site.actions';
import { siteInitialState, siteReducer } from './site.reducer';


const mocks = [{id:'1'}, {id:'2'}, {id:'3'}] as Site[];

describe('Site Reducer', () => {

    it('should return the initial state', () => {
        const action = {} as any;
        const result = siteReducer(siteInitialState, action);
        expect(result).toBe(siteInitialState);
    });

    it('should set sites from API', () => {
        const action = new SAPI_GetSiteListSuccess({sites:mocks});
        const newState = siteReducer(siteInitialState, action);
        expect(newState.ids.length).toBe(mocks.length);
        expect(Object.keys(newState.entities).length).toBe(mocks.length);
        expect(newState.error).toBeFalsy();
    });

    it('should reset state', () => {
        const action = new SAPI_GetSiteListSuccess({sites:mocks});
        let newState = siteReducer(siteInitialState, action);
        expect(Object.keys(newState.entities).length).toBe(mocks.length);
        newState = siteReducer(siteInitialState, new ResetSiteList());
        expect(Object.keys(newState.entities).length).toBe(0);
        expect(newState.ids.length).toBe(0);
        expect(newState).toEqual(siteInitialState);
    });

    it('should set error from API', () => {
        const error = new HttpErrorResponse({status:404});
        const action = new SAPI_GetSiteListFailure({error});
        const newState = siteReducer(siteInitialState, action);
        expect(newState.error).toBe(error);
    });

    it('should set current site from API', () => {
        const site = mocks[0];
        const action = new SAPI_GetSiteSuccess({site});
        const newState = siteReducer(siteInitialState, action);
        expect(newState.current).toEqual(site);
        expect(newState.error).toBeFalsy();
    });

});
