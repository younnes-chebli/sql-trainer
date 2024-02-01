import { Type } from "class-transformer"
import { Answer } from "./answer"
import { Quiz } from "./quiz"

export class Attempt {
    id?: number
    @Type(() => Date)
    start?: Date
    @Type(() => Date)
    finish?: Date
    quizId?: number
    studentId?: number
    evaluation?: number

    answers?: Answer[] = []
    quiz?: Quiz
}