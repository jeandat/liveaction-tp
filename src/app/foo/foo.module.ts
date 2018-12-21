import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FooRoutingModule } from './foo-routing.module';
import { FooComponent } from './foo/foo.component';

const components = [
    FooComponent
];

@NgModule({
    declarations:[
        ...components
    ],
    imports:[
        CommonModule,
        FooRoutingModule
    ],
    exports:[
        ...components
    ],
})
export class FooModule {
}
