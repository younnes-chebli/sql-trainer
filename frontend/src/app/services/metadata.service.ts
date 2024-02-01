import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MetadataService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getTables(databaseName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}api/metadata/tables/${databaseName}`);
    }

    getColumns(databaseName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}api/metadata/columns/${databaseName}`);
    }
}