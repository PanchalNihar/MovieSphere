import { Routes } from '@angular/router';
import { MovieSearchComponent } from './movie-search/movie-search.component';

export const routes: Routes = [
  {
    path: '',
    component: MovieSearchComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
