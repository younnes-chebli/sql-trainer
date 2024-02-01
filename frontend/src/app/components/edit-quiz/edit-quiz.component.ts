import { Component, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Database } from "src/app/models/database";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";
import { CodeEditorComponent } from "../code-editor/code-editor.component";
import { MatExpansionPanel } from "@angular/material/expansion";
import { DatabaseService } from "src/app/services/database.service";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import * as _ from 'lodash-es';
import { Solution } from "src/app/models/solution";

@Component({
    selector: 'app-edit-quiz',
    templateUrl: './edit-quiz.component.html',
    styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent {
    quizId!: number
    private _quiz!: Quiz
    databases!: Database[]
    questions!: Question[]
    isNew: boolean = false
    initialQuizName!: string

    public frm!: FormGroup
    public ctlName!: FormControl
    public ctlDescription!: FormControl
    public ctlDatabaseId!: FormControl
    public ctlIsPublished!: FormControl
    public ctlIsTest!: FormControl
    public ctlStartDate!: FormControl
    public ctlEndDate!: FormControl
    public frmQuestions!: FormGroup
    public ctlQuestionBody!: FormControl
    public frmSolutions!: FormGroup
    public ctlSolutionSql!: FormControl
    public ctlSolutions!: FormControl

    @ViewChild('newQuestionPanel') newQuestionPanel!: MatExpansionPanel;

    @ViewChild('editor') editor!: CodeEditorComponent
    databaseName: string = ""
    isQuestionValid: boolean = true
    isSolutionValid: boolean = true

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private databaseService: DatabaseService,
        private quizService: QuizService,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {
        this.ctlName = this.fb.control('', [
            Validators.required,
            this.trimmedMinLengthValidator(3)
        ], [this.quizNameUsed()])
        this.ctlDescription = this.fb.control('')
        this.ctlDatabaseId = this.fb.control('', [
            Validators.required
        ]);
        this.ctlIsPublished = this.fb.control(false);
        this.ctlIsTest = this.fb.control(false);
        this.ctlStartDate = this.fb.control(null, [
            Validators.required
        ]);
        this.ctlEndDate = this.fb.control(null, [
            Validators.required
        ]);

        this.frm = this.fb.group({
            name: this.ctlName,
            description: this.ctlDescription,
            databaseId: this.ctlDatabaseId,
            isPublished: this.ctlIsPublished,
            isTest: this.ctlIsTest,
            startDate: this.ctlStartDate,
            endDate: this.ctlEndDate
        }, {
            validators: [
                this.dateRangeValidator(),
                this.atLeastOneQuestionValidator(),
                this.atLeastOneSolutionPerQuestionValidator()
            ]
        })

        this.ctlQuestionBody = this.fb.control('', [
            Validators.required,
            this.trimmedMinLengthValidator(2)
        ])
        this.frmQuestions = this.fb.group({
            body: this.ctlQuestionBody
        });

        this.ctlSolutionSql = this.fb.control('', [
            Validators.required
        ])
        this.frmSolutions = this.fb.group({
            sql: this.ctlSolutionSql
        });
    }

    ngAfterViewInit(): void { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadDatabases()
            this.quizId = Number(params['id']);
            if (this.quizId !== 0) {
                this.loadQuiz(this.quizId);
            }
            else {
                this.isNew = true
            }
        });

        this.ctlIsTest.valueChanges.subscribe(isTest => {
            if (!isTest) {
                this.ctlStartDate.reset();
                this.ctlEndDate.reset();
            }
            this.updateDateValidators();
        });
        this.updateDateValidators();
    }

    get quiz(): Quiz {
        return this._quiz
    }

    get hasAttempt(): boolean {
        return this._quiz?.hasAttempt!
    }

    get isTest(): boolean {
        return this._quiz?.isTest!
    }

    private trimmedMinLengthValidator(minLength: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value?.trim();
            return value && value.length >= minLength ? null : { 'trimmedMinLength': { requiredLength: minLength, actualLength: value?.length } };
        };
    }

    private atLeastOneSolutionPerQuestionValidator() {
        return (): ValidationErrors | null => {
            if (!this.questions) {
                return null;
            }

            for (let question of this.questions) {
                if (question.solutions.length === 0) {
                    return { 'atLeastOneSolutionPerQuestion': true };
                }
            }

            return null;
        };
    }

    private atLeastOneQuestionValidator() {
        return (formGroup: FormGroup): ValidationErrors | null => {
            return this.questions && this.questions.length > 0 ? null : { atLeastOneQuestion: true };
        };
    }

    private updateDateValidators() {
        if (this.ctlIsTest.value) {
            this.ctlStartDate.setValidators(Validators.required);
            this.ctlEndDate.setValidators(Validators.required);
        } else {
            this.ctlStartDate.clearValidators();
            this.ctlEndDate.clearValidators();
        }
        this.ctlStartDate.updateValueAndValidity();
        this.ctlEndDate.updateValueAndValidity();
    }

    private dateRangeValidator() {
        return (group: FormGroup): ValidationErrors | null => {
            const isTest = group.get('isTest')?.value;
            if (!isTest) {
                return null;
            }

            const start = group.get('startDate')?.value;
            const end = group.get('endDate')?.value;
            return start && end && start > end ? { dateRange: true } : null;
        };
    }

    validateQuestionBody(input: string) {
        this.isQuestionValid = input.length < 2 ? false : true
    }

    validateSolutionSql(input: string) {
        this.isSolutionValid = input.length === 0 ? false : true
    }

    private loadDatabases() {
        this.databaseService.getAll().subscribe(
            databases => {
                this.databases = databases
            }
        )
    }

    private loadQuiz(quizId: number) {
        this.quizService.getById(quizId).subscribe(
            quiz => {
                this._quiz = quiz
                this.questions = quiz.questions
                this.initialQuizName = quiz.name!

                if (this.hasAttempt && quiz.isTest) {
                    this.ctlIsTest.disable();
                    this.ctlDatabaseId.disable();
                    this.ctlIsPublished.disable();
                } else {
                    this.ctlIsTest.enable();
                    this.ctlDatabaseId.enable();
                    this.ctlIsPublished.enable();
                }

                this.frm.patchValue({
                    name: quiz.name,
                    description: quiz.description === 'null' ? '' : quiz.description,
                    databaseId: quiz.databaseId,
                    isPublished: quiz.isPublished,
                    isTest: quiz.isTest,
                    startDate: quiz.startDate,
                    endDate: quiz.endDate
                })
            },
            error => {
                console.error('Error fetching quiz:', error)
                this.router.navigate(['/unknown'])
            }
        );
    }

    saveQuiz() {
        if (this.isNew) {
            this.createQuiz()
        } else {
            this.updateQuiz()
        }
    }

    private createQuiz() {
        const newQuiz: Quiz = {
            name: String(this.frm.value.name).trim(),
            description: String(this.frm.value.description).trim(),
            databaseId: this.frm.value.databaseId,
            isPublished: this.frm.value.isPublished,
            isTest: this.frm.value.isTest,
            startDate: this.frm.value.startDate,
            endDate: this.frm.value.endDate,
            database: this.databases.find(d => d.id === this.frm.value.databaseId),
            start: '',
            end: '',
            type: '',
            databaseName: '',
            evaluation: '',
            attempts: [],
            questions: this.questions
        };

        this.quizService.create(newQuiz).subscribe({
            next: (savedQuiz) => {
                this.isNew = false
                this.router.navigate(['/quizedition', savedQuiz.id]);
            },
            error: (error) => {
                console.error('Error saving the quiz:', error);
            }
        });
    }

    private updateQuiz() {
        const updatedQuiz = {
            ...this.quiz,
            name: String(this.frm.value.name).trim(),
            description: String(this.frm.value.description).trim(),
            databaseId: this.frm.value.databaseId,
            isPublished: this.frm.value.isPublished,
            isTest: this.frm.value.isTest,
            startDate: this.frm.value.startDate,
            endDate: this.frm.value.endDate,
            database: this.databases.find(d => d.id === this.frm.value.databaseId),
            questions: this.questions,
            start: '',
            end: '',
            type: '',
            databaseName: '',
            evaluation: ''
        }

        this.quizService.updateQuiz(updatedQuiz).subscribe({
            next: () => {
                // this.closePanels()
                this.loadQuiz(this.quizId)
            },
            error: error => {
                console.error('Error updating the quiz', error);
            }
        });
    }

    private deleteQuiz() {
        this.quizService.delete(this.quizId).subscribe({
            next: () => {
                this.router.navigate(['/teacher']);
            },
            error: error => {
                console.error('Error deleting the quiz', error);
            }
        });
    }

    quizNameUsed(): any {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const quizName = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine || quizName === this.initialQuizName) {
                        resolve(null);
                    } else {
                        this.quizService.getByQuizName(quizName).subscribe(quiz => {
                            resolve(quiz ? { quizNameUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }

    openConfirmationDialog() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            data: {
                title: 'Supprimer ce Quiz',
                message: 'Êtes-vous sûr ? La suppression de ce quiz impliquera la suppression des questions et essais associés.'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteQuiz();
            }
        });
    }

    openConfirmationDialogQuestion(question: Question) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            data: {
                title: 'Supprimer cette Question',
                message: 'Êtes-vous sûr ? La suppression de cette questions impliquera la suppression des solutions associées.'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteQuestion(question);
            }
        });
    }

    openConfirmationDialogSolution(eventData: { question: Question, solution: Solution }) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            data: {
                title: 'Supprimer cette Solution',
                message: 'Êtes-vous sûr ?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteSolution(eventData.question, eventData.solution);
            }
        });
    }

    addQuestion() {
        let nextOrder!: number

        if (!this.questions) {
            this.questions = [];
            nextOrder = 1;
        } else {
            const maxOrder = this.questions.reduce((max, question) => Math.max(max, question.order!), 0);
            nextOrder = maxOrder + 1;
        }

        const newQuestion = {
            quizId: this.quizId,
            order: nextOrder,
            body: String(this.ctlQuestionBody.value).trim(),
            solutions: [],
            answers: [],
            questionIds: [],
            formatLastAnswerTimestamp: '',
            lastAnswerSql: '',
            databaseName: ''
        };

        this.questions.push(newQuestion);
        this.frmQuestions.reset();
        this.updateFormValidity()
        this.newQuestionPanel.close()
        this.frm.markAsDirty();
    }

    deleteQuestion(question: Question) {
        _.remove(this.questions, question);
        this.updateFormValidity()
        this.reorderQuestions()
        this.frm.markAsDirty();
    }

    private updateFormValidity() {
        this.frm.updateValueAndValidity()
    }

    private reorderQuestions() {
        this.questions.forEach((question, index) => {
            question.order = index + 1;
        });
    }

    addSolution(question: Question) {
        let nextOrder!: number

        if (!question.solutions) {
            question.solutions = [];
            nextOrder = 1;
        } else {
            const maxOrder = question.solutions.reduce((max, solution) => Math.max(max, solution.order!), 0);
            nextOrder = maxOrder + 1;
        }

        const newSolution = {
            questionId: question.id,
            order: nextOrder,
            sql: String(this.ctlSolutionSql.value).trim()
        };

        question.solutions.push(newSolution)
        this.frmSolutions.reset()
        this.updateFormValidity()
        this.frm.markAsDirty();
    }

    deleteSolution(question: Question, solution: Solution) {
        _.remove(question.solutions, solution);
        this.updateFormValidity()
        this.reorderSolutions(question)
        this.frm.markAsDirty();
    }

    reorderSolutions(question: Question) {
        question.solutions.forEach((solution, index) => {
            solution.order = index + 1;
        });
    }

    moveQuestionUp(index: number) {
        if (index > 0) {
            const temp = this.questions[index - 1];
            this.questions[index - 1] = this.questions[index];
            this.questions[index] = temp;
            this.reorderQuestions();
            this.frm.markAsDirty();
        }
    }

    moveQuestionDown(index: number) {
        if (index < this.questions.length - 1) {
            const temp = this.questions[index + 1];
            this.questions[index + 1] = this.questions[index];
            this.questions[index] = temp;
            this.reorderQuestions();
            this.frm.markAsDirty();
        }
    }
}