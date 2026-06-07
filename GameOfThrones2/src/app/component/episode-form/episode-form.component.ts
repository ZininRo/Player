import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-episode-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episode-form.component.html',
  styleUrls: ['./episode-form.component.css']
})
export class EpisodeFormComponent {
  selectedSeason: number | null = null;
  selectedEpisode: number | null = null;

  // Массив сезонов с информацией о количестве серий
  seasons = [
    { value: 1, label: 'Сезон 1', episodes: 10 },
    { value: 2, label: 'Сезон 2', episodes: 10 },
    { value: 3, label: 'Сезон 3', episodes: 10 },
    { value: 4, label: 'Сезон 4', episodes: 10 },
    { value: 5, label: 'Сезон 5', episodes: 10 },
    { value: 6, label: 'Сезон 6', episodes: 10 },
    { value: 7, label: 'Сезон 7', episodes: 7 },
    { value: 8, label: 'Сезон 8', episodes: 6 }
  ];

  constructor(private router: Router) {}

  getMaxEpisodes(season: number): number {
    const s = this.seasons.find(s => s.value === season);
    return s ? s.episodes : 0;
  }

  watchSelectedEpisode(): void {
    if (
      this.selectedSeason == null ||
      this.selectedEpisode == null ||
      this.selectedEpisode < 1 ||
      this.selectedEpisode > this.getMaxEpisodes(this.selectedSeason)
    ) {
      alert('Пожалуйста, выберите корректные сезон и серию');
      return;
    }

    const progress = {
      seasonIndex: this.selectedSeason - 1,
      episodeIndex: this.selectedEpisode - 1,
      currentTime: 0
    };

    localStorage.setItem('videoProgress', JSON.stringify(progress));
    this.router.navigate(['/watch-episode']);
  }

  getEpisodeList(season: number): number[] {
    const seasonData = this.seasons.find(s => s.value === season);
    return seasonData ? Array.from({ length: seasonData.episodes }, (_, i) => i + 1) : [];
  }
  
}
