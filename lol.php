<?php
    echo "hi from php";
    // $result = exec("testio.py testFunction");
    // echo $result;
    print_r(json_encode($_POST));
    // $command = escapeshellcmd('testio.py testFunction');
    // $output = shell_exec($command);
    // $result = shell_exec('python ./testio.py testFunction');
    // $result = shell_exec('python2.7 testio.py testFunction');
    // var_dump($result);

    $arg = "dario";
    // /Users/danielcardona/miniconda2/
    $output = shell_exec("python2.7 testio.py testFunctionParam daniel");
    // $output = shell_exec("/Users/danielcardona/miniconda2/bin/python2.7 /Applications/XAMPP/xamppfiles/htdocs/sandbox/capture/testio.py");
    echo $output;
    // $command = escapeshellcmd('testio.py');
    // $output = shell_exec($command);
    // echo $output;
?>