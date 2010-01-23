<?
include('config.php');

//if it's a redirect request, set cookie and redirect
if(isset($_REQUEST['r'])){
	setcookie($testName, "fail", null, '/'); 
	$r = urldecode($_REQUEST['r']);
	header('Location: '. $r);
}
//otherwise, print the fail link
elseif(isset($_COOKIE[$testName]) && $_COOKIE[$testName] == "pass"){
	function selfURL() {
		$s = empty($_SERVER["HTTPS"]) ? ''
			: ($_SERVER["HTTPS"] == "on") ? "s"
			: "";
		$protocol = strleft(strtolower($_SERVER["SERVER_PROTOCOL"]), "/").$s;
		$port = ($_SERVER["SERVER_PORT"] == "80") ? ""
			: (":".$_SERVER["SERVER_PORT"]);
		return $protocol."://".$_SERVER['SERVER_NAME'].$port.$_SERVER['REQUEST_URI'];
	}
	function strleft($s1, $s2) {
		return substr($s1, 0, strpos($s1, $s2));
	}
	
	echo '<a href="/server/fallback.php?r='.urlencode(selfURL()).'" rel="nofollow" id="'.$testName.'_fallback_link">'.$phpFailText.'</a>';
}

?>