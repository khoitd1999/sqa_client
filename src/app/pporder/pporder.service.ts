import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PporderService {
  baseUrl = environment.baseUrl;
  private resourceUrl = this.baseUrl + '/api/pporder';
  constructor(
    private http: HttpClient
  ) { }

  loadAll(req?): Observable<any> {
    return this.http.get<any>(this.resourceUrl + '/load-all?page=' + req.page + '&size=' + req.size, { observe: 'response' });
  }

  loadAllSupplier(): Observable<any> {
    return this.http.get<any>(this.resourceUrl + '/get-all-supplier', {observe: 'response'});
  }

  save(req): Observable<any> {
    return this.http.post<any>(this.resourceUrl + '/save', req, { observe: 'response'});
  }

  find(req?): Observable<any> {
    return this.http.get<any>(this.resourceUrl + '/find', { params: req, observe: 'response' });
  }

  delete(id?): Observable<any> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
