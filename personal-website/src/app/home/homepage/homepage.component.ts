import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    standalone: false
})
export class HomepageComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle("Ethan Briffett")
   }

  ngOnInit(): void {
  }

}
