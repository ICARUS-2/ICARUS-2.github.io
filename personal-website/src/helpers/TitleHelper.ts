export default class TitleHelper
{
    static BASE_TITLE: string = "Ethan Briffett"

    static concat(title: string = "")
    {
        return title + " | " + this.BASE_TITLE;
    }
}