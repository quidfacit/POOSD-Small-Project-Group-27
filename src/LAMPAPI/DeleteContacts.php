<?php
	$res = false;
	$request = json_decode(file_get_contents("php://input"));
	$id = $request->UserID;
	$fName = $request->FirstName;
	$lName = $request->LastName;
	$conn = mysqli("localhost", "admin", "27isBest", "main");

	if($conn->connect_error == null){
		$res = $conn->query("DLETE FROM Contacts WHERE UserID = $id AND FirstName = $fName AND LastName = $lName");

		$conn->close();
	}

	header("Content-Type: application/json; charset = utf-8");

	print("$res");
?>
