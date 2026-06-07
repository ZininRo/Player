import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SeeAllComponent } from './pages/see-all/see-all.component';
import { WatchEpisodeComponent } from './pages/watch-episode/watch-episode.component';


export const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },
    { path: 'watch-episode', component: WatchEpisodeComponent },
    { path: 'SeeAll', component: SeeAllComponent }
];
