
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