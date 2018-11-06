//resources
// https://www.w3schools.com/jsref/prop_style_transform.asp



/*/
-----------------------------------------------------------------------------------
----------------------------------- Variables ------------------------------------- 
-----------------------------------------------------------------------------------
/*/

//An Array to keep the names of the images
let imgNames = [];

//An indicator of the currently selected image on the list
let selectedChild = -1;

//An indicator of whether or not the app is in cropping mode or not
let croppingMode = false;

//Informatoin about the container for the displayed image
let containerWidth = 500;
let containerHeight = 300;
let cropperWidth = 200;
let cropperHeight = 200;
let cropperLeft = 150;
let cropperTop = 50;

//Informatoin about the currently displayed image
let dispImageAttributes;
let dispImgInfo;

let dispImgW = 0;        //image's width to be used to display the image and keeps the modified values after the user has changed the crop/drag/rotate settings 
let dispImgH = 0;        //image's height to be used to display the image and keeps the modified values after the user has changed the crop/drag/rotate settings 
let dispImgTop = 0;      //image's Top to be used to display the image and keeps the modified values after the user has changed the crop/drag/rotate settings 
let dispImgLeft = 0;     //image's Left to be used to display the image and keeps the modified values after the user has changed the crop/drag/rotate settings 

let origImgW = 0;        //image's original width on the display area (not the file's natural width, that can be found on imgNames[i].naturalW)
let origImgH = 0;        //image's original height on the display area (not the file's natural height, that can be found on imgNames[i].naturalH)
let origImgTop = 0;      //Image's original top before the user changes the crop/drag/rotate settings
let origImgLeft = 0;     //Image's original left before the user changes the crop/drag/rotate settings

let dispImgOriginX = 0;
let dispImgOriginY = 0;
let scaleOffsetX = 0;
let scaleOffsetY = 0;
let dispImgAngle = 0;
let dispImgZoom = 1;
let lastZoomChange = 0;

let xButtonPath = './img/micro-but-del.svg';




/*/
-----------------------------------------------------------------------------------
------------------------ Retrieving Elements from the DOM ------------------------- 
-----------------------------------------------------------------------------------
/*/

let lista = document.getElementById('listica');
let butGen = document.getElementById('but-genera');
let butSet = document.getElementById('but-set-as');
let butCrop = document.getElementById('but-crop');
let butFind = document.getElementById('but-find');
let butSetCrop = document.getElementById('but-set-crop');


//Capture method through the browser
const fileInput = document.getElementById('file-input1');

//Elements to obtain the img tag where the image will be displayed
let displayImg = document.getElementById('display-img');
displayImg.draggable = false;
displayImg.style.cursor = 'default';
let displayImgParent = displayImg.parentElement;

//Capture method using the drag & drop. Obtain the element of the dropping area
let target = document.getElementById('target');

//Sliders
var sliderZoom = document.getElementById("slider-zoom");
var sliderAngle = document.getElementById("slider-angle");

//Output areas for the dispImgZoom and rotation
var outputZoom = document.getElementById("output-zoom");
outputZoom.innerHTML = sliderZoom.value; // Display the default slider value
var outputAngle = document.getElementById("output-angle");
outputAngle.innerHTML = sliderAngle.value; // Display the default slider value

//Cropping tools
const croppingTools = document.getElementsByClassName('crop-tools');



/*/
-----------------------------------------------------------------------------------
-------------------------------- Actions Listeners -------------------------------- 
-----------------------------------------------------------------------------------
/*/

//Action listener for the File Input through browsing
fileInput.addEventListener('change', (e) => processNewUpload(e.target.files));

//Actions listener for the dropping area
target.addEventListener('drop', (e) => {
  killE(e);
  sendImageToPhp(e.dataTransfer.files, processNewUpload);
});

//Type of event for when the mouse is over the dragging area (not necessarely dragging something)
target.addEventListener('mouseenter', (e) =>{
  killE(e);
  target.classList.add("popped-out");
});

//FIX THIS!!!
target.addEventListener('mousedown', (e) =>{
  console.log('e', e);
  helloWorld();

});

