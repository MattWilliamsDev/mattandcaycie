<?php

// http://www.mattandcaycie.com/lib/processForm.php?attending=true&name=TurdFerguson&count=4
$params = $_REQUEST;
$attending = $params['attending'];
$name = $params['name'];
$count = $params['count'];
$mysql = new mysqli('68.178.140.78', 'mattandcaycie', 'Wm#95179517', 'mattandcaycie');

$cleanName = addslashes( $name );

$mailto = array(
	'bleacherbum17@gmail.com',
	'rancec@uindy.edu',
	'mwilliams@cik.com'
	);

$from = 'rsvp@mattandcaycie.com';
$subject = 'Wedding RSVP';
$headers = 'From: '. $from;

$message .= $name;

if ($attending) {
	$message .= ' will be ';
} else {
	$message .= ' will NOT be ';
}

$message .= "attending the wedding.\n";

if ($attending) {
	$message .= $name . ' will have ' . $count . ' attending in their party.';
}

// Save to MySQL
$q = "INSERT INTO rsvp (name, attending, count) VALUES ('{$cleanName}', {$attending}, {$count})";

try {
	$res = $mysql->query( $q );
} catch (Exception $e) {
	exit( json_encode( $e ) );
}

if ( $res ):
	foreach ( $mailto as $to ):
		try {
			mail($to, $subject, $message, $headers);
		} catch (Exception $e) {
			$result['message'] = $e;
		}
	endforeach;

	if ($result['message']) {
		$result['successful'] = false;
	} else {
		$result['successful'] = true;
	}
endif;

$json = json_encode( $result );

if ( $params['user_agent'] != 'ie' ):
	header( 'Content-type: application/json' );
else:
	header( 'Content-type: text/plain' );
endif;

exit( $json );