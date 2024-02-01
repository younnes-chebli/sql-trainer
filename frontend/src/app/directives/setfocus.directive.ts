import { Directive, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';

@Directive({
    selector: '[appSetFocus]'
})
export class SetFocusDirective implements OnInit {

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.el.nativeElement.focus();
    }
}
