const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

//https://github.com/MoneroOcean/nodejs-pool/blob/master/lib/api.js#L171

//Port list from https://github.com/MoneroOcean/moneroocean-gui/blob/master/script.js
var COINS = {
	18081: {
		name: "XMR",
		divisor: 1000000000000,
		url: "https://xmrchain.net",
		time: 120,
	},
	//18181: {
	//	name: "XMC",
	//	divisor: 1000000000000,
	//	url: "http://explorer.monero-classic.org",
	//	time: 120,
	//},
	19734: {
		name: "SUMO",
		divisor: 1000000000,
		url: "https://explorer.sumokoin.com",
		time: 240,
	},
	12211: {
		name: "RYO",
		divisor: 1000000000,
		url: "https://explorer.ryo-currency.com",
		time: 240,
	},
	18981: {
		name: "GRFT",
		divisor: 10000000000,
		url: "https://blockexplorer.graft.network",
		time: 120,
	},
	38081: {
		name: "MSR",
		divisor: 1000000000000,
		url: "https://explorer.getmasari.org",
		time: 60,
	},
	48782: {	
		name: "LTHN",
		divisor: 100000000,
		url: "https://lethean.io/explorer",
		time: 120,
	},
	19281: {
		name: "XMV",
		divisor: 100000000000,
		url: "https://explorer.monerov.online",
		time: 60,
		unit: "G",
		factor: 16,
	},
	9231: {
		name: "XEQ",
		divisor: 10000,
		url: "https://explorer.equilibria.network",
		time: 120,
	},
	19950: {
		name: "XWP",
		divisor: 1000000000000,
		url: "https://explorer.xwp.one",
		time: 15,
		unit: "G",
		factor: 32,
	},
	8766: {
		name: "RVN",
		divisor: 100000000,
		url: "https://ravencoin.network",
		time: 60,
		unit: "H",
		factor: 0xFFFFFFFFFFFFFFFF / 0xFF000000,
	},
	9053: {
		name: "ERG",
		divisor: 1000000000,
		url: "https://explorer.ergoplatform.com/en",
		time: 120,
		unit: "H",
		factor: 1,
	},
	8545: {
		name: "ETH",
		divisor: 1000000000000000000,
		url: "https://etherscan.io",
		time: 13,
		unit: "H",
		factor: 1,
	},
	//11181: {
	//	name: "AEON",
	//	divisor: 1000000000000,
	//	url: "https://aeonblockexplorer.com",
	//	time: 240,
	//},
	17750: {
		name: "XHV",
		divisor: 1000000000000,
		url: "https://explorer.havenprotocol.org",
		time: 120,
	},
	20206: {
		name: "DERO",
		divisor: 1000000000000,
		url: "https://explorer.dero.io",
		time: 27,
	},
	25182: {
		name: "TUBE",
		divisor: 1000000000,
		url: "https://explorer.bittube.cash",
		time: 15,
		unit: "G",
		factor: 40,
	},
	11812: {
		name: "XLA",
		divisor: 100,
		url: "https://explorer.scalaproject.io",
		time: 120,
	},
	33124: {
		name: "XTNC",
		divisor: 1000000000,
		url: "https://explorer.xtendcash.com",
		time: 120,
		unit: "G",
		factor: 32,
	},
	11898: {
		name: "TRTL",
		divisor: 100,
		url: "https://explorer.turtlecoin.lol",
		time: 30,
	},
	2086: {
		name: "BLOC",
		divisor: 10000,
		url: "https://bloc-explorer.com",
		time: 120,
	},
	13007: {
		name: "IRD",
		divisor: 100000000,
		url: "https://explorer.ird.cash",
		time: 175,
	},
	19994: {
		name: "ARQ",
		divisor: 1000000000,
		url: "https://explorer.arqma.com",
		time: 120,
	},
	16000: {
		name: "CCX",
		divisor: 1000000,
		url: "https://explorer.conceal.network",
		time: 120,
	},
};
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
document.addEventListener("DOMContentLoaded", PreparePage)

