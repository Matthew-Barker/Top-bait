<?php
require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

$tweetText= isset($_REQUEST['tweetText']) ? $_REQUEST['tweetText']:null;
$_SESSION['tweet']= $tweetText;

// The TwitterOAuth instance
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

// Requesting authentication tokens, the parameter is the URL we will be redirected to

$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

//For debugging show output
//
echo "<pre>";
print_r($request_token);
echo "</pre>";

// Saving them into the session
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];


// If everything goes well..
if ($connection->getLastHttpCode()==200){
	// Let's generate the URL and redirect
	$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
	header('Location: '. $url) ;
	/* Should be finished here.. */
} else {
  // It's a bad idea to kill the script, but we've got to know when there's an error.
  die('Something wrong happened.' . " HTTP Error Code " .  $connection->getLastHttpCode());
}


?>