import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { flatMap, tap } from 'rxjs/operators';
import { failure } from '../../testing/failure';
import { Site } from '../core/model/site.model';
import { MockService } from '../mock/mock.service';
import { siteMocks } from '../mock/sites.mock';

import { SiteService } from './site.service';


describe('SiteService', () => {

    let service:SiteService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[ HttpClientModule, HttpClientInMemoryWebApiModule.forRoot(MockService, { delay:10 }) ],
            providers:[ SiteService ]
        }).compileComponents();
    }));

    beforeEach(async(function () {
        service = TestBed.get(SiteService);
    }));

    it('can get sites', async(() => {
        service.getList()
            .subscribe(
                sites => {
                    // console.log(sitees);
                    expect(sites).toBeNonEmptyArray();
                },
                failure
            );
    }));

    it('can get site w/ id=SiteA', async(() => {
        const site = siteMocks[0];
        service.get(site.id)
            .subscribe(
                fetchedSite => {
                    expect(fetchedSite.id).toBe(site.id);
                },
                failure
            );
    }));

    it('should 404 when site id not found', async(() => {
        const id = 'FOO';
        service.get(id)
            .subscribe(
                () => fail(`should not have found site for id='${id}'`),
                err => {
                    expect(err.status).toBe(404, 'should have 404 status');
                }
            );
    }));

});
