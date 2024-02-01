import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quiz } from "src/app/models/quiz";
import { StateService } from "src/app/services/state.service";

@Component({
    selector: 'app-quizzes-lists',
    templateUrl: './quizzes-lists.component.html',
    styleUrls: ['./quizzes-lists.component.css']
})
export class QuizzesListsComponent {
    displayedColumnsTrainings: string[] = ['name', 'databaseName', 'status', 'actions'];
    displayedColumnsTests: string[] = ['name', 'databaseName', 'startDate', 'endDate', 'status', 'evaluation', 'actions'];

    dataSourceTrainings: MatTableDataSource<Quiz> = new MatTableDataSource();
    dataSourceTests: MatTableDataSource<Quiz> = new MatTableDataSource();

    filter: string = '';
    state: MatTableState;

    @Output() filterChangedEvent = new EventEmitter<string>();

    constructor(
        private stateService: StateService
    ) {
        this.state = this.stateService.quizListState;
    }

    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.filter = filterValue;

        this.filterChangedEvent.emit(this.filter);
    }
}