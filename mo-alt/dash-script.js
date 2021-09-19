const LOGIN_KEY = 'MO_ALT_LOGIN';

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

let refreshInterval = 5000;

let blockDataButton;

let baseUrl = "https://api.moneroocean.stream/"

function PreparePage()
{
    CheckAddress();
    SetEventListeners();
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


    addr = window.localStorage.getItem(LOGIN_KEY);

    if (!addr)
    {
        LoginError("Client-side error has occured: No address provided");
    }

    if ((addr.length != MONERO_ADDR_LENGTH && addr.length != MONERO_INTEGR_ADDR_LENGTH) || (!addr.startsWith('4') && !addr.startsWith('8')))
    {
        LoginError("Client-side error has occured: Invalid address format");
    }
    else
    {
        let signedInAs = document.getElementsByClassName('placeholder')[0];
        signedInAs.innerHTML = "Signed in as " + addr.substr(0,5) + "...";
    }
}

function SetEventListeners()
{
    //Sign out
    let signedInAs = document.getElementsByClassName('placeholder')[0];
    let signOutButton = document.getElementsByClassName('signOutButton')[0];
    signOutButton.style.display = "none";
    signedInAs.addEventListener("click", () => 
    {
        console.log(signOutButton.style.display);
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
        window.location.href = "./login.html"
    })

    //Block data table button
    blockDataButton = document.getElementsByClassName("blockButton")[0];
    blockDataButton.addEventListener("click", HandleBlockButtonPress);
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
    poolHashrateDisplay.innerHTML = ParseHashrate(poolObj.pool_statistics.hashRate);
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
            hashCell.innerHTML = altBlocksObj[i].hash.substr(0,6) + "..."
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
            hashCell.innerHTML = xmrBlocksObj[i].hash.substr(0,6) + "..."
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

function LoginError(msg)
{
    let main = document.getElementsByClassName("dashboardPageMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    throw new Error();
}