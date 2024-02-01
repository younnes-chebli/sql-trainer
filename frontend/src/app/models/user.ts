import { Type } from "class-transformer";
import { differenceInYears } from "date-fns";
import 'reflect-metadata';
import { Attempt } from "./attempts";

export enum Role {
    Student = 0,
    Teacher = 1
}

export class User {
    id?: number
    pseudo?: string;
    password?: string;
    email?: string;
    lastName?: string;
    firstName?: string;
    @Type(() => Date)
    birthDate?: Date;
    role: Role = Role.Student;
    token?: string;
    
    attempts?: Attempt[]

    public get roleAsString(): string {
        return Role[this.role];
    }

    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    }

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = new Date();
        /* var age = today.getFullYear() - this.birthDate.getFullYear();
        today.setFullYear(today.getFullYear() - age);
        if (this.birthDate > today) age--;
        return age; */
        return differenceInYears(today, this.birthDate);
    }
}
