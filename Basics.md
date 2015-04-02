# Basic Usage #

1. To use enhance.js, first attach the script to your page:
```
	<script type="text/javascript" src="enhance.js"></script>
```
2. Then add a script element beneath that for running EnhanceJS
```
	<script type="text/javascript">
		//custom javascript goes here.
	</script>
```
3. Within that script element, call the enhance() function depending on your needs:
```
	enhance();
		--> Result: This will run the enhance library according to default configuration options.

	enhance(options);
		--> Result: This will run the enhance library with a custom configuration, depending on the options argument.
```
Options can be specified in object literal format, with key/value pairs, like this:
```
	enhance({
		key: value,
		key2: value2
	});
```
or with real options:
```
	enhance({
		loadScripts: [
			'js/jquery-1.3.2.min.js', 
			'js/enhancements.js'
		],
		loadStyles: [
			'css/enhanced.css'
		]
	});
```

More full-featured example, with CSS and JS directing to capable screen and handheld browsers, with and without overlap (jQuery goes to both, for instance):
```
//call enhance() function, include relevant assets for capable browsers
enhance({
	loadStyles: [
		{media: 'screen', excludemedia: 'screen and (max-device-width: 480px)', href: 'css/screen.css'},
		{media: 'screen and (max-device-width: 480px)', href: 'css/handheld.css'}
	],
	loadScripts: [
		'http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js',
		{media: 'screen', excludemedia: 'screen and (max-device-width: 480px)', src: 'js/screen.js'},
		{media: 'screen and (max-device-width: 480px)', src: 'js/handheld.js'}
	]	
}); 
```

More examples for available options can be found here: [ConfigurableOptions](ConfigurableOptions.md)