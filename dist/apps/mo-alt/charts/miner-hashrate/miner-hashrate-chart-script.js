const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

let minerHashratesChartURL;
let addr;

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
    let responseObj = await FetchJson(minerHashratesChartURL);
    let seed = GetData(responseObj);
    SetHeader(seed);
    DrawChart(seed);
}

function SetHeader(seed)
{
    let header = document.getElementsByClassName("minerHashratesChartHeader")[0];
    header.innerHTML = "Average 24H Pay Hashrate: " + ParseHashrate(seed.average);
}

function DrawChart(seed)
{
    const dataObj = {
        labels: seed.labels,
        datasets: [{
          label: '24H Total Pay Hashrate',
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

    let context = document.getElementsByClassName("minerHashratesChartCanvas")[0].getContext('2d');

    const chart = new Chart(context, config);
}

function GetData(responseObj)
{
    let arr = [];
    let labels = [];
    let min = 0;
    let max = Number.MAX_SAFE_INTEGER;

    let payHashrateAccumulator = 0;
    
    const SAMPLING_INTERVAL = 20;

    responseObj.forEach((item, index) =>
        {
            payHashrateAccumulator += item.hs2;

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

            if (item.hs2 > max)
            {
                max = item.hs2
            } 

            if (item.hs2 < min)
            {
                min = item.hs2;
            }
            arr.push(item.hs2);
        })
    
    return {array : arr.reverse(), min, max, labels, average : payHashrateAccumulator / responseObj.length}
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

    minerHashratesChartURL = "https://api.moneroocean.stream/miner/" + addr + "/chart/hashrate"
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

    let backButton = document.getElementsByClassName("minerHashratesChartBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../../dashboard/";
    })    

    let refreshButton = document.getElementsByClassName("minerHashratesChartFetchButton")[0]
    refreshButton.addEventListener("click", RetrieveAndSetChartData);
}

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("minerHashratesChartBackButton")[0];
    let canvas = document.getElementsByClassName("minerHashratesChartCanvas")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("minerHashratesChartFetchButton")[0];

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
    let backButton = document.getElementsByClassName("minerHashratesChartBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("minerHashratesChartFetchButton")[0];

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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "blue";
                    break;
                
                case "minerHashratesChartFetchButton":
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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "minerHashratesChartFetchButton":
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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "minerHashratesChartFetchButton":
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
    let backButton = document.getElementsByClassName("minerHashratesChartBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let refreshButton = document.getElementsByClassName("minerHashratesChartFetchButton")[0];

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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "black";
                    break;

                case "minerHashratesChartFetchButton":
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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "minerHashratesChartFetchButton":
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

                case "minerHashratesChartBackButton":
                    backButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "minerHashratesChartFetchButton":
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

function ParseHashrate(hashrateStr)
{
    let kh = 1000;
    let mh = 1000000;
    let gh = 1000000000;
    let th = 1000000000000;

    let hashrate = Number(hashrateStr);

    if (isNaN(hashrate) || hashrate < 1)
        return "0H/S"

    if (hashrate >= th)
    {
        let temp = hashrate / th;
        temp = temp.toFixed(2);
        return temp + " TH/s";
    }
    else if (hashrate >= gh)
    {
        let temp = hashrate / gh;
        temp = temp.toFixed(2);
        return temp + " GH/s";
    }
    else if (hashrate >= mh)
    {
        let temp = hashrate / mh;
        temp = temp.toFixed(2);
        return temp + " MH/s";
    }
    else if (hashrate >= kh)
    {
        let temp = hashrate / kh
        temp = temp.toFixed(2);
        return temp + " KH/s";
    }
    else 
    {
        hashrate = hashrate.toFixed(2);
        return hashrate + " H/s";
    }
}

function LogError(msg)
{
    let main = document.getElementsByClassName("minerHashratesChartPageMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    document.getElementsByClassName("selectThemeDiv")[0].style.display = "none";
    document.getElementsByClassName("selectRefreshDiv")[0].style.display = "none";
    throw new Error();
}
