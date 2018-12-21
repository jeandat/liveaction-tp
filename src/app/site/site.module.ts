import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SiteTrafficComponent } from './site-traffic/site-traffic.component';
import { SiteEffects } from './store/site.effects';
import { siteReducer } from './store/site.reducer';

const components = [SiteTrafficComponent];

@NgModule({
    declarations:[...components],
    imports:[
        CommonModule,
        HighchartsChartModule,
        StoreModule.forFeature('sites', siteReducer),
        EffectsModule.forFeature([ SiteEffects ])
    ],
    exports:[...components]
})
export class SiteModule {

    constructor() {
        // In a normal app, this global configuration would sit elsewhere depending on modules architecture.
        Highcharts.setOptions({
            credits:{
                enabled:false
            }
        });
    }
}