//Type of event for when the mouse is out of the dragging area (not necessarely dragging something)
target.addEventListener('mouseleave', (e) =>{
  killE(e);
  target.classList.remove("popped-out");
});

//Type of cursor for when the user is holding the file over the dropping area
target.addEventListener('dragover', (e) => {
  killE(e);
  e.dataTransfer.dropEffect = 'copy';
});



//Update the current slider value (each time you drag the slider handle)
sliderZoom.oninput = function(e) {

  lastZoomChange = parseFloat(outputZoom.innerHTML) - this.value;
  outputZoom.innerHTML = this.value;
  
  dispImgW = imgNames[selectedChild].dispOrigW*e.target.value;
  dispImgH = imgNames[selectedChild].dispOrigH*e.target.value;
  dispImgZoom = this.value;

  //dispImgLeft = Math.max(Math.min(dispImgLeft+xchange, cropperLeft+scaleOffsetX), -origImgW+cropperLeft+cropperWidth-scaleOffsetX);
  dispImgLeft = Math.max(Math.min(dispImgLeft*(1-lastZoomChange), cropperLeft+scaleOffsetX), -imgNames[selectedChild].dispOrigW+cropperLeft+cropperWidth-scaleOffsetX);
  dispImgTop = Math.max(Math.min(dispImgTop*(1-lastZoomChange), cropperTop+scaleOffsetY), -imgNames[selectedChild].dispOrigH+cropperTop+cropperHeight-scaleOffsetY);

  //displayImg.setAttribute('style', 'transform: rotate('+dispImgAngle+'deg) scale('+ dispImgZoom+')');
  //dispImageAttributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px';
  
  updateDisplayImageAttributes();
  displayImg.setAttribute('style', dispImageAttributes);
 }

//Update the current slider value (each time you drag the slider handle)
sliderAngle.oninput = function(e) {
  outputAngle.innerHTML = this.value;
  dispImgAngle = e.target.value;
  updateDisplayImageAttributes();
  displayImg.setAttribute('style', dispImageAttributes);
}

//Make the displayed image draggable
//dragElement(displayImg);

function cancelDragElement(elmnt){
  elmnt.onmousedown = null;
  document.onmouseup = null;
  document.onmousemove = null;
}


function dragElement(elmnt) {
    //Variables for the movement
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    //var dragContainer = document.getElementById('drag-container');
    
    elmnt.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      console.log('1-e.clientX', e.clientX);
      pos4 = e.clientY;
      console.log('1-e.clientY', e.clientY);
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      console.log('pos1', pos1);
      console.log('2-e.clientX', e.clientX);
      pos2 = pos4 - e.clientY;
      console.log('2-e.clientY', e.clientY);
      pos3 = e.clientX;
      pos4 = e.clientY;

      
      scaleOffsetX = ((imgNames[selectedChild].dispOrigW*(dispImgZoom-1))/2);
      scaleOffsetY = ((imgNames[selectedChild].dispOrigH*(dispImgZoom-1))/2);

      dispImgLeft = Math.max(Math.min(dispImgLeft - pos1, cropperLeft+scaleOffsetX), -imgNames[selectedChild].dispOrigW+cropperLeft+cropperWidth-scaleOffsetX);
      dispImgTop = Math.max(Math.min(dispImgTop - pos2, cropperTop+scaleOffsetY), -imgNames[selectedChild].dispOrigH+cropperTop+cropperHeight-scaleOffsetY);
      
      //DELETABLE
      mousePos2.innerHTML = 'dispImgLeft: '+ dispImgLeft+', dispImgTop: '+ dispImgTop+', dispImgOriginX: '+ dispImgOriginX+', dispImgOriginY: '+ dispImgOriginY;
      
      updateDisplayImageAttributes();
    }
    
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function updateDisplayImageAttributes(){
  dispImageAttributes = 'transform: rotate('+dispImgAngle+'deg) scale('+dispImgZoom+'); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px; transform-origin:'+dispImgOriginX+'px '+dispImgOriginY+'px';
  //dispImageAttributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px; transform-origin:'+dispImgOriginX+'px '+dispImgOriginY+'px';
  displayImg.setAttribute('style', dispImageAttributes);
}

