<?
include('config.php');

if (isset($_COOKIE[$testName])){
	if($_COOKIE[$testName] == "pass"){ echo $hifiHead; } 
	else { echo $lofiHead; }
}
else { echo $testHead; }

?>