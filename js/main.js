
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

//Info about the container for the displayed image
let containerWidth = 500;
let containerHeight = 300;
let cropperWidth = 200;
let cropperHeight = 200;
let cropperLeft = 150;
let cropperTop = 50;

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
fileInput.addEventListener('change', (e) => {
  killE(e);
  // processNewUpload(e.target.files);
  if(!croppingMode){
    sendImageToPhp(e.dataTransfer.files, processNewUpload);
  } else {
    alert("Please finish cropping "+imgNames[selectedChild].name+" before adding a new image.");
  }
});

//Actions listener for the dropping area
target.addEventListener('drop', (e) => {
  killE(e);
  if(!croppingMode){
    sendImageToPhp(e.dataTransfer.files, processNewUpload);
  } else {
    alert("Please finish cropping "+imgNames[selectedChild].name+" before adding a new image.");
  }
  
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

  imgNames[selectedChild].lastZoomChange = parseFloat(outputZoom.innerHTML) - this.value;
  outputZoom.innerHTML = this.value;
  
  imgNames[selectedChild].zoom = this.value;

  if(imgNames[selectedChild].edited){

  }
  imgNames[selectedChild].scaleOffsetX = ((imgNames[selectedChild].defWidth*(imgNames[selectedChild].zoom-1))/2);
  imgNames[selectedChild].scaleOffsetY = ((imgNames[selectedChild].defHeight*(imgNames[selectedChild].zoom-1))/2);
  
  imgNames[selectedChild].left = Math.max(Math.min(imgNames[selectedChild].left*(1-imgNames[selectedChild].lastZoomChange), cropperLeft+imgNames[selectedChild].scaleOffsetX), -imgNames[selectedChild].defWidth+cropperLeft+cropperWidth-imgNames[selectedChild].scaleOffsetX);
  imgNames[selectedChild].top = Math.max(Math.min(imgNames[selectedChild].top*(1-imgNames[selectedChild].lastZoomChange), cropperTop+imgNames[selectedChild].scaleOffsetY), -imgNames[selectedChild].defHeight+cropperTop+cropperHeight-imgNames[selectedChild].scaleOffsetY);

  mousePos2.innerHTML = 'imgNames[selectedChild].scaleOffsetX: '+imgNames[selectedChild].scaleOffsetX;

  updateDisplayImageAttributes();
 }

//Update the current slider value (each time you drag the slider handle)
sliderAngle.oninput = function(e) {
  outputAngle.innerHTML = this.value;
  imgNames[selectedChild].angle = e.target.value;
  updateDisplayImageAttributes();
}

function cancelDragElement(elmnt){
  elmnt.onmousedown = null;
  document.onmouseup = null;
  document.onmousemove = null;
}

function dragElement(elmnt) {
    //Variables for the movement
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;  
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

      imgNames[selectedChild].scaleOffsetX = ((imgNames[selectedChild].defWidth*(imgNames[selectedChild].zoom-1))/2);
      console.log('imgNames[selectedChild].scaleOffsetX', imgNames[selectedChild].scaleOffsetX);
      imgNames[selectedChild].scaleOffsetY = ((imgNames[selectedChild].defHeight*(imgNames[selectedChild].zoom-1))/2);

      imgNames[selectedChild].left = Math.max(Math.min(imgNames[selectedChild].left - pos1, cropperLeft+imgNames[selectedChild].scaleOffsetX/2), -imgNames[selectedChild].defWidth+cropperLeft+cropperWidth-imgNames[selectedChild].scaleOffsetX);
      imgNames[selectedChild].top = Math.max(Math.min(imgNames[selectedChild].top - pos2, cropperTop+imgNames[selectedChild].scaleOffsetY/2), -imgNames[selectedChild].defHeight+cropperTop+cropperHeight-imgNames[selectedChild].scaleOffsetY);

      imgNames[selectedChild].transformOriginX =  Math.max(Math.min(imgNames[selectedChild].transformOriginX + pos1, imgNames[selectedChild].defWidth-cropperWidth/2+imgNames[selectedChild].scaleOffsetX/2), cropperWidth/2);
      imgNames[selectedChild].transformOriginY =  Math.max(Math.min(imgNames[selectedChild].transformOriginY + pos2, imgNames[selectedChild].defHeight-cropperHeight/2+imgNames[selectedChild].scaleOffsetY/2), cropperHeight/2);

      //DELETABLE
      //mousePos2.innerHTML = 'imgNames[selectedChild].left: '+ imgNames[selectedChild].left+', imgNames[selectedChild].top: '+ imgNames[selectedChild].top+', imgNames[selectedChild].transformOriginX: '+ imgNames[selectedChild].transformOriginX+', imgNames[selectedChild].transformOriginY: '+ imgNames[selectedChild].transformOriginY;
      mousePos2.innerHTML = 'imgNames[selectedChild].scaleOffsetX: '+imgNames[selectedChild].scaleOffsetX;
      updateDisplayImageAttributes();
    }
    
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function updateDisplayImageAttributes(){
  if(croppingMode){
    imgNames[selectedChild].attributesString = 'transform: rotate('+imgNames[selectedChild].angle+'deg) scale('+imgNames[selectedChild].zoom+'); top:'+ imgNames[selectedChild].top+'px; left:'+imgNames[selectedChild].left+'px; transform-origin:'+imgNames[selectedChild].transformOriginX+'px '+imgNames[selectedChild].transformOriginY+'px';
  } else {
    if(imgNames[selectedChild].edited) {
      imgNames[selectedChild].attributesString = 'transform: rotate('+imgNames[selectedChild].angle+'deg) scale('+imgNames[selectedChild].zoom+'); top:'+ imgNames[selectedChild].top+'px; left:'+imgNames[selectedChild].left+'px; transform-origin:'+imgNames[selectedChild].transformOriginX+'px '+imgNames[selectedChild].transformOriginY+'px';
    } else {
      imgNames[selectedChild].attributesString = 'transform: rotate('+imgNames[selectedChild].defAngle+'deg) scale('+imgNames[selectedChild].defZoom+'); top:'+ imgNames[selectedChild].defTop+'px; left:'+imgNames[selectedChild].defLeft+'px; transform-origin:'+imgNames[selectedChild].defTransformOriginX+'px '+imgNames[selectedChild].defTransformOriginY+'px';  
    }
  }

  displayImg.height = imgNames[selectedChild].defHeight;
  displayImg.width = imgNames[selectedChild].defWidth;
  displayImg.setAttribute('style', imgNames[selectedChild].attributesString);
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

/**
 * Depending of whether the window is in cropping mode or not, updates the selectedChild to that specified in the params.
 * Updates the display to show the info of the selected child and leaves cropping mode
 * @param {int} number 
 */
function selectNthChild(number){

  if(croppingMode){
    var exit_ = confirm('Leaving the cropping changes unsaved? (click the "Set" button to save them)');
    if(exit_){
      //the page is in cropping more and the user presses "OK" on the confirm screen

      markAsSelectedOnList(number); //alter selectedChild and the display info of the list

      updateDisplayWithNthChildInfo(number); //Updates attributes of the HTML elements
    
      checkDisplayAreaVisivility();

      leaveCroppingMode();
    } else {
      //the page is in cropping mode and the user presses "CANCEL" on the confirm popup

      //does nothing and remains on the same screen
    }
  } else {
    //the screen is NOT in cropping mode
    markAsSelectedOnList(number); //alter selectedChild and the display info of the list
    
    updateDisplayWithNthChildInfo(number); //Updates attributes of the HTML elements
  
    checkDisplayAreaVisivility();
  }
}

function markAsSelectedOnList(number){
  if(selectedChild != -1){ //runs the first time when there is no selected items and selectedChild is -1
    deselectAllImagesList();
  }
  lista.children[number].classList.add("list-item-selected");
  lista.children[number].innerHTML = imgNames[number].name + "<img id='"+number+"' src="+xButtonPath+" class='micro-button micro-but-delete' onclick='deleteImage(event)'>";
  selectedChild = number;
}

function updateDisplayWithNthChildInfo(number){
  //Updates attributes of the HTML elements
  displayImg.src = imgNames[number].location;
  displayImg.setAttribute('style', imgNames[number].attributesString);
  displayImg.height = imgNames[number].defHeight;
  displayImg.width = imgNames[number].defWidth;
  sliderZoom.value = imgNames[number].zoom;
  sliderAngle.value = imgNames[number].angle;
  outputZoom.innerHTML = imgNames[number].zoom;
  outputAngle.innerHTML = imgNames[number].angle;
}

/*/
The event comes from the X button inside of the list item. 
/*/
function deleteImage(event){
  killE(event);
  var delete_ = confirm("Are you sure you want to delete that image?");
  if (delete_){                                 //delete image

    let delId = event.target.id;                //obtains the id of the item to be deleted from the clicked img tag
    lista.removeChild(lista.children[delId]);   //removes the element from the browsers view
    imgNames.splice(delId, 1);                  //removes the element from the array of displayed images info
    refreshIds();                               //resets the IDs matching the new image list size
    
    //Assigns selectedChild
    if(lista.children.length == 0){
      selectedChild = -1;                       //runs selectNthChild with selectedChild on -1 so that it will select the first child
      checkDisplayAreaVisivility();
      leaveCroppingMode();
    } else{
      selectNthChild(0);
    }
    checkButtons();
  }
  // do nothing
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
      //butSet.innerHTML = "Set";
    }
  } else if(listSize >= 2){                   //With two items is possible to execute the program. 

    if(croppingMode){
      disableButton(butGen);
      disableButton(butFind);

    }
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
  //butGen.classList.toggle("hidden");
  //Make the displayed image draggable
  displayImg.style.cursor = 'all-scroll';
  dragElement(displayImg);
  for(let i = 0; i < croppingTools.length; i++){
    croppingTools[i].classList.add('visible');
    croppingTools[i].classList.remove('hidden');
  }
  checkButtons();
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
  checkButtons();
}

// /**
//  * Saves the attributes of the image currentlly displayed as props of the selectedChild'th element of imgNames.
//  * runs the leaveCroppingMode() method.
//  */
function saveDisplayAttributes(){
  //Spits out the information for the cropping in Python
  console.log(imgNames[selectedChild]);
  sendCroppingInfoToPhp();


  leaveCroppingMode();
} 

function sendCroppingInfoToPhp(){
  console.log('estoy mandando!');

  let data = imgNames[selectedChild];
  $.ajax({
    url: 'savecroppinginfo.php',
    type: 'post',
    data: data,
    //data: JSON.stringify({ data: data }),
    // contentType: "application/json; charset=utf-8",
    // dataType: "json",
    success: function(response){
      console.log('response', response);
      alert(response);
    },
    failure: function(errMsg) {
        console.log('errMsg', errMsg);
        alert(errMsg);
    }
  });
}

function pythonAndPhp(){
  let data = imgNames[selectedChild];
  $.ajax({
    url: 'lol.php',
    type: 'post',
    data: data,
    success: function(response){
      console.log('response', response);
    },
    failure: function(error){
      console.log('error', error);
    }
  });
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
    console.log('formData', formData);
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
            // dispImgInfo = new Array();
            // dispImgInfo = JSON.parse(response);            
            callback(fileList, JSON.parse(response));   /*/ Executes processNewUpload(fileList) /*/

          } else if (isError(response)) {
              alert(response);
              console.log('response', response);
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
 * Checks the new file's validity.
 * Renders the image in the browser. 
 * Adds the image to the display list of uploaded images.
 * Updates the global variables controlling the currently displayed image, dimensions, etc.
 * @param {FileList} fileList 
 */
function processNewUpload(fileList, array) {
  let refOrNot = (lista.length == 1) ? false : true;  //TODO: set the refImage updater
  let file = getFile(fileList);
  if (file !== null && validDimensionsInfoArray(array)) {
    
    let defaultValuesObject = calculateOriginalDisplayDimensions(array.naturalWidth, array.naturalHeight, containerWidth, containerHeight);
    // let defaultValuesObject = calculateOriginalDisplayDimensions(dispImgInfo.naturalWidth, dispImgInfo.naturalHeight, containerWidth, containerHeight);
    
    displayImg.src = URL.createObjectURL(file);
    displayImg.width = defaultValuesObject.w;
    displayImg.height = defaultValuesObject.h;
    console.log('displayImg', displayImg);

    
    //Saves the image in the imgArray
    imgNames.push({
      "name": file.name,
      "size": file.size,
      "type": file.type,
      "naturalW": array.naturalWidth,            
      "naturalH": array.naturalHeight,
      "defWidth": defaultValuesObject.w,
      "defHeight": defaultValuesObject.h,
      "defTop": defaultValuesObject.top,
      "defLeft": defaultValuesObject.left,
      "defTransformOriginX": defaultValuesObject.transformOriginX,
      "defTransformOriginY": defaultValuesObject.transformOriginY,
      "defAngle": 0,
      "defZoom": 1,
      "width": defaultValuesObject.w,
      "height": defaultValuesObject.h,
      "top": defaultValuesObject.top,
      "left": defaultValuesObject.left,
      "transformOriginX": defaultValuesObject.transformOriginX,
      "transformOriginY": defaultValuesObject.transformOriginY,
      "angle": 0,
      "zoom": 1,
      "location": array.location,
      "attributesString": "",
      "isRefImage": refOrNot,
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

    //Creates a String attribute of the imgNames object that contains the display formatting
    updateDisplayImageAttributes();

    checkButtons();

    //displayImg.onload = customImgOnload();
    displayImg.onload = function(){

      if(imgNames[selectedChild].edited){

      } else {
        imgNames[selectedChild].height = imgNames[selectedChild].defHeight;
        imgNames[selectedChild].width = imgNames[selectedChild].defWidth;
        imgNames[selectedChild].top = imgNames[selectedChild].defTop;
        imgNames[selectedChild].left = imgNames[selectedChild].defLeft;
        imgNames[selectedChild].transformOriginX = imgNames[selectedChild].defTransformOriginX;
        imgNames[selectedChild].transformOriginY = imgNames[selectedChild].defTransformOriginY;
      }

      /**
       * TODO: 
       * if(edited){assign using the edited values} else {assign using the original values}
       */
      //

      //updateDisplayImageAttributes();
    }
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
  returnArray.transformOriginX = returnArray.w/2;
  returnArray.transformOriginY = returnArray.h/2;
  return returnArray;
}

/**
 * LOL, right?
 */
function helloWorld(){
  console.log('hello world');
}


/*/
-----------------------------------------------------------------------------------
-------------------------------- Auxiliar Methods --------------------------------- 
-----------------------------------------------------------------------------------
/*/

function killE(ee){
  ee.stopPropagation();
  ee.preventDefault();
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
 * Validates that the object contains the following properties: 'naturalWidth', 'naturalHeight', 'location'
 * @param {Object} obj 
 */
function validDimensionsInfoArray(obj){
  if (typeof obj.naturalWidth === 'undefined' || typeof obj.naturalHeight  === 'undefined' || typeof obj.location  === 'undefined'){
    return false;
  }
  return true;
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

   











