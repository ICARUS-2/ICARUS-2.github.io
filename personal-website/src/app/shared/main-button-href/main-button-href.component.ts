import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-button-href',
  templateUrl: './main-button-href.component.html',
  styleUrls: ['./main-button-href.component.css']
})
export class MainButtonHrefComponent implements OnInit {
  @Input() href: string=""
  @Input() text:string="Button text"
  
  constructor() { }

  ngOnInit(): void {
  }

}
