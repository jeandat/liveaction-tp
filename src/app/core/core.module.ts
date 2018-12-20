import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { environment } from '../../environments/environment';
import { MockModule } from '../mock/mock.module';
import { MockService } from '../mock/mock.service';
import { SharedModule } from '../shared/shared.module';
import { ActivityIndicatorComponent } from './activity-indicator/activity-indicator.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonErrorsFilter } from './network/common-errors-filter.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { LightRouterStateSerializer, metaReducers, reducers } from './store/core.reducer';


const components = [
    NavbarComponent,
    NotFoundComponent,
    HomeComponent,
    ActivityIndicatorComponent
];


@NgModule({
    imports:[
        CommonModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        environment.mocks ? MockModule : [],
        environment.mocks ? HttpClientInMemoryWebApiModule.forRoot(MockService, {
            delay:1000,
            passThruUnknownUrl:true,
            apiBase:environment.baseName ? environment.baseName : undefined
        }) : [],
        SharedModule, // Only truly used components will be inserted into the main bundle thanks to tree-shaking.
        StoreModule.forRoot(reducers, {metaReducers}),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule.forRoot({stateKey:'router'}),
        EffectsModule.forRoot([]),
        MatToolbarModule,
        MatSnackBarModule,
        NgxLoadingModule.forRoot({
            animationType:ngxLoadingAnimationTypes.doubleBounce,
            backdropBackgroundColour:'transparent',
            primaryColour:'#49B2FF',
            secondaryColour:'#7CC8FF'
        })
    ],
    declarations:[
        ...components
    ],
    exports:[
        ...components,
        HttpClientModule,
        StoreModule,
        !environment.production ? StoreDevtoolsModule : [],
        StoreRouterConnectingModule,
        EffectsModule
    ],
    providers:[
        {provide:HTTP_INTERCEPTORS, useClass:CommonErrorsFilter, multi:true},
        {provide:RouterStateSerializer, useClass:LightRouterStateSerializer},
    ]
})
export class CoreModule {

    // Security to enforce developpers to import the core module once from the AppModule only.
    constructor(@Optional() @SkipSelf() parentModule:CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it once only');
        }
    }
}
