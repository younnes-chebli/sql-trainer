import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { Role } from 'src/app/models/user';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    ctlPseudo!: FormControl;
    ctlPassword!: FormControl;
    destinationUrl: string = '/';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.ctlPseudo = this.formBuilder.control('', Validators.required);
        this.ctlPassword = this.formBuilder.control('', Validators.required);
        this.loginForm = this.formBuilder.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.destinationUrl;
    }

    get f() { return this.loginForm.controls; }

    get currentUser() {
        return this.authenticationService.currentUser;
    }

    get isTeacher() {
        return this.currentUser && this.currentUser.role === Role.Teacher;
    }

    get isStudent() {
        return this.currentUser && this.currentUser.role === Role.Student;
    }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) return;

        this.loading = true;
        this.authenticationService.login(this.f.pseudo.value, this.f.password.value)
            .subscribe({
                next: data => {
                    this.destinationUrl = this.isStudent ? '/quizzes' : this.isTeacher ? '/teacher' : '/'
                    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.destinationUrl;
                    this.router.navigate([this.returnUrl]);
                },
                error: error => {
                    const errors = error.error.errors;
                    for (let err of errors) {
                        this.loginForm.get(err.propertyName.toLowerCase())?.setErrors({ custom: err.errorMessage })
                    }
                    this.loading = false;
                }
            });
    }
}
