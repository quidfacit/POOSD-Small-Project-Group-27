<?php
    $res = false;
    $request = json_decode(file_get_contents("php://input"), true);
    $login = $request->Login;
    $pass = $request->Password;
    $conn = new mysqli("localhost", "admin", "27isBest", "main");

    if($conn->connect_error = null){
        $data = $conn->query("SELECT * FROM Users WHERE Login = $login AND Password = $pass");

        if($data->num_rows != 0){
            $res = true;
        }

        $conn->close();
    }

    header("Content-Type: application/json; charset = utf-8");

    print($res);
?>
