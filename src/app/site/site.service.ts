import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Site } from '../core/model/site.model';

@Injectable({
    providedIn:'root'
})
export class SiteService {

    constructor(private http:HttpClient) {
    }

    getList():Observable<Site[]> {
        return this.http.get<Site[]>(`${environment.apiUrl}/sites`).pipe(
            // delay(3000)
        );
    }

    get(id:string):Observable<Site> {
        return this.http.get<Site>(`${environment.apiUrl}/sites/${id}`).pipe(
            // delay(3000)
        );
    }
}
