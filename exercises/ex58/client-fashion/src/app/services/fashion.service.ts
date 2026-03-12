import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Fashion } from '../models/Fashion';

@Injectable({
  providedIn: 'root'
})
export class FashionService {
  constructor(private http: HttpClient) { }

  getAllFashions(): Observable<Fashion[]> {
    return this.http.get<Fashion[]>('/api/fashions').pipe(
      catchError(this.handleError)
    );
  }

  getFashionById(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`/api/fashions/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  filterByStyle(style: string): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(`/api/fashions/filter/${style}`).pipe(
      catchError(this.handleError)
    );
  }

  getStyles(): Observable<string[]> {
    return this.http.get<string[]>('/api/styles').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    return throwError(() => new Error(error.message));
  }
}
