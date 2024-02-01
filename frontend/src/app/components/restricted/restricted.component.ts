import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-restricted',
    template: `
    <h1>Restricted Access</h1>
    <p>You will be redirected automatically to the home page...</p>
    `
})

export class RestrictedComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);
    }
}
