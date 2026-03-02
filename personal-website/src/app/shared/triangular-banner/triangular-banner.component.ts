import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-triangular-banner',
  templateUrl: './triangular-banner.component.html',
  styleUrls: ['./triangular-banner.component.css']
})
export class TriangularBannerComponent implements OnInit {
  @Input() imgSrc: string = ''
  @Input() headerText: string = ''
  @Input() descriptionText: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
