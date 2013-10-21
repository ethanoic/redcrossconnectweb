<?php
$submission_status = "NA"; // NA or OK or ER
$email_valid = "no";
$agreed_status = "no";

if ($_SERVER['REQUEST_METHOD']=="POST")
{

	if (filter_var($_POST["email-address"], FILTER_VALIDATE_EMAIL))
	{
		$email_valid = "yes";
	}

	if ($_POST["agree-to-receive-alerts"]=="I-agree-to-receive-alerts-from-Singapore-Red-Cross")
	{
		$agreed_status = "yes";
	}

	if ($email_valid == "yes" && $agreed_status == "yes")
	{
		$myFile = "1t4r7lmaafpdrb13-database.txt";
		$file = fopen($myFile, 'a') or die("can't open file");
		$stringData = date("d F, Y" ,time()) . " " . date("h:i A" ,time()) . "\t" . $_POST["email-address"] . "\t" . $_POST["donated-will-donate-at-campus"] . "\t" . $_POST["agree-to-receive-alerts"] . "\r\n";
		fwrite($file, $stringData);
		fclose($file);
		$submission_status = "OK";
	}
	else
	{
		$submission_status = "ER";
	}
}
?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Red Cross Connection</title>

        <meta property="og:title" content="Red Cross Connection"/>
        <meta property="og:image" content="img/a-pack.png">   

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <link rel="icon" type="image/ico" href="favicon.ico"/>

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="fancybox/jquery.fancybox.css">

        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/style.css">

        <!--[if lte IE 7]>
        <link rel="stylesheet" href="css/ie7.css">
        <![endif]-->

        <!--[if IE 8]>
        <link rel="stylesheet" href="css/ie8.css">
        <![endif]-->

        <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
    </head>
    <body>
        <div class="page-container">
            <span class="scrolldown-icon"></span>
            <div class="scrollsection">
                <div class="section how-app">
                    <div class="inner-section">
                       
                        <div class="cta-share site-share">

                        </div>
                        <div class="title-text">

<?php
if ($submission_status == "OK")
{
?>
<h1 style="font-size:33px;">
Thank you for your interest in Red Cross Connection.
</h1>
<p>
You&rsquo;ll receive a download link when the app is available.
</p>
<?php
}
else
{
?>
<h1>
<span class="redbold">Connect</span> and<br/>help save lives
</h1>
<p>
One blood donation helps save 3 lives. But reaching out to potential donors can save countless more. With Red Cross Connection, you'll receive alerts when blood is needed, and can make a big difference by simply choosing to share.
</p>
<p>
Sign up now to receive an email alert when this app is available and join a network of lifesavers.
</p>
<?php
}
?>
							</div>

                        <div class="app-screen">
                            <img src="img/app-screen.png" />

                            <div class="reflect" >
                                <div class="mask"></div>
                                <img src="img/app-screen.png" />
                            </div>

                        </div>

<?php
if ($submission_status == "OK")
{
?>
<?php
}
else
{
?>
<div class="app-links">
<form action="index.php" method="POST">
<div>
<input onClick="if(this.value=='Email')this.value='';" onBlur="if(this.value=='')this.value='Email';" type="text" name="email-address" 
<?php
if ($_SERVER['REQUEST_METHOD']=="POST")
{
	echo "value=\"" . $_POST["email-address"] . "\"";
}
else
{
	echo "value=\"" . "Email" . "\"";
}
?>
 style="padding-left:10px; height:30px; width:75%;">
</div>
<?php
if ($submission_status == "ER" && $email_valid == "no")
{
	echo "<div style='color:#b51419;'>Please enter a valid email address.</div>";
}
?>

<div style="padding-top:10px;padding-bottom:10px;">
<input type="image" alt="Submit" title="Submit" src="img/btn_submit.png">
</div>
<div>
<input type="checkbox" 
<?php
if ($_SERVER['REQUEST_METHOD']=="POST")
{
	if ($_POST["donated-will-donate-at-campus"]=="I-have-donated-or-will-be-donating-blood-at-campus")
	{
		echo " checked ";
	}
}
?>
 name="donated-will-donate-at-campus" value="I-have-donated-or-will-be-donating-blood-at-campus"> &nbsp;I have donated/will be donating blood at campus
</div>
<div>
<input type="checkbox" 
<?php
if ($_SERVER['REQUEST_METHOD']=="POST")
{
	if ($_POST["agree-to-receive-alerts"]=="I-agree-to-receive-alerts-from-Singapore-Red-Cross")
	{
		echo " checked ";
	}
}
?>
 name="agree-to-receive-alerts" value="I-agree-to-receive-alerts-from-Singapore-Red-Cross"> &nbsp;I agree to receive alerts from Singapore Red Cross
</div>
<?php
if ($submission_status == "ER" && $agreed_status == "no")
{
	echo "<div style='color:#b51419;'>Sorry, but you need to agree to receive email alerts from Red Cross in order for us to send you the download link for the app.</div>";
}
?>

</form>
</div>
<?php
}
?>


                        <div class="app-features">
                            <h2>Red cross connection app lets you:</h2>
                            <ul>
                                <li class="vline mvline">
                                    <img src="img/app_feature_sharethis.png"/>
                                    Receive and share alerts<br/>
                                    to your social network
                                </li>
                                <li class="vline">
                                    <img src="img/app_feature_hero.png"/>
                                    Donate blood and scan <br/>
                                    to release the hero within
                                </li>
                                <li class="vline mvline">
                                    <img src="img/app_feature_locator.png"/>
                                    Locate your<br/>
                                    nearest blood bank
                                </li>
                                <li>
                                    <img src="img/app_feature_lifesaved.png"/>
                                    Track your donations and<br/>
                                    number of lives saved
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>
            </div>


        </div>

        <div id="fb-root"></div>

        <!--[if lt IE 9]>
        <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <script src="js/vendor/excanvas.js"></script>
        <![endif]-->


        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.1.min.js"><\/script>')</script>
        <script src="js/vendor/jquery-ui.min.js"></script>

        <script src="fancybox/jquery.fancybox.pack.js"></script>

        <script src="js/vendor/parsley.min.js"></script>
        <script type="text/javascript" src="js/vendor/jquery.easypiechart.js"></script>
        
        <script type='text/javascript' src='js/vendor/jquery-scrollspy.js'></script>


        <script type="text/javascript">var switchTo5x=true;</script>
        
        <script src="js/main.js"></script>

  

        <script>
            var _gaq=[['_setAccount','UA-41573034-1'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>

    </body>
</html>
