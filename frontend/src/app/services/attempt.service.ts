import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { Attempt } from "../models/attempts";

@Injectable({ providedIn: 'root' })
export class AttemptService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    updateAttempt(attempt: Attempt): Observable<Attempt> {
        return this.http.put<Attempt>(`${this.baseUrl}api/attempts`, attempt);
    }

    create(attempt: Attempt): Observable<Attempt> {
        return this.http.post<Attempt>(`${this.baseUrl}api/attempts`, attempt)
            .pipe(
                map((response: Attempt) => response),
                catchError(err => {
                    console.error('Error creating attempt:', err);
                    return throwError(err);
                })
            );
    }
}