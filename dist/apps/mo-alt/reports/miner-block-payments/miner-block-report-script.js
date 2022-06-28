const LOGIN_KEY = 'MO_ALT_LOGIN';
const THEME_KEY = 'MO_ALT_COLOR_THEME';
const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
const REFRESH_KEY = 'MO_ALT_REFRESH_RATE';

const BASE_URL = "https://api.moneroocean.stream/";
let addr;
let currentPage = 0;
const PAGE_SIZE = 10;

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

document.addEventListener("DOMContentLoaded", PreparePage)

function PreparePage()
{
    CheckAddress();
    SetEventListeners();
    InitializeTheme();
    RetrieveAndSetBlockPayments();
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
    let main = document.getElementsByClassName("blockReportMain")[0];
    main.innerHTML = msg;
    document.getElementsByClassName("errorReturnButton")[0].style.display = "block";
    throw new Error();
}

function InitializeTheme()
{
    let idx = Number(window.localStorage.getItem(THEME_KEY));

    let backButton = document.getElementsByClassName("blockReportBackButton")[0];
    let blockReportTable = document.getElementsByClassName("blockReportTable")[0];
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

                blockReportTable.style.backgroundColor = "";
                blockReportTable.style.borderColor = "";
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

                blockReportTable.style.backgroundColor = bgColor;
                blockReportTable.style.borderColor = bordColor;
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

                blockReportTable.style.backgroundColor = bgColor;
                blockReportTable.style.borderColor = bordColor;
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

            blockReportTable.style.backgroundColor = bgColor;
            blockReportTable.style.borderColor = bordColor;
        }
        break;
    }
}

function ButtonHoverInTheme(event)
{
    let backButton = document.getElementsByClassName("blockReportBackButton")[0];
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

                case "blockReportBackButton":
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

                case "blockReportBackButton":
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

                case "blockReportBackButton":
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
    let backButton = document.getElementsByClassName("blockReportBackButton")[0];
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

                case "blockReportBackButton":
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

                case "blockReportBackButton":
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

                case "blockReportBackButton":
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

    let backButton = document.getElementsByClassName("blockReportBackButton")[0];
    backButton.addEventListener("click", ()=>
    {
        window.location.href = "../../dashboard/";
    })

    let prevPageButton = document.getElementsByClassName("blockReportPrevBtn")[0];
    prevPageButton.addEventListener("click", PreviousPage)

    let nextPageButton = document.getElementsByClassName("blockReportNextBtn")[0];
    nextPageButton.addEventListener("click", NextPage);
}

function NextPage()
{
    currentPage++;

    RetrieveAndSetBlockPayments();
}

function PreviousPage()
{
    if (currentPage == 0)
        return;

    currentPage--;

    RetrieveAndSetBlockPayments();
}

async function RetrieveAndSetBlockPayments()
{
    let headerNum = currentPage + 1;

    let blockReportHeader = document.getElementsByClassName("blockReportHeader")[0];
    blockReportHeader.innerHTML = "YOUR BLOCK PAYMENTS - PAGE  " + headerNum

    let url = BASE_URL + "miner/" + addr + `/block_payments?page=${currentPage}&limit=${PAGE_SIZE}&`
    let table = document.getElementsByClassName("blockReportTable")[0];
    table.innerHTML = "";

    let blockData = await FetchJson(url);

    let header = table.insertRow(0);
    let coinSymbolHeader = header.insertCell(0);
    let blockPayTimestampHeader = header.insertCell(1);
    let blockFoundTimestampHeader = header.insertCell(2);
    let blockAmountXmrHeader = header.insertCell(3);
    let blockSharePercentageHeader = header.insertCell(4);
    let blockHashHeader = header.insertCell(5);

    coinSymbolHeader.innerHTML = "Coin";
    blockPayTimestampHeader.innerHTML = "Paid";
    blockFoundTimestampHeader.innerHTML = "Found";
    blockAmountXmrHeader.innerHTML = "XMR Reward";
    blockSharePercentageHeader.innerHTML = "Reward %";
    blockHashHeader.innerHTML = "Hash"

    for (let i = 0; i < blockData.length; i++)
    {
        let row = table.insertRow(i+1);
        let coinSymbolCell = row.insertCell(0);
        let blockPayTimestampCell = row.insertCell(1);
        let blockFoundTimestampCell = row.insertCell(2);
        let blockAmountXmrCell = row.insertCell(3);
        let blockSharePercentageCell = row.insertCell(4);
        let blockHashCell = row.insertCell(5);

        let entry = blockData[i];

        coinSymbolCell.innerHTML = COINS[entry.port].name;
        blockPayTimestampCell.innerHTML = (UnixTSToDate(entry.ts)).split("y, ")[1].replace(',', '').replace(',', '');
        blockFoundTimestampCell.innerHTML = (UnixTSToDate(entry.ts_found)).split("y, ")[1].replace(',', '').replace(',', '');
        blockAmountXmrCell.innerHTML = entry.value.toFixed(8);
        blockSharePercentageCell.innerHTML = entry.value_percent.toFixed(8);
        blockHashCell.innerHTML = entry.hash.substr(0, 7)+"...";
    }

    console.log(blockData);

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