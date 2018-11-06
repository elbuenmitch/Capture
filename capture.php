<?php

    echo "lol";

?>

<!DOCTYPE html>
<html>
<head>
	<title>Capture.php</title>
	<link rel="stylesheet" href="css/style.css">
</head>
<body>

<h1>Capture Test</h1>
<h3>Test file to play around with the functionalities of in-Browser image capturing and handling.</h3>

<input type="file" accept="image/*" id="file-input1">
<div class="target-div"  id="target"><p>You can drag an image file here</p></div>


<div class="container-hor">

<div class="container">
  <ul id="listica"></ul>
</div>

<div class="container img-container">
  <img id="display-img" width="300" height="300">
</div>

</div>

<div class="slidecontainer">
  <input type="range" min="1" max="200" value="100" class="slider" id="myRange">
</div>
<p id="demo">LOL</p>

<div class="slidecontainer">
  <input type="range" min="-90" max="90" value="0" class="slider" id="myRangeRotate">
</div>
<p id="demoRotate">LOL</p>





<h5>Canvas</h5>
<div class="container">
  <canvas id="display-canvas" width="300" height="300"></canvas>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="js/main.js"></script>

</body>
</html>