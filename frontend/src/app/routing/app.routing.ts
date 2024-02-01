import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { TestCodeEditorComponent } from '../components/test-code-editor/test-code-editor.component';
import { QuizzesListsComponent } from '../components/quizzes-lists/quizzes-lists.component';
import { AllQuizzesListComponent } from '../components/all-quizzes-list/all-quizzes-list.component';
import { QuestionComponent } from '../components/question/question.component';
import { EditQuizComponent } from '../components/edit-quiz/edit-quiz.component';
import { Session1ParentComponent } from '../components/session1/session1-parent.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'teacher',
        component: AllQuizzesListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
    },
    {
        path: 'session1',
        component: Session1ParentComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
    },
    {
        path: 'quizzes',
        component: QuizzesListsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Student] }
    },
    {
        path: 'question/:id',
        component: QuestionComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'quizedition/:id',
        component: EditQuizComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
    },
    {
        path: 'test-code-editor',
        component: TestCodeEditorComponent
    },
    { path: 'restricted', component: RestrictedComponent },
    { path: '**', component: UnknownComponent },
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
