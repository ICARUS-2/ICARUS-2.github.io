import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import TitleHelper from './../../../helpers/TitleHelper';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle(TitleHelper.concat("Contact"))
   }

  ngOnInit(): void {
  }

}
