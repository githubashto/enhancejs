/*
 * enhance.js - Test-Driven Progressive Enhancement
 * Authored by Scott Jehl, Filament Group (filamentgroup.com)
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 * Version 1.0
 * CODE REVIEWED BY BRANDON AARON
*/

var enhance = function(settings){
	// BA: this == window when the new keyword isn't used
	// therefore exposing everything to the window that is attached to 'that';
	// could just wrap everything in self executing function and make everything
	// local to that scope and only expose the few public methods.
	// also everytime this function executes it is resetting everything up...
	// would be good to move all of this out of the main function
	// and just mixin the settings and call runTests
	// would also be good to store a local reference to the window, document, head, and body for quicker lookups
	var that = this;
	that.settings = {
		testName: 'enhanced',
		loadScripts: [],
		loadStyles: [],
		queueLoading: true,
		appendToggleLink: true,
		forcePassText: 'View High-bandwidth version',
		forceFailText: 'View Low-bandwidth version',
		// BA: might be good to seperate out the tests, just to make it easier to extend
		// Also, you'd get much better performance by trying to combine some of these tests into a single test.
		// For example combining the float and clear tests would be a good combination
		tests: {
			getById: function(){
				// BA: Use !! instead of ternary for speed
				// return !!document.getElementById;
				return document.getElementById ? true : false;
			},
			getByTagName: function(){
				// BA: Use !! instead of ternary for speed
				// return !!document.getElementsByTagName;
				return document.getElementsByTagName ? true : false;
			},
			createEl: function(){
				// BA: Use !! instead of ternary for speed
				// return !!document.createElement;
				return document.createElement ? true : false;
			},
			boxmodel: function(){
				var newDiv = document.createElement('div');
				document.body.appendChild(newDiv);
				// BA: use style.cssText to apply styles all at once
				// BA: appendChild after setting styles
				// both to prevent the number of redraws
				newDiv.style.width = '1px';
				newDiv.style.padding = '1px';
				var divWidth = newDiv.offsetWidth;
				document.body.removeChild(newDiv);
				// BA: use === for a minor speed boost
				return divWidth == 3;
			},
			position: function(){
				var newDiv = document.createElement('div');
				document.body.appendChild(newDiv);
				// BA: use style.cssText to apply styles all at once
				// BA: appendChild after setting styles
				// both to prevent the number of redraws
				newDiv.style.position = 'absolute';
				newDiv.style.left = '10px';
				var divLeft = newDiv.offsetLeft;
				document.body.removeChild(newDiv);
				// BA: use === for a minor speed boost
				return divLeft == 10;
			},
			// BA: float is a reserved word
			'float': function(){
				var newDiv = document.createElement('div');
				document.body.appendChild(newDiv);
				// BA: appendChild after setting innerHTML
				newDiv.innerHTML = '<div style="width: 5px; float: left;"></div><div style="width: 5px; float: left;"></div>';
				// BA: could extract the style attribute into a string to reduce repitition and filesize
				// BA: get a reference to childNodes instead of accessing it twice
				// var childNodes = newDiv.childNodes,
				//	   divTopA = childNodes[0].offsetTop,
				//	   divTopB = childNodes[1].offsetTop;
				var divTopA = newDiv.childNodes[0].offsetTop;
				var divTopB = newDiv.childNodes[1].offsetTop;
				document.body.removeChild(newDiv);
				// BA: use === for a minor speed boost
				return divTopA == divTopB;
			},
			clear: function(){
				var newDiv = document.createElement('div');
				document.body.appendChild(newDiv);
				// BA: appendChild after setting innerHTML
				newDiv.style.visibility = 'hidden';
				newDiv.innerHTML = '<ul><li style="width: 1px; float: left;">test</li><li style="width: 1px; float: left;clear: left;">test</li></ul>';
				// BA: could extract the style attribute into a string to reduce repitition and filesize
				// BA: use divs here instead of UL... UL takes longer for the browser to construct
				// BA: then use childNodes as in float instead of getElementsByTagName
				var liTopA = newDiv.getElementsByTagName('li')[0].offsetTop;
				var liTopB = newDiv.getElementsByTagName('li')[1].offsetTop;
				document.body.removeChild(newDiv);
				// BA: use !== for a minor speed boost
				return liTopA != liTopB;
			},
			overflow: function(){
				var newDiv = document.createElement('div');
				document.body.appendChild(newDiv);
				// BA: appendChild after setting innerHTML
				newDiv.innerHTML = '<div style="height: 10px; overflow: hidden;"></div>';
				var divHeight = newDiv.offsetHeight;
				document.body.removeChild(newDiv);
				// BA: use === for a minor speed boost
				return divHeight == 10;
			},
			ajax: function(){
				//factory test borrowed from quirksmode.org
				var XMLHttpFactories = [
					function () {return new XMLHttpRequest()},
					function () {return new ActiveXObject("Msxml2.XMLHTTP")},
					function () {return new ActiveXObject("Msxml3.XMLHTTP")},
					function () {return new ActiveXObject("Microsoft.XMLHTTP")}
				];
				var xmlhttp = false;
				// BA: use a while loop with ++index for performance
				for (var k=0;k<XMLHttpFactories.length;k++) {
					try {xmlhttp = XMLHttpFactories[k]();}
					catch (e) {continue;}
					break;
				}
				// BA: Use !! instead of ternary for speed
				return xmlhttp ? true : false;
			},
			resize: function(){
				// BA: just return the result of the expesion instead of using a ternary
				return (window.onresize == false) ? false : true
			},
			print: function(){
				// BA: Use !! instead of ternary for speed
				return window.print ? true : false
			}
		},
		addTests: {},
		log: false
	};
	
	//extend configuration with args
	// BA: avoid the typeof check, just make sure settings is not undefined
	if(typeof(settings) == 'object'){
		for(var value in settings){ that.settings[value] = settings[value]; }
	};
	
	//public methods - can be used for custom pass/fail toggles
	that.forceFail = function(){
		// BA: don't need to erase cookie since the next line is just overwriting the value
		that._eraseCookie(that.settings.testName);
		that._createCookie(that.settings.testName, 'fail');
		window.location.reload();
		// BA: don't need to return anything
		return false;
	};
	that.forcePass = function(){
		// BA: don't need to erase cookie since the next line is just overwriting the value
		that._eraseCookie(that.settings.testName);
		that._createCookie(that.settings.testName, 'pass');
		window.location.reload();
		// BA: don't need to return anything
		return false;
	};
	that.reTest = function(){
		that._eraseCookie(that.settings.testName);
		window.location.reload();
		// BA: don't need to return anything
		return false;
	};
	
	//private - check cookies or run tests
	that._runtests = function(){
		var settings = that.settings;
		var cookieGrade = that._readCookie(settings.testName);
		// BA: use a boolean instead of string comparisson for testResult
		var testResult = 'pass'; //innocent until proven...
		//check for cookies from a previous test
		if(cookieGrade){
			testResult = cookieGrade;
			if(cookieGrade == 'pass'){ that._enhancePage(); }	
			// BA: don't need to pass the result to appendToggleLinks since it reads the cookie
			that.windowLoad(function(){ that._appendToggleLinks(testResult); });
		}
		//no cookies - run tests
		else {
			that._bodyOnReady(function(){
				// BA: might want to merge these two earlier on to prevent the nested loops
				var testSuites = [settings.tests, settings.addTests];
				for(var i in testSuites){
					for(var value in testSuites[i]){
						if(testResult == 'pass'){
							if(!testSuites[i][value]()){
								testResult = 'fail';
								// BA: don't need to call the function again to get the value, we know it was false
								// BA: should also move this outside of the if/else statement, so it isn't repeated
								if(settings.log){ alert(value +' = '+ testSuites[i][value]()); }
							}
						}
					}
				}
				//set cookie for future page loads
				that._createCookie(settings.testName, testResult);
				//append toglle links
				// BA: don't need to pass the result to appendToggleLinks since it reads the cookie
				// BA: should also move this outside of the if/else statement, so it isn't repeated
				that.windowLoad(function(){ that._appendToggleLinks(testResult); });
				//enhance the page based on test results
				if(testResult == 'pass'){ that._enhancePage(); }
				//test is done, return capabilities object
			});
		}
	};
	
	that._bodyOnReady = function(callback){
		function bodyReady(){
			if(document.body){
				// BA: remove this as it is not being used
				that._bodyReady = true;
				clearInterval(checkBody); //body is ready, stop asking
				callback();
			}
		}
		var checkBody = setInterval(bodyReady, 1);
	};
	
	that.windowLoad = function(callback){
		// BA: refactor to be more concise and no need for typeof check
		// var oldonload = window.onload;
		// window.onload = function() {
		//	   if (oldonload) {
		//		   oldonload();
		//	   }
		//	   callback();
		// }
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = callback;
		}
		else {
			window.onload = function() {
				oldonload();
				callback();
			}
		}
	}
	
	//append forceFail/forcePass links
	that._appendToggleLinks = function(testResult){
		// BA: doesn't need to receive the testResult since it reads the cookie value
		var settings = that.settings;
		var checkCookie = that._readCookie(settings.testName);
		if(checkCookie == "pass" || checkCookie == "fail"){
			if(settings.appendToggleLink){
				var a = document.createElement('a');
				a.href = "#";
				// BA: is there an issue with setting tabindex via the property?
				a.setAttribute('tabindex', 0);
				a.className = settings.testName + '_toggleResult';
				if(testResult == 'pass'){
					a.innerHTML = settings.forceFailText;
					a.onclick = that.forceFail;
				}
				else{
					a.innerHTML = settings.forcePassText;
					a.onclick = that.forcePass;
				}
				document.getElementsByTagName('body')[0].appendChild(a);
			}
		}
	};
	
	
	//private - test passed, make enhancements
	that._enhancePage = function(){
		// BA: would be good to split this function up into a few methods:
		//	 * appendStyles
		//	 * appendScriptsAsync
		//	 * apendScriptsSync
		var settings = that.settings;
		//add documentElement class				
		if (document.documentElement.className.indexOf(settings.testName) <= -1){
			document.documentElement.className += ' '+ settings.testName;
		}
		//append styles
		var h = document.getElementsByTagName("head")[0] || document.documentElement, done = false;
		//first styles
		// BA: can ommit the > 0 check... just .length
		if(settings.loadStyles.length>0){
			// BA: shouldn't use a for in loop on an array, use while loop instead
			for(var name in settings.loadStyles){
				var s = document.createElement('link');
				// BA: should be able to just set the properties instead of using setAttribute
				s.setAttribute('type', 'text/css');
				s.setAttribute('rel', 'stylesheet');
				// BA: might be safer to check for string instead of object and reverse the if/else
				if(typeof(settings.loadStyles[name]) == 'object'){
					for(var attr in settings.loadStyles[name]){
						s.setAttribute(attr, settings.loadStyles[name][attr]);
					}
				}
				else {
					s.setAttribute('href', settings.loadStyles[name]);
				}				
				//if there's an ie condition specified...
				// BA: would be good to move this logic into the above if/else to prevent checking twice
				if(typeof(settings.loadStyles[name]) == 'object' && settings.loadStyles[name]['iecondition']){
					if( /MSIE (\d+)\.\d+;/.test(navigator.userAgent) ){
						var ieversion = new Number(RegExp.$1);
						if(settings.loadStyles[name]['iecondition'] == 'all' || settings.loadStyles[name]['iecondition'] == ieversion){
							h.appendChild(s); 
						}
					}	
				}	
				//otherwise, inject
				else{
					h.appendChild(s); 
				}
			}	
		}
		//append scripts
		// BA: can ommit the > 0 check... just .length
		if(settings.loadScripts.length>0){
			// BA: would be good to seperate this out into two functions:
			//	* appendScriptsAsync
			//	* appendScriptsSync
			var jsQueue = (settings.queueLoading) ? [] : null;
			for(var name in settings.loadScripts){
				var s = document.createElement('script');
				// BA: should be able to just set the properties instead of using setAttribute
				s.setAttribute('src', settings.loadScripts[name]);
				s.setAttribute('type', 'text/javascript');
				// BA: need to use insertBefore to prevent a possible error in IE
				if(jsQueue == null){ h.appendChild(s); }
				else{ jsQueue[name] = s; }				
			}
			//if queue 
			var i = 0;
			//script and style queue
			function loadFromQueue(){
				if(jsQueue[i]){
					done = false;				
					jsQueue[i].onreadystatechange = jsQueue[i].onload = function() {
						if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
							done = true;
							loadFromQueue();
							// Handle memory leak in IE
							this.onload = this.onreadystatechange = null;
							h.removeChild( this );
							
						}
					}	

					h.insertBefore( jsQueue[i], h.firstChild );
					i++;
				}	
			}
			if(jsQueue!=null){ loadFromQueue(); }
		}
	};	
		
	/*cookie functions from quirksmode.org*/
	that._createCookie = function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	};
	that._readCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	};
	that._eraseCookie = function(name) {
		that._createCookie(name,"",-1);
	};
		
	that._runtests();
	return that;
};