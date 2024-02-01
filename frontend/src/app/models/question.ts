import { format } from "date-fns"
import { Answer } from "./answer"
import { Solution } from "./solution"
import { Type } from "class-transformer"
import { Quiz } from "./quiz"

export class Question {
    id?: number
    quizId?: number
    order?: number
    body?: string

    @Type(() => Date)
    lastAnswerTimestamp?: Date
    lastAnswer?: Answer
    questionIds?: number[]

    solutions: Solution[] = []
    answers: Answer[] = []
    quiz?: Quiz

    get formatLastAnswerTimestamp(): string {
        return `${this.lastAnswerTimestamp ? format(this.lastAnswerTimestamp!, 'dd/MM/yyyy HH:mm:ss') : ''}`;
    }

    get lastAnswerSql(): string {
        if (this.answers?.length > 0) {
            const lastAnswer = this.lastAnswer
            return `${lastAnswer?.sql ? lastAnswer.sql : ''}`;
        } else {
            return ''
        }
    }

    get databaseName(): string {
        return this.quiz!.database!.name!
    }
}