import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-button',
  templateUrl: './main-button.component.html',
  styleUrls: ['./main-button.component.css']
})
export class MainButtonComponent implements OnInit {

  @Input() routerLink: string=""
  @Input() text:string="Button text"

  constructor() { 
  }

  ngOnInit(): void {
  }

}
