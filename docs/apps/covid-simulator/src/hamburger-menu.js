let dropdownEnabled = false;

function UpdateMenu()
{
    if (dropdownEnabled === false)
    {
        dropdownEnabled = true;
        //display the menu
        document.getElementsByClassName('hm-dropdown')[0].style.display = 'flex';
        document.getElementsByClassName('hm-dropdown')[0].style.padding = '5px';
        document.getElementsByClassName('hm-dropdown')[0].style.backgroundColor = 'darkblue';
        document.getElementsByClassName('hm-link')[0].style.color = 'white';
        document.getElementsByClassName('hm-link')[1].style.color = 'white';
        document.getElementsByClassName('hamburger-menu')[0].style.height = '100px';
    
    }
    else
    {
        dropdownEnabled = false;
        //hide the menu
        document.getElementsByClassName('hm-dropdown')[0].style.display = 'none';
        document.getElementsByClassName('hamburger-menu')[0].style.height = '100%';
    }
}