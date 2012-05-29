# Riloadr

A cross-browser framework-independent responsive images loader.

The goal of this library is to deliver optimized, contextual image sizes in responsive layouts that utilize dramatically different image sizes at different resolutions in order to improve page load time.  

**Table of Contents**  

1.  [Features](#features)
2.  [How to use](#howto)
    1.  [Configuration options](#options)
    2.  [Methods](#methods)
3.  [jQuery version](#jquery)    
4.  [Demos](#demos)
5.  [Testing](#testing)
6.  [Changelog](#changelog)
7.  [Contribute](#contribute)
8.  [Bug tracker](#issues)
9.  [License](#license)

<a name="features"></a>

## 1. Features

* **No dependencies**: Just Javascript, HTML and CSS (No server involved if you don't want to, no cookies, no .htaccess, no other Javascript library or framework required).
* **Ease of use**: 15-30 mins reading the docs and checking some demos and you're good to go! 
* **Absolute control**: Riloadr will process only the images you tell it to.
* **Unlimited breakpoints**: Set the breakpoints you need. CSS properties available per breakpoint: `minWidth`, `maxWidth` & `minDevicePixelRatio`.
* **Mimics CSS**: Riloadr computes the viewport's width in CSS pixels and finds out the optimal image size for the viewport according to the breakpoints you set through the `breakpoints` option (sort of CSS media queries).
* **One request per image**: Riloadr does not make multiple requests for the same image.
* **Lazy load of images**: Riloadr gives you the option to defer the load of all images in a group (faster page load).
* **Image groups**: You can create different Riloadr objects and configure each one to your needs (i.e. A group for images in the sidebar and another one for images in the main column).
* **Image retries**: You can configure any Riloadr object to retry *n* times the loading of an image if it failed to load.
* **Useful callbacks**: Riloadr allows you to attach callbacks for the `onload` and `onerror` image events. You can also set an `oncomplete` callback that fires when all images in a group are completely loaded.
* **Bandwidth testing**: Riloadr uses the W3C Network Api to find out wether connection speed is fast enough to deliver Hi-Res images (can be disabled). 
* **Support for browsers with no Javascript support or Javascript disabled**: Use the `noscript` tag OR add and set the `src` attribute with the smallest image (the latter approach may make 2 requests instead of 1, not recommended).
* **No UA sniffing**: Riloadr does not use device detection through user-agents.
* **Lightweight**: 4.1kb minified (3.4kb jQuery version minified)
* **jQuery version available**
* **AMD compatible**
* **MIT License**

<a name="howto"></a>

## 2. How to use

Riloadr got inspired by the technique used by the [YUI image loader](http://yuilibrary.com/yui/docs/imageloader/).  

The main idea behind this technique is to leave the `src` attribute of `img` tags out of the HTML element altogether and instead use a `data-src` attribute.

This way we avoid making multiple requests to the server for different sizes of an image. Once Riloadr chooses the best size to deliver for the current viewport, it adds the `src` attribute and the image is requested.

**Warning!**:   
Do not set an empty string for the value of src `src=""`.   
Some browsers react to this by assuming the empty string means `src="/"`, and consequently the browser re-requests the current HTML page and tries to stuff it into the`<img>` element. This is bad news for performance.

I'll use some code to explain how to use Riloadr, it should be self explanatory.

```html
<!doctype html>
<!-- 
     Let's add a 'no-js' class to the <html> element so that
     if the browser does not support Javascript, we can target
     in CSS images without an 'src' attribute and remove them 
     from the document flow. 
     Riloadr and Modernizr will remove the 'no-js' class ASAP.
     HTML5 boilerplate uses this technique, so use it!
-->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if IEMobile 7 ]> <html class="no-js iem7" lang="en"> <![endif]-->
<!--[if (gt IE 8)|(gt IEMobile 7)|!(IEMobile)]><!--> 
<html class="no-js" lang="en"> 
<!--<![endif]-->
<head>
    <meta charset="utf-8">

    <!-- Mobile viewport optimization: Required!! -->
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="0">
    <meta name="viewport" content="width=device-width">
    
    <!-- Recommended CSS styles --> 
    <style type="text/css">
        img {
            max-width: 100% /* To make all images fluid */
        }
        .lt-ie8 img{
            -ms-interpolation-mode: bicubic /* IE < 8 does not scale images well */
        }
        .lt-ie7 img{
            width: 100% /* IE < 7 does not support max-width. Use a container. */
        }
        /* Riloadr styles for image groups: assumes <noscript> technique is used */
        img.responsive, 
        img.main-col-images {
            visibility: hidden; /* To make responsive images not visible until loaded. */
            min-height: 100px /* To give responsive images some height until loaded. */
        }
        .no-js img.responsive,
        .no-js img.main-col-images {
            display: none /* To remove responsive images if Javascript is disabled */
        }
    </style>
    
    <!-- Include Riloadr (preferrably in the <head>) --> 
    <script type="text/javascript" src="riloadr.min.js"></script>
    
    <!-- Once Riloadr is loaded, set up your image groups -->
    <script type="text/javascript">
        /* Image group 1 
         * Minimum options, just the breakpoints:
         * - The group's name will be 'responsive' and the root will be the <body> element.
         * - The base URL for each image must be included in each <img> tag.
         * - Images will be loaded as soon as the DOM is ready.
         */
        var group1 = new Riloadr({
            breakpoints: [
                {name: '320px', maxWidth: 320}, // iPhone 3
                {name: '640px', maxWidth: 320, minDevicePixelRatio: 2}, // iPhone 4 Retina display
                {name: '640px', minWidth: 321, maxWidth: 640},
                {name: '1024px', minWidth: 641}
            ]
        });
        
        /* Image group 2 
         * All options: 
         * - The group's name will be 'main-col-images' and the root will be the <div id="main-column"> element.
         * - The base URL for each image is already set so you don't need to include it in each <img> tag.
         * - Images will load when the user is likely to see them (above the fold).
         * - If an image in this group fails to load, Riloadr will try to load it 1 more time.
         */
        var group2 = new Riloadr({
            root: 'main-column', // ID
            name: 'main-col-images',
            base: 'images/{breakpoint-name}/', // {breakpoint-name} will be replaced by one of your breakpoints names
            defer: 'belowfold',
            foldDistance: 125,
            ignoreLowBandwidth: true, // Hi-Res images will be requested regardless of connection speed
            onload: function(){
                // Image x is loaded
                // Do whatever you need
            },
            onerror: function(){
                // Image x failed to load, Riloadr will try to load it one more time
                // Do whatever you need
            },
            oncomplete: function(){
            	// All images in this group are completely loaded
            	// Do whatever you need
            },
            retries: 1,
            breakpoints: [
                {name: 'small', maxWidth: 320}, // iPhone 3
                {name: 'medium', maxWidth: 320, minDevicePixelRatio: 2}, // iPhone 4 Retina display
                {name: 'medium', minWidth: 321, maxWidth: 640},
                {name: 'large', minWidth: 641}
            ]
        });   
    </script>
</head>
<body>
    <!-- Image group 1 -->
    <header>
        <!-- You can set or override the base URL for each image adding a 'data-base' attribute -->
        <img class="responsive" data-base="images/" data-src="tahiti_{breakpoint-name}.jpg">
        <!-- No Javascript support? 
             Deliver to these browsers the smallest image size (Mobile first approach).
             2 techniques available: <noscript> tag & 'src' attribute. <noscript> technique preferred!
             
             Technique 1: <noscript> tag.
             - Pros: 1 request per image.
             - Cons: Cumbersome (You may create a function to print images such as: https://gist.github.com/2689388)
             
             Technique 2: 'src' attribute.
             - Pros: Valid markup, <noscript> tag not needed.
             - Cons: High probability of making 2 requests instead of 1 (worse performance, not recommended).
        -->
        <noscript>
            <img src="images/tahiti_320px.jpg">
        </noscript>
        
        <!-- You can set the full src path for each image (no 'base' option nor 'data-base' attribute) -->
        <img class="responsive" data-src="images/cocoa_{breakpoint-name}.jpg">
        <noscript>
            <img src="images/cocoa_320px.jpg">
        </noscript>
    </header>
    
    <!-- Image group 2 -->
    <div id="main-column">
        <img class="main-col-images" data-src="jolla.jpg">
        <noscript>
            <img src="images/small/jolla.jpg">
        </noscript>
        
        <img class="main-col-images" data-src="morro.jpg">
        <noscript>
            <img src="images/small/morro.jpg">
        </noscript>
    </div>
</body>
</html>
```

<a name="options"></a>

## 2.1. Configuration options

### base (*String*, Optional)  
An absolute or relative path for all images in a group.

```js
    var group1 = new Riloadr({
        base: 'http://assets.myserver.com/images/'
    });
    
    var group2 = new Riloadr({
        base: 'images/'
    });
```

If `base` is not set, Riloadr will check for the value of the `data-base` attribute of each `img` tag in a group.

```html
    <img class="responsive" data-base="http://assets3.myserver.com/images/" data-src="img_{breakpoint-name}.jpg">
```

If `base` is not set and the `data-base` attribute is missing in an image, Riloadr will use the value of the `data-src` attribute for that image.

```html
    <img class="responsive" data-src="http://assets3.myserver.com/images/img_{breakpoint-name}.jpg">
```

If `base` is set and an image has a `data-base` attribute, the attribute's value overrides the `base` option for that image.

***

### breakpoints (*Array* | Required)  
The `breakpoints` array works in a similar way to media queries in CSS.  
You can configure as many breakpoints (or size ranges) as you need, just like with media queries.  
A breakpoint is a literal object with up to 4 properties:  

* `name` (*String|Integer* | Required): The breakpoint name. You can set the name you prefer for any breakpoint.
* `minWidth` (*Integer* | Optional): Equivalent to `min-width` in CSS media queries. Value should be expressed in CSS pixels.
* `maxWidth` (*Integer* | Optional): Equivalent to `max-width` in CSS media queries. Value should be expressed in CSS pixels.
* `minDevicePixelRatio` (*Float* | Optional): Equivalent to `min-device-pixel-ratio` in CSS media queries (useful for delivering high resolution images). If two breakpoints only differ by this property, the breakpoint containing this property should be placed in the last place. 

**The `{breakpoint-name}` variable**

The variable `{breakpoint-name}` can be used multiple times in `base`, `data-base` and `data-src` values.  
Riloadr will replace `{breakpoint-name}` by the `name` property of one of the breakpoints you've set.

Let's see some examples:  
Example 1:  

```js
    var group1 = new Riloadr({
        base: '../images/',
        breakpoints: [
            {name: 'xsmall', maxWidth: 320}, // Applied if viewport is not wider than 320 pixels
            {name: 'small',  minWidth: 321, maxWidth: 480},
            {name: 'medium', minWidth: 481, maxWidth: 768},
            {name: 'large',  minWidth: 769, maxWidth: 1024},
            {name: 'xlarge', minWidth: 1025} // Applied if viewport is wider than 1025 pixels
        ]
    });
```

```html
    <!--  
        We add a 'data-src' attribute and the {breakpoint-name} variable where we need it.  
        In this case, image names have a size suffix i.e. wow_small.jpg, wow_xlarge.jpg etc...  
        so we place the {breakpoint-name} variable where the breakpoint name should be.  
    -->  
    <img class="responsive" data-src="wow_{breakpoint-name}.jpg">
```

Example 2:  

```js
    var group2 = new Riloadr({
        base: 'http://myserver.com/photos/{breakpoint-name}/',
        breakpoints: [
            {name: 'mobile',  maxWidth: 320},
            {name: 'tablet',  minWidth: 321, maxWidth: 768},
            {name: 'desktop', minWidth: 769}
        ]
    });
```

```html
    <!-- 
        In this case the {breakpoint-name} variable is used in the 'base' option.
        The final URL for this image will be one of these:
        - http://myserver.com/photos/mobile/super.jpg
        - http://myserver.com/photos/tablet/super.jpg
        - http://myserver.com/photos/desktop/super.jpg
    -->
    <img class="responsive" data-src="super.jpg">
```

Example 3:  

```js
    // Breakpoint names can be used more than once if the breakpoint properties 
    // are different but they apply to the same image size.
    var group3 = new Riloadr({
        base: 'http://img.{breakpoint-name}.myserver.com/',
        breakpoints: [
            {name: 'low',  maxWidth: 320}, // iPhone 3 
            {name: 'high', maxWidth: 320, minDevicePixelRatio: 2}, // iPhone 4 Retina display (High resolution image)
            {name: 'high', minWidth: 321} // Any bigger screen
        ]
    });
```

```html
    <!-- 
        In this case the {breakpoint-name} variable is used in the 'base' option.
        The final URL for this image will be one of these:
        - http://img.low.myserver.com/Hollywood.jpg
        - http://img.high.myserver.com/Hollywood.jpg
    -->
    <img class="responsive" data-src="Hollywood.jpg">
```

**Important!**:   
When Riloadr parses your `breakpoints` it mimics CSS behavior: Riloadr computes the browser's viewport width in CSS pixels, then traverses your breakpoints to find out the appropiate image size to load and makes use of your breakpoint names to get the correct `src` (image URL) to load the image.  
Remember, Riloadr *mimics CSS* and as such, it works with CSS pixels not with device pixels. So when you define your breakpoints use this formula to calculate screen width:  

`device screen width / device pixel ratio = screen width in CSS pixels`  

An example:  
You need to target the iPhone 4 which in portrait mode has a screen width (device pixels) of 640px.
The iPhone 4 has a device pixel ratio of 2 (2 device pixels equal 1 CSS pixel) so if we apply the formula above we get a width of 320 CSS pixels.  
This is the value that you should set as `minWidth` to target the iPhone 3 & 4 (just like in CSS).

***

### defer (*String*, Optional)  
Tells Riloadr to defer the load of images.  
Two values available:  

* `load`: Images in a group will be loaded once the window has fully loaded (window.onload).
* `belowfold`: Images in a group will load when the user is likely to see them (above the fold).

```js
    var group1 = new Riloadr({
        defer: 'belowfold'
    });
```

If `belowfold` mode is set and Opera Mini is used, Riloadr falls back to `load`.  
If `belowfold` mode is set and the browser does not support the `getBoundingClientRect` method, Riloadr falls back to `load`. This rule does not apply to the jQuery version. 

***

### foldDistance (*Integer* | Optional)  
A group can check its images at the DOM ready state and immediately begin loading those that are above the fold (i.e., inside the current viewport) while delaying the load of those that aren't. Just set a value (in pixels) for the `foldDistance` property of the group. Images are checked and loaded in a cascading fashion. That is, each image will be loaded only when it comes within `foldDistance` pixels of the bottom of the viewport. The effect is that images are loaded as needed as the user scrolls down the page. When you set a `foldDistance`, the group automatically gets window `scroll`, `resize` and `orientationchange` triggers.

```js
    var group1 = new Riloadr({
        defer: 'belowfold',
        foldDistance: 150
    });
```

If `foldDistance` is not set, it defaults to `100`px.  

***

### ignoreLowBandwidth (*Boolean* | Optional)    
In the case of HiDPI screens, Riloadr will try to find out if the connection speed of the user's device is fast enough to deliver Hi-Res images.   
For that purpose, Riloadr uses the W3C Network Api (both the Working and Editor's Drafts).   
Currently, only a small subset of devices & browsers support this specification although wider support is expected.
   
If a device/browser does not support the Network Api yet, Riloadr assumes a fast connection speed.  

```js
    var group1 = new Riloadr({
        ignoreLowBandwidth: true, // Hi-Res images will be requested regardless of connection speed
        breakpoints: [
			{name: '320px', maxWidth: 320}, // iPhone 3
			{name: '640px', maxWidth: 320, minDevicePixelRatio: 2}, // iPhone 4 Retina display (Hi-Res image)
			{name: '640px', minWidth: 321, maxWidth: 640},
			{name: '1024px', minWidth: 641}
		]
    });
```

If `ignoreLowBandwidth` is not set or is not `true`, it defaults to `false`, meaning Riloadr will only request Hi-Res images if connection speed is fast enough.  

¿What is "fast enough" for Riloadr?  

* Offline mode (no internet connection).
* Bandwidth higher than 100 KB/s. 
* 4g or faster mobile networks (2g & 3g are considered slow for Hi-Res images). 

***

### name (*String*, Optional)    
A name to identify which images Riloadr must process.  
This name must be added to the `class` attribute of each `img` tag in a group.  
When you create a Riloadr object, you're creating an image group.  
You can create different image groups setting a different `name` option for each Riloadr object even if all images share the same `root`. 

```js
    // We're creating 2 image groups that share the same root (body)
    // Each Riloadr object (group) will only process its images (identified by 'name')
    
    var group1 = new Riloadr({
        name: 'group1'
        ...
    });
    
    var group1 = new Riloadr({
        name: 'group2'
        ...
    });
```

```html
    <body>
        <img class="group1 other classes" data-src="img_{breakpoint-name}.jpg">
        <img class="group2 anyother classes" data-src="img_{breakpoint-name}.jpg">
        ...
    </body>
```

Image groups are awesome because you can set different options for different sets of images (i.e. An image group for the main column, another for the sidebar, another for the footer...).  

But, let's go one step further and suppose you want to deliver images from different domains ([Domain sharding](http://www.stevesouders.com/blog/2009/05/12/sharding-dominant-domains/)). You can create a group for each domain even if all images share the same `root`, just by setting a different `name` to each group:  

```js
    // Main column ID of your website
    var rootId = 'main-column';
    
    // Both groups share the same 'root' but each group will process 
    // exclusively the images identified by the 'name' option.
    // Use the 'base' option to set the domain for each group
    
    var group1 = new Riloadr({
        base: 'http://img1.example.com/{breakpoint-name}/',
        name: 'sub1',
        root: rootId,
        breakpoints: [ ... ]
    });
    
    var group2 = new Riloadr({
        base: 'http://img2.example.com/{breakpoint-name}/',
        name: 'sub2',
        root: rootId,
        breakpoints: [ ... ]
    });
```

```html
    <!-- HTML -->
    <div id="main-column">
       <img class="sub1" data-src="img1.jpg">
       <img class="sub2" data-src="img2.jpg">
       <img class="sub1" data-src="img3.jpg">
       <img class="sub2" data-src="img4.jpg">
    </div>   
```  

If `name` is not set, Riloadr will look for images with the class `responsive`.  

```html
    <img class="responsive" data-src="img1.jpg">
```

***

### oncomplete (*Function* | Optional)    
Callback function that will be called when all images in a group are completely (down)loaded.  
If new images are added dynamically to a group after the `oncomplete` callback is executed, this callback will be executed again once those new images are loaded.

```js
    var group1 = new Riloadr({
        oncomplete: function() {
            console.log("All images loaded");
        }
    });
```

***

### onerror (*Function* | Optional)    
Callback function that will be called if an image fails to load.  
Inside the callback the reserved keyword `this` refers to the image.  
If `retries` is set to a number greater than `0`, Riloadr will automatically try to load that image a maximum of `retries` times. 

```js
    var group1 = new Riloadr({
        onerror: function() {
            console.log(this);
        }
    });
```

***

### onload (*Function* | Optional)  
Callback function that will be called if an image loads successfully.  
Inside the callback the reserved keyword `this` refers to the image.

```js
    var group1 = new Riloadr({
        onload: function() {
            console.log('Image loaded!');
        }
    });
```

***

### retries (*Integer* | Optional)  
Number of times Riloadr must try to load an image if it fails to load.

```js
    var group1 = new Riloadr({
        retries: 2
    });
```

If `retries` is not set, it defaults to `0` (no retries). 

***

### root (*String* | Optional)  
The `id` attribute value of a DOM element (Riloadr uses internally `document.getElementById(root)` to select the element).  
Riloadr will look for images to process in the subtree underneath the specified element, excluding the element itself.  
This option allows you to define a group's scope.  
Use this option to improve image selection performance.  
If `root` is not set or can't be found, it falls back to the `body` element.  

```js
    // Here we're creating 2 groups (Riloadr objects) and each one 
    // has a different 'root'. Although these groups share the same 'name' 
    // (responsive) both are perfectly isolated because their scope is different. 
    
    // 'name' not set, defaults to 'responsive'
    var group1 = new Riloadr({
        base: 'http://{breakpoint-name}.example.com/',
        root: 'main-column',
        breakpoints: [ ... ]
    });
    
    // 'name' not set, defaults to 'responsive'
    var group2 = new Riloadr({
        base: 'http://{breakpoint-name}.example.com/',
        root: 'sidebar',
        breakpoints: [ ... ]
    });
```

```html
    <!-- HTML -->
    <div id="main-column">
       <img class="responsive" data-src="img1.jpg">
       <img class="responsive" data-src="img2.jpg">
    </div> 
    <div id="sidebar">
        <img class="responsive" data-src="img3.jpg">
        <img class="responsive" data-src="img4.jpg">
    </div>
```  

***

<a name="methods"></a>

## 2.2. Methods

### riload()
This method allows you to load responsive images inserted into the document after a group has been created.   
Call this method after new markup is inserted into the document.  
Note this method will load exclusively images belonging to the group (Riloadr object) that invoked `riload()`.

```js
    // Create an image group (root = body)
    var group1 = new Riloadr({
        name: 'resp-images',
        breakpoints: [ ... ]
    });
    
    // Code that adds images to the group's root element (body)
    ...
    
    // After inserting the images, call riload() to load them 
    group1.riload();
```

<a name="jquery"></a>

## 3. jQuery version

If you already use jQuery in a project, save some bytes and use the jQuery version of Riloadr (riloadr.jquery.js & riloadr.jquery.min.js). Same performance, same behavior!  
jQuery 1.3.2+ recommended!  

<a name="demos"></a>

## 4. Demos

Demos are located [here](https://github.com/tubalmartin/riloadr/tree/master/demos).  
Inspect the source code and watch each demo in action, it's the best way to learn how to use Riloadr.  
To run the demos, download the repo, extract the files (optionally upload them to an online server) and open any `demo/*.html` file in your browser.  

**Online demos you ask?** [Here you are](http://www.margenn.com/tubal/riloadr/demos/)


<a name="testing"></a>

## 5. Testing

Riloadr's goal has always been to work cross-browser, both desktop and mobile, and not require any javascript libraries, frameworks or any other dependencies except HTML and CSS. If you come across any problems please help us by submitting an issue and we'll work to improve it. Below are the primary browsers Riloadr has been tested against.

**Mobile browsers**

* Webkit mobile (iOS and Android)
* Opera Mini (iOS and Android). Yes, it sounds incredible!!
* Opera Mobile (iOS and Android)
* Firefox mobile (Android)
* Netfront Life browser v2 (Android)
* Dolphin Browser HD (iOS and Android)
* UC Browser 8+ (Android)

**Desktop browsers**

* Internet Explorer 6+
* Firefox (Mac and Win)
* Google Chrome (Mac and Win)
* Safari (Mac and Win)
* Opera (Mac and Win)

<a name="changelog"></a>

## 6. Changelog

### 1.2.0

* Added `oncomplete` option (callback)
* Added `ignoreLowBandwidth` option (for Hi-Res images - HiDPI screens)
* Bugfix: When calling `riload()` more than once on a group configured to load images above the fold (defer: belowfold), Riloadr was collecting more images than it should.

### 1.1.0

Much much better performance:
* Pub/Sub removed (less function calls and loops)
* `throttle` and `debounce` methods from underscore.js replaced by lodash.js counterparts (4% faster)
* If `belowfold` defer mode is used, event listeners are added/removed when needed (specially noticeable when scrolling)
* Some refactoring (`init` and `getImages` methods removed & better initialization)
* Images used in demos reduced in size (sorry guys for previous versions)
* Better demos overall
* Smaller footprint!

### 1.0.3

* Improved module definition for the jQuery version
* Improved demos
* Added RequireJS and curl demos

### 1.0.2

* `getSizeOfImages` function refactored (same result and better minification).

### 1.0.1

* Cleaner constructor (`riload`, `getImageSrc` & `isBelowFold` methods moved outside)
* Better minification (saving bytes!)

### 1.0.0

Initial release.

<a name="contribute"></a>

## 7. Contribute
This project was originally created for my company as a need to handle different image sizes for different device screens in order to make websites load faster (specially for mobile devices). Please feel free to improve this project in any way you can.

**Contact Me**

[@tubalmartin](https://twitter.com/#!/tubalmartin)

<a name="issues"></a>

## 8. Bug tracker

Find a bug? Please create an issue here on GitHub!

[Submit an issue](https://github.com/tubalmartin/riloadr/issues)

<a name="license"></a>

## 9. License

Copyright (c) 2012 Tubal Martin

Licensed under the [MIT license](https://github.com/tubalmartin/riloadr/blob/master/LICENSE.txt).

