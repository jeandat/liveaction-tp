import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class BaseComponent implements OnDestroy {

    // Used to clear subscriptions
    protected done:Subject<boolean> = new Subject();


    constructor() {

    }

    ngOnDestroy():void {
        this.done.next(true);
        this.done.complete();
    }

}
