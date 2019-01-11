import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector:'la-root',
    template:`
        <la-navbar></la-navbar>
        <router-outlet></router-outlet>
    `,
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    ngOnInit():void {
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }

    constructor(private titleService:Title) {
        titleService.setTitle('Live Action TP');
    }

    isTouchDevice() {
        // tslint:disable-next-line
        const navigator = window.navigator as any;
        return !!('ontouchstart' in window) || !!('msmaxtouchpoints' in navigator);
    }
}