//Top stat displays
let networkHashrateDisplay;
let poolHashrateDisplay;
let poolBlocksFoundDisplay;
let poolXMRBlocksFoundDisplay;
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
let usdERDisplay;
let bitcoinERDisplay;
let eurERDisplay;

//miner data
let sharesDisplay;

const BLOCK_TABLE_SIZE = 25;

let addr;

let refreshInterval;

let clearRefreshId; 

let blockDataButton;

let baseUrl = "https://api.moneroocean.stream/"

function PreparePage()
{
    CheckAddress();
    InitializeRefreshRate();
    InitializeTheme();
    SetEventListeners();
    GetDisplays();
    
    let displays = document.getElementsByClassName("display");
    for (let d of displays)
    {
        d.style.color = "lightgreen";
    }

    RefreshStats();
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

function InitializeTheme()
{
    let idx = window.localStorage.getItem(THEME_KEY)

    document.getElementsByClassName('themeButton')[idx].checked = true;
    ChangeTheme();
}

function InitializeRefreshRate()
{
    let idx = window.localStorage.getItem(REFRESH_KEY)

    document.getElementsByClassName('refreshRateButton')[idx].checked = true;
    SetRefreshRate();
}

function SetRefreshRate()
{
    let selectedIdx;
    
    let radioButtons = document.getElementsByClassName("refreshRateButton");

    for(let i = 0; i < radioButtons.length; i++)
    {
        if (radioButtons[i].checked)
        {
            selectedIdx = i;
        }
    }

    switch(selectedIdx)
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
        window.clearInterval(clearRefreshId)

    clearRefreshId = window.setInterval(RefreshStats, refreshInterval);

    window.localStorage.setItem(REFRESH_KEY, selectedIdx);

}

function SetEventListeners()
{
    //Sign out
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
        window.location.href = "./login.html"
    })

    //Block data table button
    blockDataButton = document.getElementsByClassName("blockButton")[0];
    blockDataButton.addEventListener("click", HandleBlockButtonPress);

    //theme buttons
    let themeButtons = document.getElementsByClassName("themeButton");

    for (let btn of themeButtons)
        btn.addEventListener('change', ChangeTheme);

    //refresh rate buttons
    let refreshRateButtons = document.getElementsByClassName("refreshRateButton");

    for (let btn of refreshRateButtons)
        btn.addEventListener('change', SetRefreshRate);

    
    //transaction report button
    let txReportButton = document.getElementsByClassName('transactionReportButton')[0];
    txReportButton.addEventListener("click", () => window.location.href = "./reports/transaction-report.html")
}

function GetDisplays()
{
    //Top stats
    networkHashrateDisplay = document.getElementsByClassName("networkHashrateDisplay")[0];
    poolHashrateDisplay = document.getElementsByClassName("poolHashrateDisplay")[0];
    poolBlocksFoundDisplay = document.getElementsByClassName("poolBlocksFoundDisplay")[0];
    poolXMRBlocksFoundDisplay = document.getElementsByClassName("poolXMRBlocksFoundDisplay")[0];
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
    usdERDisplay = document.getElementsByClassName("usdExchangeRateDisplay")[0];
    bitcoinERDisplay = document.getElementsByClassName("btcExchangeRateDisplay")[0];
    eurERDisplay = document.getElementsByClassName("eurExchangeRateDisplay")[0];

    //Miner data
    sharesDisplay = document.getElementsByClassName("sharesDisplay")[0];
}


