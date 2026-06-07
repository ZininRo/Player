// src/app/services/season.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Season } from '../models/season.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private apiUrl = 'http://localhost:3000/seasons';

  constructor(private http: HttpClient) { }

  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.apiUrl);
  }
  
}