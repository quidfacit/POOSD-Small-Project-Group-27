<?php
	$res = false;
	$request = json_decode(file_get_contents("php://input"), true);
	$id->ID;
	$fName = $request->FirstName;
	$lName = $request->LastName;
	$login = $request->Login;
	$password = $request->Password;
	$dateC = date('n').'/'.date('j').'/'.date('y');
	$dateL = null;
	$conn = mysqli("localhost", "admin", "27isBest", "main");

	if($conn->connect_error = null){
		$res = $conn->query("SELECT * FROM Users WHERE ID = $id AND Login = $login AND Password = $password");

		if($res->num_rows == 0){
			$res = $conn->query("INSERT INTO Users (ID, DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES ($id, $dateC, $dateL, $fName, $lName, $login, $password)");

			$res = true;
		}
	}

	header("Content-Type: application/json; charset = utf-8");

	print($res);
?>
