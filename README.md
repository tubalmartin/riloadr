# Riloadr

A cross-browser framework-independent responsive images loader.

The goal of this library is to deliver optimized, contextual image sizes in responsive layouts that utilize dramatically different image sizes at different resolutions. Ideally, this could enable developers to start with mobile-optimized images in their HTML and specify a larger size to be used for users with larger screen resolutions -- without requesting both image sizes, and without UA sniffing.  

**Table of Contents**  

1.  [Features](#features)
2.  [How to use](#howto)
    1.  [Configuration options](#options)
    2.  [Methods](#methods)
3.  [Demos](#demos)
4.  [Testing](#testing)
5.  [To-Dos & Ideas](#todos)
6.  [Contribute](#contribute)
7.  [Bug tracker](#issues)
8.  [License](#license)

<a name="features"></a>

## 1. Features

* **No dependencies**: Just Riloadr, HTML and CSS (No server involved if you don't want to, no cookies, no .htaccess, no other Javascript library or framework required).
* **Ease of use**: 15-30 mins reading the docs and checking some demos and you're good to go!
* **Freedom**: Riloadr tries to get out of your way. We don't like rigid conventions. 
* **Absolute control**: Riloadr will process only the images you tell it to.
* **One request per image**: Riloadr does not make multiple requests for the same image.
* **Optimal image size delivery**: Riloadr mimics CSS, it computes the viewport's width in CSS pixels and the optimal image size for the viewport according to the breakpoints you set through the `breakpoints` option (sort of CSS media queries).
* **Lazy load of images**: Riloadr gives you the option to defer the load of all images in a group (faster pageload).
* **Image groups**: You can create different Riloadr objects and configure each one to your needs (ie: One for images in the sidebar and another one for images in the main column).
* **Image callbacks**: Riloadr allows you to attach callbacks for the `onload` and `onerror` image events.
* **Image retries**: You can configure any Riloadr object to retry *n* times the loading of an image if it failed to load.
* **Support for browsers with no Javascript support or Javascript disabled**: Use the `noscript` tag.
* **No UA sniffing**: Riloadr does not use device detection through user-agents.
* **Lightweight**: 4kb minified
* **AMD compatible**
* **MIT License**

<a name="howto"></a>

## 2. How to use

Riloadr got inspired by the technique used by the [YUI image loader](http://yuilibrary.com/yui/docs/imageloader/).  

The main idea behind this technique is to leave the `src` attribute of `img` tags out of the HTML element altogether.

This way we avoid making multiple requests to the server for different sizes of an image. Once Riloadr chooses the best size to deliver for the current screen, it adds the `src` attribute and the image is requested.

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
     Riloadr and Modernizr will remove this 'no-js' class ASAP.
     HTML5 boilerplate uses this technique, so use it!
-->
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">

    <!-- Mobile viewport optimization: Required!! -->
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="0">
    <meta name="viewport" content="width=device-width">
    
    <!-- Recommended CSS styles --> 
    <style type="text/css">
        img {
            max-width: 100%; /* To make all images fluid */
        }
        /* Riloadr styles for image groups */
        img.responsive, 
        img.main-col-images {
            visibility: hidden /* To make responsive images not visible until loaded. */
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
        /* Image group 1: Minimal Js configuration, just the breakpoints.
         * The group's name will be 'responsive' and the root will be the <body> element
         * The base URL for each image must be included in each <img> tag
         * Images will be loaded as soon as the DOM is ready.
         */
        var group1 = new Riloadr({
            breakpoints: {
                w320: {maxWidth: 320},
                w640: {minWidth: 321, maxWidth: 640},
                w1024: {minWidth: 641}
            }
        });
        
        // Image group 2: Full Js configuration. 
        // To know what each setting does read the 'configuration options' section
        var group2 = new Riloadr({
            root: document.getElementById('main-column'),
            name: 'main-col-images',
            base: "images/",
            defer: "belowfold",
            foldDistance: 125,
            onload: function(){
                // Image x is loaded
            },
            onerror: function(){
                // Image x failed to load, Riloadr will try to load it one more time
            },
            retries: 1,
            breakpoints: {
                small : {maxWidth: 320},
                medium: {minWidth: 321, maxWidth: 640},
                large : {minWidth: 641}
            }
        });   
    </script>
</head>
<body>
    <header>
        <!-- You can set the base URL for all image sizes adding a 'data-base' attribute -->
        <img class="responsive" alt="Tahiti" data-base="images/" data-w320="tahiti_320.jpg" data-w640="tahiti_640.jpg" data-w1024="tahiti_1024.jpg">
        <!-- 
            Use the <noscript> tag to show images to browsers with no Javascript support.
            Deliver to these browsers the smallest image size (Mobile first approach).
        -->
        <noscript>
            <img alt="Tahiti" src="images/tahiti_320.jpg">
        </noscript>
        
        <!-- You can set the full src path for each image size (no 'base' option nor 'data-base' attribute) -->
        <img class="responsive" alt="Cocoa Beach" data-w320="images/cocoa_320.jpg" data-w640="images/cocoa_640.jpg" data-w1024="images/cocoa_1024.jpg">
        <noscript>
            <img alt="Cocoa Beach" src="images/cocoa_320.jpg">
        </noscript>
    </header>
    
    <div id="main-column">
        <img class="main-col-images" alt="La Jolla" data-small="jolla_320.jpg" data-medium="jolla_640.jpg" data-large="jolla_1024.jpg">
        <noscript>
            <img alt="La Jolla" src="images/jolla_320.jpg">
        </noscript>
        
        <img class="main-col-images" alt="Morro Rocks" data-small="morro_320.jpg" data-medium="morro_640.jpg" data-large="morro_1024.jpg">
        <noscript>
            <img alt="Morro Rocks" src="images/morro_320.jpg">
        </noscript>
    </div>
</body>
</html>
```

<a name="options"></a>

## 2.1. Configuration options

### base (*String*, Optional)  
An absolute or relative path to all images in a group.

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
    <img class="responsive" data-base="http://assets3.myserver.com/images/" data-xsmall="img_xs.jpg" data-small="img_s.jpg">
```

If `base` is not set and the `data-base` attribute is missing in an image, Riloadr will use the value of each `data-{breakpoint-name}` attribute for that image.

```html
    <img class="responsive" data-xsmall="http://assets3.myserver.com/images/img_xs.jpg" data-small="http://assets3.myserver.com/images/img_s.jpg">
```

If `base` is set and an image has a `data-base` attribute, the attribute's value overrides the `base` option for that image.

***

### breakpoints (*Object* | Optional)  
The `breakpoints` object works in a similar way to media queries in CSS.  
You can define `minWidth` and `maxWidth` properties. Values should be expressed in CSS pixels.  

Let's see some examples:  
Example 1:  

```js
    var group1 = new Riloadr({
        base: '../images/',
        breakpoints: {
            xsmall: {maxWidth: 320},
            small : {minWidth: 321, maxWidth: 480},
            medium: {minWidth: 481, maxWidth: 768},
            large : {minWidth: 769, maxWidth: 1024},
            xlarge: {minWidth: 1025}
        }
    });
```

```html
    <!-- HTML -->
    <img class="responsive" data-xsmall="wow_xs.jpg" data-small="wow_s.jpg" data-medium="wow_m.jpg" data-large="wow_l.jpg" data-xlarge="wow_xl.jpg">
```

Example 2:  

```js
    var group2 = new Riloadr({
        base: 'http://myserver.com/photos/',
        breakpoints: {
            mobile : {maxWidth: 320},
            tablet : {minWidth: 321, maxWidth: 768},
            desktop: {minWidth: 769}
        }
    });
```

```html
    <!-- HTML -->
    <img class="responsive" data-mobile="mobi/super.jpg" data-tablet="tablet/super.jpg" data-desktop="desktop/super.jpg">
```
  
Configure as many breakpoints (or size ranges) as you need.  
Choose the breakpoint names you like most.  
Each breakpoint name needs to have its counterpart HTML `data-{breakpoint-name}` attribute on each image of a group.  

**Important!**:   
When Riloadr parses your `breakpoints` it mimics CSS behavior: Riloadr computes the browser's viewport width in CSS pixels, then traverses your breakpoints to find out the appropiate image size to load and makes use of your breakpoint names to get the correct `src` (image URL) to load the image.  
Remember, Riloadr *mimics CSS* and as such, it works with CSS pixels not with device pixels. So when you define your breakpoints use this formula to calculate the minWidth and maxWidth values:  

`device screen width / device pixel ratio = width in CSS pixels`  

An example:  
You need to target the iPhone 4 which in portrait mode has a screen width (device pixels) of 640px.
The iPhone 4 has a device pixel ratio of 2 (2 device pixels equal 1 CSS pixel) so if we apply the formula above we get a width of 320 CSS pixels.  
This is the value that you should set as `minWidth` to target the iPhone 3 & 4.

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
If `belowfold` mode is set and the browser does not support the `getBoundingClientRect` method, Riloadr falls back to `load`.  

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

### name (*String*, Optional)    
A name to identify which images Riloadr must process.  
This name must be added to the `class` attribute of each `img` tag in a group.  
When you create a Riloadr object, you're creating an image group.  
You can create different image groups setting a different `name` option on each Riloadr object even if all images share the same `root`. 

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
        <img class="group1 other classes" data-mobile="img_mobile.jpg" data-desktop="img_desktop.jpg">
        <img class="group2 anyother classes" data-mobile="img_mobile2.jpg" data-desktop="img_desktop2.jpg">
        ...
    </body>
```

Image groups are awesome because you can set different options for different sets of images (i.e. An image group for the main column, another for the sidebar, another for the footer...).  

But, let's go one step further and suppose you want to deliver images from different subdomains. You can create a group for each subdomain even if all images share the same `root`, just by setting a different `name` to each group:  

```js
    // Main column of your website
    var root = document.getElementById('main-column');
    
    // Both groups share the same 'root' but each group will process 
    // exclusively the images identified by the 'name' option.
    // Use the 'base' option to set the subdomain base URL for each group
    
    var group1 = new Riloadr({
        base: 'http://images1.example.com/',
        name: 'sub1',
        root: root,
        breakpoints: { ... }
    });
    
    var group2 = new Riloadr({
        base: 'http://images2.example.com/',
        name: 'sub2',
        root: root,
        breakpoints: { ... }
    });
```

```html
    <!-- HTML -->
    <div id="main-column">
       <img class="sub1" data-mobile="img_mobile1.jpg" data-desktop="img_desktop1.jpg">
       <img class="sub2" data-mobile="img_mobile2.jpg" data-desktop="img_desktop2.jpg">
       <img class="sub1" data-mobile="img_mobile3.jpg" data-desktop="img_desktop3.jpg">
       <img class="sub2" data-mobile="img_mobile4.jpg" data-desktop="img_desktop4.jpg">
    </div>   
```  

If `name` is not set, Riloadr will look for images with the class `responsive`.  

```html
    <img class="responsive" data-mobile="img_mobile.jpg" data-desktop="img_desktop.jpg">
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
            console.log('Image loaded! Wheee!');
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

### root (*DOM element* | Optional)  
A reference to a DOM element.  
Riloadr will look for images to process in the subtree underneath the specified element, excluding the element itself.  
This option allows you to define a group's scope.  
Use this option to improve image selection performance.  
If `root` is not set, it defaults to the `body` element.  

```js
    // Here we're creating 2 groups (Riloadr objects) and each one 
    // has a different 'root'. Although these groups share the same 'name' 
    // (responsive) both are perfectly isolated because their scope is different. 
    
    // 'name' not set, defaults to 'responsive'
    var group1 = new Riloadr({
        root: document.getElementById('main-column'),
        breakpoints: { ... }
    });
    
    // 'name' not set, defaults to 'responsive'
    var group2 = new Riloadr({
        root: document.getElementById('sidebar'),
        breakpoints: { ... }
    });
```

```html
    <!-- HTML -->
    <div id="main-column">
       <img class="responsive" data-mobile="img_mobile1.jpg" data-desktop="img_desktop1.jpg">
       <img class="responsive" data-mobile="img_mobile2.jpg" data-desktop="img_desktop2.jpg">
    </div> 
    <div id="sidebar">
        <img class="responsive" data-mobile="img_mobile3.jpg" data-desktop="img_desktop3.jpg">
        <img class="responsive" data-mobile="img_mobile4.jpg" data-desktop="img_desktop4.jpg">
    </div>
```  

***

### serverBreakpoints (*Boolean* | Optional)   
If you prefer to create or resize images on-demand in the server set `serverBreakpoints` to `true` and omit the `breakpoints` option.  
If set to `true`, you must add the data attribute `data-src` on each `img` tag of a group because Riloadr will append a query string (GET request) to the value (URL) of the `data-src` attribute.    
This query string will contain the following 3 parameters:

* `vwidth`: The viewport width in CSS pixels.
* `swidth`: The screen width in device pixels.
* `dpr`: The device pixel ratio.

```js
    var group1 = new Riloadr({
        name: 'resp-images',
        serverBreakpoints: true
    });
```

```html
    <!-- HTML -->
    <img class="resp-images" data-src="http://www.domain.com/images/process.php">
```

Example of the GET request that will be sent to the server:

```
http://www.domain.com/images/process.php?vwidth=1229&swidth=1920&dpr=1
```

Riloadr does not provide a library/script to create/resize images on the server but you can find lots of them googling a bit :)  

**Warning!**:  
This method is not cache/proxy friendly because we're using query strings and 3 parameters that will change from one browser/device to another.  
Even if we didn't use query strings, it wouldn't be cache friendly either because the likelihood that URLs change from one device to another is really high and you can end up easily with 100 different URLs for the same image and size instead of 1 per image/size combination.  

`serverBreakpoints` defaults to `false`.

<a name="methods"></a>

## 2.2. Methods

### riload()
This method allows you to load responsive images inserted into the document after the initial page load.   
Call this method after new markup is inserted into the document (useful for AJAX content & markup created dynamically with javascript).  
Note this method will load exclusively images belonging to the group (Riloadr object) that invoked `riload()`.

```js
    // Create an image group (root = body)
    var group1 = new Riloadr({
        name: 'resp-images',
        breakpoints: {...}
    });
    
    // Code that adds images to the group's root element (body)
    ...
    
    // After inserting the images, call riload() to load them 
    group1.riload();
```


<a name="demos"></a>

## 3. Demos

Demos are located [here](https://github.com/tubalmartin/riloadr/tree/master/demos).  
Inspect the source code and watch each demo in action, it's the best way to learn how to use Riloadr.  
To run the demos, download the repo, extract the files (optionally upload them to an online server) and open any `demo/*.html` file in your browser.  

<a name="testing"></a>

## 4. Testing

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

<a name="todos"></a>

## 5. To-Dos & Ideas

* jQuery version (to reduce code size) -> Will do!
* Give option to set minDevicePixelRatio in `breakpoints` to allow delivery of High Resolution images? -> Probably
* Create plugin that adds the option `serverCookie` (if `serverBreakpoints` is true) to set a cookie (instead of query string) in order to send the screen/viewport calculated values to the server? -> Maybe!

<a name="contribute"></a>

## 6. Contribute
This project was originally created for my company as a need to handle different image sizes for different device screens in order to make websites load faster (specially for mobile devices). Please feel free to improve this project in any way you can.

**Contact Me**

[@tubalmartin](https://twitter.com/#!/tubalmartin)

<a name="issues"></a>

## 7. Bug tracker

Find a bug? Please create an issue here on GitHub!

[Submit an issue](https://github.com/tubalmartin/riloadr/issues)

<a name="license"></a>

## 8. License

Copyright (c) 2012 Tubal Martin

Licensed under the [MIT license](https://github.com/tubalmartin/riloadr/blob/master/LICENSE.txt).

