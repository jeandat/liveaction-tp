import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SiteModule } from './site/site.module';


@NgModule({
    declarations:[
        AppComponent,
    ],
    imports:[
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SiteModule
    ],
    providers:[],
    bootstrap:[AppComponent]
})
export class AppModule {
}