//Mouse position
let mousePos = document.getElementById("mouse-pos");
let mousePos2 = document.getElementById("mouse-pos2");
$("body").mousemove(function(e) {
  mousePos.innerHTML = "x: "+e.pageX+", y: "+e.pageY;
})


/**
 * TODO: I'm going to have only two sets of variables: 
 *    1 - an array of objects (imgNames) that contains all the info on each image added (original display props and editted display props)
 *    2 - an object (dispImgInfo) that contains the information about the image file as it comes back from the php file when persisted to the db.
 *    3 (dies soon**) - a global set of display attributes of the currently displayed image, (ELIMINATE BY MERGING WITH 'dispImgInfo' !!!!!)
 * 
 * **PILAS! puede eliminar el grupo de variables globales, y tener todo dentro de 'dispImgInfo' manejandolo como un objeto. Cada vez que agregue una 
 * imagen nueva y el archivo venga desde 'upload.php' resetea la variable y listo hermano.
 * 
 * 1. When loaded, the image is rendered using the global variables that begin with 'disp'
 * 2. When in cropping mode, and the 'Set' button is pressed, the current global display variables are assigned to attributes of 
 * the imgNames[selectedChild] array in the form 'modifiedW', 'modifiedH', 'modifiedLeft' and so on. Also the 'edited' variable is set to true.
 * 3. When an unselected image is selected, Two things can happen:
 *    3.1: if the edited prop is false: the ORIGINAL display attributes of the NthChild are assigned to the global display variables
 *    3.2: if the edited prop is true: the MODIFIED display attributes of the NthChild are assigned to the global display variables
 * 4. 
 */



/*/
-----------------------------------------------------------------------------------
------------------------------------ Functions ------------------------------------ 
-----------------------------------------------------------------------------------
/*/

function killE(ee){
  ee.stopPropagation();
  ee.preventDefault();
}

function deselectAllImagesList(){
  var boys = lista.children;
  for(var i = 0; i < boys.length; i++){
    boys[i].classList.remove("list-item-selected");
    boys[i].innerHTML = imgNames[i].name;
    
  }
}

function refreshIds(){
  var boys = lista.children;
  for(var i = 0; i < boys.length; i++){
      boys[i].id = i;
      //console.log("refreshing: "+boys[i].id);
  }
}

function checkDisplayAreaVisivility(){
  if (lista.children.length == 0){
    displayImg.classList.add('hidden');
  } else{
    displayImg.classList.remove('hidden');
  }
}

function selectNthChild(number){

  if(selectedChild != -1){ //runs the first time when there is no selected items and selectedChild is -1
    deselectAllImagesList();
  }
  lista.children[number].classList.add("list-item-selected");
  lista.children[number].innerHTML = imgNames[number].name + "<img id='"+number+"' src="+xButtonPath+" class='micro-button micro-but-delete' onclick='deleteImage(event)'>";
  selectedChild = number;
  renderImageFromSelection(selectedChild);
  checkDisplayAreaVisivility();
  /*/
  add a check to prompt the user asking 
  "are you sure you want to leave cropping mode?", 
  if he does, save cropping attributes, and then leave 
  the actual cropping mode/*/
  if(croppingMode){
    var exit_ = confirm('Leaving the cropping changes unsaved? (click the "Set" button to save them)');
    if(exit_){
      //saveDisplayAttributes();
      /* 
        ToDo: Make a method to reset the image's displaying attributes to the previously available
      */
      leaveCroppingMode();
    } 
    
  }
  
}


/*/
The event comes from the X button inside of the list item. 
/*/
function deleteImage(event){
  killE(event);
  var delete_ = confirm("Are you sure you want to delete that image?");
  if (delete_){                                 //delete image

    let delId = event.target.id;               //obtains the id of the item to be deleted from the clicked img tag
    lista.removeChild(lista.children[delId]);   //removes the element from the browsers view
    imgNames.splice(delId, 1);                  //removes the element from the array of displayed images info
    refreshIds();                               //resets the IDs matching the new image list size
    
    //Assigns selectedChild
    if(lista.children.length == 0){
      selectedChild = -1;                       //runs selectNthChild with selectedChild on -1 so that it will select the first child
      dispImgW = 0;
      dispImgH = 0;
      checkDisplayAreaVisivility();
      leaveCroppingMode();
    } else{
      selectNthChild(0);
    }
    checkButtons();
  }
  // do nothing
}

