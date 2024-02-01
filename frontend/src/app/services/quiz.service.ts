import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { plainToInstance } from "class-transformer";
import { Observable, catchError, map, throwError } from "rxjs";
import { Quiz } from "../models/quiz";

@Injectable({ providedIn: 'root' })
export class QuizService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getById(id: number): Observable<Quiz> {
        return this.http.get<any>(`${this.baseUrl}api/quizzes/${id}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}api/quizzes/${id}`);
    }

    getData(isTraining: boolean, isTest: boolean): Observable<Quiz[]> | null {
        if (isTraining)
            return this.getTrainings()
        else if (isTest)
            return this.getTests()
        else
            return this.getAll()
    }

    getAll(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getTrainings(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes/trainings`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getTests(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/quizzes/tests`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    updateQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.put<Quiz>(`${this.baseUrl}api/quizzes`, quiz);
    }

    getByQuizName(quizName: string): Observable<Quiz> {
        return this.http.get<any>(`${this.baseUrl}api/quizzes/name/${quizName}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    create(quiz: Quiz): Observable<Quiz> {
        return this.http.post<Quiz>(`${this.baseUrl}api/quizzes`, quiz)
            .pipe(
                map((response: Quiz) => response),
                catchError(err => {
                    console.error('Error creating quiz:', err);
                    return throwError(err);
                })
            );
    }
}