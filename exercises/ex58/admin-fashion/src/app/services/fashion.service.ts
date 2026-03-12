import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Fashion } from '../models/Fashion';

@Injectable({
  providedIn: 'root'
})
export class FashionService {
  constructor(private http: HttpClient) { }

  // Get all fashions
  getAllFashions(): Observable<Fashion[]> {
    return this.http.get<Fashion[]>('/api/fashions').pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Get fashion by ID
  getFashionById(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`/api/fashions/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Filter fashions by style
  filterByStyle(style: string): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(`/api/fashions/filter/${style}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Get all styles
  getStyles(): Observable<string[]> {
    return this.http.get<string[]>('/api/styles').pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Create fashion
  createFashion(fashion: Fashion): Observable<Fashion> {
    return this.http.post<Fashion>('/api/fashions', fashion).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Update fashion
  updateFashion(fashion: Fashion): Observable<Fashion> {
    return this.http.put<Fashion>('/api/fashions', fashion).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Delete fashion
  deleteFashion(id: string): Observable<any> {
    return this.http.delete(`/api/fashions/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
