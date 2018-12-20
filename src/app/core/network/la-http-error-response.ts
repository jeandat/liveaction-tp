import { HttpErrorResponse } from '@angular/common/http';

export interface LaHttpErrorResponse extends HttpErrorResponse {
    processed?:boolean;
}
