<?php
require "twitteroauth/autoload.php";/*Libary must be in the twitteroauth*/
use Abraham\TwitterOAuth\TwitterOAuth; /*This is a namespace*/

//access keys for twitter auth
$consumer_key = 'sWIctmCryG7gWf49DkeaUquVA';
$consumer_secret = '1W5fvLFwXHFQS3cZTPLPBqnUUUJa0tcpCg3mKDEfmAGS6Dmn0s';
$accessToken = '956576132001918977-jHuvXOfVpbo05ZtRPRMFuGLVPMqL78Z';
$accessTokenSecret = 'V86vnO0rxIqHF9KuAItMFRS3MGxiG82TmteAKdT3CKZ0y';

$connection = new TwitterOAuth($consumer_key, $consumer_secret, $accessToken, $accessTokenSecret);

//$content = $connection->get('search/tweets', array('q' => $_GET['q']));
$content = $connection->get('search/tweets', array('q' => $_GET['q']));

if (!empty($content->statuses)) {   
    echo "<h3>Tweets</h3>";
    foreach ($content->statuses as $content) {
        //echo "<h4>" . $content->screen_name . "</h4>";
        echo "<p>" . $content->text . "</p>";
    }
} else {
    echo "<p>No tweets available</p>";
}


?>