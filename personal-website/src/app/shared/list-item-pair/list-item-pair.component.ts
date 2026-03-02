import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-item-pair',
  templateUrl: './list-item-pair.component.html',
  styleUrls: ['./list-item-pair.component.css']
})
export class ListItemPairComponent implements OnInit {

  @Input() item1: string = ""
  @Input() item2: string = ""

  constructor() { }

  ngOnInit(): void {
  }

}
