<?php
require "twitteroauth/autoload.php"/*Libary must be in the twitteroauth*/
use Abraham\TwitterOAuth\TwitterOAuth; /*This is a namespace*/

$consumer_key = 'sWIctmCryG7gWf49DkeaUquVA';
$consumer_secret = '1W5fvLFwXHFQS3cZTPLPBqnUUUJa0tcpCg3mKDEfmAGS6Dmn0s';
$accessToken = '956576132001918977-jHuvXOfVpbo05ZtRPRMFuGLVPMqL78Z';
$accessTokenSecret = 'V86vnO0rxIqHF9KuAItMFRS3MGxiG82TmteAKdT3CKZ0y';


$connection = new TwitterOAuth($consumer_key, $consumer_secret, $accessToken, $accessTokenSecret);

$content = $connection->get("Account/verify_credentials");

echo "<pre>"; //Outputs readable content
print_r($content);
echo "</pre>";
