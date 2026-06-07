import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-season-cont',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './season-cont.component.html',
  styleUrl: './season-cont.component.css'
})
export class SeasonContComponent {
  constructor(private router: Router) {}

  openSeason(seasonNumber: number) {
    const progress = {
      seasonIndex: seasonNumber - 1,
      episodeIndex: 0, // Первая серия (индекс 0)
      currentTime: 0
    };
  
    localStorage.setItem('videoProgress', JSON.stringify(progress));
    this.router.navigate(['/watch-episode']);
  }
  
}
