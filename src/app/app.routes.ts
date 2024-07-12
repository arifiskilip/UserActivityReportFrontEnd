import { Routes } from '@angular/router';
import { LoginComponent } from './components/home/login/login.component';
import { RegisterComponent } from './components/home/register/register.component';
import { VerificationCodeComponent } from './components/home/verification-code/verification-code.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { UnauthorizedComponent } from './components/home/unauthorized/unauthorized.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { UserActivityReportComponent } from './components/user/user-activity-report/user-activity-report.component';
import { RoleGuard } from './guards/role.guard';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verificationcode',
        component: VerificationCodeComponent,
        canActivate: [()=> inject(AuthService).isAuthenticated()],
        data: { roles: 'User' }
      },
      {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [()=>inject(AuthService).isAuthenticated(),()=>inject(AuthService).isUserVerified(),RoleGuard],
        data: { roles: ['User'] },
        children: [
          {
            path: '',
            component: UserActivityReportComponent
          },
          {
            path: 'profile',
            component: UserProfileComponent
          },
        ],
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: '**', redirectTo: '/login' },
];
