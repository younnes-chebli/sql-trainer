import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

@Component({
    selector: 'app-test-code-editor',
    templateUrl: './test-code-editor.component.html'
})
export class TestCodeEditorComponent implements AfterViewInit {
    @ViewChild('editor') editor!: CodeEditorComponent;

    query = "SELECT *\nFROM P\nWHERE COLOR='Red'";

    constructor() { }

    ngAfterViewInit(): void {
        this.editor.focus();
    }
}
