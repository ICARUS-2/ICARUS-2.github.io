const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const LOGIN_KEY = 'MO_ALT_LOGIN';

document.addEventListener('DOMContentLoaded', () =>
{
    if (localStorage.getItem(LOGIN_KEY))
    {
        window.location.href = "./dashboard.html";
    }
})

function ValidateInput()
{
    //let loginButton = document.getElementsByClassName("loginButton")[0];
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
        window.location.href = "./dashboard.html";
        return true;
    }
}
