import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { plainToClass } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public currentUser?: User;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        let data = sessionStorage.getItem('currentUser');
        if (data)
            data = JSON.parse(data);
        this.currentUser = plainToClass(User, data);
    }

    get currentUserId(): number | undefined {
        return this.currentUser?.id;
    }

    login(pseudo: string, password: string) {
        return this.http.post<any>(`${this.baseUrl}api/users/authenticate`, { pseudo, password })
            .pipe(map(user => {
                user = plainToClass(User, user);
                if (user && user.token) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                }

                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = undefined;
    }
}
