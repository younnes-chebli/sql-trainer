import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quiz } from "src/app/models/quiz";
import { StateService } from "src/app/services/state.service";

@Component({
    selector: 'app-all-quizzes-list',
    templateUrl: './all-quizzes-list.component.html',
    styleUrls: ['./all-quizzes-list.component.css']
})
export class AllQuizzesListComponent {
    displayedColumns: string[] = ['name', 'databaseName', 'type', 'status', 'startDate', 'endDate', 'actions'];
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Output() filterChangedEvent = new EventEmitter<string>();

    constructor(
        private stateService: StateService,
        private router: Router,
    ) {
        this.state = this.stateService.quizListState;
    }

    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.filter = filterValue;

        this.filterChangedEvent.emit(filterValue);
    }

    navigateToQuiz() {
        this.router.navigate(['/quizedition', 0]);
    }
}