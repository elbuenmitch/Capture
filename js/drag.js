


// Make the DIV element draggable:
dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
    //Variables for the movement
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    var dragContainer = document.getElementById('drag-container');
    var leftContainer = dragContainer.offsetLeft;
    var topContainer = dragContainer.offsetTop;
    var heightContainer = dragContainer.offsetHeight;
    var widthContainer = dragContainer.offsetWidth;
    var heightElement = elmnt.offsetHeight;
    var widthElement = elmnt.offsetWidth;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        
        elmnt.style.top = Math.max(topContainer, Math.min(elmnt.offsetTop - pos2, heightContainer-heightElement+topContainer)) + "px";
        elmnt.style.left = Math.max(leftContainer, Math.min(elmnt.offsetLeft - pos1, widthContainer-widthElement+leftContainer)) + "px";
    }


    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}