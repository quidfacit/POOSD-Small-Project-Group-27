<?php
	$res = false;
	$request = json_decode(file_get_contents("php://input"));
	$id = $request->UserID;
	$currDate = date('n').'/'.date('j').'/'.date('y');
	$fName = $request->FirstName;
	$lName = $request->LastName;
	$email = $request->Email;
	$number = $request->PhoneNumber;
	$conn = mysqli("localhost", "admin", "27isBest", "main");

	if($conn->connect_error == null){
		$data = $conn->query("SELECT * FROM Contacts WHERE UserID = $id");

		if($data->num_rows == 0){
			$conn->query("INSERT INTO Contacts (UserID, DateCreated, FirstName, LastName, Email, PhoneNumber) VALUES ($id, $currDate, $fName, $lName, $email, $number)");
			$res = true;
		}

		$conn->close();
	}

	header("Content-Type: application/json; charset = utf-8");

	print($res);
?>

