import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-zoom-card-link',
  templateUrl: './zoom-card-link.component.html',
  styleUrls: ['./zoom-card-link.component.css']
})
export class ZoomCardLinkComponent implements OnInit {

  @Input() routerLink: string = ""
  @Input() href: string = "";
  @Input() imgSrc: string = "";
  @Input() text: string="";

  constructor() { }

  ngOnInit(): void {
    if (this.href != "" && this.routerLink != "")
      throw new Error("Either href or routerLink can be set, but not both")
  }

}
