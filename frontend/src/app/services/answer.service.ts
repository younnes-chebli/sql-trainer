import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { Answer } from "../models/answer";

@Injectable({ providedIn: 'root' })
export class AnswerService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    create(answer: Answer): Observable<Answer> {
        return this.http.post<Answer>(`${this.baseUrl}api/answers`, answer)
            .pipe(
                map((response: Answer) => response),
                catchError(err => {
                    console.error('Error creating answer:', err);
                    return throwError(err);
                })
            );
    }
}