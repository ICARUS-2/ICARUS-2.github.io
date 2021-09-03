const MONERO_ADDR_LENGTH = 95;
const MONERO_INTEGR_ADDR_LENGTH = 106;
document.addEventListener("DOMContentLoaded", CheckAddress)

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
        let addr = window.location.toString().split("=")[1];
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