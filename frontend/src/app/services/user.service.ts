import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<User[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/users`).pipe(
            map(res => plainToInstance(User, res))
        );
    }

    getStudentsWithAttempts(): Observable<User[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/users/session1`).pipe(
            map(res => plainToInstance(User, res))
        );
    }
}
