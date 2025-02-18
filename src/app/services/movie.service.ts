import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Movie } from '../interfaces/movie.interface';
import { HttpClient } from '@angular/common/http';
import { parse } from 'path';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = '5f982077';
  private baseUrl = 'https://www.omdbapi.com/';
  private recentSearchesSubject = new BehaviorSubject<string[]>([]);
  private favouriteMoviesSubject = new BehaviorSubject<Movie[]>([]);
  isBrowser:boolean
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadFromLocalStorage();
    }
  }
  private loadFromLocalStorage() {
    const recentSerches = localStorage.getItem('recentSearches');
    if (recentSerches) {
      this.recentSearchesSubject.next(JSON.parse(recentSerches));
    }
    const favourites = localStorage.getItem('favouriteMovies');
    if (favourites) {
      this.favouriteMoviesSubject.next(JSON.parse(favourites));
    }
  }
  searchMovie(title: string): Observable<Movie> {
    const url = `${this.baseUrl}?t=${encodeURIComponent(title)}&apiKey=${
      this.apiKey
    }`;
    return this.http.get<Movie>(url).pipe(
      map((movie) => {
        if (movie.Response == 'True') {
          this.addToRecentSearches(title);
          console.log(movie)
        }
        return movie;
      })
    );
  }
  searchMovieByYear(year: string): Observable<Movie[]> {
    const url = `${this.baseUrl}?y=${year}&type=movie&apiKey=${this.apiKey}`;
    return this.http
      .get<any>(url)
      .pipe(map((response) => response.Search || []));
  }
  private addToRecentSearches(title: string) {
    const searches = this.recentSearchesSubject.value;
    if (!searches.includes(title)) {
      const newSearch = [title, ...searches].slice(0, 5);
      this.recentSearchesSubject.next(newSearch);
      localStorage.setItem('recentSearches', JSON.stringify(newSearch));
    }
  }
  getRecentSearches(): Observable<string[]> {
    return this.recentSearchesSubject.asObservable();
  }
}
