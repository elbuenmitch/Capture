//resources
// https://www.w3schools.com/jsref/prop_style_transform.asp



// --------- Variables --------- //

//An Array to keep the names of the images
let imgNames = [];

//An indicator of the currently selected image on the list
let selectedChild = 0;

//Dimensions of the container for the displayed image
let container_width = 500;
let container_height = 500;

//The image element that contains the displayed image
let imageObj = new Image();
//imageObj.onload = imgCustomOnLoad();

//Style attribute of the displayed image
let attributeList;

//location of the currently displayed image
let imageObjLocation;

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
//const canvas = document.getElementById('display-canvas');
//const context = canvas.getContext('2d');

//Capture method using the drag & drop. Obtain the element of the dropping area
let target = document.getElementById('target');

//Sliders
var sliderZoom = document.getElementById("slider-zoom");
var sliderAngle = document.getElementById("slider-angle");

//Output areas for the zoom and rotation
var outputZoom = document.getElementById("output-zoom");
outputZoom.innerHTML = sliderZoom.value; // Display the default slider value
var outputAngle = document.getElementById("output-angle");
outputAngle.innerHTML = sliderAngle.value; // Display the default slider value



//testing with the wrapper and wrapper
let wrapper2 = document.getElementsByClassName('wrapper-2')[0];






// --------- Actions Listeners --------- //

//Action listener for the File Input through browsing
fileInput.addEventListener('change', (e) => renderImageInBrowser(e.target.files));

//Actions listener for the dropping area
target.addEventListener('drop', (e) => {
  killE(e);
  renderImageInBrowser(e.dataTransfer.files);

  // ------ TEST TO SEND IMAGES TO PHP -------- //
  sendImageToPhp(e.dataTransfer.files);
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

// Update the current slider value (each time you drag the slider handle)
sliderZoom.oninput = function(e) {
  outputZoom.innerHTML = this.value;
  zoom = e.target.value;
  //console.log("current zoom: "+zoom);

  //attributeList = 'transform: rotate('+angle+'deg) scale('+zoom+');'+
  //                'background-image: url('+'"'+'../capture/' + imageObjLocation +'"'+');';
  //attributeList = 'transform: rotate('+angle+'deg) scale('+zoom+');'+
  //                'background-image: url('+'"'+'../capture/' + imageObjLocation +'"'+');';
  //console.log(attributeList);
  //wrapper2.setAttribute('style', attributeList);
  displayImg.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
  //displayImg.setAttribute('style', attributeList);

  // wrapper test
  //wrapper2.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
}

// Update the current slider value (each time you drag the slider handle)
sliderAngle.oninput = function(e) {
  outputAngle.innerHTML = this.value;
  angle = e.target.value;
  //console.log("current angle: "+angle);
  displayImg.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
  //attributeList = 'transform: rotate('+angle+'deg) scale('+zoom+');'+
  //                'background-image: url('+'"'+'../capture/' + imageObjLocation +'"'+');';
  //console.log(attributeList);
  //wrapper2.setAttribute('style', attributeList);
  //displayImg.setAttribute('style', attributeList);
  // wrapper test
  //wrapper2.setAttribute('style', 'transform: rotate('+angle+'deg) scale('+zoom+')');
}




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


  // ------ TEST TO SEND IMAGES TO PHP -------- //
  function sendImageToPhp(fileList){
    let file = getFile(fileList);
    if (file !== null){
      var formData = new FormData();
      formData.append('file', file);
      console.log("hello desde sendImageToPhp");
      console.log(formData);
      $.ajax({
        url: 'upload.php',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
          if(response != 0){
            /*/
            replace this URL with the correct location of the uploaded images
            /*/
            imageObjLocation = response;
            //wrapper2.setAttribute('style','background-image: url(../capture/' + imageObjLocation + ')');
            console.log("response from upload.php: " + imageObjLocation);
          } else {
            console.log("Error sending file to the server (uploading script)");
          }
        },
      });
    }
  }

function renderImageInBrowser(fileList) {
  //let file = null;
  //for (let i = 0; i < fileList.length; i++) {
  //  if (fileList[i].type.match(/^image\//)) {
  //    file = fileList[i];
  //    break;
  //  }
  //}
  let file = getFile(fileList);
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

    

    //Saves the image in the imgArray
    imgNames.push({
      "name": file.name,
      "size": file.size,
      "type": file.type,
      "width": imageObj.naturalWidth,
      "height": imageObj.naturalHeight,
      "src": displayImg.src.split("blob:")[1]
    });

    // --------- testing with the wrapper background!!!!! ---------
    /*/ --------- DOESNT WORK BECAUSE THE URL OF THE IMAGE LEADS TO A 
    404 ERROR. WE NEED TO 1. PERSIST THE IMAGE SOMEWHERE AND 2. RETRIEVE
     AND USE A VALIR URL IN THE TWO LINES BELOW/*/
    console.log(imgNames.src);
    wrapper2.setAttribute('style', 'background-image: url('+imgNames.src+')');
    wrapper2.setAttribute('style', 'background-size: cover');


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


  }
}


function renderImageFromSelection(){
  console.log("renderImageFromSelection");
}








   


















