const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

document.addEventListener('DOMContentLoaded', () =>
{
    if (localStorage.getItem(LOGIN_KEY))
    {
        window.location.href = "../dashboard/";
    }
})

function ValidateInput()
{
    let loginBox = document.getElementsByClassName("loginBox")[0];
    let loginInfoBox = document.getElementsByClassName('loginInfoBox')[0];

    let inputAddr = loginBox.value;
    if ((inputAddr.length != MONERO_ADDR_LENGTH && inputAddr.length != MONERO_INTEGR_ADDR_LENGTH) || (!inputAddr.startsWith('4') && !inputAddr.startsWith('8')))
    {
        alert("That's not a valid Monero address!");
        return false;
    }
    else
    {
        loginInfoBox.style.color = "lightgreen"
        loginInfoBox.innerHTML = "Loading dashboard..."
        window.localStorage.setItem(LOGIN_KEY, inputAddr);
        window.localStorage.setItem(THEME_KEY, 0);
        window.localStorage.setItem(REFRESH_KEY, 0);
        window.location.href = "../dashboard/";
        return true;
    }
}
