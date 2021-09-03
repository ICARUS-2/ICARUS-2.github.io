const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;

function ValidateInput()
{
    //let loginButton = document.getElementsByClassName("loginButton")[0];
    let loginBox = document.getElementsByClassName("loginBox")[0];
    let loginInfoBox = document.getElementsByClassName('loginInfoBox')[0];

    let inputAddr = loginBox.value;
    if ((inputAddr.length != MONERO_ADDR_LENGTH && inputAddr.length != MONERO_INTEGR_ADDR_LENGTH) || (!inputAddr.startsWith('4') && !inputAddr.startsWith('8')))
    {
        //loginInfoBox.style.color = "red";
        //loginInfoBox.innerHTML = "That's not a valid address!"
        alert("That's not a valid Monero address!");
        return false;
    }
    else
    {
        loginInfoBox.style.color = "lightgreen"
        loginInfoBox.innerHTML = "Loading dashboard..."
        return true;
    }
}
