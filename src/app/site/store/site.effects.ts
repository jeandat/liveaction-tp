import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { ActivityIndicatorService } from '../../core/activity-indicator/activity-indicator.service';
import { Site } from '../../core/model/site.model';
import { ActionWithPayload, AppState } from '../../core/store/core.reducer';
import { NO_ACTION } from '../../core/store/no-action';
import { SiteService } from '../site-service/site.service';
import {
    SAPI_GetSiteFailure,
    SAPI_GetSiteListFailure,
    SAPI_GetSiteListSuccess,
    SAPI_GetSiteSuccess,
    SiteActions,
    SiteActionTypes,
    TOV_GetSite,
} from './site.actions';
import { siteSelectors } from './site.selectors';


/*
    For demonstration purposes, I'm assuming here the list of site is cached and fetched only once.
    Each site in the list contains only high level properties like `id`, `name`, … but no charts data like `trafficOut`.
    A single site however is fetched from server every time. Just a possible scenario.
    Without data model, volumetry and use cases, difficult to make a choice here.
*/

@Injectable()
export class SiteEffects {

    @Effect()
    getSiteList$:Observable<ActionWithPayload> = this.actions$.pipe(
        ofType(
            SiteActionTypes.TOV_GetSiteList,
        ),
        switchMap((action:SiteActions) => {
            console.log(`Intercepted action of type '${action.type}' with payload:`, action.payload);
            return this.store.select(siteSelectors.selectAll).pipe(first());
        }),
        switchMap((sites:Site[]) => {
            if (sites && sites.length) {
                console.log(`Sites found in store`);
                // Noop.
                return of(NO_ACTION as Action);
            }
            console.log('Sites not found in store => downloading…');
            this.ais.on('getSiteList$');
            return this.siteService.getList().pipe(
                map((fetchedSites:Site[]) => {
                    console.log('HTTP Get Site List Success:', fetchedSites);
                    return new SAPI_GetSiteListSuccess({sites:fetchedSites});
                }),
                catchError((error:HttpErrorResponse) => {
                        console.error('HTTP Get Site List Failure:', error);
                        return of(new SAPI_GetSiteListFailure({error}));
                    }
                ),
                tap(() => this.ais.off('getSiteList$'))
            );
        }),
        tap(result => console.log('Action returned by effect:', result))
    );


    @Effect()
    getSite$:Observable<ActionWithPayload> = this.actions$.pipe(
        ofType(
            SiteActionTypes.TOV_GetSite,
        ),
        switchMap((action:TOV_GetSite) => {
            console.log(`Intercepted action of type '${action.type}' with payload:`, action.payload);
            this.ais.on('getSite$');
            return this.siteService.get(action.payload.id).pipe(
                map((fetchedSite:Site) => {
                    console.log('HTTP Get Site Success:', fetchedSite);
                    return new SAPI_GetSiteSuccess({site:fetchedSite});
                }),
                catchError((error:HttpErrorResponse) => {
                        console.error('HTTP Get Site Failure:', error);
                        return of(new SAPI_GetSiteFailure({error}));
                    }
                ),
                tap(() => this.ais.off('getSite$'))
            );
        }),
        tap(result => console.log('Action returned by effect:', result))
    );

    constructor(
        private actions$:Actions,
        private siteService:SiteService,
        private store:Store<AppState>,
        private ais:ActivityIndicatorService) {
    }

}
