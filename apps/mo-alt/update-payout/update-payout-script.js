const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;

const MIN_THRESHOLD = 0.0030;
const MAX_THRESHOLD = 1000;

const API_URL = "https://api.moneroocean.stream/"

let addr
let inputField;
let additionalInfoField;
let backButton;
let submitButton;
let userObj;

document.addEventListener('DOMContentLoaded', () =>
{
    CheckAddress();

    let signedInAs = document.getElementsByClassName('placeholder')[0];
    let signOutButton = document.getElementsByClassName('signOutButton')[0];
    signOutButton.style.display = "none";
    signedInAs.addEventListener("click", () => 
    {
        if(signOutButton.style.display == "none")
        {
            signOutButton.style.display = "block";
        }
        else
        {
            signOutButton.style.display = "none";
        }
    })
    signOutButton.addEventListener("click", () =>
    {
        window.localStorage.removeItem(LOGIN_KEY);
        window.localStorage.removeItem(THEME_KEY);
        window.localStorage.removeItem(REFRESH_KEY);
        window.location.href = "../login/"
    })

    addr = window.localStorage.getItem(LOGIN_KEY);
    inputField = document.getElementsByClassName("thresholdBox")[0];
    inputField.addEventListener("change", HandleInputChanged)

    backButton = document.getElementsByClassName("updatePayoutBackButton")[0];
    backButton.addEventListener("click", ()=> window.location="../dashboard");

    additionalInfoField = document.getElementsByClassName("payoutInputAdditionalInfo")[0];

    submitButton = document.getElementsByClassName("updateThresholdButton")[0];
    submitButton.addEventListener("click", HandleUpdateButtonPressed);

    DisplayCurrentThreshold();
})

async function DisplayCurrentThreshold()
{
    userObj = await FetchJson(API_URL + "user/" + addr)
    document.getElementsByClassName("currentPayoutThreshold")[0].innerHTML = "Current Threshold: " + userObj.payout_threshold / 1000000000000 + " XMR"
}

function HandleInputChanged()
{
    let input = inputField.value;

    if (CheckValidPayoutThreshold(input))
    {
        additionalInfoField.innerHTML = "";
    }
    else
    {
        additionalInfoField.style.color = "red"
        additionalInfoField.innerText = `Please enter a number between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`;
    }

    console.log(input);
}

async function HandleUpdateButtonPressed()
{
    let input = inputField.value;

    if (!CheckValidPayoutThreshold(input))
        return;

    let result = await fetch("https://api.moneroocean.stream/user/updateThreshold", {
        "headers": {
          "content-type": "application/json",
        },
        "body": `{\"username\":\"${addr}\",\"threshold\":${input}}`,
        "method": "POST",
      });

    if(result.ok && result.status == 200)
    {
        alert(`Payout successfully updated from ${userObj.payout_threshold / 1000000000000} to ${input} XMR`)
    }
    else
    {
        alert(`The update failed because an error occurred. Error code ${result.status}`)
    }
    window.location.href = "../dashboard";
}

function StringIsNumeric(str)
{
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}

function CheckValidPayoutThreshold(payout)
{
    if (payout == "")
        return false;

    if (!StringIsNumeric(payout))
        return false;

    return payout >= MIN_THRESHOLD;
}

async function FetchJson(url)
{
    let res = await fetch(url);

    return res.json();
}

function CheckAddress()
{        
    addr = window.localStorage.getItem(LOGIN_KEY);

    if (!addr)
    {
        LogError("Client-side error has occured: No address provided");
    }

    if ((addr.length != MONERO_ADDR_LENGTH && addr.length != MONERO_INTEGR_ADDR_LENGTH) || (!addr.startsWith('4') && !addr.startsWith('8')))
    {
        LogError("Client-side error has occured: Invalid address format");
    }
    else
    {
        let signedInAs = document.getElementsByClassName('placeholder')[0];
        signedInAs.innerHTML = "Signed in as " + addr.substr(0,5) + "...";
    }
}

function LogError(msg)
{
    let main = document.getElementsByClassName("updatePayoutMain")[0];
    main.innerHTML = msg;
    main.style.color = "white"
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    throw new Error();
}