import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unknown',
    template: `
    <h1>Unknown Page</h1>
    <p>The page you ask doesn't exist. You will be redirected automatically to your home page...</p>
    `
})

export class UnknownComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 2000);
    }
}
