const blockInterval = 210000;

const blockchainRefreshInterval = 30000;

const blockTime = 600000;

const msInHalvingPeriod = 126000000000;
const msInDay = 86400000;
const msInHour = 3600000;
const msInMinute = 60000;
const msInSecond = 1000;

const timerInterval = 1000;


let currentBlockchainHeight = 0;
let globalMsToNextHalving = 0;

const APIs = 
{
    BlockchainHeight: "https://blockchain.info/q/getblockcount",
}

const DISPLAY_COLORS = 
{
    OnColors:
    {
        Red: "rgb(200,0,0)",
        Green:"rgb(0,190,0)",
        Blue: "rgb(0,0,200)",
        Yellow: "yellow",
    },
    OffColors: 
    {
        Red: "rgb(20,0,0)",
        Green: "rgb(0,10,0)",
        Blue: "rgb(0,0,20)",
        Yellow: "rgb(10, 10, 0)",
    }
}

document.addEventListener("DOMContentLoaded", async () =>
{
    currentBlockchainHeight = await getBlockchainHeight(); 
    initialize();
    getHalvingTimeStamp();
    window.setInterval(updateBlockchainHeight, blockchainRefreshInterval)
    window.setInterval(updateTimer, timerInterval);
})

async function getBlockchainHeight()
{
    return (await fetch(APIs.BlockchainHeight)).json();
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
    return blockInterval -(currentBlockchainHeight % blockInterval);
}

function getMillisecondsTillNextHalving()
{
    return getBlocksTillNextHalving() * blockTime;
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

    globalMsToNextHalving -= timerInterval;
}

function getHalvingTimeStamp()
{
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    let totalMilliseconds = globalMsToNextHalving;

    days = (totalMilliseconds - (totalMilliseconds % msInDay)) / msInDay;
    totalMilliseconds -= days * msInDay;

    hours = (totalMilliseconds - (totalMilliseconds % msInHour)) / msInHour;
    totalMilliseconds -= hours * msInHour;

    minutes = (totalMilliseconds - (totalMilliseconds % msInMinute)) / msInMinute;
    totalMilliseconds -= minutes * msInMinute;

    seconds = (totalMilliseconds - (totalMilliseconds % msInSecond)) / msInSecond;
    totalMilliseconds -= seconds * msInSecond;

    milliseconds = totalMilliseconds;

    return {days: days, hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds};
}

function initialize()
{
    globalMsToNextHalving = getMillisecondsTillNextHalving();
    updateTimer();
    $(".blockchainHeight").sevenSeg({value: currentBlockchainHeight, colorOn: DISPLAY_COLORS.OnColors.Green, colorOff: DISPLAY_COLORS.OffColors.Green, digits: currentBlockchainHeight.toString().length});
    $(".blocksTillHalving").sevenSeg({value: getBlocksTillNextHalving(), colorOn: DISPLAY_COLORS.OnColors.Blue, colorOff: DISPLAY_COLORS.OffColors.Blue, digits: getBlocksTillNextHalving().toString().length});
    $(".halvingDate").sevenSeg({value : "0", colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : 7})

    let halvingDate = getHalvingDate();

    $(".etaYears").sevenSeg({value : halvingDate.getFullYear(), colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : halvingDate.getFullYear().toString().length})
    $(".etaMonth").sevenSeg({value : halvingDate.getMonth() + 1, colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : halvingDate.getMonth().toString().length})
    $(".etaDay").sevenSeg({value : halvingDate.getDate(), colorOn : DISPLAY_COLORS.OnColors.Yellow, colorOff: DISPLAY_COLORS.OffColors.Yellow, digits : (halvingDate.getDay()+ 1).toString().length})
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