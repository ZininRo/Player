import { Component } from '@angular/core';
import { EpisodeFormComponent } from "../../component/episode-form/episode-form.component";
import { SeasonSeeComponent } from "../../component/season-see/season-see.component";
import { CommonModule } from '@angular/common';

interface Season {
  number: number;
  episodes: number;
  image: string;
}
@Component({
  selector: 'app-see-all',
  standalone: true,
  imports: [EpisodeFormComponent, SeasonSeeComponent, CommonModule],
  templateUrl: './see-all.component.html',
  styleUrl: './see-all.component.css'
})



export class SeeAllComponent {
  seasons: Season[] = [
    { number: 1, episodes: 10, image: 'assets/img/season1.png' },
    { number: 2, episodes: 10, image: 'assets/img/season2.png' },
    { number: 3, episodes: 10, image: 'assets/img/season3.png' },
    { number: 4, episodes: 10, image: 'assets/img/season4.png' },
    { number: 5, episodes: 10, image: 'assets/img/season5.png' },
    { number: 6, episodes: 10, image: 'assets/img/season6.png' },
    { number: 7, episodes: 7, image: 'assets/img/season7.png' },
    { number: 8, episodes: 6, image: 'assets/img/season8.png' }
  ];
}
