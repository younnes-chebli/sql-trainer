import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Question } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.service";
import { CodeEditorComponent } from "../code-editor/code-editor.component";
import { Answer } from "src/app/models/answer";
import { AnswerService } from "src/app/services/answer.service";
import { Attempt } from "src/app/models/attempts";
import { Quiz } from "src/app/models/quiz";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { AttemptService } from "src/app/services/attempt.service";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements AfterViewInit {
    questionId!: number;
    private _question!: Question;
    questionIds: number[] = [];
    answers: Answer[] = [];
    currentQuestionIndex!: number;
    isAnswered: boolean = false;
    hasAttempt: boolean = false;
    areSolutionsDisplayed: boolean = false
    cleared: boolean = false
    quiz!: Quiz
    lastAttempt?: Attempt
    isNew: boolean = false

    @ViewChild('editor') editor!: CodeEditorComponent
    sql: string = ""
    isClosed: boolean = false
    databaseName: string = ""

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private questionService: QuestionService,
        private answerService: AnswerService,
        private attemptService: AttemptService,
        private authenticationService: AuthenticationService,
        private dialog: MatDialog) { }

    ngAfterViewInit(): void {
        this.editor.focus();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.questionId = Number(params['id']);
            this.loadQuestion(this.questionId);
            this.editor?.focus();
        });
    }

    get question(): Question {
        return this._question
    }

    get quizName(): string {
        return this.quiz?.name!
    }

    get order(): number {
        return this._question?.order!
    }

    get body(): string {
        return this._question?.body!
    }

    get isTest(): boolean {
        return this.quiz?.isTest!
    }

    get lastAnswer(): Answer | undefined {
        return this._question?.lastAnswer
    }

    private loadQuestion(questionId: number = -1) {
        this.questionService.getById(this.questionId).subscribe(
            question => {
                this._question = question
                this.questionId = question.id!
                this.answers = question.answers === null ? [] : question.answers
                this.sql = question.lastAnswerSql
                this.isAnswered = question.lastAnswer ? true : false
                this.hasAttempt = question.quiz?.attempts.length !== 0 ? true : false
                this.quiz = question.quiz!
                this.questionIds = question.questionIds!;
                this.currentQuestionIndex = this.questionIds.indexOf(this.questionId);
                this.databaseName = question.databaseName

                this.setStatus()
                this.setLastAttempt()
            },
            error => {
                console.error('Error fetching question:', error);
                this.router.navigate(['/unknown']);
            }
        );
    }

    private setLastAttempt() {
        if (!this.isNew) {
            this.lastAttempt = this.quiz.lastAttempt
        } else {
            this.lastAttempt = undefined
        }
    }

    private setStatus() {
        if (this.quiz?.status === 'FINI') {
            this.isClosed = true
        } else {
            this.isClosed = false
        }

        if (this.quiz?.status === 'PAS_COMMENCE') {
            this.isNew = true
        } else {
            this.isNew = false
        }
    }

    private createAttempt() {
        const newAttempt: Attempt = {
            start: new Date(),
            quizId: this.quiz.id,
            studentId: this.authenticationService.currentUserId,
            evaluation: 0,
            answers: []
        }

        this.attemptService.create(newAttempt).subscribe({
            next: (newAttempt) => {
                this.createAnswer(newAttempt.id)
            },
            error: (error) => {
                console.error('Error saving the attempt:', error);
            }
        });
    }

    private createAnswer(newAttemptId?: number) {
        const newAnswer: Answer = {
            sql: this.sql.trim(),
            attemptId: newAttemptId ? newAttemptId : this.lastAttempt?.id,
            questionId: this.questionId,
            errors: [],
            resultColumns: [],
            resultData: []
        };

        this.answerService.create(newAnswer).subscribe({
            next: (savedAnswer) => {
                this.answers.push(savedAnswer);
                this.isAnswered = true;
                this.cleared = false
                this.loadQuestion()
            },
            error: (error) => {
                console.error('Error saving the answer:', error);
            }
        });
    }

    private updateAttempt() {
        const updatedAttempt = { ...this.lastAttempt, finish: new Date() }

        this.attemptService.updateAttempt(updatedAttempt).subscribe({
            next: () => {
                this.router.navigate(['/quizzes']);
            },
            error: error => {
                console.error('Erreur lors de la mise à jour de l\'attempt', error);
            }
        });
    }

    navigateToQuestion(offset: number) {
        this.areSolutionsDisplayed = false;
        this.cleared = false;

        const newQuestionId = this.questionIds[this.currentQuestionIndex + offset];

        this.router.navigate(['/question', newQuestionId]);
    }

    clearEditor() {
        this.sql = "";
        this.editor.focus();
        this.editor.readOnly = false;
        this.areSolutionsDisplayed = false;
        this.cleared = true
    }

    showSolutions() {
        this.sql = "";
        this.areSolutionsDisplayed = true
        this.editor.readOnly = true;
    }

    onSubmit() {
        if (this.isNew) {
            this.createAttempt()
        } else {
            this.createAnswer()
        }
    }

    openConfirmationDialog() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            data: {
                title: 'Clôturer ce Quiz',
                message: 'Attention, vous ne pourrez plus le modifier par après. Êtes-vous sûr ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateAttempt();
            }
        });
    }
}