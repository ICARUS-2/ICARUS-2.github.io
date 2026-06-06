import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-triangular-banner',
    templateUrl: './triangular-banner.component.html',
    styleUrls: ['./triangular-banner.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TriangularBannerComponent implements OnInit {
  @Input() imgSrc: string = ''
  @Input() headerText: string = ''
  @Input() descriptionText: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
