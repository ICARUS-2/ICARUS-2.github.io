const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

//https://github.com/MoneroOcean/nodejs-pool/blob/master/lib/api.js#L171

//Port list from https://github.com/MoneroOcean/moneroocean-gui/blob/master/script.js
const COINS = {
	18081: {
		name: "XMR",
        portNumber: 18081,
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
        portNumber: 19734,
		divisor: 1000000000,
		url: "https://explorer.sumokoin.com",
		time: 240,
	},
	12211: {
		name: "RYO",
        portNumber: 12211,
		divisor: 1000000000,
		url: "https://explorer.ryo-currency.com",
		time: 240,
	},
	18981: {
		name: "GRFT",
        portNumber: 18981,
		divisor: 10000000000,
		url: "https://blockexplorer.graft.network",
		time: 120,
	},
	38081: {
		name: "MSR",
        portNumber: 38081,
		divisor: 1000000000000,
		url: "https://explorer.getmasari.org",
		time: 60,
	},
	48782: {	
		name: "LTHN",
        portNumber: 48782,
		divisor: 100000000,
		url: "https://lethean.io/explorer",
		time: 120,
	},
	19281: {
		name: "XMV",
        portNumber: 19281,
		divisor: 100000000000,
		url: "https://explorer.monerov.online",
		time: 60,
		unit: "G",
		factor: 16,
	},
	9231: {
		name: "XEQ",
        portNumber: 9231,
		divisor: 10000,
		url: "https://explorer.equilibria.network",
		time: 120,
	},
	19950: {
		name: "XWP",
        portNumber: 19950,
		divisor: 1000000000000,
		url: "https://explorer.xwp.one",
		time: 15,
		unit: "G",
		factor: 32,
	},
	8766: {
		name: "RVN",
        portNumber: 8766,
		divisor: 100000000,
		url: "https://ravencoin.network",
		time: 60,
		unit: "H",
		factor: 0xFFFFFFFFFFFFFFFF / 0xFF000000,
	},
	9998: {
		name: "RTM",
        portNumber: 9998,
		divisor: 100000000,
		url: "https://explorer.raptoreum.com",
		time: 120,
	},
	9053: {
		name: "ERG",
        portNumber: 9053,
		divisor: 1000000000,
		url: "https://explorer.ergoplatform.com/en",
		time: 120,
		unit: "H",
		factor: 1,
	},
	8545: {
		name: "ETH",
        portNumber: 8545,
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
        portNumber: 17750,
		divisor: 1000000000000,
		url: "https://explorer.havenprotocol.org",
		time: 120,
	},
	20206: {
		name: "DERO",
        portNumber: 20206,
		divisor: 1000000000000,
		url: "https://explorer.dero.io",
		time: 27,
	},
	25182: {
		name: "TUBE",
        portNumber: 25182,
		divisor: 1000000000,
		url: "https://explorer.bittube.cash",
		time: 15,
		unit: "G",
		factor: 40,
	},
	11812: {
		name: "XLA",
        portNumber: 11812,
		divisor: 100,
		url: "https://explorer.scalaproject.io",
		time: 120,
	},
	33124: {
		name: "XTNC",
        portNumber: 33124,
		divisor: 1000000000,
		url: "https://explorer.xtendcash.com",
		time: 120,
		unit: "G",
		factor: 32,
	},
	11898: {
		name: "TRTL",
        portNumber: 11898,
		divisor: 100,
		url: "https://explorer.turtlecoin.lol",
		time: 30,
	},
	2086: {
		name: "BLOC",
        portNumber: 2086,
		divisor: 10000,
		url: "https://bloc-explorer.com",
		time: 120,
	},
	13007: {
		name: "IRD",
        portNumber: 13007,
		divisor: 100000000,
		url: "https://explorer.ird.cash",
		time: 175,
	},
	19994: {
		name: "ARQ",
        portNumber: 19994,
		divisor: 1000000000,
		url: "https://explorer.arqma.com",
		time: 120,
	},
	16000: {
		name: "CCX",
        portNumber: 16000,
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

let blockReportButton;

let baseUrl = "https://api.moneroocean.stream/"

function PreparePage()
{
    CheckAddress();
    InitializeRefreshRate();
    InitializeTheme();
    SetEventListeners();
    GetDisplays();
    InitializeBlockDropdownMenu();

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
        window.location.href = "../login/"
    })

    //block dropdown menu
    let blockDropdown = document.getElementsByClassName("blockDropdownMenu")[0];
    blockDropdown.addEventListener("change", () => UpdateBlockData())

    //block report button
    blockReportButton = document.getElementsByClassName("seeBlockReportButton")[0];
    blockReportButton.addEventListener("click", () => window.location.href = "../reports/miner-block-payments")

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
    txReportButton.addEventListener("click", () => window.location.href = "../reports/transaction-report")

    //change threshold button
    let changeThresholdButton = document.getElementsByClassName('updateThresholdButton')[0];
    changeThresholdButton.addEventListener("click", () => window.location.href = "../update-payout")

    //exchange rates button
    let exchangeRatesButton = document.getElementsByClassName("seeExchangeRatesButton")[0];
    exchangeRatesButton.addEventListener("click", () => window.location.href = "../exchange-rates")

    //connected miners chart button
    let connectedMinersChartButton = document.getElementsByClassName("connectedMinersChartButton")[0];
    connectedMinersChartButton.addEventListener("click", ()=> window.location.href = "../charts/connected-miners")

    //miner hashrates chart button
    let minerHashratesChartButton = document.getElementsByClassName("minerHashratesChartButton")[0];
    minerHashratesChartButton.addEventListener("click", () => window.location.href = "../charts/miner-hashrate")
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

function InitializeBlockDropdownMenu()
{
    let dropdown = document.getElementsByClassName("blockDropdownMenu")[0];
    let ports = Object.keys(COINS).map(key =>
        {
            return COINS[key];
        })

    for (let obj of ports)
    {
        let option = document.createElement("option");
        option.text = obj.name;
        option.value = obj.portNumber;

        dropdown.add(option);
    }

    let altOpt = document.createElement("option")
    altOpt.text = "Altcoins";
    altOpt.value = "Altcoins";
    dropdown.add(altOpt);

    //12 is the index for XMR
    dropdown.selectedIndex = 12;
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
    //let xmrBlocksUrl = "https://api.moneroocean.stream/pool/blocks";
    //let altBlocksUrl = "https://api.moneroocean.stream/pool/altblocks";
    let userUrl = baseUrl;
    userUrl += "user/" + addr;

    let worldApiObj = await FetchJson(worldUrl);
    let networkStatsObj = await FetchJson(networkStatsUrl);
    let minerStatsObj = await FetchJson(minerStatsUrl);
    let minerStatsAllWorkersObj = await FetchJson(minerStatsAllWorkersUrl);
    let poolStatsObj = await FetchJson(poolStatsUrl);
    //let xmrBlocksObj = await FetchJson(xmrBlocksUrl);
    //let altBlocksObj = await FetchJson(altBlocksUrl);
    let userObj = await FetchJson(userUrl);

    UpdateTopStats(networkStatsObj, poolStatsObj, worldApiObj)
    UpdateMinerHashrates(minerStatsObj);
    UpdateConnectedMiners(poolStatsObj, minerStatsAllWorkersObj);
    UpdateBalances(minerStatsObj, userObj);
    UpdateExchangeRates(poolStatsObj);
    UpdateMinerData(minerStatsAllWorkersObj)
    UpdateBlockData()
}

function UpdateTopStats(netObj, poolObj, worldApiObj)
{
    poolHashrateDisplay.innerHTML = ParseHashrate(poolObj.pool_statistics.portHash[18081]) + "&nbsp&nbsp&nbsp&nbsp/&nbsp&nbsp&nbsp&nbsp" + ParseHashrate(poolObj.pool_statistics.hashRate);
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

function UpdateBalances(minerStatsObj, userObj)
{
    pendingBalanceDisplay.innerHTML = (minerStatsObj.amtDue / 1000000000000).toFixed(6) + " / " + (userObj.payout_threshold / 1000000000000).toFixed(6);
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

async function UpdateBlockData()
{
    let dropdown = document.getElementsByClassName("blockDropdownMenu")[0];
    let portNumber = dropdown.value;

    let url;

    if (dropdown.value == COINS[18081].portNumber)
    {
        url= "https://api.moneroocean.stream/pool/blocks"
    }
    else if (portNumber == "Altcoins")
    {
        url = "https://api.moneroocean.stream/pool/altblocks";
    }
    else
    {
        url = "https://api.moneroocean.stream/pool/coin_altblocks/" + portNumber;
    }   

    let retrievedBlockData = await FetchJson(url);

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

    for (let i = 0; i < BLOCK_TABLE_SIZE; i++)
    {
        let obj = retrievedBlockData[i];
        let coinPortData;
    
        if (obj.port)
            coinPortData = COINS[obj.port];
        else
            coinPortData = COINS[18081];

        let row = table.insertRow(i+1)
        let coinCell = row.insertCell(0);
        let heightCell = row.insertCell(1);
        let foundCell = row.insertCell(2);
        let rewardCell = row.insertCell(3);
        let hashCell = row.insertCell(4);

        coinCell.innerHTML = coinPortData.name;
        heightCell.innerHTML = obj.height;
        foundCell.innerHTML = UnixTSToDate(obj.ts).split("y, ")[1].replace(',', '').replace(',', '');
        rewardCell.innerHTML = (obj.value / coinPortData.divisor).toString().substr(0,7);
        hashCell.innerHTML = obj.hash.substr(0,6) + "..."
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
    let seeBlockReportButton = document.getElementsByClassName("seeBlockReportButton")[0];
    let selectThemeSection = document.getElementsByClassName("selectThemeDiv")[0];
    let selectRefreshSection = document.getElementsByClassName("selectRefreshDiv")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];
    let payoutThresholdButton = document.getElementsByClassName("updateThresholdButton")[0];
    let exchangeRatesButton = document.getElementsByClassName("seeExchangeRatesButton")[0];
    let connectedMinersChartButton = document.getElementsByClassName("connectedMinersChartButton")[0];
    let minerHashratesChartButton = document.getElementsByClassName("minerHashratesChartButton")[0];

    placeholder.removeEventListener("mouseover", ButtonHoverInTheme);
    placeholder.removeEventListener("mouseout", ButtonHoverOutTheme);

    signOutButton.removeEventListener("mouseover", ButtonHoverInTheme);
    signOutButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    seeBlockReportButton.removeEventListener("mouseover", ButtonHoverInTheme);
    seeBlockReportButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    txReportButton.removeEventListener("mouseover", ButtonHoverInTheme);
    txReportButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    payoutThresholdButton.removeEventListener("mouseover", ButtonHoverInTheme);
    payoutThresholdButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    connectedMinersChartButton.removeEventListener("mouseover", ButtonHoverInTheme);
    connectedMinersChartButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    minerHashratesChartButton.removeEventListener("mouseover", ButtonHoverInTheme);
    minerHashratesChartButton.removeEventListener("mouseout", ButtonHoverOutTheme);

    exchangeRatesButton.removeEventListener("mouseover", ButtonHoverInTheme);
    exchangeRatesButton.removeEventListener("mouseout", ButtonHoverOutTheme);

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

                //block report button
                seeBlockReportButton.style.backgroundColor = "";
                seeBlockReportButton.style.borderColor = "";

                //select theme section
                selectThemeSection.style.backgroundColor = "";
                selectThemeSection.style.borderColor = "";

                //refresh rate section
                selectRefreshSection.style.backgroundColor = "";
                selectRefreshSection.style.borderColor = "";

                //transaction report button
                txReportButton.style.backgroundColor = "";
                txReportButton.style.borderColor = "";

                //connected miners chart button
                connectedMinersChartButton.style.backgroundColor = "";
                connectedMinersChartButton.style.borderColor = ""

                //miner hashrates chart button
                minerHashratesChartButton.style.backgroundColor = "";
                minerHashratesChartButton.style.borderColor = "";

                //change payout button
                payoutThresholdButton.style.backgroundColor = "";
                payoutThresholdButton.style.borderColor = "";

                //exchange rates button;
                exchangeRatesButton.style.backgroundColor = "";
                exchangeRatesButton.style.borderColor = "";
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

                //block report button
                seeBlockReportButton.style.backgroundColor = bgColor;
                seeBlockReportButton.style.borderColor = bordColor;
                seeBlockReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                seeBlockReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //change payout button
                payoutThresholdButton.style.backgroundColor = bgColor;
                payoutThresholdButton.style.borderColor = bordColor;
                payoutThresholdButton.addEventListener("mouseover", ButtonHoverInTheme);
                payoutThresholdButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //exchange rates button
                exchangeRatesButton.style.backgroundColor = bgColor;
                exchangeRatesButton.style.borderColor = bordColor;
                exchangeRatesButton.addEventListener("mouseover", ButtonHoverInTheme);
                exchangeRatesButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //connected miners chart button
                connectedMinersChartButton.style.backgroundColor = bgColor;
                connectedMinersChartButton.style.borderColor = bordColor;
                connectedMinersChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                connectedMinersChartButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //miner hashrate chart button
                minerHashratesChartButton.style.backgroundColor = bgColor;
                minerHashratesChartButton.style.borderColor = bordColor;
                minerHashratesChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                minerHashratesChartButton.addEventListener("mouseout", ButtonHoverOutTheme);

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

                //block report button
                seeBlockReportButton.style.backgroundColor = bgColor;
                seeBlockReportButton.style.borderColor = bordColor;
                seeBlockReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                seeBlockReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //change payout button
                payoutThresholdButton.style.backgroundColor = bgColor;
                payoutThresholdButton.style.borderColor = bordColor;
                payoutThresholdButton.addEventListener("mouseover", ButtonHoverInTheme);
                payoutThresholdButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //exchange rates button
                exchangeRatesButton.style.backgroundColor = bgColor;
                exchangeRatesButton.style.borderColor = bordColor;
                exchangeRatesButton.addEventListener("mouseover", ButtonHoverInTheme);
                exchangeRatesButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //connected miners chart button
                connectedMinersChartButton.style.backgroundColor = bgColor;
                connectedMinersChartButton.style.borderColor = bordColor;
                connectedMinersChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                connectedMinersChartButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //miner hashrate chart button
                minerHashratesChartButton.style.backgroundColor = bgColor;
                minerHashratesChartButton.style.borderColor = bordColor;
                minerHashratesChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                minerHashratesChartButton.addEventListener("mouseout", ButtonHoverOutTheme);
                
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

                //block report button
                seeBlockReportButton.style.backgroundColor = bgColor;
                seeBlockReportButton.style.borderColor = bordColor;
                seeBlockReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                seeBlockReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //transaction report button
                txReportButton.style.backgroundColor = bgColor;
                txReportButton.style.borderColor = bordColor;
                txReportButton.addEventListener("mouseover", ButtonHoverInTheme);
                txReportButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //change payout button
                payoutThresholdButton.style.backgroundColor = bgColor;
                payoutThresholdButton.style.borderColor = bordColor;
                payoutThresholdButton.addEventListener("mouseover", ButtonHoverInTheme);
                payoutThresholdButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //exchange rates button
                exchangeRatesButton.style.backgroundColor = bgColor;
                exchangeRatesButton.style.borderColor = bordColor;
                exchangeRatesButton.addEventListener("mouseover", ButtonHoverInTheme);
                exchangeRatesButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //connected miners chart button
                connectedMinersChartButton.style.backgroundColor = bgColor;
                connectedMinersChartButton.style.borderColor = bordColor;
                connectedMinersChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                connectedMinersChartButton.addEventListener("mouseout", ButtonHoverOutTheme);

                //miner hashrate chart button
                minerHashratesChartButton.style.backgroundColor = bgColor;
                minerHashratesChartButton.style.borderColor = bordColor;
                minerHashratesChartButton.addEventListener("mouseover", ButtonHoverInTheme);
                minerHashratesChartButton.addEventListener("mouseout", ButtonHoverOutTheme);                

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
    let seeBlockReportButton = document.getElementsByClassName("seeBlockReportButton")[0];
    let placeholder = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];
    let updateThresholdButton = document.getElementsByClassName("updateThresholdButton")[0];
    let exchangeRatesButton = document.getElementsByClassName("seeExchangeRatesButton")[0];
    let connectedMinersChartButton = document.getElementsByClassName("connectedMinersChartButton")[0];
    let minerHashratesChartButton = document.getElementsByClassName("minerHashratesChartButton")[0];

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
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "blue";
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

                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "blue";
                    break;

                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "blue";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "blue";
                    break;

                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "blue";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "rgb(0,85,165)";
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

                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "rgb(0,85,165)";
                    break;       

                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "rgb(0,85,165)";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "rgb(255,0,255)";
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
            
                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "rgb(255,0,255)";
                    break;

                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "rgb(255,0,255)";
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
    let seeBlockReportButton = document.getElementsByClassName("seeBlockReportButton")[0];
    let placeholder = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];
    let txReportButton = document.getElementsByClassName("transactionReportButton")[0];
    let updateThresholdButton = document.getElementsByClassName("updateThresholdButton")[0];
    let exchangeRatesButton = document.getElementsByClassName("seeExchangeRatesButton")[0];
    let connectedMinersChartButton = document.getElementsByClassName("connectedMinersChartButton")[0];
    let minerHashratesChartButton = document.getElementsByClassName("minerHashratesChartButton")[0];

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
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "black";
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

                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "black";
                    break;

                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "black";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "black";
                    break;

                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "black";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 2:
            switch(event.target.className)
            {
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "rgb(4,0,50)";
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

                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "rgb(4,0,50)";
                    break;
            
                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "rgb(4,0,50)";
                    break;
                    
                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "rgb(4,0,50)";
                    break;

                default:
                    LogError("Button not defined, try clearing browser data");
                    break;
            }
            break;

        case 3:
            switch(event.target.className)
            {
                case "seeBlockReportButton":
                    seeBlockReportButton.style.backgroundColor = "rgb(85,0,85)";
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

                case "updateThresholdButton":
                    updateThresholdButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;

                case "seeExchangeRatesButton":
                    exchangeRatesButton.style.backgroundColor = "rgb(85,0,85)";
                    break;

                case "connectedMinersChartButton":
                    connectedMinersChartButton.style.backgroundColor = "rgb(85,0,85)";
                    break;

                case "minerHashratesChartButton":
                    minerHashratesChartButton.style.backgroundColor = "rgb(85,0,85)";
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