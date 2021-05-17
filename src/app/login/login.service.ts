import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.baseUrl;
  private resourceUrl = this.baseUrl + '/ahepi';
  constructor(
    private http: HttpClient
  ) { }

    checkUser(req): Observable<any> {
    return this.http.post(this.resourceUrl + '/check', req, { observe: 'response'});
  }

  findAll(): Observable<any> {
    return this.http.get(this.resourceUrl + '/load-all', { observe: 'response'});
  }
}
