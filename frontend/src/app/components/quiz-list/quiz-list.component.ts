import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Attempt } from "src/app/models/attempts";
import { Quiz } from "src/app/models/quiz";
import { AttemptService } from "src/app/services/attempt.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { QuizService } from "src/app/services/quiz.service";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements AfterViewInit {
    @Input() dataSource!: MatTableDataSource<Quiz>;
    @Input() displayedColumns!: string[];
    @Input() state!: MatTableState;
    @Input() filter: string = '';
    @Input() isTraining: boolean = false;
    @Input() isTest: boolean = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Input() filterChangedEvent!: EventEmitter<string>;

    role!: string | undefined;

    constructor(
        private quizService: QuizService,
        private attemptService: AttemptService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngAfterViewInit(): void {
        this.role = this.authenticationService.currentUser?.roleAsString

        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // définit le predicat qui doit être utilisé pour filtrer les quizzes
        this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
            const str = data.name + ' '
                + data.database!.name + ' '
                + (data.type ? data.type : '') + ' '
                + (data.startDate ? format(data.startDate!, 'dd/MM/yyyy') : '') + ' '
                + (data.endDate ? format(data.endDate!, 'dd/MM/yyyy') : '') + ' '
                + (data.status ? data.status : '') + ' '
                + (data.evaluation ? data.evaluation : '');
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();

        this.filterChangedEvent.subscribe((filterValue: string) => {
            this.applyFilter(filterValue)
        })
    }

    private refresh() {
        this.quizService.getData(this.isTraining, this.isTest)?.subscribe(quizzes => {
            this.dataSource.data = quizzes;
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.state.filter = this.dataSource.filter;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    navigateToQuestions(quiz: Quiz, renew: boolean = false) {
        if (quiz) {
            if (renew) {
                const newAttempt: Attempt = {
                    start: new Date(),
                    quizId: quiz.id,
                    studentId: this.authenticationService.currentUserId,
                    evaluation: 0,
                    answers: []
                }

                this.attemptService.create(newAttempt).subscribe({
                    next: (newAttempt) => {
                        this.router.navigate(['/question', quiz.firstQuestionId]);
                    },
                    error: (error) => {
                        console.error('Error saving the attempt:', error);
                    }
                });
            } else {
                this.router.navigate(['/question', quiz.firstQuestionId]);
            }
        }
    }

    openConfirmationDialog(quiz: Quiz) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            data: {
                title: 'Recommencer ce Quiz',
                message: 'Êtes-vous sûr ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.navigateToQuestions(quiz, true);
            }
        });
    }

    navigateToQuiz(quizId: number) {
        this.router.navigate(['/quizedition', quizId]);
    }
}