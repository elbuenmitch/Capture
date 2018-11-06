//resources
// https://www.w3schools.com/jsref/prop_style_transform.asp



// --------- Variables --------- //

//An Array to keep the names of the images
let imgNames = [];

//An indicator of the currently selected image on the list
let selectedChild = 0;

//Dimensions of the container for the displayed image
let container_width = 300;
let container_height = 300;

//The image element that contains the displayed image
let imageObj = new Image();
//imageObj.onload = imgCustomOnLoad();

let tempieBoy;
let currIm;
let rango; 


//Rotation and cropping variables
let angle = 0;
let zoom = 1;

// --------- Retrieving Elements from the DOM --------- //

let lista = document.getElementById('listica');

//Capture method through the browser
const fileInput = document.getElementById('file-input1');

//Elements to obtain the img tag where the image will be displayed
const displayImg = document.getElementById('display-img');
const displayImgParent = displayImg.parentElement;
//console.log("displayImg.height: "+displayImg.height+", displayImg.width: "+displayImg.width);

//Elements to obtain the canvas where the image is displayed
const canvas = document.getElementById('display-canvas');
const context = canvas.getContext('2d');

//Capture method using the drag & drop. Obtain the element of the dropping area
let target = document.getElementById('target');




// --------- Actions Listeners --------- //

//Action listener for the File Input through browsing
fileInput.addEventListener('change', (e) => renderImageInBrowser(e.target.files));

//Actions listener for the dropping area
target.addEventListener('drop', (e) => {
  killE(e);
  renderImageInBrowser(e.dataTransfer.files);
});

//Type of event for when the mouse is over the dragging area (not necessarely dragging something)
target.addEventListener('mouseenter', (e) =>{
  killE(e);
  target.classList.add("popped-out");
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




// --------- Functions --------- //

function killE(ee){
  ee.stopPropagation();
  ee.preventDefault();
}

function deselectAllImagesList(){
    //console.log("deselect");
    var boys = lista.children;
    for(var i = 0; i < boys.length; i++){
        boys[i].classList.remove("list-item-selected");
        //console.log("deselecting... " + i)
    }
}

function refreshIds(){
  //console.log("refresh");
  var boys = lista.children;
  for(var i = 0; i < boys.length; i++){
      boys[i].id = i;
  }
}


function selectNthChild(number){
    deselectAllImagesList();
    lista.children[number].classList.add("list-item-selected");
    selectedChild = number;
}

function checkRepeatedImages(){
    console.log("repeated!");
}

function clearCanvas(){
    console.log("canvas cleared!");
}

function renderImageInBrowser(fileList) {
  let file = null;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }
  if (file !== null) {
    var ww;
    var hh;
    
    displayImg.onload = function(){
      hh = displayImg.naturalHeight;
      ww = displayImg.naturalWidth;
      if (hh > ww){
        //portrait
        displayImg.width = ww/hh * container_width;
        displayImg.height = container_height;
        displayImgParent.classList.add('img-cont-row');
        displayImgParent.classList.remove('img-cont-col');
      } else {
        //landscape (or square)
        displayImg.height = hh/ww * container_height;
        displayImg.width = container_width;
        displayImgParent.classList.add('img-cont-col');
        displayImgParent.classList.remove('img-cont-row');
      }
    }

    displayImg.src = URL.createObjectURL(file);

    //segment done with the canvas (for reference)
    if(false){
   ////For the canvas
//
    ////var imageObj = new Image();
    ////imageObj.onload = imgCustomOnLoad();
    //imageObj.onload = function() {
    //  var x;
    //  var y;
    //  var w;
    //  var h;
    //  //console.log(imageObj.naturalHeight);
    //  //console.log(imageObj.naturalWidth);
    //	h = imageObj.naturalHeight;
    //	w = imageObj.naturalWidth;
    //	//New height
    //	if (h > w){
    //		//portrait
    //		w = w/h * container_width;
    //		h = container_height;
    //		x = (container_width - w) / 2;
    //		y = 0;
    //	} else {
    //		//landscape (or square)
    //		h = h/w * container_height;
    //		w = container_width;
    //		y = (container_height - h) / 2;
    //		x = 0;
    //  }
    //  context.drawImage(imageObj, x, y, w, h);
    //};
//
    //imageObj.src = URL.createObjectURL(file);
    //console.log(imageObj);
    //tempieBoy = imageObj;
    }
 
    //Saves the image in the imgArray
    imgNames.push({
      "name": file.name,
      "size": file.size,
      "type": file.type,
      "width": imageObj.naturalWidth,
      "height": imageObj.naturalHeight,
      "src": displayImg.src.split("blob:")[1]
    });
    //console.log(imgNames[imgNames.length-1]);
    
    //Updates the image list with the name of the recently uploaded image
    lista.insertAdjacentHTML('beforeend',"<li class='list-item'>" + imgNames[imgNames.length-1].name + "</li>");
    
    //Assigns the IDs of all the elements in the list
    refreshIds();

    //Adds, to the newly added list item, the listener to change on click
    lista.lastElementChild.addEventListener('click', (e) => {
        killE(e);
        //console.log(e);
        selectNthChild(e.target.id);
    });

    //Selects the most recently uploaded image's name on the list
    selectNthChild(lista.children.length-1);




    //TEMPORARYYY!!!! --- - - - - - - -
    currIm = document.images[0];
    sliderZoom = document.getElementById('slider-zoom');
    sliderAngle = document.getElementById('slider-angle');

    //sliderZoom.addEventListener('change', function(e){
    //  zoom = e.target.value;
    //  console.log("current zoom: "+zoom);
    //  currIm.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
    //}); 
//
    //sliderAngle.addEventListener('change', function(e){
    //  angle = e.target.value;
    //  console.log("current angle: "+angle);
    //  currIm.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
    //});

  }
}


function renderImageFromSelection(){
  console.log("renderImageFromSelection");
}













// SLIDER FROM W3 SCHOOLS
var sliderZoom = document.getElementById("slider-zoom");
var sliderAngle = document.getElementById("slider-angle");
var outputZoom = document.getElementById("output-zoom");
var outputAngle = document.getElementById("output-angle");
outputZoom.innerHTML = sliderZoom.value; // Display the default slider value
outputAngle.innerHTML = sliderAngle.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
sliderZoom.oninput = function(e) {
  outputZoom.innerHTML = this.value;
  zoom = e.target.value;
  console.log("current zoom: "+zoom);
  currIm.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
}

sliderAngle.oninput = function(e) {
  outputAngle.innerHTML = this.value;
  angle = e.target.value;
  console.log("current angle: "+angle);
  currIm.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
}


   



















// DEPRECATED FUNCTIONS!!! ///
function imgCustomOnLoad() {
  var x;
  var y;
  var w;
  var h;
  //console.log(imageObj.naturalHeight);
  //console.log(imageObj.naturalWidth);
  h = imageObj.naturalHeight;
  w = imageObj.naturalWidth;
  //New height
  if (h > w){
    //portrait
    w = w/h * container_width;
    h = container_height;
    x = (container_width - w) / 2;
    y = 0;
  } else {
    //landscape (or square)
    h = h/w * container_height;
    w = container_width;
    y = (container_height - h) / 2;
    x = 0;
  }
  context.drawImage(imageObj, x, y, w, h);
};

function changeImage(number){
  displayImg.src = imgNames[number].src;
}
