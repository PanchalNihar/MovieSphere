import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../interfaces/movie.interface';
import { MovieService } from '../services/movie.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-movie-search',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.css',
})
export class MovieSearchComponent implements OnInit {
  searchControl = new FormControl('');
  movie: Movie | null = null;
  loading = false;
  error: string | null = null;
  recentSearches: string[] = [];
  yearFilter = new FormControl('');

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService
      .getRecentSearches()
      .subscribe((searches) => (this.recentSearches = searches));

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value) => {
          if (value) {
            this.loading = true;
            return this.movieService.searchMovie(value);
          }
          return [];
        })
      )
      .subscribe({
        next: (result: any) => {
          this.movie = result.Response === 'True' ? result : null;
          this.error = result.Response === 'Fasle' ? result.error : null;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'An errror occured while fetching the movie';
          this.loading = false;
        },
      });
  }
  searchMovie(title: string) {
    this.searchControl.setValue(title);
  }
  toggleFavorite(movie: Movie) {
    this.movieService.toggleFavourite(movie);
  }
  isFavorite(imdbID: string): boolean {
    return this.movieService.isFavourite(imdbID);
  }
}