function checkRepeatedImages(){
  console.log("repeated!");
}

function clearCanvas(){
  console.log("canvas cleared!");
}

function resetSliders(){
  console.log("sliders reset!");
}

function resetPreviewImagePosition(){
  console.log("preview area position reset!");
}

/**
 * Displays a selected image recovering its cropping information if available
 */
function renderImageFromSelection(){
  // displayImg.onload = function(){
  //   console.log("lol man, lol");
  // }
  displayImg.src = imgNames[selectedChild].src;
  retrieveDisplayAttributesNthChild(selectedChild);
  updateDisplayImageAttributes();
}

function arrayContains(lookey, arrayy){
  return ($.inArray(lookey, arrayy) > -1);
}

function toggleButton(button){
  let classes = button.classList;
  if(arrayContains('btn-invert-disabled', classes)){
    classes.remove('btn-invert-disabled');
    classes.add('btn-invert');
  } else if(arrayContains('btn-invert', classes)){
    classes.add('btn-invert-disabled');
    classes.remove('btn-invert');
  }
}

function enableButton(button){
  let classes = button.classList;
  if(arrayContains('btn-invert-disabled', classes)){
    classes.remove('btn-invert-disabled');
    classes.add('btn-invert');
  }
}

function disableButton(button){
  let classes = button.classList;
  if(arrayContains('btn-invert', classes)){
    classes.add('btn-invert-disabled');
    classes.remove('btn-invert');
  }
}

/*/
Evaluates the buttons that should be displayed at any given time
Takes into consideration:
  the number of images in the 'Uploaded Images' list
  whether or not the app is in cropping mode
/*/
function checkButtons(){
  let listSize = lista.children.length;
  if(listSize == 0){                          //If there are no items, all buttons are disabled
    disableButton(butCrop);
    disableButton(butSet);
    disableButton(butGen);
  } else if(listSize == 1){                   //If there is only 1 item, it could be used for a new sample or cropper. but is made reference by default.
    enableButton(butGen);
    enableButton(butCrop);
    disableButton(butFind);
    if(croppingMode){
      disableButton(butGen);
      disableButton(butFind);
      disableButton(butSet);
      butSet.innerHTML = "Set";
    }
  } else if(listSize >= 2){                   //With two items is possible to execute the program. 

    /*/
    FIX THIS PART AS SOON AS YOU FIX THE dispImgInfo array with the promises or callbacks 
    /*/
    //if(!dispImgInfo.reference){ //Check whether the selected item is NOT set as reference, in which case activates butSet. 
    //  enableButton(butSet);
    //}

    enableButton(butFind);
  }

}

/**
 * 
 */
function enterCroppingMode(){
  croppingMode = true;
  butCrop.classList.toggle("hidden");
  butSetCrop.classList.toggle("hidden");
  //Make the displayed image draggable
  displayImg.style.cursor = 'all-scroll';
  dragElement(displayImg);
  for(let i = 0; i < croppingTools.length; i++){
    croppingTools[i].classList.add('visible');
    croppingTools[i].classList.remove('hidden');
  }

  
  // if(croppingMode){  //Case in which cropping mode is already active and the user pressed the "Set" button to accept the changes on his image
  //   leaveCroppingMode();
  // } else{
  //   croppingMode = true;

  //   //Make the displayed image draggable
  //   displayImg.style.cursor = 'all-scroll';
  //   dragElement(displayImg);

  //   for(let i = 0; i < croppingTools.length; i++){
  //     croppingTools[i].classList.add('visible');
  //     croppingTools[i].classList.remove('hidden');
  //   }
  // }
  // checkButtons();
}

function leaveCroppingMode(){
  croppingMode = false;
  butCrop.classList.toggle("hidden");
  butSetCrop.classList.toggle("hidden");
  //Make the displayed image NOT draggable
  cancelDragElement(displayImg);
  displayImg.style.cursor = 'default'; 

  //Persist the cropping information to the database


  for(let i = 0; i < croppingTools.length; i++){
    croppingTools[i].classList.add('hidden');
    croppingTools[i].classList.remove('visible');
  }
}

