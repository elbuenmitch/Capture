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
let dispImgAngle = 0;
let dispImgZoom = 1;




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


//Capture method through the browser
const fileInput = document.getElementById('file-input1');

//Elements to obtain the img tag where the image will be displayed
let displayImg = document.getElementById('display-img');
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

var lastZoomChange = 0;

//Update the current slider value (each time you drag the slider handle)
sliderZoom.oninput = function(e) {
  lastZoomChange = parseFloat(outputZoom.innerHTML) - this.value;
  console.log('lastZoomChange', lastZoomChange);
  outputZoom.innerHTML = this.value;
  
  dispImgW = origImgW*e.target.value;
  dispImgH = origImgH*e.target.value;

  //X axis
  dispImgLeft = dispImgLeft + (lastZoomChange * origImgW)/2;
  dispImgOriginX = dispImgOriginX - (lastZoomChange * origImgW)/2;

  //Y axis
  dispImgTop = dispImgTop + (lastZoomChange * origImgH)/2;
  dispImgOriginY = dispImgOriginY - (lastZoomChange * origImgH)/2;
  
  dispImgZoom = this.value;
  //displayImg.setAttribute('style', 'transform: rotate('+dispImgAngle+'deg) scale('+ dispImgZoom+')');
  //dispImageAttributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px';
  
  
  updateDisplayImageAttributes();
  displayImg.setAttribute('style', dispImageAttributes);

  
 }

//Update the current slider value (each time you drag the slider handle)
sliderAngle.oninput = function(e) {
  outputAngle.innerHTML = this.value;
  dispImgAngle = e.target.value;
  //displayImg.setAttribute('style', 'transform: rotate('+dispImgAngle+'deg) scale('+ dispImgZoom+')');
  //displayImg.setAttribute('style', 'transform: rotate('+dispImgAngle+'deg) scale('+ dispImgZoom+'); top:'+ dispImgTop+'; left:'+dispImgLeft);
  //dispImageAttributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px';
  updateDisplayImageAttributes();
  displayImg.setAttribute('style', dispImageAttributes);
}

//Make the displayed image draggable
dragElement(displayImg);

function dragElement(elmnt) {
    //console.log('elmnt.offsetHeight: '+ elmnt.offsetHeight+", elmnt.offsetWidth: "+elmnt.offsetWidth);
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


      /* 
        Section calculates the image's location based on a model that DOESNT use the "Scale" css prop
      */
      //Arranges the horizontal axis
      dispImgOriginX = dispImgOriginX + pos1*dispImgZoom;
      dispImgLeft = dispImgLeft - pos1*dispImgZoom;
      
      //Arranges the vertical axis
      dispImgOriginY = dispImgOriginY + pos2*dispImgZoom;
      dispImgTop = dispImgTop - pos2*dispImgZoom;
      




      /* 
        Section calculates the image's location based on a model that uses the "Scale" css prop
      */
      //Arranges the horizontal axis
      //dispImgOriginX = Math.min(Math.max(dispImgOriginX + pos1, cropperWidth/2), -(cropperWidth/2)+origImgW);
      //dispImgLeft = Math.max(Math.min(dispImgLeft - pos1, cropperLeft), -origImgW+cropperLeft+cropperWidth);

      //Arranges the vertical axis
      //dispImgOriginY = Math.min(Math.max(dispImgOriginY + pos2, cropperHeight/2), -(cropperHeight/2)+origImgH);
      //dispImgTop = Math.max(Math.min(dispImgTop - pos2, cropperTop), -origImgH+cropperTop+cropperHeight);



      //dispImgOriginY = (dispImgOriginY + pos2);
      //dispImgTop = dispImgTop - pos2;

      //dispImgOriginX = (dispImgOriginX + pos1);
      //dispImgLeft = dispImgLeft - pos1;
      
      //dispImgTop = dispImgTop - pos2;
      
      mousePos2.innerHTML = 'dispImgLeft: '+ dispImgLeft+', dispImgTop: '+ dispImgTop+', dispImgOriginX: '+ dispImgOriginX+', dispImgOriginY: '+ dispImgOriginY;
      
      // set the element's new position:
      //dispImgTop = Math.max(topContainer, Math.min(elmnt.offsetTop - pos2, heightContainer-elmnt.offsetHeight+topContainer));
      //dispImgLeft = Math.max(leftContainer, Math.min(elmnt.offsetLeft - pos1, widthContainer-elmnt.offsetWidth+leftContainer));

      updateDisplayImageAttributes();
    }
    
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function updateDisplayImageAttributes(){
  //dispImageAttributes = 'transform: rotate('+dispImgAngle+'deg) scale('+dispImgZoom+'); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px; transform-origin:'+dispImgOriginX+'px '+dispImgOriginY+'px';
  dispImageAttributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px; transform-origin:'+dispImgOriginX+'px '+dispImgOriginY+'px';
  displayImg.setAttribute('style', dispImageAttributes);
}

