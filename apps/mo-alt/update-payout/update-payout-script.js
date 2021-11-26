const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;

const MIN_THRESHOLD = 0.0030;
const MAX_THRESHOLD = 1000;

const TX_FEES = [0.0004, 0.0003, 0.0002, 0.0001]
const THRESHOLDS = [0.5026, 1.5018, 2.5011, 3.5003]

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

    InitializeTheme();
    DisplayCurrentThreshold();
})

async function DisplayCurrentThreshold()
{
    userObj = await FetchJson(API_URL + "user/" + addr)
    document.getElementsByClassName("currentPayoutThreshold")[0].innerHTML = "Current Threshold: " + userObj.payout_threshold / 1000000000000 + " XMR"
}

function getFeeFromThreshold(threshold)
{
    if (threshold > THRESHOLDS[THRESHOLDS.length - 1])
        return {fee : 0, percentage : 0}

    for (let i = 0; i < THRESHOLDS.length; i++)
    {
        if (threshold > THRESHOLDS[i])
            continue;
        else
        {
            return {fee : TX_FEES[i], percentage : TX_FEES[i] / threshold * 100}
        }
    }
}

function HandleInputChanged()
{
    let input = inputField.value;

    if (CheckValidPayoutThreshold(input))
    {
            let fees = getFeeFromThreshold(input)
            additionalInfoField.style.color = "lightgreen"
            additionalInfoField.innerHTML = `Payout fee: ${fees.fee} XMR (${fees.percentage.toFixed(4)} %)`;
    }
    else
    {
        additionalInfoField.style.color = "red"
        additionalInfoField.innerText = `Please enter a number between ${MIN_THRESHOLD} and ${MAX_THRESHOLD}`;
    }
}

async function HandleUpdateButtonPressed()
{
    let input = inputField.value;

    if (!CheckValidPayoutThreshold(input))
        return;

    if (Number(input) * 1000000000000 == userObj.payout_threshold)
    {
        additionalInfoField.style.color = "red";
        additionalInfoField.innerHTML = "New threshold can't be the same as the old one!"
        return;
    }

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

    return payout >= MIN_THRESHOLD && payout <= MAX_THRESHOLD;
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

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("updatePayoutBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let updateButton = document.getElementsByClassName("updateThresholdButton")[0];

    signInButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signInButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    signOutButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signOutButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    backButton.removeEventListener("mouseover", ButtonHoverInTheme);
    backButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    updateButton.removeEventListener("mouseover", ButtonHoverInTheme);
    updateButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    switch (idx)
    {
        case 0:
            {
                document.body.style.backgroundColor = "";

                signInButton.style.backgroundColor = "";
                signInButton.style.borderColor = "";

                signOutButton.style.backgroundColor = "";
                signOutButton.style.borderColor = "";

                backButton.style.backgroundColor = "";
                backButton.style.borderColor = "";

                updateButton.style.backgroundColor = "";
                updateButton.style.borderColor = ""

                inputField.style.backgroundColor = "";
                inputField.style.borderColor = "";
            }
            break;

        case 1:
            {
                let bgColor = "black";
                let bordColor = "blue";

                signInButton.addEventListener("mouseover", ButtonHoverInTheme)
                signInButton.addEventListener("mouseout", ButtonHoverOutTheme)
            
                signOutButton.addEventListener("mouseover", ButtonHoverInTheme)
                signOutButton.addEventListener("mouseout", ButtonHoverOutTheme)
            
                backButton.addEventListener("mouseover", ButtonHoverInTheme);
                backButton.addEventListener("mouseout", ButtonHoverOutTheme);
            
                updateButton.addEventListener("mouseover", ButtonHoverInTheme);
                updateButton.addEventListener("mouseout", ButtonHoverOutTheme);

                document.body.style.backgroundColor = bgColor;
                
                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;

                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                updateButton.style.backgroundColor = bgColor;
                updateButton.style.borderColor = bordColor;

                inputField.style.backgroundColor = bgColor;
                inputField.style.borderColor = bordColor;
            }
            break;

        case 2: 
            {
                let bodyColor = "rgb(4, 0, 32)";
                let bgColor = "rgb(4,0,50)";
                let bordColor = "rgb(0,85,165)";

                signInButton.addEventListener("mouseover", ButtonHoverInTheme)
                signInButton.addEventListener("mouseout", ButtonHoverOutTheme)
            
                signOutButton.addEventListener("mouseover", ButtonHoverInTheme)
                signOutButton.addEventListener("mouseout", ButtonHoverOutTheme)
            
                backButton.addEventListener("mouseover", ButtonHoverInTheme);
                backButton.addEventListener("mouseout", ButtonHoverOutTheme);

                updateButton.addEventListener("mouseover", ButtonHoverInTheme);
                updateButton.addEventListener("mouseout", ButtonHoverOutTheme);

                document.body.style.backgroundColor = bodyColor;

                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;
                    
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                updateButton.style.backgroundColor = bgColor;
                updateButton.style.borderColor = bordColor;

                inputField.style.backgroundColor = bgColor;
                inputField.style.borderColor = bordColor;
            }
            break;

        case 3:          
        {  
            let bodyColor = "rgb(30, 0, 30)";
            let bgColor = "rgb(85, 0, 85)";
            let bordColor = "rgb(255, 0, 255)";

            signInButton.addEventListener("mouseover", ButtonHoverInTheme)
            signInButton.addEventListener("mouseout", ButtonHoverOutTheme)
        
            signOutButton.addEventListener("mouseover", ButtonHoverInTheme)
            signOutButton.addEventListener("mouseout", ButtonHoverOutTheme)
        
            backButton.addEventListener("mouseover", ButtonHoverInTheme);
            backButton.addEventListener("mouseout", ButtonHoverOutTheme);

            updateButton.addEventListener("mouseover", ButtonHoverInTheme);
            updateButton.addEventListener("mouseout", ButtonHoverOutTheme);

            document.body.style.backgroundColor = bodyColor;

            signInButton.style.backgroundColor = bgColor;
            signInButton.style.borderColor = bordColor;
                
            signOutButton.style.backgroundColor = bgColor;
            signOutButton.style.borderColor = bordColor;

            backButton.style.backgroundColor = bgColor;
            backButton.style.borderColor = bordColor;

            updateButton.style.backgroundColor = bgColor;
            updateButton.style.borderColor = bordColor;

            inputField.style.backgroundColor = bgColor;
            inputField.style.borderColor = bordColor;
        }
        break;
    }
}

function ButtonHoverInTheme(event)
{
    let backButton = document.getElementsByClassName("updatePayoutBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let updateButton = document.getElementsByClassName("updateThresholdButton")[0];


    let idx = Number(window.localStorage.getItem(THEME_KEY));

    switch(idx)
    {
        case 1:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "blue";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "blue";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "blue";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "blue";
                    break;
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "rgb(0,85,165)";
                    break;  
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "rgb(255,0,255)";
                    break;  
            }
            break;

        default:
            //
            break;
    }
}

function ButtonHoverOutTheme(event)
{
    let backButton = document.getElementsByClassName("updatePayoutBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let updateButton = document.getElementsByClassName("updateThresholdButton")[0];

    let idx = Number(window.localStorage.getItem(THEME_KEY));

    switch(idx)
    {
        case 1:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "black";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "black";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "black";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "black";
                    break;  
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "rgb(4,0,50)";
                    break;  
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "placeholder":
                    signInButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "updatePayoutBackButton":
                    backButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "updateThresholdButton":
                    updateButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;  
            }
            break;

        default:
            //
            break;
    }
}