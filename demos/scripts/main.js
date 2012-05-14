/*
 * Demo Module
 * Compatible with Require.js, curl.js and browser globals.
 */
!function(fn) {
    // AMD
    if (typeof define === 'function' && define.amd) {
        var usejQuery = 'usejQueryVersion' in window && define.amd.jQuery,
            riloadrFileName = usejQuery ? 'riloadr.jquery' : 'riloadr',
            cfg = {
                paths: {'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'}
            };
        
        // RequireJS
        if (typeof require === 'function') {
            require.config(cfg);
            require(['../' + riloadrFileName + '.js'], fn);
        
        // curl
        } else if (typeof curl === 'function') {
            cfg.baseUrl = '../';
            curl(cfg, [riloadrFileName], fn);
        }

    // Browser global      
    } else {
        fn(Riloadr);
    }
}(function(Riloadr) {

    // Make it safe to use console.log always
    (function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

    // AMD test
    var isAMD = !('Riloadr' in window);
    console.log('AMD loader used? ' + isAMD);
    if (isAMD) {
        console.log('AMD loader in use: ' + (typeof require === 'function' ? 'RequireJS '+require.version : 'curl '+curl.version));
    }

    // jQuery test
    var jQueryLoaded = 'jQuery' in window;
    console.log('jQuery version used? ' + jQueryLoaded);
    if (jQueryLoaded) {
        console.log('jQuery version in use: ' + jQuery.fn.jquery);
    }   

    // Riloadr version
    console.log('Riloadr version: ' + Riloadr.version);
    
    // Image callbacks
    var onload = function(){
        console.log("'" + this.alt + "' image loaded!");
    };

    var onerror = function(){
        console.log("Failed loading image '" + this.alt + "'!");
        console.log('Riloadr will try to reload this image one more time.');
    };

    // Image groups
    var group1 = new Riloadr({
        name: 'group1',
        base: 'images/',
        onload: onload,
        breakpoints: [
            {name: 320, maxWidth: 320}, /* Viewports smaller than 320px */
            {name: 640, maxWidth: 320, minDevicePixelRatio: 2}, /* iPhone 4 Retina display */
            {name: 640, minWidth: 321} /* Viewports wider than 320px */
        ]
    });

    var group2 = new Riloadr({
        root: 'group2', /* Id of DOM node */
        base: 'images/{breakpoint-name}/',
        defer: 'belowfold',
        monitorViewportWidth: true,
        foldDistance: 120,
        onload: onload,
        onerror: onerror,
        retries: 1,
        breakpoints: [
            {name: 240, maxWidth: 240},
            {name: 320, minWidth: 241, maxWidth: 320},
            {name: 640, minWidth: 241, maxWidth: 320, minDevicePixelRatio: 2}, /* iPhone 4 Retina display */
            {name: 640, minWidth: 321, maxWidth: 640},
            {name: 1024, minWidth: 641}
        ]
    });
    
    var group3 = new Riloadr({
        name: 'mygroup3',
        base: 'images/{breakpoint-name}/',
        defer: 'load',
        onload: onload,
        onerror: onerror,
        monitorViewportWidth: true,
        retries: 1,
        breakpoints: [
            {name: 240, maxWidth: 240},
            {name: 320, minWidth: 241, maxWidth: 320},
            {name: 640, minWidth: 241, maxWidth: 320, minDevicePixelRatio: 2}, /* iPhone 4 Retina display */
            {name: 640, minWidth: 321, maxWidth: 640},
            {name: 1024, minWidth: 641}
        ]
    });
    
    var group4 = new Riloadr({
        name: 'mygroup4',
        base: 'images/{breakpoint-name}/',
        onload: onload,
        breakpoints: [
            {name: 320, maxWidth: 320}, /* Viewports smaller than 320px */
            {name: 640, maxWidth: 320, minDevicePixelRatio: 2}, /* iPhone 4 Retina display */
            {name: 640, minWidth: 321} /* Viewports wider than 320px */
        ]
    });
    
    // Buttons will show up when window is loaded
    // Although this works x-browser, this code is shit so don't use it!!
    window.onload = function() {
        var group2Container = document.getElementById('group2'),
            group2Button = document.getElementById('group2-button'),
            group2ImageNames = [
                {name: 'cocoa', alt: 'Cocoa Beach'},
                {name: 'morro', alt: 'Morro Rocks'},
                {name: 'jolla', alt: 'La Jolla'},
                {name: 'tahiti', alt: 'Tahiti'}
            ],
            group4Container = document.getElementById('group4'),
            group4Button = document.getElementById('group4-button');

        // Display them
        group2Button.style.display = group4Button.style.display = 'block';    
        
        // Register click listeners
        // Group 2 button
        group2Button.onclick = function() {
            var p = document.createElement('p'),
                img = document.createElement('img'),
                image = group2ImageNames[Math.floor(Math.random() * group2ImageNames.length)];

            img.className = 'responsive';
            img.alt = img.className + ' - ' + image.alt;
            img.setAttribute('data-src', image.name + '.jpg');

            // Add images to the document with Javascript
            p.appendChild(img);
            group2Container.appendChild(p);
                
            group2.riload();    
        };

        // Group 4 button
        group4Button.onclick = function() {
            // Add images to the document with Javascript
            // You can use innerHTML to add new images to a group and only those
            // will be processed by Riloadr.
            group4Container.innerHTML += 
                '<p>' +
                    '<img class="mygroup4" data-src="cocoa.jpg" alt="group4 - Cocoa Beach">' + 
                '</p>' + 
                '<p>' + 
                    '<img class="mygroup4" data-src="morro.jpg" alt="group4 - Morro Rocks">' + 
                '</p>';
                
            group4.riload();    
        };
    };
});