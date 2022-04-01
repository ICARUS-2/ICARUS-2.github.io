const BLOCK_INTERVAL = 210000;

const API_REFRESH_RATE  = 10000;

const BLOCK_TIME = 600000;

const MS_IN_HALVING_PERIOD = 126000000000;
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;
const MS_IN_MINUTE = 60000;
const MS_IN_SECOND = 1000;

const TIMER_INTERVAL = 1000;

const BASE_BLOCK_REWARD = 50;

const MAX_HALVING_COUNT = 33;

const MAX_BLOCKCHAIN_HEIGHT = BLOCK_INTERVAL * MAX_HALVING_COUNT;

let currentBlockchainHeight = 0;
let globalMsToNextHalving = 0;

const APIs = 
{
    BlockchainHeight: "https://blockchain.info/q/getblockcount",
    Price: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
}

const DISPLAY_COLORS = 
{
    OnColors:
    {
        Red: "rgb(200,0,0)",
        Green:"rgb(0,190,0)",
        Blue: "rgb(0,0,200)",
        Yellow: "yellow",
        White: "white",
        LightBlue: "rgb(0,200,255)",
        Pink:"rgb(255,0,255)"
    },
    OffColors: 
    {
        Red: "rgb(20,0,0)",
        Green: "rgb(0,10,0)",
        Blue: "rgb(0,0,20)",
        Yellow: "rgb(10, 10, 0)",
        White: "rgb(20,20,20)",
        LightBlue: "rgb(0,7,10)",
        Pink: "rgb(25,0,25)"
    }
}

document.addEventListener("DOMContentLoaded", async () =>
{
    currentBlockchainHeight = await getBlockchainHeight(); 
    initialize();
    getHalvingTimeStamp();
    window.setInterval(update, API_REFRESH_RATE)
    window.setInterval(updateTimer, TIMER_INTERVAL);
})

async function update()
{
    updateBlockchainHeight();
    updatePrice();
    updateBlockReward();
}

async function updateBlockReward()
{
    let currentBlockReward = getBlockReward();
    let blockRewardAfterHalving = getBlockReward(currentBlockchainHeight+BLOCK_INTERVAL)

    let cblSegLength = currentBlockReward.toString().length
    if (currentBlockReward.toString().includes('.'))
    {
        cblSegLength--;
    }

    let blahSegLength = blockRewardAfterHalving.toString().length;
    if (blockRewardAfterHalving.toString().includes('.'))
    {
        blahSegLength--;
    }


    $(".currentBlockReward").sevenSeg({value: currentBlockReward, colorOn: DISPLAY_COLORS.OnColors.Pink, colorOff: DISPLAY_COLORS.OffColors.Pink, digits: cblSegLength});
    $(".blockRewardAfterHalving").sevenSeg({value: blockRewardAfterHalving, colorOn: DISPLAY_COLORS.OnColors.Pink, colorOff: DISPLAY_COLORS.OffColors.Pink, digits: blahSegLength});
}

async function getBlockchainHeight()
{
    return (await fetch(APIs.BlockchainHeight)).json();
}

async function getPrice()
{
    return (await fetch(APIs.Price)).json();
}

async function updatePrice()
{
    let priceData = await getPrice();
    let bitcoinData = priceData.bitcoin;
    let usdPrice = bitcoinData.usd.toString();
    let change = bitcoinData.usd_24h_change.toFixed(2).toString();

    try
    {
        $(".price").sevenSeg("destroy");
        $(".priceChange").sevenSeg("destroy");
    }
    catch(err)
    {

    }

    let changeIsNegative = change.includes("-");
    let changeOn = changeIsNegative ? DISPLAY_COLORS.OnColors.Red : DISPLAY_COLORS.OnColors.Green;
    let changeOff = changeIsNegative ? DISPLAY_COLORS.OffColors.Red : DISPLAY_COLORS.OffColors.Green;

    let changeLength = change.length;

    if (change.includes("-"))
        changeLength--;

    if (change.includes("."))
        changeLength--

    let arrow = document.getElementsByClassName("priceChangeArrow")[0];
    let percentSign = document.getElementsByClassName("priceChangePercent")[0];

    percentSign.style.color = changeOn;
    arrow.style.color = changeOn

    if (changeIsNegative)
    {
        arrow.name = "arrow-down-outline"
    }
    else
    {
        arrow.name = "arrow-up-outline"
    }

    $(".price").sevenSeg({value: usdPrice, colorOn: DISPLAY_COLORS.OnColors.White, colorOff : DISPLAY_COLORS.OffColors.White, digits: usdPrice.length});
    $(".priceChange").sevenSeg({value: change.toString(), colorOn: changeOn, colorOff : changeOff, digits: changeLength, decimalPoint : true});
}

async function updateBlockchainHeight()
{
    let newHeight = await getBlockchainHeight();

    if(newHeight != currentBlockchainHeight)
    {
        currentBlockchainHeight = newHeight;
        reInitialize();
    }
}

