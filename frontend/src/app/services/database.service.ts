import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";
import { Database } from "../models/database";

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Database[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/databases`).pipe(
            map(res => plainToInstance(Database, res))
        );
    }
}