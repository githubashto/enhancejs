/*
 * enhance.js - Test-Driven Progressive Enhancement
 * Authors: Scott Jehl (filamentgroup.com), Brandon Aaron (brandonaaron.net)
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
*/
(function(win, doc) {
    
var settings, body, windowLoaded,
    head = doc.getElementsByTagName('head')[0] || doc.documentElement;

enhance = function(options) {
    options  = options || {};
    settings = {};
    
    // mixin settings
    for (var name in enhance.defaultSettings) {
        var option = options[name];
        settings[name] = option !== undefined ? option : enhance.defaultSettings[name];
    }
    
    // mixin additional tests
    for (var test in options.addTests) {
        settings.tests[test] = options.addTests[test];
    }
    
    runTests();
    
    applyDocReadyHack();
    
    windowLoad(function() {
        windowLoaded = true;
    });
};

enhance.defaultTests = {
    getById: function() {
        return !!doc.getElementById;
    },
    getByTagName: function() {
        return !!doc.getElementsByTagName;
    },
    createEl: function() {
        return !!doc.createElement;
    },
    boxmodel: function() {
        var newDiv = doc.createElement('div');
        newDiv.style.cssText = 'width: 1px; padding: 1px;';
        body.appendChild(newDiv);
        var divWidth = newDiv.offsetWidth;
        body.removeChild(newDiv);
        return divWidth === 3;
    },
    position: function() {
        var newDiv = doc.createElement('div');
        newDiv.style.cssText = 'position: absolute; left: 10px;';
        body.appendChild(newDiv);
        var divLeft = newDiv.offsetLeft;
        body.removeChild(newDiv);
        return divLeft === 10;
    },
    floatClear: function() {
        var pass = false,
            newDiv = doc.createElement('div'),
            style = 'style="width: 5px; height: 5px; float: left;"';
        newDiv.innerHTML = '<div ' + style + '></div><div ' + style + '></div>';
        body.appendChild(newDiv);
        var childNodes = newDiv.childNodes,
            topA = childNodes[0].offsetTop,
            divB = childNodes[1],
            topB = divB.offsetTop;
        if (topA === topB) {
            divB.style.clear = 'left';
            topB = divB.offsetTop;
            if (topA !== topB) {
                pass = true;
            }
        }
        body.removeChild(newDiv);
        return pass;
    },
    overflow: function() {
        var newDiv = doc.createElement('div');
        newDiv.innerHTML = '<div style="height: 10px; overflow: hidden;"></div>';
        body.appendChild(newDiv);
        var divHeight = newDiv.offsetHeight;
        body.removeChild(newDiv);
        return divHeight === 10;
    },
    ajax: function() {
        //factory test borrowed from quirksmode.org
        var xmlhttp = false, index = -1, factory,
            XMLHttpFactories = [
                function() { return new XMLHttpRequest() },
                function() { return new ActiveXObject("Msxml2.XMLHTTP") },
                function() { return new ActiveXObject("Msxml3.XMLHTTP") },
                function() { return new ActiveXObject("Microsoft.XMLHTTP") }
            ];
        while ((factory = XMLHttpFactories[++index])) {
            try { xmlhttp = factory(); }
            catch (e) { continue; }
            break;
        }
        return !!xmlhttp;
    },
    resize: function() {
        return win.onresize != false;
    },
    print: function() {
        return !!win.print;
    }
};

enhance.defaultSettings = {
    testName: 'enhanced',
    loadScripts: [],
    loadStyles: [],
    queueLoading: true,
    appendToggleLink: true,
    forcePassText: 'View High-bandwidth version',
    forceFailText: 'View Low-bandwidth version',
    tests: enhance.defaultTests,
    addTests: {},
    alertOnFailure: false
};

function forceFail() {
    createCookie(settings.testName, 'fail');
    win.location.reload();
}
enhance.forceFail = forceFail;

function forcePass() {
    createCookie(settings.testName, 'pass');
    win.location.reload();
}
enhance.forcePass = forcePass;

function reTest() {
    eraseCookie(settings.testName);
    win.location.reload();
}
enhance.reTest = reTest;

function runTests() {
    var result = readCookie(settings.testName);
        
    //check for cookies from a previous test
    if (result) {
        if (result === 'pass') {
            enhancePage();
        }
        
        // append toggle link
        if (settings.appendToggleLink) {
            windowLoad(function() { 
                appendToggleLinks(result);
            });
        }
    }
    //no cookies - run tests
    else {
        bodyOnReady(function() {
            var pass = true;
            for (var name in settings.tests) {
                pass = settings.tests[name]();
                if (!pass) {
                    if (settings.alertOnFailure) {
                        alert(name + ' failed');
                    }
                    break;
                }
            }
            
            result = pass ? 'pass' : 'fail';
            createCookie(settings.testName, result);
            if (pass) {
                enhancePage();
            }
            
            // append toggle link
            if (settings.appendToggleLink) {
                windowLoad(function() { 
                    appendToggleLinks(result);
                });
            }
        });
    }
}

function bodyOnReady(callback) {
    var checkBody = setInterval(bodyReady, 1);
    function bodyReady() {
        if (doc.body) {
            body = doc.body;
            clearInterval(checkBody);
            callback();
        }
    }
}

function windowLoad(callback) {
    if (windowLoaded) {
        callback();
    } else {
        var oldonload = win.onload
        win.onload = function() {
            if (oldonload) { oldonload(); }
            callback();
        }
    }
}

function appendToggleLinks(result) {
    if (!settings.appendToggleLink) { return; }
        
    if (result) {
        var a = doc.createElement('a');
        a.href = "#";
        a.className = settings.testName + '_toggleResult';
        a.innerHTML = result === 'pass' ? settings.forceFailText : settings.forcePassText;
        a.onclick   = result === 'pass' ? enhance.forceFail : enhance.forcePass;
        doc.getElementsByTagName('body')[0].appendChild(a);
    }
}

function enhancePage() {
    if (doc.documentElement.className.indexOf(settings.testName) === -1) {
        doc.documentElement.className += ' ' + settings.testName;
    }
    
    if (settings.loadStyles.length) {
        appendStyles();
    }
    if (settings.loadScripts.length) {
        settings.queueLoading ? appendScriptsSync() : appendScriptsAsync();
    }
}

function appendStyles() {
    var index = -1,
        name;
    
    while ((name = settings.loadStyles[++index])) {
        var link  = doc.createElement('link');
        
        link.type = 'text/css';
        link.rel  = 'stylesheet';
        
        if (typeof name === 'string') {
            link.href = name;
            head.appendChild(link);
        }
        else {
            for (var attr in name) {
                link.setAttribute(attr, name[attr]);
            }
            if (attr === 'iecondition' && (/MSIE (\d+)\.\d+;/).test(navigator.userAgent)) {
                var ieversion = new Number(RegExp.$1);
                if (name['iecondition'] === 'all' || name['iecondition'] === ieversion) {
                    head.appendChild(link); 
                }
            }
            else {
                head.appendChild(link);
            }
        }
    }
}

function appendScriptsSync() {
    var queue = [].concat(settings.loadScripts);
    
    function next() {
        if (queue.length === 0) {
            return;
        }
        
        var src    = queue.shift();
            script = createScriptTag(src),
            done   = false;
        
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                next();
                this.onload = this.onreadystatechange = null;
            }
        }
        head.insertBefore(script, head.firstChild);
    }
    
    next();
}

function appendScriptsAsync() {
    var index = -1,
        name;
        
    while ((name = settings.loadScripts[++index])) {
        head.insertBefore(createScriptTag(name), head.firstChild);
    }
}

function createScriptTag(src) {
    var script  = doc.createElement('script');
    script.type = 'text/javascript';
    script.src  = src;
    return script;
}

/*cookie functions from quirksmode.org*/
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    doc.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = doc.cookie.split(';');
    for (var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


function applyDocReadyHack() {
    // via http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
    // verify that document.readyState is undefined
    // verify that document.addEventListener is there
    // these two conditions are basically telling us
    // we are using Firefox < 3.6
    if (doc.readyState == null && doc.addEventListener){
        // on DOMContentLoaded event, supported since ages
        doc.addEventListener("DOMContentLoaded", function DOMContentLoaded(){
            // remove the listener itself
            doc.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            // assign readyState as complete
            doc.readyState = "complete";
        }, false);
        // set readyState = loading or interactive
        // it does not really matter for this purpose
        doc.readyState = "loading";
    }
}


})(window, document);