function getHalvingDate()
{
    let currentMS = new Date().getTime();
    let msTillNextHalving = getMillisecondsTillNextHalving();

    return new Date(currentMS + msTillNextHalving);
}

function getBlocksTillNextHalving()
{
    return BLOCK_INTERVAL -(currentBlockchainHeight % BLOCK_INTERVAL);
}

function getMillisecondsTillNextHalving()
{
    return getBlocksTillNextHalving() * BLOCK_TIME;
}

function updateTimer()
{
    let timeStamp = getHalvingTimeStamp();
    try
    {
        destroyTimers();
    }
    catch(err)
    {
        //YOLO
    }

    $(".halvingDays").sevenSeg({value: timeStamp.days.toString(), colorOn: DISPLAY_COLORS.OnColors.Red, colorOff : DISPLAY_COLORS.OffColors.Red, digits: timeStamp.days.toString().length});
    $(".halvingHours").sevenSeg({value: timeStamp.hours.toString(), colorOn: DISPLAY_COLORS.OnColors.Red, colorOff: DISPLAY_COLORS.OffColors.Red, digits: timeStamp.hours.toString().length})
    $(".halvingMinutes").sevenSeg({value: timeStamp.minutes.toString(), colorOn: DISPLAY_COLORS.OnColors.Red, colorOff: DISPLAY_COLORS.OffColors.Red, digits: timeStamp.minutes.toString().length})
    $(".halvingSeconds").sevenSeg({value: timeStamp.seconds.toString(), colorOn: DISPLAY_COLORS.OnColors.Red, colorOff: DISPLAY_COLORS.OffColors.Red, digits: timeStamp.seconds.toString().length})

    globalMsToNextHalving -= TIMER_INTERVAL;
}

function getHalvingTimeStamp()
{
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    let totalMilliseconds = globalMsToNextHalving;

    days = (totalMilliseconds - (totalMilliseconds % MS_IN_DAY)) / MS_IN_DAY;
    totalMilliseconds -= days * MS_IN_DAY;

    hours = (totalMilliseconds - (totalMilliseconds % MS_IN_HOUR)) / MS_IN_HOUR;
    totalMilliseconds -= hours * MS_IN_HOUR;

    minutes = (totalMilliseconds - (totalMilliseconds % MS_IN_MINUTE)) / MS_IN_MINUTE;
    totalMilliseconds -= minutes * MS_IN_MINUTE;

    seconds = (totalMilliseconds - (totalMilliseconds % MS_IN_SECOND)) / MS_IN_SECOND;
    totalMilliseconds -= seconds * MS_IN_SECOND;

    milliseconds = totalMilliseconds;

    return {days: days, hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds};
}

function initialize()
{
    globalMsToNextHalving = getMillisecondsTillNextHalving();
    updateTimer();
    $(".blockchainHeight").sevenSeg({value: currentBlockchainHeight, colorOn: DISPLAY_COLORS.OnColors.LightBlue, colorOff: DISPLAY_COLORS.OffColors.LightBlue, digits: currentBlockchainHeight.toString().length});
    $(".blocksTillHalving").sevenSeg({value: getBlocksTillNextHalving(), colorOn: DISPLAY_COLORS.OnColors.Blue, colorOff: DISPLAY_COLORS.OffColors.Blue, digits: getBlocksTillNextHalving().toString().length});
    $(".halvingDate").sevenSeg({value : "0", colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : 7})

    let halvingDate = getHalvingDate();

    $(".etaYears").sevenSeg({value : halvingDate.getFullYear(), colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : halvingDate.getFullYear().toString().length})
    $(".etaMonth").sevenSeg({value : halvingDate.getMonth() + 1, colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : halvingDate.getMonth().toString().length})
    $(".etaDay").sevenSeg({value : halvingDate.getDate(), colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : (halvingDate.getDay()+ 1).toString().length})

    updatePrice();
    updateBlockReward();
}

function reInitialize()
{
    $(".sevenSegmentDisplay").sevenSeg("destroy");
    initialize();   
}

function destroyDisplays()
{
    $(".sevenSegmentDisplay").sevenSeg("destroy");
}

function destroyTimers()
{
    $(".halvingTimerDiv").sevenSeg("destroy");
}

function getHalvingCount(height = currentBlockchainHeight)
{
    if (height < BLOCK_INTERVAL)
        return 0;

    let remainder = height % BLOCK_INTERVAL;
    return (height - remainder) / BLOCK_INTERVAL;
}

function getBlockReward(height = currentBlockchainHeight)
{
    let halvings = getHalvingCount(height);

    if (halvings > 33)
        return 0;

    let subsidy = BASE_BLOCK_REWARD;
    
    for (let i = 0; i < halvings; i++)
    {
        subsidy /= 2;
    }
    return subsidy;
}
