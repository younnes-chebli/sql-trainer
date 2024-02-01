import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { TestCodeEditorComponent } from '../components/test-code-editor/test-code-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { QuizzesListsComponent } from '../components/quizzes-lists/quizzes-lists.component';
import { AllQuizzesListComponent } from '../components/all-quizzes-list/all-quizzes-list.component';
import { QuizListComponent } from '../components/quiz-list/quiz-list.component';
import { QuestionComponent } from '../components/question/question.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { EditQuizComponent } from '../components/edit-quiz/edit-quiz.component';
import { QuestionItemComponent } from '../components/question-item/question-item.component';
import { Session1ParentComponent } from '../components/session1/session1-parent.component';
import { Session1ChildComponent } from '../components/session1/session1-child.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    UserListComponent,
    LoginComponent,
    UnknownComponent,
    RestrictedComponent,
    CodeEditorComponent,
    TestCodeEditorComponent,
    QuizzesListsComponent,
    AllQuizzesListComponent,
    QuizListComponent,
    QuestionComponent,
    ConfirmationDialogComponent,
    EditQuizComponent,
    QuestionItemComponent,
    Session1ParentComponent,
    Session1ChildComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
