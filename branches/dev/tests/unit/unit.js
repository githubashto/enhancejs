testWithIframe('iframe test helper', function(win, doc, enhance) {
    start();
    expect(3);
    ok(win, 'win reference');
    ok(doc, 'doc reference');
    ok(enhance, 'enhance reference');
});

testWithIframe('pass and basics', function(win, doc, enhance) {
    expect(7);
    
    enhance.defaultTests = {
        fail: function() {
            ok(false, 'default test was not supposed to run');
            return false;
        }
    };
    
    var settings = {
        testName: 'unitTest1',
        tests: {
            pass: function() {
                ok(true, 'successfully overwrote default tests');
                return true;
            }
        },
        addTests: {
            success: function() {
                ok(true, 'successfully called test from addTests setting');
                return true;
            }
        },
        loadScripts: ['../data/pass.js', '../data/onErrorTest-falseurl.js'],
        loadStyles: ['pass.css'],
        onPass: function() {
            start();
            var pass = readCookie(settings.testName);
            equals(readCookie(enhance.defaultSettings.testName), null, 'default testName was not used');
            ok(pass != null, 'testName setting properly used');
            equals(pass, 'pass', 'onPass successfully called after passing tests');
            ok(true, 'onPass successfully called');
        },
        onFail: function() {
            start();
            ok(false, 'onFail was called');
        },
        onLoadError: function() {
            ok(true, 'onLoadError was called after script failed to load');
        }
    };
    
    eraseCookie(settings.testName);
    eraseCookie(enhance.defaultSettings.testName);
    
    enhance(settings);
});

