import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import TitleHelper from './../../../helpers/TitleHelper';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit, OnDestroy{

  projectsTitleSubscription: Subscription | null = null;

  constructor(private titleService: Title, private translateService: TranslateService) {

   }
  ngOnDestroy(): void {
    this.projectsTitleSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.updateTranslationsOnPage();

    this.projectsTitleSubscription = this.translateService.onLangChange.subscribe( (event: LangChangeEvent) =>
    {
      this.updateTranslationsOnPage();
    } )
  }

  updateTranslationsOnPage()
  {
    this.titleService.setTitle(TitleHelper.concat(this.translateService.instant('projects.bannerText')))
  }
}
