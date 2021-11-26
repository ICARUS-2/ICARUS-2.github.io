const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

const EXCHANGE_DECIMALS = 4;

const poolStatsURL = "https://api.moneroocean.stream/pool/stats"

let refreshInterval;
let clearRefreshId;

document.addEventListener("DOMContentLoaded", () =>
{
    CheckAddress();
    SetEventListeners();
    SetRefreshRate();

    RetrieveAndSetExchangeRates();
});

async function RetrieveAndSetExchangeRates()
{
    let statsObj = await FetchJson(poolStatsURL);
    let xmrPriceUsd = statsObj.pool_statistics.price.usd;
    let xmrPriceEur = statsObj.pool_statistics.price.eur;
    let xmrPriceBtc = statsObj.pool_statistics.price.btc;

    let table = document.getElementsByClassName("exchangeRatesTable")[0];
    table.innerHTML = "";

    let index = {value : 0}

    let btcPriceMultiplier = 1 / xmrPriceBtc;

    InsertIntoERTable(index, "Pairing", "Value", true)

    InsertIntoERTable(index, "XMR -> USD", "$"+xmrPriceUsd.toFixed(EXCHANGE_DECIMALS));
    InsertIntoERTable(index, "XMR -> EUR", "€"+xmrPriceEur.toFixed(EXCHANGE_DECIMALS));
    InsertIntoERTable(index, "XMR -> BTC", "₿"+xmrPriceBtc.toFixed(10), true);

    InsertIntoERTable(index, "BTC -> USD", "$"+(xmrPriceUsd*btcPriceMultiplier).toFixed(EXCHANGE_DECIMALS));
    InsertIntoERTable(index, "BTC -> EUR", "€"+(xmrPriceEur*btcPriceMultiplier).toFixed(EXCHANGE_DECIMALS))
    InsertIntoERTable(index, "BTC -> XMR", "XMR"+(btcPriceMultiplier).toFixed(EXCHANGE_DECIMALS), true);

    InsertIntoERTable(index, "USD -> EUR", "€"+(xmrPriceEur/xmrPriceUsd).toFixed(EXCHANGE_DECIMALS));
    InsertIntoERTable(index, "EUR -> USD", "$"+(xmrPriceUsd/xmrPriceEur).toFixed(EXCHANGE_DECIMALS));
}

async function InsertIntoERTable(index, pairing, value, spacer = false)
{
    let table = document.getElementsByClassName("exchangeRatesTable")[0];
    let row = table.insertRow(index.value);
    let coinPairCell = row.insertCell(0);
    let rateCell = row.insertCell(1);

    coinPairCell.innerHTML = pairing;
    rateCell.innerHTML = value;

    if (spacer)
    {
        index.value++;
        let spacerRow = table.insertRow(index.value);
        spacerRow.classList.add("exchangeRatesBlankTableRow")
        spacerRow.innerHTML = ""
    }

    index.value++;
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
        window.location.href = "../"
    })

    let backButton = document.getElementsByClassName("exchangeRatesBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../dashboard";
    })    
}

function SetRefreshRate()
{
    let selectedIdx = window.localStorage.getItem(REFRESH_KEY);

    switch(Number(selectedIdx))
    {
        case 0:
            refreshInterval = 5000;
            break;

        case 1:
            refreshInterval = 15000;
            break;

        case 2:
            refreshInterval = 30000;
            break;

        case 3:
            refreshInterval = 60000;
            break;

        default:
            LogError("Refresh rate not defined, try clearing browser data");
            break;
    }

    if (clearRefreshId)
        window.clearInterval(clearRefreshId);

    clearRefreshId = window.setInterval(RetrieveAndSetExchangeRates, refreshInterval);
}


async function FetchJson(url)
{
    let res = await fetch(url);

    return res.json();
}