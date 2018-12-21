import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HighchartsChartModule } from 'highcharts-angular';

import { SiteTrafficComponent } from './site-traffic.component';

describe('SiteTrafficComponent', () => {
    let component:SiteTrafficComponent;
    let fixture:ComponentFixture<SiteTrafficComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations:[SiteTrafficComponent],
            imports:[HighchartsChartModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteTrafficComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
