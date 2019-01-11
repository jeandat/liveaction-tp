/* tslint:disable:component-class-suffix */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, QueryList } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatOption, MatSelect, MatSelectModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AbstractComponentTester } from '../../../testing/abstract-component-tester';
import { activityIndicatorServiceStub } from '../../../testing/activity-indicator-service.stub';
import { siteServiceStub } from '../../../testing/site-service.stub';
import { snackBarServiceStub } from '../../../testing/snack-bar-service.stub';
import { sitesMock } from '../../mock/sites.mock';
import { SiteService } from '../../site/site-service/site.service';
import { SAPI_GetSiteListFailure, SAPI_GetSiteListSuccess, SAPI_GetSiteSuccess } from '../../site/store/site.actions';
import { siteReducer, SiteState } from '../../site/store/site.reducer';
import { ActivityIndicatorService } from '../activity-indicator/activity-indicator.service';
import { Site } from '../model/site.model';
import { AppError } from '../network/app-error';
import { SnackBarService } from '../snackbar/snackbar.service';
import { HomeComponent } from './home.component';
import SpyObj = jasmine.SpyObj;


class ComponentTester extends AbstractComponentTester<HomeComponent> {

    get selectedSite():MatOption {
        const selectDe = this.fixture.debugElement.query(By.directive(MatSelect));
        return selectDe.componentInstance.selected;
    }

    get sites():QueryList<MatOption> {
        const selectDe = this.fixture.debugElement.query(By.directive(MatSelect));
        return selectDe.componentInstance.options;
    }

    selectFirstSite():void {
        const selectDe = this.fixture.debugElement.query(By.directive(MatSelect));
        selectDe.componentInstance.options.first.select();
    }

    selectLastSite():void {
        const selectDe = this.fixture.debugElement.query(By.directive(MatSelect));
        selectDe.componentInstance.options.last.select();
    }

    isActionsBarVisible():boolean {
        const actionsBarDe = this.fixture.debugElement.query(By.css('.actions-bar'));
        return actionsBarDe && actionsBarDe.children.length > 0;
    }

    validateSiteSelection():void {
        const confirmButtonDe = this.fixture.debugElement.query(By.css('.actions-bar .js-confirm-button'));
        confirmButtonDe.triggerEventHandler('click', {});
    }

    cancelSiteSelection():void {
        const cancelButtonDe = this.fixture.debugElement.query(By.css('.actions-bar .js-cancel-button'));
        cancelButtonDe.triggerEventHandler('click', {});
    }
}

@Component({
    selector:'la-site-traffic',
    template:''
})
class SiteTrafficComponentStub {
    @Input() site:Site;
    @Input() color:string;
    @Input() title:string;
}


describe('HomeComponent', () => {

    let fixture:ComponentFixture<HomeComponent>;
    let tester:ComponentTester;
    let component:HomeComponent;
    let store:Store<SiteState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[HomeComponent, SiteTrafficComponentStub],
            imports:[
                NoopAnimationsModule,
                RouterTestingModule,
                StoreModule.forRoot({sites:siteReducer}),
                FormsModule,
                MatFormFieldModule,
                MatSelectModule
            ],
            providers:[
                {provide:SiteService, useValue:siteServiceStub},
                {provide:SnackBarService, useValue:snackBarServiceStub},
                {provide:ActivityIndicatorService, useValue:activityIndicatorServiceStub}
            ]
            // schemas:[NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        tester = new ComponentTester(fixture);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(store).toBeTruthy();
    });

    it('should display error', () => {
        const snackbar:SpyObj<SnackBarService> = TestBed.get(SnackBarService);
        fixture.detectChanges();
        expect(snackbar.showError).not.toHaveBeenCalled();

        const error = new HttpErrorResponse({status:404});
        store.dispatch(new SAPI_GetSiteListFailure({error}));
        expect(snackbar.showError).toHaveBeenCalled();
        snackbar.showError.calls.reset();

        (error as AppError).processed = true;
        store.dispatch(new SAPI_GetSiteListFailure({error}));
        expect(snackbar.showError).not.toHaveBeenCalled();
    });

    it('should load sites in select', fakeAsync(() => {
        fixture.detectChanges();
        expect(component.sites).toBeUndefined();
        store.dispatch(new SAPI_GetSiteListSuccess({sites:sitesMock}));
        fixture.detectChanges();
        expect(component.sites).toBeNonEmptyArray();
        const options = tester.sites;
        expect(options).toBeDefined();
        expect(options.length).toBe(component.sites.length);
    }));

    it('should show actions bar on site selection', fakeAsync(() => {
        store.dispatch(new SAPI_GetSiteListSuccess({sites:sitesMock}));
        fixture.detectChanges();
        expect(component.sites).toBeNonEmptyArray();
        tester.selectFirstSite();
        fixture.detectChanges();
        expect(tester.isActionsBarVisible()).toBeTruthy();
    }));

    it('should change site data on validation', fakeAsync(() => {
        store.dispatch(new SAPI_GetSiteListSuccess({sites:sitesMock}));

        fixture.detectChanges();
        expect(component.sites).toBeNonEmptyArray();

        tester.selectFirstSite();
        const firstSite = tester.sites.first.value;
        fixture.detectChanges();
        expect(component.candidate).toBe(firstSite);
        expect(tester.isActionsBarVisible()).toBeTruthy();


        tester.validateSiteSelection();
        expect(store.dispatch).toHaveBeenCalled();
        store.dispatch(new SAPI_GetSiteSuccess({site:firstSite}));
        fixture.detectChanges();
        expect(component.siteSelection.value).toBe(firstSite);
        expect(component.candidate).toBeNull();
        expect(component.currentSite.id).toBe(firstSite.id);
    }));

    it('should keep site data on cancellation', () => {
        // TODO
    });

    it('should ask for confirmation only if selection is different', () => {
        // TODO
    });
});
