import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-season-see',
  standalone: true, // <-- Добавьте это
  imports: [CommonModule],
  templateUrl: './season-see.component.html',
  styleUrl: './season-see.component.css'
})
export class SeasonSeeComponent {
  @Input() seasonNumber!: number;
  @Input() episodesCount!: number;
  @Input() imagePath!: string;

  constructor(private router: Router) {}

  get episodes(): number[] {
    return Array(this.episodesCount)
      .fill(0)
      .map((_, i) => i + 1);
  }
  
  chunkArray(arr: number[], size: number): number[][] {
    return arr.length > 0
      ? arr.reduce<number[][]>((acc, _, i) => {
          if (i % size === 0) {
            acc.push(arr.slice(i, i + size));
          }
          return acc;
        }, [])
      : [];
  }

  playEpisode(episodeNumber: number): void {
    const progress = {
      seasonIndex: this.seasonNumber - 1,  // Номер сезона с 0
      episodeIndex: episodeNumber - 1,     // Номер серии с 0
      currentTime: 0
    };

    localStorage.setItem('videoProgress', JSON.stringify(progress));
    this.router.navigate(['/watch-episode']);
  }
}