async function RefreshStats()
{
    //alert("Stats refreshed");
    let minerStatsUrl = baseUrl;
    minerStatsUrl += "miner/" + addr + "/stats";
    let minerStatsAllWorkersUrl = minerStatsUrl + "/allWorkers"
    let poolStatsUrl = "https://api.moneroocean.stream/pool/stats";
    let networkStatsUrl = "https://api.moneroocean.stream/network/stats";
    let worldUrl = "https://localmonero.co/blocks/api/get_stats";
    let xmrBlocksUrl = "https://api.moneroocean.stream/pool/blocks";
    let altBlocksUrl = "https://api.moneroocean.stream/pool/altblocks";

    let worldApiObj = await FetchJson(worldUrl);
    let networkStatsObj = await FetchJson(networkStatsUrl);
    let minerStatsObj = await FetchJson(minerStatsUrl);
    let minerStatsAllWorkersObj = await FetchJson(minerStatsAllWorkersUrl);
    let poolStatsObj = await FetchJson(poolStatsUrl);
    let xmrBlocksObj = await FetchJson(xmrBlocksUrl);
    let altBlocksObj = await FetchJson(altBlocksUrl);

    UpdateTopStats(networkStatsObj, poolStatsObj, worldApiObj)
    UpdateMinerHashrates(minerStatsObj);
    UpdateConnectedMiners(poolStatsObj, minerStatsAllWorkersObj);
    UpdateBalances(minerStatsObj);
    UpdateExchangeRates(poolStatsObj);
    UpdateMinerData(minerStatsAllWorkersObj)
    UpdateBlockData(xmrBlocksObj, altBlocksObj)
}

function UpdateTopStats(netObj, poolObj, worldApiObj)
{
    poolHashrateDisplay.innerHTML = ParseHashrate(poolObj.pool_statistics.portHash[18081]) + "&nbsp&nbsp&nbsp&nbsp/&nbsp&nbsp&nbsp&nbsp" + ParseHashrate(poolObj.pool_statistics.hashRate);
    console.log(poolObj.pool_statistics.portHash[18081])
    poolBlocksFoundDisplay.innerHTML = poolObj.pool_statistics.totalAltBlocksFound;
    poolXMRBlocksFoundDisplay.innerHTML = poolObj.pool_statistics.totalBlocksFound;
    blockchainHeightDisplay.innerHTML = netObj.main_height;
    networkHashrateDisplay.innerHTML = ParseHashrate(worldApiObj.hashrate);
}

function UpdateMinerHashrates(obj)
{
    payHashrateDisplay.innerHTML = ParseHashrate(obj.hash2);

    rawHashrateDisplay.innerHTML = ParseHashrate(obj.hash)
}

function UpdateConnectedMiners(poolObj, minerStatsAllWorkersObj)
{
    poolMinerCountDisplay.innerHTML = poolObj.pool_statistics.miners;
    
    let count = Object.keys(minerStatsAllWorkersObj).length;
    addressMinerCountDisplay.innerHTML = count - 1;
}

function UpdateBalances(minerStatsObj)
{
    pendingBalanceDisplay.innerHTML = (minerStatsObj.amtDue / 1000000000000).toFixed(6);
    totalXMRPaidDisplay.innerHTML = (minerStatsObj.amtPaid / 1000000000000).toFixed(6);
    transactionCountDisplay.innerHTML = minerStatsObj.txnCount;
}

function UpdateExchangeRates(poolObj)
{
    usdERDisplay.innerHTML = "$"+poolObj.pool_statistics.price.usd.toFixed(2);
    eurERDisplay.innerHTML = "€"+poolObj.pool_statistics.price.eur.toFixed(2);
    bitcoinERDisplay.innerHTML = "₿"+poolObj.pool_statistics.price.btc.toFixed(5);
}

function UpdateMinerData(workersObj)
{
    //https://stackoverflow.com/questions/14528385/how-to-convert-json-object-to-javascript-array
    let arr = Object.keys(workersObj).map(function(_){return workersObj[_]});
    
    sharesDisplay.innerHTML = "Total Shares : " + arr[0].validShares + " / " + arr[0].invalidShares;

    let table = document.getElementsByClassName("minerTable")[0];
    table.innerHTML = "";
    let header = table.insertRow(0);
    let minerIdHeader = header.insertCell(0);
    let minerHashrateHeader = header.insertCell(1);
    let minerSharesHeader = header.insertCell(2);

    minerIdHeader.innerHTML = "Miner ID";
    minerHashrateHeader.innerHTML = "Hashrate";
    minerSharesHeader.innerHTML = "Shares";

    header.style.color = "white";

    for (let i = 1; i < arr.length; i++)
    {
        let row = table.insertRow(i);

        let minerId = row.insertCell(0);
        let minerHashrate = row.insertCell(1);
        let minerShares = row.insertCell(2);

        minerId.innerHTML = arr[i].identifer;
        minerHashrate.innerHTML = ParseHashrate(arr[i].hash2);
        minerShares.innerHTML = arr[i].validShares + " / " + arr[i].invalidShares;
    }
}

