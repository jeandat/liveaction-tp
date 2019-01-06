import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Site } from '../../core/model/site.model';

@Component({
    selector:'la-site-traffic',
    templateUrl:'./site-traffic.component.html',
    styleUrls:['./site-traffic.component.scss']
})
export class SiteTrafficComponent implements OnChanges {

    @Input() site:Site;
    @Input() title:string;
    @Input() color:string;

    // Highcharts
    // ----------

    Highcharts = Highcharts; // required
    chartOptions:any;

    constructor() {

    }

    ngOnChanges(changes:SimpleChanges):void {
        if (!changes.site.currentValue) return;
        this.chartOptions = {
            chart:{
                type:'line'
            },
            title:{
                text:this.title,
                align: 'left',
                margin: 25
            },
            xAxis:{
                type:'datetime',
            },
            yAxis:{
                title:'',
                tickInterval:20 * 1000 * 1000,
                labels:{
                    formatter:context => context.value ? humanFormat(context.value, {decimals:1}) : 0
                },
            },
            series:[
                {
                    name:'(AVC) Traffic Out',
                    color: this.color,
                    data:this.site.trafficOut.map(([time, size]) => [time * 1000, size])
                }
            ],
            plotOptions:{
                series:{
                    marker:{
                        enabled:false
                    }
                }
            }
        };
    }

}