/**
 * Saves the attributes of the image currentlly displayed as props of the selectedChild'th element of imgNames.
 * runs the leaveCroppingMode() method.
 */
function saveDisplayAttributes(){
  //Updates the cropping information in the imgNames array
  imgNames[selectedChild].edited = true; 
  imgNames[selectedChild].angle = dispImgAngle;
  imgNames[selectedChild].zoom = dispImgZoom;
  imgNames[selectedChild].top = dispImgTop;
  imgNames[selectedChild].left = dispImgLeft;
  imgNames[selectedChild].originx = dispImgOriginX;
  imgNames[selectedChild].originy = dispImgOriginY;
  imgNames[selectedChild].originalh = origImgH;
  imgNames[selectedChild].originalw = origImgW;
  imgNames[selectedChild].originaltop = origImgH;
  imgNames[selectedChild].originalleft = origImgW;
  

  leaveCroppingMode();

}

function resetDisplayInfo(){

}

/**
 * Retreives the display information of the Nth element of the imgNames array and assigns the display values to 
 * the global variables used to render the display
 * @param {int} childNum 
 */
function retrieveDisplayAttributesNthChild(childNum){
  if(imgNames[childNum].edited){
    dispImgAngle = imgNames[childNum].angle;
    dispImgZoom = imgNames[childNum].zoom;
    dispImgTop = imgNames[childNum].top;
    dispImgLeft = imgNames[childNum].left;
    dispImgOriginX = imgNames[childNum].originx;
    dispImgOriginY = imgNames[childNum].originy;
  } else {
    console.log("no cropping info to display");
  }
  
}

/**
 * Takes in a file list and extracts the first one. returns the file or null if there is no file.
 * @param {FileList} fileList 
 */
function getFile(fileList){
  let file = null;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }
  return file;
}

/**
 * Sends images to the PHP file called 'upload.php'
 * @param {FileList} fileList 
 * @param {processNewUpload(fileList)} callback 
 */
function sendImageToPhp(fileList, callback){
  let file = getFile(fileList);
  if (file !== null){
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      url: 'upload.php',
      type: 'post',
      data: formData,
      contentType: false,
      processData: false,
      success: function(response){
        if(response != 0){
          //Checks that the response has no errors
          if (isJsonString(response)){
            dispImgInfo = JSON.parse(response);
            
            callback(fileList);   /*/ Executes processNewUpload(fileList) /*/

          } else if (isError(response)) {
              alert(response);
          } else {
            alert("Something's fishy around here...");
          }
        } else {
          alert("Error sending file to the server (uploading script)");
        }
      },
    });
  }
}


/**
 * Checks whether a string is an error sent by upload.php
 * @param {String} str 
 */
function isError(str){
  if(str.startsWith("Error: ")){
    return true;
  }
  return false;
}

/**
 * Checks whether a String has a valid json structure and is safe to parse
 * @param {String} str 
 */
