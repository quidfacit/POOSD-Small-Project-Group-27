<?php
	$res = null;
	$request = json_decode(file_get_contents("php://input"));
	$id = $request->UserID;
	$fName = $request->FirstName;
	$lName = $request->LastName;
	$conn = new mysqli("localhost", "admin", "27isBest", "main");

	if($conn->connect_error == null){
		$command = "SELECT * FROM Contacts WHERE UserID = $id AND FirstName = $fName And LastName = $lName";
		$data = $conn->query(command);

		if($data->num_rows != 0){
			$res = $data->fetch_assoc();
		}

		$conn->close();
	}

	header("Content-Type: application/json; charset = utf-8");

	print($res);
?>
