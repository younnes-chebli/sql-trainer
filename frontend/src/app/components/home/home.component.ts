import { Component } from '@angular/core';
import { Role } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    public authenticationService: AuthenticationService
  ) { }

  get currentUser() {
    return this.authenticationService.currentUser;
  }

  get isTeacher() {
    return this.currentUser && this.currentUser.role === Role.Teacher;
  }

  get isStudent() {
    return this.currentUser && this.currentUser.role === Role.Student;
  }
}