function UpdateBlockData(xmrBlocksObj, altBlocksObj)
{
    let table = document.getElementsByClassName("blockTable")[0];
    table.innerHTML = "";
    let header = table.insertRow(0);
    let coinHeader = header.insertCell(0);
    let heightHeader = header.insertCell(1);
    let foundHeader = header.insertCell(2);
    let rewardHeader = header.insertCell(3);
    let hashHeader = header.insertCell(4); 

    coinHeader.innerHTML = "Coin";
    heightHeader.innerHTML = "Height";
    foundHeader.innerHTML = "Found";
    rewardHeader.innerHTML = "Reward";
    hashHeader.innerHTML = "Hash";

    let mediaQueryWidth = 1600;

    if (blockDataButton.innerHTML == "See XMR") //populate table with alt blocks
    {
        for(let i = 0; i < BLOCK_TABLE_SIZE; i++)
        {
            let row = table.insertRow(i + 1);
            let port = altBlocksObj[i].port;

            let coinData = COINS[port];

            let coinCell = row.insertCell(0);
            let heightCell = row.insertCell(1);
            let foundCell = row.insertCell(2);
            let rewardCell = row.insertCell(3);
            let hashCell = row.insertCell(4);

            coinCell.innerHTML = coinData.name;
            heightCell.innerHTML = altBlocksObj[i].height;
            foundCell.innerHTML = UnixTSToDate(altBlocksObj[i].ts).split("y, ")[1].replace(',', '').replace(',', '');
            rewardCell.innerHTML = (altBlocksObj[i].value / coinData.divisor).toString().substr(0,7);
            
            if (window.innerWidth <= mediaQueryWidth) 
                hashCell.innerHTML = altBlocksObj[i].hash.substr(0,6) + "..."
            else
                hashCell.innerHTML = altBlocksObj[i].hash.substr(0,20) + "..."
        }
    }
    else //populate table with XMR blocks
    {
        for(let i = 0; i < BLOCK_TABLE_SIZE; i++)
        {
            let row = table.insertRow(i + 1);

            let coinCell = row.insertCell(0);
            let heightCell = row.insertCell(1);
            let foundCell = row.insertCell(2);
            let rewardCell = row.insertCell(3);
            let hashCell = row.insertCell(4);

            coinCell.innerHTML = "XMR";
            heightCell.innerHTML = xmrBlocksObj[i].height;
            foundCell.innerHTML = UnixTSToDate(xmrBlocksObj[i].ts).split("y, ")[1].replace(',', '').replace(',', '');
            rewardCell.innerHTML = (xmrBlocksObj[i].value / 1000000000000).toString().substr(0,7);
            
            if(window.innerWidth <= mediaQueryWidth)
                hashCell.innerHTML = xmrBlocksObj[i].hash.substr(0,6) + "..."
            else
                hashCell.innerHTML = xmrBlocksObj[i].hash.substr(0,20) + "..."
        }
    }
}

async function FetchJson(url)
{
    let res = await fetch(url);

    return res.json();
}

function HandleBlockButtonPress()
{
    if (blockDataButton.innerHTML == "See Alt")
    {
        document.getElementsByClassName("blockDataHeader")[0].innerHTML = "Altcoin Block Data"
        blockDataButton.innerHTML = "See XMR";
    }
    else
    {
        document.getElementsByClassName("blockDataHeader")[0].innerHTML = "XMR Block Data"
        blockDataButton.innerHTML = "See Alt";
    }

    RefreshStats();
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
    else 
    {
        hashrate = hashrate.toFixed(2);
        return hashrate + " H/s";
    }
}

