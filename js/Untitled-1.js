



/**
 * 
 * @param {*} naturalW 
 * @param {*} naturalH 
 * @param {*} containerW 
 * @param {*} containerH 
 */
function calculateOriginalDisplayDimensions(naturalW, naturalH, containerW, containerH){

    let returnArray;

  if (naturalH > naturalW){
    //portrait ratio
    returnArray.originalH = containerH;
    returnArray.originalW = naturalW * containerH / naturalH;
    returnArray.originalLeft = (containerW - originalW) / 2;
    returnArray.originalTop = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
  } else {
    //landscape (or square) ratio
    if(naturalW/naturalH > containerW/containerH){
      // w/h ratio is larger than that of the frame where the image is dislayed
      returnArray.originalH = naturalH * containerW / naturalW;
      returnArray.originalW = containerW;
      returnArray.originalLeft = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
      returnArray.originalTop = (containerH - originalH) / 2;
    } else {
      // w/h ratio is smaller than that of the frame where the image is dislayed 
      returnArray.originalH = containerH;
      returnArray.originalW = naturalW * containerH / naturalH;
      returnArray.originalLeft = (containerW - originalW) / 2;
      returnArray.originalTop = 0;  //this should be set depending on whether there is previously stored cropping info on this image or not
    }
  }

  return returnArray;

}