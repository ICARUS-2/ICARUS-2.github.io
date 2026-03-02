export default class LocalStorageHelper
{
    static SITE_NAME: string="icarus-2.github.io-lang"
    static getLang() : string | null
    {
        return window.localStorage.getItem(this.SITE_NAME)
    }

    static setLang(val: string)
    {
        window.localStorage.setItem(this.SITE_NAME, val)
    }
}