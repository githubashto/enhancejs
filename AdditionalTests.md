# Additional Tests #

The following tests can be useful depending on the needs of your application. To add them to the default suite, simply specify them via the addTests option.

## Modified floatClear test that fails in IE6 due to double-margin-float bug ##
If you want to build complex floated layouts without having to worry about IE6 workarounds, this modified version of the EnhanceJS floatClear test will make sure the margins of floated elements are rendered accurately, which means IE6 will fail the test and receive the basic experience.
```
 floatClear: function() {
        var pass = false,
            newDiv = doc.createElement('div'),
            style = 'style="width: 5px; height: 5px; float: left; margin-right: 1px;"';
        newDiv.style.cssText = 'float: left;';    
        newDiv.innerHTML = '<div ' + style + '></div><div ' + style + '></div>';
        body.appendChild(newDiv);
        var childNodes = newDiv.childNodes,
            topA = childNodes[0].offsetTop,
            divB = childNodes[1],
            topB = divB.offsetTop;
        if (topA === topB && newDiv.offsetWidth == 12) {
            divB.style.clear = 'left';
            topB = divB.offsetTop;
            if (topA !== topB) {
                pass = true;
            }
        }
        body.removeChild(newDiv);
        return pass;
    }
```