function isJsonString(str){
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

/**
 * Checks the new file's validity.
 * Renders the image in the browser. 
 * Adds the image to the display list of uploaded images.
 * Updates the global variables controlling the currently displayed image, dimensions, etc.
 * @param {FileList} fileList 
 */
function processNewUpload(fileList) {
  let file = getFile(fileList);
  if (file !== null) {
    
    let originalValuesObject = calculateOriginalDisplayDimensions(dispImgInfo.widt, dispImgInfo.heig, containerWidth, containerHeight);

    //displayImg.onload = customImgOnload();
    displayImg.onload = function(){
      // if (displayImg.naturalHeight > displayImg.naturalWidth){
      //   //portrait ratio
      //   origImgH = containerHeight;
      //   origImgW = displayImg.naturalWidth * containerHeight / displayImg.naturalHeight;
      //   dispImgLeft = (containerWidth - origImgW) / 2;
      //   dispImgTop = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
      // } else {
      //   //landscape (or square) ratio
      //   if(displayImg.naturalWidth/displayImg.naturalHeight > containerWidth/containerHeight){
      //     // w/h ratio is larger than that of the frame where the image is dislayed
      //     origImgH = displayImg.naturalHeight * containerWidth / displayImg.naturalWidth;
      //     origImgW = containerWidth;
      //     dispImgTop = (containerHeight - origImgH) / 2;
      //     dispImgLeft = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
      //   } else {
      //     // w/h ratio is smaller than that of the frame where the image is dislayed 
      //     origImgH = containerHeight;
      //     origImgW = displayImg.naturalWidth * containerHeight / displayImg.naturalHeight;
      //     dispImgLeft = (containerWidth - origImgW) / 2;
      //     dispImgTop = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
          
          
      //   }
      // }
      //assigns the value of the original display to the display (the one that changes with zoom, rotate and dragging)
      dispImgH = originalValuesObject.h; 
      dispImgW = originalValuesObject.w;

      /**
       * TODO: 
       * if(edited){assign using the edited values} else {assign using the original values}
       */
      //
      dispImgOriginX = originalValuesObject.w/2;
      dispImgOriginY = originalValuesObject.h/2;
      displayImg.width = originalValuesObject.w;
      displayImg.height = originalValuesObject.h;
      dispImgTop = originalValuesObject.top;
      dispImgLeft = originalValuesObject.left;
      updateDisplayImageAttributes();
    }
    
    displayImg.src = URL.createObjectURL(file);
    console.log('displayImg', displayImg);

    
    //Saves the image in the imgArray
    imgNames.push({
      "name": file.name,
      "size": file.size,
      "type": file.type,
      "naturalW": dispImgInfo.widt,            //displayImg.naturalWidth,
      "naturalH": dispImgInfo.heig,
      "dispOrigW": originalValuesObject.w,                   //This remains from the previous picture!!!! ERROR ERROR ERROR!!!
      "dispOrigH": originalValuesObject.h,                   //This remains from the previous picture!!!! ERROR ERROR ERROR!!!
      "dispOrigTop": originalValuesObject.top,
      "dispOrigLeft": originalValuesObject.left,
      "src": dispImgInfo.loca,
      "edited": false
    });
    
    //Updates the image list with the name of the recently uploaded image
    lista.insertAdjacentHTML('beforeend',"<li class='list-item'>" + imgNames[imgNames.length-1].name + "</li>");
    
    //Assigns the IDs of all the elements in the list
    refreshIds();

    //Adds, to the newly added list item, the listener to change on click
    lista.lastElementChild.addEventListener('click', (e) => {
      killE(e);
      selectNthChild(e.target.id);
    });
    //Selects the most recently uploaded image's name on the list
    selectNthChild(lista.children.length-1);

    checkButtons();
  }
}

/**
 * Takes in the natural dimensions of the image file and the dimensions of the container in the browser, 
 * and calculates the height, width, top and left css properties to display the image centered fitted on the container. 
 * @param {Int} naturalW 
 * @param {Int} naturalH 
 * @param {Int} containerW 
 * @param {Int} containerH 
 */
function calculateOriginalDisplayDimensions(naturalW, naturalH, containerW, containerH){

  let returnArray = Array();

  if (naturalH > naturalW){
    //portrait ratio
    returnArray.h = containerH;
    returnArray.w = naturalW * containerH / naturalH;
    returnArray.left = (containerW - returnArray.w) / 2;
    returnArray.top = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
  } else {
    //landscape (or square) ratio
    if(naturalW/naturalH > containerW/containerH){
      // w/h ratio is larger than that of the frame where the image is dislayed
      returnArray.h = naturalH * containerW / naturalW;
      returnArray.w = containerW;
      returnArray.left = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
      returnArray.top = (containerH - returnArray.h) / 2;
    } else {
      // w/h ratio is smaller than that of the frame where the image is dislayed 
      returnArray.h = containerH;
      returnArray.w = naturalW * containerH / naturalH;
      returnArray.left = (containerW - returnArray.w) / 2;
      returnArray.top = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
    }
  }
  return returnArray;
}

/**
 * LOL, right?
 */
function helloWorld(){
  console.log('hello world');
}










   











