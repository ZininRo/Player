import { Component } from '@angular/core';
import { MainContComponent } from "../../component/main-cont/main-cont.component";
import { SeasonContComponent } from "../../component/season-cont/season-cont.component";


@Component({
  selector: 'app-index',
  imports: [MainContComponent, SeasonContComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
