import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TasksComponent },
];
