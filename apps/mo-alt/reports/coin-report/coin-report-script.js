const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';
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
	9998: {
		name: "RTM",
		divisor: 100000000,
		url: "https://explorer.raptoreum.com",
		time: 120,
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

let baseUrl = "https://api.moneroocean.stream/";

let refreshInterval;
let clearRefreshId;

document.addEventListener("DOMContentLoaded", PreparePage)

function PreparePage()
{
    CheckAddress();
    SetEventListeners();
    SetRefreshRate();
    InitializeTheme();
    RetrieveAndSetCoinData();
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
    let main = document.getElementsByClassName("coinReportMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    throw new Error();
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

    clearRefreshId = window.setInterval(RetrieveAndSetCoinData, refreshInterval);
}

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("coinReportBackButton")[0];
    let refreshButton = document.getElementsByClassName("coinReportRefreshButton")[0];
    let txTable = document.getElementsByClassName("coinReportTable")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];

    signInButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signInButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    signOutButton.removeEventListener("mouseover", ButtonHoverInTheme)
    signOutButton.removeEventListener("mouseout", ButtonHoverOutTheme)

    backButton.removeEventListener("mouseover", ButtonHoverInTheme);
    backButton.removeEventListener("mouseout", ButtonHoverOutTheme);

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

                txTable.style.backgroundColor = "";
                txTable.style.borderColor = "";
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
            
                document.body.style.backgroundColor = bgColor;
                
                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;

                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                txTable.style.backgroundColor = bgColor;
                txTable.style.borderColor = bordColor;
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

                document.body.style.backgroundColor = bodyColor;

                signInButton.style.backgroundColor = bgColor;
                signInButton.style.borderColor = bordColor;
                    
                signOutButton.style.backgroundColor = bgColor;
                signOutButton.style.borderColor = bordColor;

                backButton.style.backgroundColor = bgColor;
                backButton.style.borderColor = bordColor;

                txTable.style.backgroundColor = bgColor;
                txTable.style.borderColor = bordColor;
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

            document.body.style.backgroundColor = bodyColor;

            signInButton.style.backgroundColor = bgColor;
            signInButton.style.borderColor = bordColor;
                
            signOutButton.style.backgroundColor = bgColor;
            signOutButton.style.borderColor = bordColor;

            backButton.style.backgroundColor = bgColor;
            backButton.style.borderColor = bordColor;

            txTable.style.backgroundColor = bgColor;
            txTable.style.borderColor = bordColor;
        }
        break;
    }
}

function ButtonHoverInTheme(event)
{
    let backButton = document.getElementsByClassName("coinReportBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];

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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "blue";
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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "rgb(0,85,165)";
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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "rgb(255,0,255)";
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
    let backButton = document.getElementsByClassName("coinReportBackButton")[0];
    let signInButton = document.getElementsByClassName("placeholder")[0];
    let signOutButton = document.getElementsByClassName("signOutButton")[0];

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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "black";
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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "rgb(4,0,50)";
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

                case "coinReportBackButton":
                    backButton.style.backgroundColor = "rgb(85, 0, 85)";
                    break;
            }
            break;

        default:
            //
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
        window.location.href = "../../"
    })

    let backButton = document.getElementsByClassName("coinReportBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../../dashboard";
    })
}

async function RetrieveAndSetCoinData()
{
    let table = document.getElementsByClassName("coinReportTable")[0];

    let statsApiPath = baseUrl + "pool/stats";
    let netStatsPath = baseUrl + "network/stats";
    let statData = await FetchJson(statsApiPath);
    let netData = await FetchJson(netStatsPath);

    let blocksFound = statData.pool_statistics["altBlocksFound"];
    blocksFound["18081"] = statData.pool_statistics["totalBlocksFound"]

    let ports = Object.keys(COINS).map((a)=>{return a})
    let algos = statData.pool_statistics["portCoinAlgo"];
    let hashrates = statData.pool_statistics["portHash"];
    let minerCounts = statData.pool_statistics["portMinerCount"]

    table.innerHTML = "";

    let header = table.insertRow(0);

    let coinNameHeader = header.insertCell(0);
    let coinAlgoHeader = header.insertCell(1);
    let coinPoolHashrateHeader = header.insertCell(2);
    let coinWorldHashrateHeader = header.insertCell(3)
    let coinBlocksFoundHeader = header.insertCell(4);
    let coinMinersConnectedHeader = header.insertCell(5);

    coinNameHeader.innerHTML = "<u>Coin</u>";
    coinAlgoHeader.innerHTML = "<u>Algorithm</u>";
    coinPoolHashrateHeader.innerHTML = "<u>Pool Hashrate</u>";
    coinWorldHashrateHeader.innerHTML = "<u>World Hashrate</u>"
    coinBlocksFoundHeader.innerHTML = "<u>Blocks Found</u>";
    coinMinersConnectedHeader.innerHTML = "<u>Active Miners</u>"

    for(let i = 1; i < ports.length; i++)
    {
        let portId = ports[i];
        
        let row = table.insertRow(i);
        
        let coinNameCell = row.insertCell(0);
        let coinAlgoCell = row.insertCell(1);
        let coinPoolHashrateCell = row.insertCell(2);
        let coinWorldHashrateCell = row.insertCell(3);
        let coinBlocksFoundCell = row.insertCell(4);
        let coinMinersConnectedCell = row.insertCell(5);

        coinNameCell.innerHTML = COINS[portId].name;
        coinAlgoCell.innerHTML = algos[portId];
        coinPoolHashrateCell.innerHTML = ParseHashrate(hashrates[portId] * (COINS[portId].factor ? COINS[portId].factor : 1));

        if(coinPoolHashrateCell.innerHTML == "0H/S")
            coinPoolHashrateCell.style.color = "red"
        else
            coinPoolHashrateCell.style.color = "green"

        coinWorldHashrateCell.innerHTML = ParseHashrate(netData[portId].difficulty / COINS[portId].time * (COINS[portId].factor ? COINS[portId].factor : 1));


        coinBlocksFoundCell.innerHTML = blocksFound[portId];
    
    
        coinMinersConnectedCell.innerHTML = minerCounts[portId] ? minerCounts[portId] : 0;
    
        if (coinMinersConnectedCell.innerHTML == "0")
            coinMinersConnectedCell.style.color = "red";
        else
            coinMinersConnectedCell.style.color = "green";
    }

    document.getElementsByClassName("coinInfoHeader")[0].innerHTML = `Tracking ${table.rows.length - 1} pool coins`
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
