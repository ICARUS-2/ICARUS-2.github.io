import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import LocalStorageHelper from './../../../helpers/LocalStorageHelper';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentLang = null;

  constructor(public translate: TranslateService) {
    //@ts-ignore
    this.currentLang = LocalStorageHelper.getLang();
  }

  ngOnInit(): void {
  }

  onLanguageChanged()
  {
      let langSelect = document.getElementById("langSelect")
      
      //@ts-ignore
      this.translate.use(langSelect.value)
      
      //@ts-ignore
      LocalStorageHelper.setLang(langSelect.value)
  }
}
