const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HR = 60;
const LOWEST_DOUBLE_DIGIT_NUMBER = 10; //

let sickDisplay = document.getElementById("sick-indiv");
let peakInfectTimeDisplay = document.getElementById("peak-infect-time");
let timeElapsedDisplay = document.getElementById("time-elapsed");
let peakInfectCountDisplay = document.getElementById("peak-infect-count");

let hoursElapsed = 0;
let minutesElapsed = 0;
let secondsElapsed = 0;
let hoursElapsedString; //String format to account for the additional zero if the units are single-digit
let minutesElapsedString;
let secondsElapsedString;
let timeStamp = '00:00:00';

setInterval(UpdateTimer, MS_IN_SEC);

function UpdateRealTimeDisplay(sickCounter, peakTimeStamp, peakSickCounter)
{
    sickDisplay.innerHTML = sickCounter;
    timeElapsedDisplay.innerHTML = timeStamp;
    peakInfectTimeDisplay.innerHTML = peakTimeStamp;
    peakInfectCountDisplay.innerHTML = peakSickCounter;
}

function UpdateTimer()
{
    secondsElapsed++;
    if (secondsElapsed === SEC_IN_MIN)
    {
        secondsElapsed = 0;
        minutesElapsed++;
    }

    if (minutesElapsed == MIN_IN_HR)
    {
        minutesElapsed = 0;
        hoursElapsed++;
    }

    if (secondsElapsed < LOWEST_DOUBLE_DIGIT_NUMBER)
    {
        secondsElapsedString = '0' + secondsElapsed.toString();
    }
    else
    {
        secondsElapsedString = secondsElapsed.toString();
    }

    if (minutesElapsed < LOWEST_DOUBLE_DIGIT_NUMBER)
    {
        minutesElapsedString = '0' + minutesElapsed.toString();
    }
    else
    {
        minutesElapsedString = minutesElapsed.toString();
    }
    
    if (hoursElapsed < LOWEST_DOUBLE_DIGIT_NUMBER)
    {
        hoursElapsedString = '0' + hoursElapsed.toString();
    }
    else
    {
        hoursElapsedString = hoursElapsed.toString();
    }

    timeStamp = hoursElapsedString + ':' + minutesElapsedString + ':' + secondsElapsedString;
}

function ResetCounter()
{
    timeStamp = '00:00:00';
    secondsElapsed = 0;
    minutesElapsed = 0;
    hoursElapsed = 0;
}

function DetectImmune() //if the system detects a new immunity, reduce the active cases
{
    sickCounter--;
}