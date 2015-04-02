# Integration Tips #

## Dynamic CSS/JS loading ##
We highly recommend setting up your page to link only the necessary CSS and JS files for your basic experience
and then specifying further files to load via enhance options. The difference between basic and enhanced
versions can be several hundred kb on the average website, so there's a lot of benefits to making this separation.



## Preventing FOUC ##
When using enhance.js, you might experience what's known as a Flash of Unstyled Content, or "FOUC." This side effect occurs whenever CSS is loaded and applied after a page begins visually rendering, causing a flash or jump between unstyled and styled content. This can be prevented in a number of ways. You can make the FOUC less of a problem by hiding the body content in your basic stylesheet, and then showing it with styles delivered in your enhanced stylesheet. The safe way to do this is to key your styles off of the html element with the test class applied. Like this:

basic.css:
```
	html.enhanced body { visibility: hidden; }
	html.enhanced-incomplete body { visibility: visible; }
```
at the end of enhanced.css (or your final enhanced css file):
```
	html.enhanced body { visibility: visible; }
```

Since the class name (which varies depending on your testName option) is applied immediately upon passing the test, this will allow your page to just be blank until all styles are loaded. The second rule in basic.css above will make sure the page is visible if any stylesheets fail to load.




## Styling the Toggle link ##
By default, enhance.js will append a link to the body element which allows a user to force a pass or fail
result and refresh. This is useful for situations when something went wrong in the enhanced version of your
application, rendering it unusable, or even for mobile users who simply prefer a faster site. We recommend
styling this link very simply in the basic version, and using the enhanced scripts and styles to change
its style and positioning if preferable. Using our default testName of "enhanced", the link can be styled
like this:
```
a.enhanced_toggleResult {... css goes here... }
```
Note that this class name will change based on your testName. Refer to the documentation above.



## Server-side Integration ##

The Enhance.js dev branch includes a PHP-based server-side examples which can be used to integrate the library on the server-side your website for performance gains. _Note that these files are not in active development, but can be extended to work well in most implementations_ These files will detect whether a user has run your tests before and either:
> a. serve a pre-enhanced page for those who have passed
> b. serve a lightweight basic page for those who have failed
> c. serve the page normally, with basic assets and a call to enhance to load enhancements upon passing.


To integrate, you can find the following files in the enhance/server/ folder:
- config.php: Custom Configuration - change the settings to your needs
- fallback.php: Include this file at the end of your body element.
- head.php: Include this file in your head element.


PHP includes require a PHP-enabled server, and look like this:
```
	<? include("/enhance/server/head.php"); ?>
```
config.php has variables for each of the options found in the JavaScript version of enhance.js.
Just fill them out with values as you would for the options documented above, and include the 2 other php
files where specified, and that's it!


Footer link considerations:
The footer include adds a link similar to that of the JavaScript library, with an ID of your testName plus "_fallback\_link".
We suggest removing this with your enhanced JavaScript file, like this:
```
	var phpFallbackLink = document.getElementById('enhanced_fallback_link');
	document.removeChild(phpFallbackLink);
```_




Example page:
```
	<html>
		<head>
			<title></title>
			<? include("/enhance/server/head.php"); ?>
		</head>
		<body>
			<!-- page content -->
			<? include("/enhance/server/footer.php"); ?>
		</body>
	</html>
```