import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../site/site.service';
import { SnackBar } from '../snackbar/snackbar.service';


@Component({
    selector:'la-home',
    templateUrl:'./home.component.html',
    styleUrls:['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private siteService:SiteService, private snackbar:SnackBar) {
    }

    ngOnInit() {
        this.siteService.getList().subscribe(
            data => console.log('data:', data),
            err => console.error('err:', err)
        );
    }

}
