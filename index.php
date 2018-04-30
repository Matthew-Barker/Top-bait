<?php
require 'config.php';
require 'twitteroauth/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

session_start();

$token = isset($_REQUEST['oauth_token']) ? $_REQUEST['oauth_token']:null;

//twitter oauth
$request_token = [];
$request_token['oauth_token'] = $_SESSION['oauth_token'];
$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

if ((isset($_REQUEST['oauth_token']) && 
    $request_token['oauth_token'] !== $_REQUEST['oauth_token']) || (empty($token)) ) {
  // oauth token is not found - link back to login to retry
  header('Location: http://ec2-18-218-176-53.us-east-2.compute.amazonaws.com/CM0677/twitter_login.php');    
} else {

// //Now we make a TwitterOAuth instance with the temporary request token.
// $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

// //At this point we will use the temporary request token to get the long lived access_token that authorized to act as the user.
// $access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));


// // Save it in a session var
// $_SESSION['access_token'] = $access_token;

// //Now we make a TwitterOAuth instance with the users access_token
// $twitter = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

// // Let's get the user's info
// $user_info = $twitter->get('account/verify_credentials');

echo "
  <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width'>
        <link rel='stylesheet' type='text/css' href='css/style.css'>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet'>
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>
        <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>      
        <title>Top Bait</title>
    </head>
    <body>
      <nav>
        <div class='logo'>
          <h1>TOP Bait</h1>
        </div>
        <div class='nav-links'>
        </div>
      </nav>

      <div class='map-ftr'>
        <div id='map'>
        </div>
        <div id='right-panel'>
          <div class='panel-content'>
            <h2>Wayfinder</h2>
            <div id='twitter-div'>
              <a class='twitter-hashtag-button' href='https://twitter.com/intent/tweet?text=' data-size='large' data-text='#CM0677 Top Bait'>Tweet</a>  
            </div>
            <div class='user-location'>
              <div id='click-address'></div>
              <div id='input-address'>
                <div class='location-input'>
                  <label for='address1'>Address line 1</label>
                  <input type='text' id='address1' name='address1' placeholder='26 Example Lane' size='50'/>
                </div>
                <div class='location-input middle'>
                  <label for='address2'>Address line 2</label>
                  <input type='text' id='address2' name='address2' placeholder='Newcastle Upon Type' size='40'/>
                </div>
                <div class='location-input' style='float: right;'>
                  <label for='postcode'>Postcode</label>
                  <input type='text' id='postcode' name='postcode' placeholder='NE6 5HU' size='8' required/>
                </div>
                <div class='location-input search'>
                  <input type='text' id='search' placeholder='Search resturants'/>
                </div>
                <div class='location-submit'>
                  <input type='submit' onclick='userInput()' value='Submit'/>
                </div>
                <span id='address-error'></span>
              </div>
            </div>
            <div id='routeInfo'>
            </div>
        </div>
      </div>
      <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
      <script async defer src='http://maps.googleapis.com/maps/api/js?key=AIzaSyBuTaWX0J2LZcNTAmFrnZPmJdDd5wWKIpg&amp;callback=initMap&amp;libraries=geometry'></script>
      <script src='scripts/map.js'></script>
      <!--<script src='scripts/food-rating.js'></script>-->
    </body>
  </html>
  ";
}
?>
