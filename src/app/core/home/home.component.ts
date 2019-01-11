import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SiteService } from '../../site/site-service/site.service';
import { TOV_GetSite, TOV_GetSiteList } from '../../site/store/site.actions';
import { siteSelectors } from '../../site/store/site.selectors';
import { BaseComponent } from '../base.component';
import { Site } from '../model/site.model';
import { AppError } from '../network/app-error';
import { SnackBarService } from '../snackbar/snackbar.service';
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
    styleUrls:['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent implements OnInit {

    // Site list
    // ---------

    @ViewChild('siteSelection') siteSelection:MatSelect;
    sites:Site[];

    // Current site
    // ------------

    currentSite:Site;
    candidate:Site;


    constructor(private siteService:SiteService, private snackbar:SnackBarService, private store:Store<AppState>, private cdr:ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.listenToErrors();
        this.listenToSiteList();
        this.listenToSiteSeletionEvents();
    }

    listenToErrors() {
        this.store.pipe(
            select(siteSelectors.selectError),
            filter((err:AppError) => err != null && !err.processed),
            takeUntil(this.done)
        ).subscribe(
            (err) => {
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
                this.cdr.markForCheck();
            }
        );
    }

    // Refresh select when site list is updated in store
    listenToSiteList() {
        this.store.pipe(
            select(siteSelectors.selectAll),
            filter((sites:Site[]) => sites != null && sites.length > 0),
            takeUntil(this.done)
        ).subscribe(
            (sites:Site[]) => {
                this.sites = sites;
                this.listenToCurrentSite();
                this.cdr.markForCheck();
            }
        );
        this.store.dispatch(new TOV_GetSiteList());
    }

    siteIdentity(index, site:Site) {
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
