/* tslint:disable:component-class-suffix */
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Site } from '../../core/model/site.model';
import { sitesMock } from '../../mock/sites.mock';

import { SiteTrafficComponent } from './site-traffic.component';


fdescribe('SiteTrafficComponent', () => {

    @Component({
        template:'<la-site-traffic [site]="site" [color]="color" [title]="title"></la-site-traffic>'
    })
    class SiteTrafficComponentTester {
        site:Site = sitesMock[0];
        color = 'red';
        title = 'Test';
    }

    let fixture:ComponentFixture<SiteTrafficComponentTester>;
    let tester:SiteTrafficComponentTester;
    let component:SiteTrafficComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[SiteTrafficComponentTester, SiteTrafficComponent],
            schemas:[NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteTrafficComponentTester);
        tester = fixture.componentInstance;
        component = fixture.debugElement.query(By.directive(SiteTrafficComponent)).componentInstance;
    });

    it('should create', () => {
        expect(tester).toBeTruthy();
        expect(component).toBeTruthy();
    });

    it('should render a chart with specified color, title and data', () => {
        expect(component.chartOptions).toBeUndefined();
        fixture.detectChanges();
        expect(component.chartOptions).toBeDefined();
        expect(component.chartOptions.title.text).toBe(tester.title);
        expect(component.chartOptions.series).toBeNonEmptyArray();
        expect(component.chartOptions.series[0].color).toBe(tester.color);
        expect(component.chartOptions.series[0].data.length).toBe(tester.site.trafficOut.length);
        expect(component.chartOptions.series[0].data).toBeNonEmptyArray();
    });
});
