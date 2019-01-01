import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { EMPTY, of, ReplaySubject, throwError } from 'rxjs';
import { activityIndicatorServiceStub } from '../../../testing/activity-indicator-service.stub';
import { siteServiceStub } from '../../../testing/site-service.stub';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Site } from '../../core/model/site.model';
import { ActionWithPayload, AppState } from '../../core/store/core.reducer';
import { NO_ACTION } from '../../core/store/no-action';
import { SiteService } from '../site-service/site.service';
import {
    SAPI_GetSiteFailure,
    SAPI_GetSiteListFailure,
    SAPI_GetSiteListSuccess,
    SAPI_GetSiteSuccess, SiteActions,
    TOV_GetSite,
    TOV_GetSiteList
} from './site.actions';
import { SiteEffects } from './site.effects';
import { siteReducer, SiteState } from './site.reducer';
import Spy = jasmine.Spy;
import SpyObj = jasmine.SpyObj;


const mocks = [{id:'1', name:'foo'}, {id:'2', name:'bar'}, {id:'3', name:'baz'}] as Site[];

describe('Site Effects', () => {

    let effects:SiteEffects;
    let actions:ReplaySubject<ActionWithPayload>;
    let store:Store<SiteState>;
    let siteService: SpyObj<SiteService>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[
                StoreModule.forRoot({sites:siteReducer})
            ],
            providers:[
                SiteEffects,
                provideMockActions(() => actions),
                {provide:SiteService, useValue:siteServiceStub},
                {provide:ActivityIndicatorService, useValue:activityIndicatorServiceStub},
            ]
        });

        effects = TestBed.get(SiteEffects);
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
        siteService = TestBed.get(SiteService);
        actions = new ReplaySubject<ActionWithPayload>(1);
    });

    it('should load sites from api', (done) => {

        // Input
        const inputAction = new TOV_GetSiteList();

        // Output
        const outputAction = new SAPI_GetSiteListSuccess({sites:mocks});

        // Context
        store.dispatch(new SAPI_GetSiteListSuccess({sites:[]}));
        siteService.getList.and.returnValue(of(mocks));

        // Trigger
        actions.next(inputAction);

        // Expectations
        effects.getSiteList$.subscribe((result:SAPI_GetSiteListSuccess) => {
            expect(result instanceof SAPI_GetSiteListSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });

    it('should load sites from store', (done) => {

        // Input
        const inputAction = new TOV_GetSiteList();

        // Context
        store.dispatch(new SAPI_GetSiteListSuccess({sites:mocks}));

        // Trigger effect
        actions.next(inputAction);

        // Expectations
        effects.getSiteList$.subscribe((result) => {
            expect(result).toEqual(NO_ACTION);
            done();
        });
    });

    it('should update state with HTTP error when fetching sites', (done) => {

        // Input
        const inputAction = new TOV_GetSiteList();

        // Output
        const error = new HttpErrorResponse({status:404});
        const outputAction = new SAPI_GetSiteListFailure({error});

        // Context
        store.dispatch(new SAPI_GetSiteListSuccess({sites:[]}));
        siteService.getList.and.returnValue(throwError(error));

        // Trigger effect
        actions.next(inputAction);

        // Expectations
        effects.getSiteList$.subscribe((result:SAPI_GetSiteListFailure) => {
            expect(result instanceof SAPI_GetSiteListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });

    it('should load site from api', (done) => {

        // Input
        const siteMock = mocks[0];
        const inputAction = new TOV_GetSite({id:'1'});

        // Output
        const outputAction = new SAPI_GetSiteSuccess({site:siteMock});

        // Context
        siteService.get.and.returnValue(of(siteMock));

        // Trigger effect
        actions.next(inputAction);

        // Expectations
        effects.getSite$.subscribe((result:SAPI_GetSiteSuccess) => {
            expect(result instanceof SAPI_GetSiteSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });


    it('should update state with HTTP error when fetching a single site', (done) => {

        // Input
        const inputAction = new TOV_GetSite({id:'1'});

        // Output
        const error = new HttpErrorResponse({status:404});
        const outputAction = new SAPI_GetSiteFailure({error});

        // Context
        siteService.get.and.returnValue(throwError(error));

        // Trigger effect
        actions.next(inputAction);

        // Expectations
        effects.getSite$.subscribe((result:SAPI_GetSiteFailure) => {
            expect(result instanceof SAPI_GetSiteFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });


});
