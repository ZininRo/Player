import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Episode, Season } from '../../data/models/season.model';
import { SeasonService } from '../../data/Serv/season.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-watch-episode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watch-episode.component.html',
  styleUrls: ['./watch-episode.component.css']
})
export class WatchEpisodeComponent implements OnInit, OnDestroy {
  seasons: Season[] = [];
  currentSeasonIndex = 0;
  currentEpisodeIndex = 0;
  timestamp = Date.now();
  isLoading = true;
  private videoElement?: HTMLVideoElement;
  private isDestroyed = false;
  private routerSubscription: any;
  

  adPlaying = true;
  adSkipped = false;
  adDuration = 10;
  adVideoUrl: SafeResourceUrl;
  showSkipButton = false;
  private adTimeout?: any;

  startAd(): void {
    this.adPlaying = true;
    this.showSkipButton = false;
  
    // Показать кнопку пропуска через 10 сек
    this.adTimeout = setTimeout(() => {
      this.showSkipButton = true;
      this.cdr.detectChanges();
    }, 10000); // 10 секунд
  }
  
  skipAd(): void {
    this.adPlaying = false;
    this.showSkipButton = false;
    clearTimeout(this.adTimeout);
    this.cdr.detectChanges();
    this.updateVideo(); // Запускаем видео
  }

  private playAdBeforeVideo(): void {
    this.adPlaying = true;
    this.adSkipped = false;
    this.showSkipButton = false;
  
    // Запустить таймер показа кнопки "Пропустить" через 10 сек
    if (this.adTimeout) {
      clearTimeout(this.adTimeout);
    }
    this.adTimeout = setTimeout(() => {
      this.showSkipButton = true;
      this.cdr.detectChanges();
    }, 10000);
  
    this.cdr.detectChanges();
  }


  constructor(
    private cdr: ChangeDetectorRef,
    private seasonService: SeasonService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.adVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/urTfEEsGHds?autoplay=1&controls=0&modestbranding=1&rel=0'
    );
  }

  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      // Загружаем сохраненный прогресс
      this.loadSavedProgress();
      this.loadSeasons();
      
      this.startAd();
           
      // Добавляем обработчик перед закрытием страницы
      window.addEventListener('beforeunload', this.saveProgress.bind(this));

      // При навигации по сайту
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.saveProgress();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (isPlatformBrowser(this.platformId)) {
      this.saveProgress();
      window.removeEventListener('beforeunload', this.saveProgress.bind(this));
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }
  }

  private loadSavedProgress(): void {
    if (!this.isBrowser()) return;
  
    const savedProgress = localStorage.getItem('videoProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (typeof progress.seasonIndex === 'number' && 
            typeof progress.episodeIndex === 'number') {
          this.currentSeasonIndex = progress.seasonIndex;
          this.currentEpisodeIndex = progress.episodeIndex;
        }
      } catch (e) {
        console.error('Ошибка загрузки прогресса:', e);
      }
    }
  }
  

  private saveProgress(): void {
    if (this.isDestroyed || !this.isBrowser() || !this.videoElement) return;
  
    const progress = {
      seasonIndex: this.currentSeasonIndex,
      episodeIndex: this.currentEpisodeIndex,
      currentTime: this.videoElement.currentTime
    };
  
    localStorage.setItem('videoProgress', JSON.stringify(progress));
  }

  private loadSeasons(): void {
    this.seasonService.getSeasons().subscribe({
      next: (seasons: Season[]) => {
        console.log('Seasons loaded:', seasons);
        this.seasons = seasons;
        this.isLoading = false;
        
        if (this.seasons.length > 0) {
          // Проверяем границы после загрузки
          this.ensureValidSelection();
          this.updateVideo();
        }
      },
      error: (err: any) => {
        console.error('Ошибка загрузки сезонов:', err);
        this.isLoading = false;
      }
    });
  }

  private ensureValidSelection(): void {
    // Проверяем, что выбранные индексы в допустимых пределах
    if (this.currentSeasonIndex >= this.seasons.length) {
      this.currentSeasonIndex = 0;
    }
    
    if (this.currentSeasonIndex < this.seasons.length) {
      const season = this.seasons[this.currentSeasonIndex];
      if (this.currentEpisodeIndex >= season.episodes.length) {
        this.currentEpisodeIndex = 0;
      }
    } else {
      this.currentSeasonIndex = 0;
      this.currentEpisodeIndex = 0;
    }
  }

  changeSeason(direction: number): void {
    const newIndex = this.currentSeasonIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.seasons.length) {
      this.currentSeasonIndex = newIndex;
      this.currentEpisodeIndex = 0;
      this.saveProgress();
      this.updateVideo();
      this.playAdBeforeVideo(); 
    }
  }

  selectEpisode(index: number): void {
    if (this.seasons.length > 0 && 
        this.currentSeason && 
        index >= 0 && 
        index < this.currentSeason.episodes.length) {
      this.currentEpisodeIndex = index;
      this.saveProgress();
      this.updateVideo();
      this.playAdBeforeVideo(); 
    }
  }

  private updateVideo(): void {
    if (this.adPlaying) return; // Ждём окончания рекламы
  
    this.timestamp = Date.now();
    this.cdr.detectChanges();
  
    const videoElement = document.querySelector('video');
    if (videoElement) {
      this.videoElement = videoElement;
  
      this.loadSavedTime();
      videoElement.load();
  
      videoElement.addEventListener('timeupdate', () => {
        if (Math.floor(videoElement.currentTime) % 5 === 0) {
          this.saveProgress();
        }
      });
    }
  }

  private loadSavedTime(): void {
    if (!this.videoElement) return;
    
    const savedProgress = localStorage.getItem('videoProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        
        // Восстанавливаем время только если это тот же сезон и эпизод
        if (progress.seasonIndex === this.currentSeasonIndex &&
            progress.episodeIndex === this.currentEpisodeIndex &&
            typeof progress.currentTime === 'number') {
            
          this.videoElement.currentTime = progress.currentTime;
        }
      } catch (e) {
        console.error('Ошибка загрузки времени:', e);
      }
    }
  }

  get currentSeason(): Season | null {
    return this.seasons.length > 0 ? this.seasons[this.currentSeasonIndex] : null;
  }

  get currentEpisode(): Episode | null {
    if (!this.currentSeason || 
        !this.currentSeason.episodes || 
        this.currentSeason.episodes.length === 0) {
      return null;
    }
    return this.currentSeason.episodes[this.currentEpisodeIndex];
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}