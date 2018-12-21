import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { SiteService } from '../../site/site-service/site.service';
import { TOV_GetSite, TOV_GetSiteList } from '../../site/store/site.actions';
import { siteSelectors } from '../../site/store/site.selectors';
import { Site } from '../model/site.model';
import { LaHttpErrorResponse } from '../network/la-http-error-response';
import { SnackBar } from '../snackbar/snackbar.service';
import { AppState } from '../store/core.reducer';


/*
    I assumed here that fetching sites only return high level info.
    If you want complete data with trafficOut property you have to fetch a single site.
    I'm assuming that's what you want regarding the fact there is an update button in view.
    Depending on volumetry and data model, other scenarios would have been imaginable without confirmation buttons
    nor subsequent fetch for instance.
*/


@Component({
    selector:'la-home',
    templateUrl:'./home.component.html',
    styleUrls:['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    // Site list
    // ---------

    @ViewChild('siteSelection') siteSelection;
    sites:Site[];

    // Current site
    // ------------

    currentSite:Site;
    candidate:Site;

    // Utils
    // -----

    // Used to clear subscriptions
    private done:Subject<boolean> = new Subject();


    constructor(private siteService:SiteService, private snackbar:SnackBar, private store:Store<AppState>) {

    }

    ngOnInit() {
        this.listenToErrors();
        this.listenToSiteList();
        this.listenToSiteSeletionEvents();
    }

    ngOnDestroy():void {
        this.done.next(true);
        this.done.complete();
    }

    listenToErrors() {
        this.store.pipe(
            select(siteSelectors.selectError),
            filter((err:LaHttpErrorResponse) => err != null && !err.processed),
            takeUntil(this.done)
        ).subscribe(
            (err:LaHttpErrorResponse) => {
                this.snackbar.showError('Server is temporarily unavailable');
            }
        );
    }

    listenToSiteSeletionEvents() {
        this.siteSelection.selectionChange.asObservable().pipe(
            map((event:MatSelectChange) => event.value),
            filter((site:Site) => {
                this.candidate = null;
                return this.currentSite == null || site.id !== this.currentSite.id;
            })
        ).subscribe(
            (site:Site) => this.candidate = site
        );
    }

    // Refresh current selected site when site change in store
    listenToCurrentSite() {
        this.store.pipe(
            select(siteSelectors.selectCurrentSite),
            filter((site:Site) => site != null),
            takeUntil(this.done)
        ).subscribe(
            (site:Site) => {
                this.currentSite = site;
                if (this.siteSelection.value == null) this.siteSelection.value = this.findSite(this.currentSite.id);
                this.candidate = null;
            }
        );
    }

    // Refresh select when site list is updated in store
    listenToSiteList() {
        this.store.pipe(
            select(siteSelectors.selectAll),
            startWith([]),
            takeUntil(this.done)
        ).subscribe(
            (sites:Site[]) => {
                this.sites = sites;
                this.listenToCurrentSite();
            }
        );
        this.store.dispatch(new TOV_GetSiteList());
    }

    siteIdentity(site:Site) {
        return site.id;
    }

    cancel() {
        this.siteSelection.value = this.currentSite ? this.findSite(this.currentSite.id) : null;
        this.candidate = null;
    }

    changeCurrentSite() {
        const s = this.siteSelection.value;
        this.store.dispatch(new TOV_GetSite({id:s.id}));
    }

    findSite(id:string):Site {
        if (!id || !this.sites) return;
        return this.sites.find(site => site.id === id);
    }

}
