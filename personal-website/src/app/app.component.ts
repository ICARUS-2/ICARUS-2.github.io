import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import LocalStorageHelper from './../helpers/LocalStorageHelper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'personal-website';

  constructor(private router: Router, public translate: TranslateService) 
  {
      translate.addLangs(['en', 'fr']);

      if (LocalStorageHelper.getLang())
      {
        //@ts-ignore
        translate.use(LocalStorageHelper.getLang())
      }
      else
      {
        //@ts-ignore
        translate.use("en");
      }
   }

  ngOnInit() 
  {

  }

}
