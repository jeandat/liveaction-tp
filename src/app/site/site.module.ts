import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SiteTrafficComponent } from './site-traffic/site-traffic.component';

const components = [SiteTrafficComponent];

@NgModule({
    declarations:[...components],
    imports:[CommonModule, HighchartsChartModule],
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
