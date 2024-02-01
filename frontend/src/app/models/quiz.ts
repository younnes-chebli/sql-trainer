import { Type } from "class-transformer";
import { format } from "date-fns";
import { Database } from "./database";
import { Attempt } from "./attempts";
import { Question } from "./question";

export class Quiz {
    id?: number
    name?: string
    description?: string | null
    databaseId?: number
    isPublished?: boolean
    isTest?: boolean
    @Type(() => Date)
    startDate?: Date
    @Type(() => Date)
    endDate?: Date

    status?: string
    firstQuestionId?: string
    lastAttempt?: Attempt
    hasAttempt?: boolean

    database?: Database
    attempts: Attempt[] = []
    questions: Question[] = []

    get start(): string {
        return `${this.startDate ? format(this.startDate!, 'dd/MM/yyyy') : 'N/A'}`;
    }

    get end(): string {
        return `${this.endDate ? format(this.endDate!, 'dd/MM/yyyy') : 'N/A'}`;
    }

    get type(): string {
        return `${this.isTest ? 'Test' : 'Training'}`;
    }

    get databaseName(): string {
        return this.database!.name!
    }

    get evaluation(): string {
        if (this.attempts.length > 0) {
            const lastAttempt = this.attempts[this.attempts.length - 1];
            return `${lastAttempt.evaluation?.toString() + '/10'}`;
        } else {
            return 'N/A';
        }
    }
}