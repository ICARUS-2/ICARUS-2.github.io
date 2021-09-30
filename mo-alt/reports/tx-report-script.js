const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

let baseUrl = "https://api.moneroocean.stream/";

document.addEventListener("DOMContentLoaded", PreparePage)

function PreparePage()
{
    CheckAddress();
    SetEventListeners();
    InitializeTheme();
    RetrieveAndSetTransactionData();
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
    let main = document.getElementsByClassName("txReportMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    throw new Error();
}

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("txReportBackButton")[0];
    let refreshButton = document.getElementsByClassName("txReportRefreshButton")[0];
    let txTable = document.getElementsByClassName("txReportTable")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];

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

                txTable.style.backgroundColor = "";
                txTable.style.borderColor = "";
            }
            break;

        case 1:
            {
                let bgColor = "black";
                let bordColor = "blue";

                document.body.style.backgroundColor = bgColor;
                
                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;

                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;
            
                refreshButton.style.backgroundColor = bgColor;
                refreshButton.style.borderColor = bordColor;

                txTable.style.backgroundColor = bgColor;
                txTable.style.borderColor = bordColor;
            }
            break;

        case 2: 
            {
                let bodyColor = "rgb(4, 0, 32)";
                let bgColor = "rgb(4,0,50)";
                let bordColor = "rgb(0,85,165)";

                document.body.style.backgroundColor = bodyColor;

                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;
                    
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;
            
                refreshButton.style.backgroundColor = bgColor;
                refreshButton.style.borderColor = bordColor;

                txTable.style.backgroundColor = bgColor;
                txTable.style.borderColor = bordColor;
            }
            break;

        case 3:          
        {  
            let bodyColor = "rgb(30, 0, 30)";
            let bgColor = "rgb(85, 0, 85)";
            let bordColor = "rgb(255, 0, 255)";

            document.body.style.backgroundColor = bodyColor;

            signInButton.style.backgroundColor = bgColor;
            signInButton.style.borderColor = bordColor;
                
            signOutButton.style.backgroundColor = bgColor;
            signOutButton.style.borderColor = bordColor;

            backButton.style.backgroundColor = bgColor;
            backButton.style.borderColor = bordColor;
        
            refreshButton.style.backgroundColor = bgColor;
            refreshButton.style.borderColor = bordColor;

            txTable.style.backgroundColor = bgColor;
            txTable.style.borderColor = bordColor;
        }
        break;
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
        window.location.href = "../login.html"
    })

    let backButton = document.getElementsByClassName("txReportBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../dashboard.html";
    })

    let refreshButton = document.getElementsByClassName("txReportRefreshButton")[0];
    refreshButton.addEventListener("click", ()=>
    {
        RetrieveAndSetTransactionData();
    })
}

async function RetrieveAndSetTransactionData()
{
    let apiPath = baseUrl + "miner/" + window.localStorage.getItem(LOGIN_KEY) + "/payments";
    let txData = await FetchJson(apiPath);

    let table = document.getElementsByClassName("txReportTable")[0];

    table.innerHTML = "";

    let header = table.insertRow(0);
    let timeStampHeader = header.insertCell(0);
    let amountHeader = header.insertCell(1);
    let hashHeader = header.insertCell(2);

    timeStampHeader.innerHTML = "Timestamp";
    amountHeader.innerHTML = "Amount Paid";
    hashHeader.innerHTML = "Transaction Hash"

    let totalPaid = 0;

    for (let i = 0; i < txData.length; i++)
    {
        let row = table.insertRow(i + 1);

        let timestampCell = row.insertCell(0);
        let amountCell = row.insertCell(1);
        let hashCell = row.insertCell(2);

        timestampCell.innerHTML = (UnixTSToDate(txData[i].ts)).split("y, ")[1].replace(',', '').replace(',', '');;
        amountCell.innerHTML = (txData[i].amount / 1000000000000).toString().substr(0,7);
        
        hashCell.innerHTML = txData[i].txnHash.toString().substr(0, 14) + "...";

        totalPaid += txData[i].amount / 1000000000000
    }

    document.getElementsByClassName("totalTXInfo")[0].innerHTML = `Payout Count: ${txData.length} -> Total XMR Paid: ${totalPaid.toFixed(6)}`
}

async function FetchJson(url)
{
    let res = await fetch(url);

    return res.json();
}

function UnixTSToDate(unix_timestamp)
{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let d = new Date(0);
    d.setUTCSeconds(unix_timestamp);
    return d.toLocaleTimeString("en-us",options)
}