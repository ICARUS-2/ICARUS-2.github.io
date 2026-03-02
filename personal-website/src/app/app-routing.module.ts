import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './home/homepage/homepage.component';
import { ProjectsPageComponent } from './projects/projects-page/projects-page.component';
import { ContactPageComponent } from './contact/contact-page/contact-page.component';
import { ProjectInfoComponent } from './projects/project-info/project-info.component';
import ProjectInfoModel from 'src/models/ProjectInfoModel';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'projects', component: ProjectsPageComponent},
  {path: 'contact', component: ContactPageComponent},

  //test project info
  /*
  {path: "projects/test", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/home/view2.webp", //Background image
    "Test header",                         //Header
    "Test description",                    //Description
    "Test",                                //Button text
    "",                                    //Href
    "/projects"                            //Router link
  )},*/

  //CHONSE2
  {path: "projects/chonse2", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/chonse2.webp", //Background image
    "projects.chonse2",
    "https://icarus-2.github.io/chonse2",
    ""
  )},

  //MoneroOcean Custom UI
  {path: "projects/moneroocean-custom-ui", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/moneroocean-customui.webp", //Background image
    "projects.moneroOceanCustomUi",
    "https://icarus-2.github.io/monero-ocean",
    ""
  )},

  
  //ElliptiKeys
  {path: "projects/elliptikeys", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/elliptikeys.webp",
    "projects.elliptiKeys",
    "https://elliptikeys.github.io/",
    ""
  )},

  
  //HG Pizza
  {path: "projects/hella-good-pizza-site", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/hgpizza.webp",
    "projects.hellaGoodPizza",
    "https://github.com/ICARUS-2/Web3Project",
    ""
  )},
  
  //Matte Storefront
  {path: "projects/matte-storefront", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/mattestorefront.webp",
    "projects.matteStorefront",
    "/assets/downloads/MatteWebApplication.zip",
    ""
  )},

  //MYVC App
  {path: "projects/myvc-app", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/myvc-app.webp",
    "projects.myvcApp",
    "https://github.com/ICARUS-2/COMP353-Projects/tree/main/MainProject/MYVCApp",
    ""
  )},

  //TNNF BudgetViewer
  {path: "projects/tnnf-budgetviewer", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/tnnfbudget.webp",
    "projects.tnnfBudgetViewer",
    "https://github.com/ICARUS-2/AppDevProject",
    ""
  )},

  //XvB_GUI
  {path: "projects/xvb-gui", component: ProjectInfoComponent, data: new ProjectInfoModel(
      "../../../assets/img/projects/xvb-gui.webp",
      "projects.xvbGui",
      "https://github.com/ICARUS-2/XvB_GUI",
      ""
    )
  },
  
  //TNNFContainers
  {path: "projects/tnnfcontainers-iot-system", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/tnnfcontainers.webp",
    "projects.tnnfContainers",
    "/assets/downloads/course-project-tnnf-main.zip",
    ""
    )
  },
  
  //WaveDodger
  {path: "projects/wavedodger", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/wavedodger.webp",
    "projects.waveDodger",
    "/assets/downloads/WaveDodger-1.12.zip",
    ""
  )},
    
  //WaveDodger II
  {path: "projects/wavedodger2", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/wavedodger2.webp",
    "projects.waveDodger2",
    "https://github.com/ICARUS-2/wavedodger2",
    ""
  )
  },
  
  //SlimeDodger
  {path: "projects/slimedodger", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/slimedodger.webp",
    "projects.slimeDodger",
    "/games/SlimeDodger/",
    ""
  )
  },
  
  //Video Poker
  {path: "projects/video-poker", component: ProjectInfoComponent, data: new ProjectInfoModel(
    "../../../assets/img/projects/video-poker.webp",
    "projects.videoPoker",
    "/assets/downloads/VideoPoker.zip",
    ""
  )
  },

  //redirect old site
  {path: 'en', redirectTo: ""},
  {path: 'fr', redirectTo: ""},
  {path: 'en/contact', redirectTo: "contact"},
  {path: 'fr/contact', redirectTo: "contact"},
  {path: 'en/projects', redirectTo: "projects"},
  {path: 'fr/projects', redirectTo: "projects"},

  {path: '**', redirectTo: ""},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
