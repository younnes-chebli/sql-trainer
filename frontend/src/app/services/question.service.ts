import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";
import { Question } from "../models/question";

@Injectable({ providedIn: 'root' })
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getById(id: number): Observable<Question> {
        return this.http.get<any>(`${this.baseUrl}api/questions/${id}`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }
}