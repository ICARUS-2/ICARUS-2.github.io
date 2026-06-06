import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-parallax',
    templateUrl: './parallax.component.html',
    styleUrls: ['./parallax.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ParallaxComponent implements OnInit {

  @Input() bgImg = ''
  @Input() height = ''

  constructor() { }

  ngOnInit(): void {
  }

}