//Mouse position
let mousePos = document.getElementById("mouse-pos");
let mousePos2 = document.getElementById("mouse-pos2");
$("body").mousemove(function(e) {
  mousePos.innerHTML = "x: "+e.pageX+", y: "+e.pageY;
})


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
  lista.children[number].innerHTML = imgNames[number].name + "<img id='"+number+"' src='./img/micro-but-del.svg' class='micro-button micro-but-delete' onclick='deleteImage(event)'>";
  selectedChild = number;
  renderImageFromSelection(selectedChild);
  checkDisplayAreaVisivility();
  leaveCroppingMode();
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

//Super simple, huh? I'm amazed too.
function renderImageFromSelection(){
  displayImg.src = imgNames[selectedChild].src;
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
    console.log('butFind', butFind);
    if(croppingMode){
      console.log('croppingMode', croppingMode);
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

/*/

/*/
function enterCroppingMode(){
  console.log("now in cropping mode!");
  if(croppingMode){  //Case in which cropping mode is already active and the user pressed the "Set" button to accept the changes on his image
    leaveCroppingMode();
  } else{
    croppingMode = true;
    for(let i = 0; i < croppingTools.length; i++){
      croppingTools[i].classList.add('visible');
      croppingTools[i].classList.remove('hidden');
    }
  }
  checkButtons();
}

function leaveCroppingMode(){
  croppingMode = false;
  for(let i = 0; i < croppingTools.length; i++){
    croppingTools[i].classList.add('hidden');
    croppingTools[i].classList.remove('visible');
  }
}

//takes in a file list and extracts the first one. returns the file or null if there is no file.
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

/*/
Sends images to PHP
/*/
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


//Checks whether a string is an error sent by upload.php
function isError(str){
  if(str.startsWith("Error: ")){
    return true;
  }
  return false;
}

//Checks whether a String has a valid json structure and is safe to parse
function isJsonString(str){
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}




/*/
  Checks the new file's validity
  Renders the image in the browser 
  Adds the image to the display list of uploaded images
  Updates the global variables controlling the currently displayed image, dimensions, etc.
/*/
function processNewUpload(fileList) {
  let file = getFile(fileList);
  if (file !== null) {
    
    //displayImg.onload = customImgOnload();
    displayImg.onload = function(){
      if (displayImg.naturalHeight > displayImg.naturalWidth){
        //portrait ratio
        origImgH = containerHeight;
        origImgW = displayImg.naturalWidth * containerHeight / displayImg.naturalHeight;
        dispImgLeft = (containerWidth - origImgW) / 2;
        dispImgTop = 0;
        displayImg.height = origImgH;
        displayImg.width = origImgW;
      } else {
        //landscape (or square) ratio
        if(displayImg.naturalWidth/displayImg.naturalHeight > containerWidth/containerHeight){
          // w/h ratio is larger than that of the frame where the image is dislayed
          origImgH = displayImg.naturalHeight * containerWidth / displayImg.naturalWidth;
          origImgW = containerWidth;
          dispImgTop = (containerHeight - origImgH) / 2;
          dispImgLeft = 0;
          displayImg.height = origImgH;
          displayImg.width = origImgW;
        } else {
          // w/h ratio is smaller than that of the frame where the image is dislayed 
          origImgH = containerHeight;
          origImgW = displayImg.naturalWidth * containerHeight / displayImg.naturalHeight;
          dispImgLeft = (containerWidth - origImgW) / 2;
          dispImgTop = 0;
          displayImg.height = origImgH;
          displayImg.width = origImgW;
        }
      }
      //assigns the value of the original display to the display (the one that changes with zoom, rotate and dragging)
      dispImgH = origImgH; 
      dispImgW = origImgW;
      dispImgOriginX = origImgW/2;
      dispImgOriginY = origImgH/2;
      
      updateDisplayImageAttributes();
    }
    
    displayImg.src = URL.createObjectURL(file);
    console.log('displayImg', displayImg);

    //Saves the image in the imgArray
    imgNames.push({
      "name": file.name,
      "size": file.size,
      "type": file.type,
      "naturalW": displayImg.naturalWidth,
      "naturalH": displayImg.naturalHeight,
      "dispOrigW": origImgW,
      "dispOrigH": origImgH,

      "src": dispImgInfo.loca
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

/*/
  LOL, right?
/*/
function helloWorld(){
  console.log('hello world');
}








/*
Promises worksheet

function createPost(attributes){
  return new Promise((resolve, reject) => {
    const error = false;
    attributes = 'height:'+dispImgH+'px; width:'+dispImgW+'px; transform: rotate('+dispImgAngle+'deg); top:'+ dispImgTop+'px; left:'+dispImgLeft+'px';
    if(!error){
      resolve();
    } else {
      reject();
    }
  });
}

const promise1 = Promise.resolve('Hello World');
const promise2 = 10;
const promise3 = new Promise((resolve, reject) => setTimeout(resolve, 2000, 'Goodbye'));

Promise.all([promise1, promise2, promise3]).then((values) => console.log(values));

console.log('LOL');
*/


   











