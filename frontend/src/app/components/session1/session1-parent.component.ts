import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'session1-parent',
    templateUrl: './session1-parent.component.html',
    styleUrls: ['./session1.css']
})
export class Session1ParentComponent implements OnInit {
    students?: User[]
    selectedStudent?: User

    constructor(
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.loadStudents()
    }

    loadStudents() {
        this.userService.getStudentsWithAttempts().subscribe(
            students => {
                this.students = students
                if (this.selectedStudent !== undefined) {
                    this.selectedStudent = students.find(s => s.id === this.selectedStudent?.id)
                }
            },
            error => {
                console.error('Error fetching students:', error);
            }
        );
    }
}