function UnixTSToDate(unix_timestamp)
{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(unix_timestamp).toLocaleTimeString("en-us", options)
    return date;
}

function ChangeTheme()
{
    let selectedIdx;
    
    let radioButtons = document.getElementsByClassName("themeButton");

    for(let i = 0; i < radioButtons.length; i++)
    {
        if (radioButtons[i].checked)
        {
            selectedIdx = i;
        }
    }
    
    window.localStorage.setItem(THEME_KEY, selectedIdx)

    let allDashboardItems = document.getElementsByClassName('dashboardItem')
    let placeholder = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let optionButton = document.getElementsByClassName("optionButton")[0];
    let selectThemeSection = document.getElementsByClassName("selectThemeDiv")[0];
    let selectRefreshSection = document.getElementsByClassName("selectRefreshDiv")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];

    placeholder.removeEventListener("mouseover", ButtonHoverInTheme);
    placeholder.removeEventListener("mouseout", ButtonHoverOutTheme);

    signOutButton.removeEventListener("mouseover", ButtonHoverInTheme);
    signOutButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    optionButton.removeEventListener("mouseover", ButtonHoverInTheme);
    optionButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    txReportButton.removeEventListener("mouseover", ButtonHoverInTheme);
    txReportButton.removeEventListener("mouseout", ButtonHoverOutTheme);
    txReportButton.style.backgroundColor = "blue"
    switch(selectedIdx)
    {
        //default/purple theme
        case 0:
            {
                //background
                document.body.style.backgroundColor = "";

                //dashboard items
                for (let dbi of allDashboardItems)
                {
                    dbi.style.backgroundColor = "";
                    dbi.style.borderColor = ""
                }

                //signed in as
                placeholder.style.backgroundColor = "";
                placeholder.style.borderColor = "";

                //sign out button
                signOutButton.style.backgroundColor = "";
                signOutButton.style.borderColor = "";


                //option button
                optionButton.style.backgroundColor = "";
                optionButton.style.borderColor = "";

                //select theme section
                selectThemeSection.style.backgroundColor = "";
                selectThemeSection.style.borderColor = "";

                //refresh rate section
                selectRefreshSection.style.backgroundColor = "";
                selectRefreshSection.style.borderColor = "";

                //transaction report button
                txReportButton.style.backgroundColor = "";
                txReportButton.style.borderColor = "";
            }
            break;

        //dark theme
        case 1:
            {
                let bgColor = "black";
                let bordColor = "blue";

                //background
                document.body.style.backgroundColor = bgColor;

                //dashboard items
                for (let dbi of allDashboardItems)
                {
                    dbi.style.backgroundColor = bgColor;
                    dbi.style.borderColor = bordColor;
                }

                //signed in as
                placeholder.style.backgroundColor = bgColor;
                placeholder.style.borderColor = bordColor;
                placeholder.addEventListener("mouseover", ButtonHoverInTheme);
                placeholder.addEventListener("mouseout", ButtonHoverOutTheme);

                //sign out button
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;
                signOutButton.addEventListener("mouseover", ButtonHoverInTheme);
                signOutButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //option button
                optionButton.style.backgroundColor = bgColor;
                optionButton.style.borderColor = bordColor;
                optionButton.addEventListener("mouseover", ButtonHoverInTheme);
                optionButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //select theme section
                selectThemeSection.style.backgroundColor = bgColor;
                selectThemeSection.style.borderColor = bordColor;

                //refresh rate section
                selectRefreshSection.style.backgroundColor = bgColor;
                selectRefreshSection.style.borderColor = bordColor;
            }
            break;

        //blue theme
        case 2:
            {
                let bodyColor = "rgb(4, 0, 32)";
                let bgColor = "rgb(4,0,50)";
                let bordColor = "rgb(0,85,165)"

                //background
                document.body.style.backgroundColor = bodyColor;

                //dashboard items
                for (let dbi of allDashboardItems)
                {
                    dbi.style.backgroundColor = bgColor;
                    dbi.style.borderColor = bordColor;
                }

                //signed in as
                placeholder.style.backgroundColor = bgColor;
                placeholder.style.borderColor = bordColor;
                placeholder.addEventListener("mouseover", ButtonHoverInTheme);
                placeholder.addEventListener("mouseout", ButtonHoverOutTheme);

                //sign out button
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;
                signOutButton.addEventListener("mouseover", ButtonHoverInTheme);
                signOutButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //option button
                optionButton.style.backgroundColor = bgColor;
                optionButton.style.borderColor = bordColor;
                optionButton.addEventListener("mouseover", ButtonHoverInTheme);
                optionButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //select theme section
                selectThemeSection.style.backgroundColor = bgColor;
                selectThemeSection.style.borderColor = bordColor;

                //refresh rate section
                selectRefreshSection.style.backgroundColor = bgColor;
                selectRefreshSection.style.borderColor = bordColor;
            }
            break;

        //pink theme
        case 3:
            {
                let bodyColor = "rgb(30, 0, 30)";
                let bgColor = "rgb(85, 0, 85)";
                let bordColor = "rgb(255, 0, 255)";

                //background
                document.body.style.backgroundColor = bodyColor;

                //dashboard items
                for (let dbi of allDashboardItems)
                {
                    dbi.style.backgroundColor = bgColor
                    dbi.style.borderColor = bordColor;
                }

                //signed in as
                placeholder.style.backgroundColor = bgColor;
                placeholder.style.borderColor = bordColor;
                placeholder.addEventListener("mouseover", ButtonHoverInTheme);
                placeholder.addEventListener("mouseout", ButtonHoverOutTheme);

                //sign out button
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;
                signOutButton.addEventListener("mouseover", ButtonHoverInTheme);
                signOutButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //option button
                optionButton.style.backgroundColor = bgColor;
                optionButton.style.borderColor = bordColor;
                optionButton.addEventListener("mouseover", ButtonHoverInTheme);
                optionButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //select theme section
                selectThemeSection.style.backgroundColor = bgColor;
                selectThemeSection.style.borderColor = bordColor;

                //refresh rate section
                selectRefreshSection.style.backgroundColor = bgColor;
                selectRefreshSection.style.borderColor = bordColor;
            }
            break;
    }
}

