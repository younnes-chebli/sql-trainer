import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Attempt } from "src/app/models/attempts";
import { User } from "src/app/models/user";
import { AttemptService } from "src/app/services/attempt.service";

@Component({
    selector: 'session1-child',
    templateUrl: './session1-child.component.html',
    styleUrls: ['./session1.css']
})
export class Session1ChildComponent implements OnInit {
    @Input() selectedStudent?: User
    @Output() attemptClosed = new EventEmitter<void>();

    constructor(
        private attemptService: AttemptService
    ) { }

    ngOnInit(): void { }

    closeAttempt(attempt: Attempt) {
        const updatedAttempt = { ...attempt, finish: new Date() }

        this.attemptService.updateAttempt(updatedAttempt).subscribe({
            next: () => {
                this.attemptClosed.emit()
            },
            error: error => {
                console.error('Erreur lors de la mise à jour de l\'attempt', error);
            }
        });
    }
}
