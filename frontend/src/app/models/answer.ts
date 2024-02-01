import { Type } from "class-transformer"

export class Answer {
    id?: number
    sql?: string
    @Type(() => Date)
    timestamp?: Date
    isCorrect?: boolean
    attemptId?: number
    questionId?: number

    errors?: string[]
    resultColumns?: string[]
    resultData?: string[][]
}