function ButtonHoverInTheme(event)
{
    let optionButton = document.getElementsByClassName("optionButton")[0];
    let placeholder = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];

    let selectedIdx;
    
    let radioButtons = document.getElementsByClassName("themeButton");

    for(let i = 0; i < radioButtons.length; i++)
    {
        if (radioButtons[i].checked)
        {
            selectedIdx = i;
        }
    }

    switch(selectedIdx)
    {
        case 1:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "blue";
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "blue";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "blue";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "blue";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "rgb(0,85,165)"
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }

            break;
    }
}

function ButtonHoverOutTheme(event)
{
    let optionButton = document.getElementsByClassName("optionButton")[0];
    let placeholder = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];

    let selectedIdx;
    
    let radioButtons = document.getElementsByClassName("themeButton");

    for(let i = 0; i < radioButtons.length; i++)
    {
        if (radioButtons[i].checked)
        {
            selectedIdx = i;
        }
    }

    switch(selectedIdx)
    {
        case 1:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "black";
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "black";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "black";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "black";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "rgb(4,0,50)";
                    break;
                
                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "optionButton blockButton":
                    optionButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "placeholder":
                    placeholder.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "signOutButton":
                    signOutButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "transactionReportButton":
                    txReportButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }

            break;
    }
}

function LogError(msg)
{
    let main = document.getElementsByClassName("dashboardPageMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    document.getElementsByClassName("selectThemeDiv")[0].style.display = "none";
    document.getElementsByClassName("selectRefreshDiv")[0].style.display = "none";
    throw new Error();
}