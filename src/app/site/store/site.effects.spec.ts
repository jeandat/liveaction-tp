import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { EMPTY, of, ReplaySubject, throwError } from 'rxjs';
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
import Spy = jasmine.Spy;


const mocks = [{id:'1', name:'foo'}, {id:'2', name:'bar'}, {id:'3', name:'baz'}] as Site[];

describe('Site Effects', () => {

    let effects:SiteEffects;
    let actions:ReplaySubject<ActionWithPayload>;

    const ssMock = jasmine.createSpyObj('SiteService', ['get', 'getList']) as SiteService;
    const aisMock = jasmine.createSpyObj('ActivityIndicatorService', ['on', 'off']) as ActivityIndicatorService;
    const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']) as Store<AppState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[],
            providers:[
                SiteEffects,
                provideMockActions(() => actions),
                {provide:SiteService, useValue:ssMock},
                {provide:ActivityIndicatorService, useValue:aisMock},
                {provide:Store, useValue:storeMock}
            ]
        });

        effects = TestBed.get(SiteEffects);
    });

    it('should load sites from api', (done) => {
        const inputAction = new TOV_GetSiteList();

        const outputAction = new SAPI_GetSiteListSuccess({sites:mocks});

        (storeMock.select as Spy).and.returnValue(of([]));
        (ssMock.getList as Spy).and.returnValue(of(mocks));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getSiteList$.subscribe((result:SAPI_GetSiteListSuccess) => {
            expect(result instanceof SAPI_GetSiteListSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });

    it('should load sites from store', (done) => {
        const inputAction = new TOV_GetSiteList();
        (storeMock.select as Spy).and.returnValue(of(mocks));
        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);
        effects.getSiteList$.subscribe((result) => {
            expect(result).toEqual(NO_ACTION);
            done();
        });
    });

    it('should update state with HTTP error when fetching sites', (done) => {
        const inputAction = new TOV_GetSiteList();

        const error = new HttpErrorResponse({status:404});
        const outputAction = new SAPI_GetSiteListFailure({error});

        (storeMock.select as Spy).and.returnValue(of([]));
        (ssMock.getList as Spy).and.returnValue(throwError(error));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getSiteList$.subscribe((result:SAPI_GetSiteListFailure) => {
            expect(result instanceof SAPI_GetSiteListFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });

    it('should load site from api', (done) => {
        const siteMock = mocks[0];
        const inputAction = new TOV_GetSite({id:'1'});

        const outputAction = new SAPI_GetSiteSuccess({site:siteMock});

        (ssMock.get as Spy).and.returnValue(of(siteMock));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getSite$.subscribe((result:SAPI_GetSiteSuccess) => {
            expect(result instanceof SAPI_GetSiteSuccess).toBe(true);
            expect(result).toEqual(outputAction);
            done();
        });

    });


    it('should update state with HTTP error when fetching a single site', (done) => {
        const inputAction = new TOV_GetSite({id:'1'});

        const error = new HttpErrorResponse({status:404});
        const outputAction = new SAPI_GetSiteFailure({error});

        (ssMock.get as Spy).and.returnValue(throwError(error));

        actions = new ReplaySubject<ActionWithPayload>(1);
        actions.next(inputAction);

        effects.getSite$.subscribe((result:SAPI_GetSiteFailure) => {
            expect(result instanceof SAPI_GetSiteFailure).toBe(true);
            expect(result.payload.error).toBe(outputAction.payload.error);
            done();
        });
    });


});
