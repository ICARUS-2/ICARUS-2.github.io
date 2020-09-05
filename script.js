let menuIsOpen = false;

function UpdateMenu()
{
    if(menuIsOpen)
    {   
        document.getElementsByClassName('hm-dropdown')[0].style.display = 'none';
        menuIsOpen = false
    }
    else
    {
        document.getElementsByClassName('hm-dropdown')[0].style.display = 'flex';
        menuIsOpen = true;
    }
}