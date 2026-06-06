import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-main-button-href',
    templateUrl: './main-button-href.component.html',
    styleUrls: ['./main-button-href.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MainButtonHrefComponent implements OnInit {
  @Input() href: string=""
  @Input() text:string="Button text"
  
  constructor() { }

  ngOnInit(): void {
  }

}
