<?php

    if(isset($_POST['data'])){
        $name = $_POST['name'];
        echo "yeah!";
        
        $content = "some text here";
        $fp = fopen($_SERVER['DOCUMENT_ROOT'] . "/sandbox/capture/croppingattributes/_cropattributest.txt","wb");
        fwrite($fp,$content);
        fclose($fp);








    }
    echo $_SERVER['DOCUMENT_ROOT'];
    $fp = fopen($_SERVER['DOCUMENT_ROOT'] . "/sandbox/capture/croppingattributes/_cropattributest.txt","wb");
    fwrite($fp,json_encode($_POST));
    fclose($fp);
    // echo $data;
    // print_r($_POST['data']);
    print_r(json_encode($_POST));
    // $fileName = $_FILES['file']['name'];
    // $fileTmpName = $_FILES['file']['tmp_name'];
    // $fileSize = $_FILES['file']['size'];
    // $fileError = $_FILES['file']['error'];
    // $fileType = $_FILES['file']['type'];

    // if (!isset($response)) $response = new stdClass();

    // $width = 0;
    // $height = 0;

    // $fileExt = explode('.', $fileName);
    // $fileActualExt = strtolower(end($fileExt));

    // $allowed = array('jpg', 'jpeg', 'png');
    
    // if(in_array($fileActualExt, $allowed)){
    //     // if($fileError === 0){
    //         // if($fileSize < 5000000){
    //     $fileNameNew = uniqid('', true) . "." . $fileActualExt;
    //     $fileDestination = 'upload/' . $fileNameNew;
    //     move_uploaded_file($fileTmpName, $fileDestination);
    //     list($width, $height) = getimagesize($fileDestination);

    //     //Preparing the response
    //     $response->naturalWidth = $width;
    //     $response->naturalHeight = $height;
    //     $response->location = $fileDestination;
    //     $response->size = $fileSize;
    //     $response->name = $fileName;
    //     $response->type = $fileType;
    //     $response->extension = $fileActualExt;

    //     $response = json_encode($response);
    //     echo $response;
                
                //echo $fileDestination;
    // } 
    //         else {
    //             echo "Error: The file's size exedes the allowed limit.";
    //         }
    //     } else {
    //         echo "Error: There was an problem uploading your file.";
    //     }
    // } else {
    //     echo "Error: Please upload only image files.";
    // }
?>