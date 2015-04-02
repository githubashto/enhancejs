# Configurable Options #

The following options are available for configuration when calling EnhanceJS:

### loadStyles ###
  * type: array of strings or objects
  * description: CSS file urls to load (any css path will work, local or remote, relative to the HTML page enhance is running in).
  * default: [.md](.md)
  * example:
```
enhance({
   loadStyles: [
      'a.css',
      'b.css'
   ]
});
```

  * Using the object syntax specifying each stylesheet in object literal syntax, you can manually set attributes on the generated link tags, like the type,media, rel (for alternate stylesheets), etc. The example above shown in this syntax:
```
enhance({
   loadStyles: [
     {href:  'a.css'},
     {href:  'b.css'}
   ]
});
```
  * Targeting media types and queries with media and excludemedia: These properties accept CSS media types and media queries where the stylesheet should or should not be loaded. The following demonstrates stylesheets directed to either screen or mobile.
```
enhance({
   loadStyles: [
     {media: 'screen', excludemedia: 'screen and (max-device-width: 480px)', href: 'js/screen.css'},
     {media: 'screen and (max-device-width: 480px)', href: 'js/handheld.css'}
   ]
});
```

  * iecondition property. Optionally, you can specify an 'iecondition' property as well, to direct stylesheets to specific versions of Internet Explorer. Accepted values work like conditional comments in ie: 'IE 7', 'IE 6', 'lte IE 7', etc, or you can specify "all" or a whole number, such as 6, 7, or 8. (note that versions older than 6 will not pass the default test suite)

```
enhance({
   loadStyles: [
      'a.css',
      'b.css',
      {src: 'ie.css', iecondition: 'lte IE 7'}
   ]
});
```

All these properties are available in loading script files through the loadScripts array as well.

### loadScripts ###
  * type: array of strings
  * description: JavaScript file urls to load.
  * default: [.md](.md)
  * example:
```
enhance({
   loadScripts: [
      'a.js',
      'b.js'
   ]
});
```
  * Using the object syntax specifying each script in object literal syntax, you can manually set attributes on the generated script tags, like the type, title, etc. The example above shown in this syntax:
```
enhance({
   loadScripts: [
     {src:  'a.js'},
     {src:  'b.js'}
   ]
});
```
  * Targeting media types and queries with media and excludemedia: These properties accept CSS media types and media queries where the script should or should not be loaded. The following demonstrates scripts directed to either screen or mobile.
```
enhance({
   loadScripts: [
     {media: 'screen', excludemedia: 'screen and (max-device-width: 480px)', src: 'js/screen.js'},
     {media: 'screen and (max-device-width: 480px)', src: 'js/handheld.js'}
   ]
});
```

  * iecondition option. Optionally, you can specify an 'iecondition' property in the object as well, to direct stylesheets to specific versions of Internet Explorer. Accepted values work like conditional comments in ie: 'IE 7', 'IE 6', 'lte IE 7', etc, or you can specify "all" or a whole number, such as 6, 7, or 8. (note that versions older than 6 will not pass the default test suite)

```
enhance({
   loadScripts: [
      'a.js',
      'b.js',
      {src: 'ie.js', iecondition: 'lte IE 7'}
   ]
});
```

All these properties are available in loading stylesheets through the loadStyles array as well.

### queueLoading ###
  * type: boolean
  * description: If true, JavaScript files in the loadScripts array are loaded consecutively to safeguard dependencies
  * default: true

### onScriptsLoaded ###
  * type: callback function
  * description: callback that executes when all loadScripts scripts have finished loading
  * default: empty function

### appendToggleLink ###
  * type: boolean
  * description: If true, an HTML link is appended to the body element allowing a user to force-pass or force-fail the test. The link will have a class name of your testName value, plus '_toggleResult' (default: "enhanced\_toggleResult")
  * default: true_

### forcePassText ###
  * type: string
  * description: Text for the appendToggleLink, if the link's behavior is to force-pass the test.
  * default: 'View High-bandwidth version'

### forceFailText ###
  * type: string
  * description: Text for the appendToggleLink, if the link's behavior is to force-fail the test.
  * default: 'View Low-bandwidth version'

### onPass ###
  * type: function
  * description: function that executes when a browser passes test suite. Mostly useful when developing tests.
  * default: empty function

### onFail ###
  * type: function
  * description: function that executes when a browser fails test suite. Mostly useful when developing tests.
  * default: empty function

### onLoadError ###
  * type: function
  * description: If a script or stylesheet fails to load.
  * default: function that adds a class of 'enhanced-incomplete' to the HTML element

### tests ###
  * type: object
  * description: Hash of key/value test methods and properties. Test fails upon first failing test. This option can be overridden with a new test suite.
  * default: The following tests are preloaded to run:
    * getById: Tests for document.getElementById
    * getByTagName: Tests for document.getElementsByTagName
    * createEl: Tests for document.createElement
    * boxmodel: Tests for basic CSS box model rendering
    * position: Tests for basic CSS positioning rendering
    * floatClear: Tests CSS float and clear rendering
    * overflow: Tests CSS overflow rendering
    * ajax: Tests for common Ajax support
    * resize: Tests for window resize support
    * print: Tests for window print support

### addTests ###
  * type: object
  * description: Allows you to add tests on top of existing tests suite. Hash of key/value test methods and properties.
  * default: {}

### testName ###
  * type: string
  * description: If test passes, this string is added as a class to the html element, which is helpful for CSS scoping. It is also used as the name of the cookie which saves the test result for subsequent page loads.
  * default: 'enhanced'

### alertOnFailure ###
  * type: boolean
  * description: For development only. Alert failed test result. (uses alert() for wide compatibility)
  * default: false


# External Properties and Methods #

After running the test, you can call several methods on the enhance object.

```
	enhance();
	//set cookie to false and refresh, loading low-fi version
	enhance.forceFail();
```

The following methods and properties can be used post-test:
### mediaquery ###
  * type: function
  * description: run your own media query tests to see if a particular media type or query will apply before relying on it.
  * example code:
```
//check if the browser displays the screen media type
enhance.mediaquery('screen');
//returns true/false

//check if the browser displays the common mobile webkit media query
enhance.mediaquery('screen and (max-device-width: 480px)');
//returns true/false
```


### cookiesSupported ###
  * type: boolean
  * description: allows you to detect whether cookies are enabled/supported. The methods forceFail,forcePass, reTest, and toggleMedia should never be relied upon without checking that this property is true first.

### toggleMedia ###
  * type: function
  * description: allows you to toggle all occurrences of 2 media types and refresh the page. This allows you to create a link that toggles between screen and handheld experiences, for example.
  * example code:
```
//switch experiences between screen and handheld
enhance.toggleMedia('screen', 'screen and (max-device-width: 480px)');
```

### forceFail ###
  * type: function
  * description: Set cookie value to fail and refresh page.

### forcePass ###
  * type: function
  * description: Set cookie value to pass and refresh page.

### reTest ###
  * type: function
  * description: Delete cookie and refresh page (re-run test)



