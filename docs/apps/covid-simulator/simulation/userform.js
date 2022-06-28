function CheckInput(e)
{
    var interval_id = window.setInterval("", 9999); // Get a reference to the last
    // interval +1
    for (var i = 1; i < interval_id; i++)
    window.clearInterval(i);
    //code snipped sourced from https://stackoverflow.com/questions/8635502/how-do-i-clear-all-intervals/8636050

    setInterval(UpdateTimer, MS_IN_SEC);
    // TODO: Check if the user didn't input invalid information.
    // Example: 
    // User Input for number of circles: 50
    // User Input for number of static circles: 75 << THIS SHOULD CAUSE AN ERROR
    // User Input for number of sick bubbles: 75 << ERROR

    //this line of code stops the form from refreshing, ruining all our hard work!
    
    e.preventDefault();

    //set all the bubbles immune from preview so they dont interfere

    //capturing form data
    let size;
    let valid = true;

    if (document.getElementsByName("Size")[0].checked)
        size = 250;
    else if(document.getElementsByName("Size")[1].checked)
        size = 500;
    else
        size = 1000;

    let circle = document.getElementById("Radius").value;
    let quant = document.getElementById("Qty").value;
    let stillQuant = document.getElementById("StaticQty").value;

    // If the user inputs more still bubbles than total bubbles
    if (Number(stillQuant) > Number(quant))
    {
        valid = false;
        alert("The number of still bubbles cannot exceed the total amount of bubbles.");
    }

    let ratio = document.getElementById("SickQty").value / 100;
    let fast = document.getElementById("Speed").value;

    if (valid)
    {
    
    //establishing new parameters based on form
    canvas.height = size;
    radius = Number(circle);
    noBubbles = Number(quant);
    noStatic = Number(stillQuant);
    sickRatio = Number(ratio);
    speed = Number(fast);
    sickCounter = 0;
    ResetCounter();
    ResetPeak();
    //deleting all old data   

    while(bubbles[0] != null)
    bubbles.pop();

        for (let i = 0; i < noBubbles; i++) 
        {
            let isSick = false;
            let isImmune = false;
            
            if (i < noBubbles * sickRatio) 
            {	// the first X bubbles will be sick
                isSick = true;
                sickCounter++;
            }
        
            if (i > noBubbles - noStatic) 
            {	// the last Y bubbles will be static
                speed = 0;
            }
        
            const newBubble = new Bubble(radius, speed, isSick, isImmune);
        
            // Ensures that no bubbles spawn on top of each other initially. 
            for (let bubble of bubbles) 
            {

                if (bubble.sick)
                {
                    setInterval(bubble.incrementTime, 1000, bubble);
                }
                
                while (newBubble.isColliding(bubble)) 
                {
                    newBubble.positionRandomly();
                }
            }
            bubbles.push(newBubble);	// add newBubble to the bubbles array
        }
        animate();
    }
    
}
