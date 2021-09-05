const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
document.addEventListener("DOMContentLoaded", PreparePage)

//Top stat displays
let networkHashrateDisplay;
let poolHashrateDisplay;
let poolBlocksFoundDisplay;
let blockEffortDisplay;
let blockchainHeightDisplay;

//Miner hashrate displays
let payHashrateDisplay;
let rawHashrateDisplay;

//Connected miner displays
let addressMinerCountDisplay;
let poolMinerCountDisplay;

//Balance displays
let pendingBalanceDisplay;
let totalXMRPaidDisplay;
let transactionCountDisplay;

//Exchange rate displays
let fiatERDisplay;
let bitcoinERDisplay;
let ethereumERDisplay;

let addr;

let refreshInterval = 5000;

let baseUrl = "https://api.moneroocean.stream/"

function PreparePage()
{
    CheckAddress();
    GetDisplays();

    let displays = document.getElementsByClassName("display");
    for (let d of displays)
    {
        d.style.color = "lightgreen";
    }

    RefreshStats();
    window.setInterval(RefreshStats, refreshInterval)
}

function CheckAddress()
{        
    let main = document.getElementsByClassName("dashboardPageMain")[0]
    if (!window.location.toString().includes("?addr="))
    {
        main.innerHTML = "Client-side error has occurred: Address not found";
        throw new Error();
    }
    else
    {
        addr = window.location.toString().split("=")[1];
        if ((addr.length != MONERO_ADDR_LENGTH && addr.length != MONERO_INTEGR_ADDR_LENGTH) || (!addr.startsWith('4') && !addr.startsWith('8')))
        {
            main.innerHTML = "Client-side error has occured: Invalid login";
            throw new Error();
        }
        else
        {
            let signedInAs = document.getElementsByClassName('placeholder')[0];
            signedInAs.innerHTML = "Signed in as " + addr.substr(0,5) + "...";
        }
    }
}

function GetDisplays()
{
    //Top stats
    networkHashrateDisplay = document.getElementsByClassName("networkHashrateDisplay")[0];
    poolHashrateDisplay = document.getElementsByClassName("poolHashrateDisplay")[0];
    poolBlocksFoundDisplay = document.getElementsByClassName("poolBlocksFoundDisplay")[0];
    blockEffortDisplay = document.getElementsByClassName("blockEffortDisplay")[0];
    blockchainHeightDisplay = document.getElementsByClassName("blockchainHeightDisplay")[0];

    //Miner hashrates
    payHashrateDisplay = document.getElementsByClassName("payHashrateDisplay")[0];
    rawHashrateDisplay = document.getElementsByClassName("rawHashrateDisplay")[0];

    //Connected miners
    addressMinerCountDisplay = document.getElementsByClassName("addressActiveMinersDisplay")[0];
    poolMinerCountDisplay = document.getElementsByClassName("poolActiveMinersDisplay")[0];

    //Balances
    pendingBalanceDisplay = document.getElementsByClassName("pendingBalanceDisplay")[0];
    totalXMRPaidDisplay = document.getElementsByClassName("totalXMRPaidDisplay")[0];
    transactionCountDisplay = document.getElementsByClassName("transactionCountDisplay")[0];

    //Exchange rates
    fiatERDisplay = document.getElementsByClassName("fiatExchangeRateDisplay")[0];
    bitcoinERDisplay = document.getElementsByClassName("btcExchangeRateDisplay")[0];
    ethereumERDisplay = document.getElementsByClassName("ethExchangeRateDisplay")[0];
}


async function RefreshStats()
{
    let minerStatsUrl = baseUrl;
    minerStatsUrl += "miner/" + addr + "/stats";
    let poolStatsUrl = "https://api.moneroocean.stream/pool/stats";
    let networkStatsUrl = "https://api.moneroocean.stream/network/stats";

    let networkStatsObj = await FetchJson(networkStatsUrl);
    let minerStatsObj = await FetchJson(minerStatsUrl);
    let poolStatsObj = await FetchJson(poolStatsUrl);

    UpdateTopStats(networkStatsObj, poolStatsObj)
    UpdateMinerHashrates(minerStatsObj);
    //ParseHashrate(minerStatsObj.hash2)
}

function UpdateTopStats(netObj, poolObj)
{
    poolHashrateDisplay.innerHTML = ParseHashrate(poolObj.pool_statistics.hashRate);
    poolBlocksFoundDisplay.innerHTML = poolObj.pool_statistics.totalAltBlocksFound;
}

function UpdateMinerHashrates(obj)
{
    payHashrateDisplay.innerHTML = ParseHashrate(obj.hash2);

    rawHashrateDisplay.innerHTML = ParseHashrate(obj.hash)
}

function UpdateBalances()
{

}

function UpdateExchangeRates()
{

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

    let hashrate = Number(hashrateStr);

    if (hashrate >= gh)
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
    else return hashrate + " H/s";
}