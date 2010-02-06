<?
	//CONFIG
	$testName = 'enhanced';
	$phpFailText = "View Low-bandwidth version";
	
	$lofiHead = <<<EOD
	<link rel="stylesheet" type="text/css" href="/css/basic.css" />
EOD;

	$hifiHead = <<<EOD
	<link rel="stylesheet" type="text/css" href="/css/basic.css" />
	<link rel="stylesheet" type="text/css" href="/css/enhanced.css" />
	<script src="/js/enhanced.js" type="text/javascript"></script>
EOD;

	$testHead = <<<EOD
	<link rel="stylesheet" type="text/css" href="css/basic.css" />
	<script type="text/javascript" src="/enhance/enhance.js"></script>
	<script type="text/javascript">
		enhance({
			loadScripts: ['js/enhanced.js'],
			loadStyles: ['css/enhanced.css']
		});
	</script>
EOD;
?>