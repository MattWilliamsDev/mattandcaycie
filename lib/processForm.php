<?php

// http://hades.triauto.net/mattandcaycie/lib/processForm.php?attending=true&name=TurdFerguson&number-attending=4
$params = $_REQUEST;
$attending = $params['attending'];
$name = $params['name'];
$number = $params['number-attending'];

$to = array(
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
	$message .= $name . ' will have ' . $number . ' attending in their party.';
}

try {
	mail($to, $subject, $message, $headers);
} catch (Exception $e) {
	$result['message'] = $e;
}

if ($result['message']) {
	$result['successful'] = false;
} else {
	$result['successful'] = true;
}
$json = json_encode( $result );

if ( $params['user_agent'] != 'ie' ):
	header( 'Content-type: application/json' );
else:
	header( 'Content-type: text/plain' );
endif;

exit( $json );