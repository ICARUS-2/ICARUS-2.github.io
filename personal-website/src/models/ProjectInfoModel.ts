export default class ProjectInfoModel
{
    backgroundImageSource: string = "";
    translationKey: string="";
    btnHref: string = "";
    btnRouterLink: string = "";

    constructor(
        backgroundImageSource: string = "", 
        translationKey: string="",
        btnHref: string = "",
        btnRouterLink: string = "")
    {
        this.backgroundImageSource = backgroundImageSource;
        this.translationKey = translationKey; 
        this.btnHref = btnHref;
        this.btnRouterLink = btnRouterLink;
    }
}