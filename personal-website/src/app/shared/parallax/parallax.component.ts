import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-parallax',
    templateUrl: './parallax.component.html',
    styleUrls: ['./parallax.component.css'],
    standalone: false
})
export class ParallaxComponent implements OnInit {

  @Input() bgImg = ''
  @Input() height = ''

  constructor() { }

  ngOnInit(): void {
  }

}
