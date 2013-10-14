<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT);
ini_set('display_errors', 1);

require_once('class.phpmailer.php');

if (isset($_POST['email'])) {

	$mail = new PHPMailer();

	$mail->IsSMTP();
	$mail->SMTPAuth = true;
	$mail->Host = "smtp.elasticemail.com";
	$mail->Port = 25;
	$mail->Username = "ca42d852-f020-4d04-a1fa-9c93f5640431";
	$mail->Password = "ca42d852-f020-4d04-a1fa-9c93f5640431";

	$message = "Name: ".$_POST['name']."<br/>".
			   	"Email: ".$_POST['email']."<br/>".
			   	"Phone: ".$_POST['phone']."<br/>".
			   	"Subject: ".$_POST['subject']."<br/>".
			   	"Message<br/>: ".$_POST['message']."<br/>";

	$mail->SetFrom('enquiry@redcross.org.sg', 'Red Cross Connection');
	$mail->Subject = "Contact Us Form";
	$mail->MsgHTML($message);

	$mail->AddAddress('enquiry@redcross.org.sg', 'Red Cross Connection');
	$mail->AddAddress($_POST['email'], $_POST['name']);
	$mail->addCC('christy.goh@mrmworldwide.com');
	$mail->addCC('ethan.ccj@gmail.com');
	
	if($mail->Send()) {
	   echo "result=0";
	} else {
	   echo "result=1";
	}
}

if (isset($_GET['method']) == 'bloodstat') {

	$clientid = '591439560144.apps.googleusercontent.com';
	$secret = 'faY1qxOc3IOUH4dJ6Sw1UcSB';

	$user = "redcrossconnectsg@gmail.com";
	$pass = "=rccsg8303";
	 
	// Google Spreadsheet ID (You can get it from the URL when you view the spreadsheet)
	$GSheetID = "0AmHch73Ue3_EcDRkZWxfUWM3eGpkdUpBY0FIcFZtYUE";
	 
	// od6 is the first worksheet in the spreadsheet
	$worksheetID="ocz";
	 
	// Include the loader and Google API classes for spreadsheets
	require_once('Zend/Loader.php');
	Zend_Loader::loadClass('Zend_Gdata');
	Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
	Zend_Loader::loadClass('Zend_Gdata_Spreadsheets');
	Zend_Loader::loadClass('Zend_Http_Client');
	 
	// Authenticate on Google Docs and create a Zend_Gdata_Spreadsheets object.            

	$service = Zend_Gdata_Spreadsheets::AUTH_SERVICE_NAME;
	$client = Zend_Gdata_ClientLogin::getHttpClient($user, $pass, $service);
	$spreadsheetService = new Zend_Gdata_Spreadsheets($client);
	
	$query = new Zend_Gdata_Spreadsheets_ListQuery();
	$query->setSpreadsheetKey($GSheetID);
	$query->setWorksheetId($worksheetID);

	$query->setSpreadsheetQuery( 'date='.date("n/j/Y").' and apos<>"" and bpos<>"" and opos<>"" and abpos<>""' );
	$listFeed = $spreadsheetService->getListFeed($query);

	//echo count($listFeed->entries);

	$blood_a = 0;
	$blood_b = 0;
	$blood_o = 0;
	$blood_ab = 0;
	$date_row = '';

	if (count($listFeed->entries) > 0) {
		$rowData = $listFeed->entries[0]->getCustom();

		$blood_a = $rowData[1]->getText();
		$blood_b = $rowData[2]->getText();
		$blood_o = $rowData[3]->getText();
		$blood_ab = $rowData[4]->getText();

	} else {
		$query = new Zend_Gdata_Spreadsheets_ListQuery();
		$query->setSpreadsheetKey($GSheetID);
		$query->setWorksheetId($worksheetID);

		//$query->setSpreadsheetQuery( 'apos<>"" and bpos<>"" and opos<>"" and abpos<>"" order by date desc' );

		$listFeed = $spreadsheetService->getListFeed($query);

		for($i = (count($listFeed->entries)-1); $i>0 
			&& ($blood_a == '' && $blood_b == '' && $blood_o == '' && $blood_ab == ''); $i--) {
			$rowData = $listFeed->entries[$i]->getCustom();

			if ($rowData[1]->getText()!='' && $rowData[2]->getText()!='' && $rowData[3]->getText()!='' && $rowData[4]->getText()!='') {

				$blood_a = intval($rowData[1]->getText());
				$blood_b = intval($rowData[2]->getText());
				$blood_o = intval($rowData[3]->getText());
				$blood_ab = intval($rowData[4]->getText());
				$date_row = $rowData[0]->getText();
			}			
		}
	}

	// set the blood levels
	if ($blood_a <=269)
		$blood_a = '25';
	else if ($blood_a >= 270 && $blood_a <= 599)
		$blood_a = '50';
	else if ($blood_a >= 600)
		$blood_a = '75';

	if ($blood_b <=269)
		$blood_b = '25';
	else if ($blood_b >= 270 && $blood_b <= 599)
		$blood_b = '50';
	else if ($blood_b >= 600)
		$blood_b = '75';

	if ($blood_o <=44)
		$blood_o = '25';
	else if ($blood_o >= 45 && $blood_o <= 89)
		$blood_o = '50';
	else if ($blood_o >= 90)
		$blood_o = '75';

	if ($blood_ab <=399)
		$blood_ab = '25';
	else if ($blood_ab >= 400 && $blood_ab <= 809)
		$blood_ab = '50';
	else if ($blood_ab >= 810)
		$blood_ab = '75';

	echo $blood_a.'-'.$blood_a.'-'.$blood_o.'-'.$blood_ab.'-'.$date_row;
}


?>