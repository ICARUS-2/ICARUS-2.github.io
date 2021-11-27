const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

const CONNECTED_MINER_CHART_URL = "https://api.moneroocean.stream/pool/chart/miners"

let refreshInterval;
let clearRefreshId;

document.addEventListener("DOMContentLoaded", () =>
{
    CheckAddress();
    SetEventListeners();
    InitializeTheme();
    RetrieveAndSetChartData();
});

async function RetrieveAndSetChartData()
{
    let responseObj = await FetchJson(CONNECTED_MINER_CHART_URL);
    
    SetHeader(responseObj);
    DrawChart(responseObj);
}

function SetHeader(responseObj)
{
    let header = document.getElementsByClassName("connectedMinerChartHeader")[0];
    let change24hElement = document.getElementsByClassName("connectedMinerChartDiff")[0];
    
    let connectedAccounts = responseObj[0].cn;
    let connectedAccounts24HAgo = responseObj[responseObj.length-1].cn

    header.innerHTML = "Connected Addresses : " + connectedAccounts;

    if (connectedAccounts > connectedAccounts24HAgo)
    {
        let percentage = ((connectedAccounts / connectedAccounts24HAgo * 100) - 100).toFixed(2)

        change24hElement.style.color = "lightgreen";
        change24hElement.innerHTML = "&nbsp↑" + " " + percentage + "%"
    }
    else
    {
        let percentage = ((connectedAccounts24HAgo / connectedAccounts * 100) - 100).toFixed(2)


        change24hElement.style.color = "red";
        change24hElement.innerHTML = "&nbsp↓" + " " + percentage + "%"
    }
}

function DrawChart(responseObj)
{
    let seed = GetData(responseObj);

    const dataObj = {
        labels: seed.labels,
        datasets: [{
          label: '24H Connected Accounts',
          data: seed.array,
          fill: false,
          borderColor: 'cyan',
        }]
      };

    const config = {
        type: 'line',
        data: dataObj,
          scales: {
            y: { // defining min and max so hiding the dataset does not change scale range
              min: seed.min,
              max: seed.max
            }
          }
        
      };

    let context = document.getElementsByClassName("connectedMinerChartCanvas")[0].getContext('2d');

    const chart = new Chart(context, config);

    console.log(seed.array)
}

function GetData(responseObj)
{
    let arr = [];
    let labels = [];
    let min = 0;
    let max = Number.MAX_SAFE_INTEGER;
    
    const SAMPLING_INTERVAL = 20;

    responseObj.forEach((item, index) =>
        {
            if(index % SAMPLING_INTERVAL != 0)
                return

            if(index == 0)
            {
                labels.push("24H")
            }
            else if(index == responseObj.length - 1)
            {
                labels.push("NOW")
            }
            else
            {
                labels.push("")
            }

            if (item.cn > max)
            {
                max = item.cn
            } 

            if (item.cn < min)
            {
                min = item.cn;
            }
            arr.push(item.cn);
        })
    
    return {array : arr.reverse(), min, max, labels}
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

function SetEventListeners()
{
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
        window.location.href = "../../"
    })

    let backButton = document.getElementsByClassName("connectedMinerChartBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../../dashboard";
    })    

    let refreshButton = document.getElementsByClassName("connectedMinerChartFetchButton")[0]
    refreshButton.addEventListener("click", RetrieveAndSetChartData);
}

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("connectedMinerChartBackButton")[0];
    let canvas = document.getElementsByClassName("connectedMinerChartCanvas")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("connectedMinerChartFetchButton")[0];

    signInButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signInButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    signOutButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signOutButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    backButton.removeEventListener("mouseover", ButtonHoverInTheme);
    backButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    refreshButton.removeEventListener("mouseover", ButtonHoverInTheme);
    refreshButton.removeEventListener("mouseout", ButtonHoverOutTheme);

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

                refreshButton.style.backgroundColor = "";
                refreshButton.style.borderColor = "";

                canvas.style.backgroundColor = "";
                canvas.style.borderColor = "";
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

                refreshButton.addEventListener("mouseover", ButtonHoverInTheme);
                refreshButton.addEventListener("mouseout", ButtonHoverOutTheme);
            
                document.body.style.backgroundColor = bgColor;
                
                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;

                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                refreshButton.style.backgroundColor = bgColor;
                refreshButton.style.borderColor = bordColor;

                canvas.style.backgroundColor = bgColor;
                canvas.style.borderColor = bordColor;
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

                refreshButton.addEventListener("mouseover", ButtonHoverInTheme);
                refreshButton.addEventListener("mouseout", ButtonHoverOutTheme);

                document.body.style.backgroundColor = bodyColor;

                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;
                    
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                refreshButton.style.backgroundColor = bgColor;
                refreshButton.style.borderColor = bordColor;

                canvas.style.backgroundColor = bgColor;
                canvas.style.borderColor = bordColor;
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

            refreshButton.addEventListener("mouseover", ButtonHoverInTheme);
            refreshButton.addEventListener("mouseout", ButtonHoverOutTheme);

            document.body.style.backgroundColor = bodyColor;

            signInButton.style.backgroundColor = bgColor;
            signInButton.style.borderColor = bordColor;
                
            signOutButton.style.backgroundColor = bgColor;
            signOutButton.style.borderColor = bordColor;

            backButton.style.backgroundColor = bgColor;
            backButton.style.borderColor = bordColor;

            refreshButton.style.backgroundColor = bgColor;
            refreshButton.style.borderColor = bordColor;

            canvas.style.backgroundColor = bgColor;
            canvas.style.borderColor = bordColor;
        }
        break;
    }
}

function ButtonHoverInTheme(event)
{
    let backButton = document.getElementsByClassName("connectedMinerChartBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("connectedMinerChartFetchButton")[0];

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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "blue";
                    break;
                
                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "blue";
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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "rgb(0,85,165)";
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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "rgb(255,0,255)";
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
    let backButton = document.getElementsByClassName("connectedMinerChartBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("connectedMinerChartFetchButton")[0];

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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "black";
                    break;

                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "black";
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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "rgb(4,0,50)";
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

                case "connectedMinerChartBackButton":
                    backButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "connectedMinerChartFetchButton":
                    refreshButton.style.backgroundColor = "rgb(85,0,85)";
                    break;
            }
            break;

        default:
            //
            break;
    }
}

async function FetchJson(url)
{
    let res = await fetch(url);

    return res.json();
}

function LogError(msg)
{
    let main = document.getElementsByClassName("connectedMinerChartPageMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    document.getElementsByClassName("selectThemeDiv")[0].style.display = "none";
    document.getElementsByClassName("selectRefreshDiv")[0].style.display = "none";
    throw new Error();
}
