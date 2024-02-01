import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Question } from 'src/app/models/question';
import { Solution } from 'src/app/models/solution';

@Component({
    selector: 'app-question-item',
    templateUrl: './question-item.component.html',
    styleUrls: ['../edit-quiz/edit-quiz.component.css']
})
export class QuestionItemComponent {
    @Input() question!: Question;
    @Input() questions!: Question[];
    @Input() index!: number;
    @Input() hasAttempt!: boolean;
    @Input() isTest!: boolean;
    @Input() isQuestionValid!: boolean;
    @Input() isSolutionValid!: boolean;
    @Input() ctlSolutionSql!: FormControl
    @Input() frmSolutions!: FormGroup

    @Output() moveQuestionUp = new EventEmitter<number>();
    @Output() moveQuestionDown = new EventEmitter<number>();
    @Output() openConfirmationDialogQuestion = new EventEmitter<Question>();
    @Output() validateQuestionBody = new EventEmitter<string>();
    @Output() addSolution = new EventEmitter<Question>();
    @Output() moveSolutionUp = new EventEmitter<Question>();
    @Output() moveSolutionDown = new EventEmitter<Question>();
    @Output() validateSolutionSql = new EventEmitter<string>();
    @Output() openConfirmationDialogSolution = new EventEmitter<{ question: Question, solution: Solution }>();
    @Output() reorderSolutions = new EventEmitter<Question>();

    @ViewChild('newSolutionPanel') newSolutionPanel!: MatExpansionPanel;

    onMoveQuestionUp() {
        this.moveQuestionUp.emit(this.index)
    }

    onMoveQuestionDown() {
        this.moveQuestionDown.emit(this.index)
    }

    onOpenConfirmationDialogQuestion() {
        this.openConfirmationDialogQuestion.emit(this.question)
    }

    onValidateQuestionBody() {
        this.validateQuestionBody.emit(this.questions[this.index].body)
    }

    onAddSolution() {
        this.addSolution.emit(this.question)
        this.newSolutionPanel.close()
    }

    onMoveSolutionUp(sIndex: number) {
        if (sIndex > 0) {
            const temp = this.question.solutions[sIndex - 1];
            this.question.solutions[sIndex - 1] = this.question.solutions[sIndex];
            this.question.solutions[sIndex] = temp;
            this.reorderSolutions.emit(this.question);
        }
    }

    onMoveSolutionDown(sIndex: number) {
        if (sIndex < this.question.solutions.length - 1) {
            const temp = this.question.solutions[sIndex + 1];
            this.question.solutions[sIndex + 1] = this.question.solutions[sIndex];
            this.question.solutions[sIndex] = temp;
            this.reorderSolutions.emit(this.question);
        }
    }

    onValidateSolutionSql(solutionSql: string) {
        this.validateSolutionSql.emit(solutionSql)
    }

    onOpenConfirmationDialogSolution(eventData: { question: Question, solution: Solution }) {
        this.openConfirmationDialogSolution.emit(eventData)
    }
}
