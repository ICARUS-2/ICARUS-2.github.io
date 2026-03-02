import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import TitleHelper from 'src/helpers/TitleHelper';
import  ProjectInfoModel from 'src/models/ProjectInfoModel';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit, OnDestroy {

  @Input() backgroundImageSource: string = "";
  @Input() header: string = "Header text";
  @Input() description: string = "description text";
  @Input() btnText: string = "button text";
  @Input() btnHref: string = "";
  @Input() btnRouterLink: string = "";
  @Input() translationKey: string="";

  routeDataSubscription: Subscription | null = null;
  translationSubscription: Subscription | null = null;

  constructor(private route: ActivatedRoute, private titleService: Title,private translateService: TranslateService) {

   }
  ngOnDestroy(): void {
    this.routeDataSubscription?.unsubscribe();
    this.translationSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.routeDataSubscription = this.route.data.subscribe(d =>
      {
        if (d["backgroundImageSource"])
        {
          this.backgroundImageSource = d["backgroundImageSource"];
        }

        if (d["btnHref"])
        {
          this.btnHref = d["btnHref"];
        }

        if (d["btnRouterLink"])
        {
          this.btnRouterLink = d["btnRouterLink"];
        }

        if (d["translationKey"])
        {
          this.translationKey = d["translationKey"];
        }
      })

      this.updateTranslationsOnPage();

      this.translationSubscription = this.translateService.onLangChange.subscribe( (event: LangChangeEvent) =>
      {
        this.updateTranslationsOnPage();
      } )
  }

  updateTranslationsOnPage()
  {
    let translationData = this.translateService.instant(this.translationKey);

    this.header = translationData["infoPageHeader"];
    this.description = translationData["infoPageDescription"];
    this.btnText = translationData["infoPageButtonText"];

    this.titleService.setTitle(TitleHelper.concat(this.header))
  }
}
