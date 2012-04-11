# Riloadr

A cross-browser framework-independent responsive images loader.

## Introduction



## Features

* **No dependencies**: Just Riloadr, HTML and CSS (No server involved if you don't want to, no cookies, no .htaccess, no other Javascript library or framework required).
* **Ease of use**: 5-15 mins reading the docs and checking some demos and you're good to go!
* **Freedom**: Riloadr tries to get out of your way. We don't like rigid conventions. 
* **Absolute control**: Riloadr will process only the images you tell it to.
* **One request per image**: Riloadr does not make multiple requests for the same image.
* **Optimal image size delivery**: Riloadr mimics CSS, it computes the viewport's width in CSS pixels and the optimal image size for the viewport according to the breakpoints you set through the `breakpoints` option (sort of CSS media queries).
* **Lazy load of images**: Riloadr gives you the option to defer the load of all images in a group (faster pageload).
* **Image groups**: You can create different Riloadr instances and configure each one to your needs (ie: One for images in the sidebar and another one for images in the main column).
* **Image callbacks**: Riloadr allows you to attach callbacks for the `onload` and `onerror` image events.
* **Image retries**: You can configure any Riloadr instance to retry *n* times the loading of an image if it failed to load.
* **Support for browsers with no Javascript support or Javascript disabled**: Use the `noscript` tag.
* **No UA sniffing**: Riloadr does not use device detection through user-agents.
* **Lightweight**

## Demos

Demos are located [here](). Inspect the source code and watch each demo in action, it's the best way to learn how to use Riloadr.

To run the demos, download the repo, extract the files and open any `demo/*.html` file in your browser.

**Online demos you ask?** You got them [here]().

## How to use



## Configuration options

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

### breakpoints (*Object* | Optional)  
The `breakpoints` object contains `minWidth` and `maxWidth` breakpoints in CSS pixels in a similar way to media queries in CSS.  
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

As you can see the flexibility is huge.  
You can configure as many breakpoints or size ranges as you need and you can assign the name you prefer to each breakpoint.  
As you may already deduced, each breakpoint name needs to have its counterpart HTML `data-{name}` attribute on each image of a group.  
When Riloadr parses your `breakpoints` it mimics CSS behavior: Riloadr computes the browser's viewport width in CSS pixels, then traverses your breakpoints to find out the appropiate image size to load and makes use of your breakpoint names to get the correct `src` (image url) and load the image. 


### className (*String*, Optional)    
A name to identify which images Riloadr must process.  
This name must be added to the `class` attribute of each `img` tag.  

```js
    var group1 = new Riloadr({
        className: 'myClass'
    });
```

```html
    <img class="rounded myClass" data-mobile="img_mobile.jpg" data-desktop="img_desktop.jpg">
```

If `className` is not set, Riloadr will look for images with the class `responsive`.

```html
    <img class="rounded responsive" data-mobile="img_mobile.jpg" data-desktop="img_desktop.jpg">
```

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

### foldDistance (*Integer* | Optional)  
A group can check its images at the DOM ready state and immediately begin loading those that are above the fold (i.e., inside the current viewport) while delaying the load of those that aren't. Just set a value (in pixels) for the `foldDistance` property of the group. Images are checked and loaded in a cascading fashion. That is, each image will be loaded only when it comes within `foldDistance` pixels of the bottom of the viewport. The effect is that images are loaded as needed as the user scrolls down the page. When you set a `foldDistance`, the group automatically gets window `scroll`, `resize` and `orientationchange` triggers.

```js
    var group1 = new Riloadr({
        defer: 'belowfold',
        foldDistance: 150
    });
```

If `foldDistance` is not set, it defaults to `100`px.  


### onerror (*Function* | Optional)    
Callback function that will be called if an image fails to load.  
Inside the callback the reserved keyword `this` refers to the image.

```js
    var group1 = new Riloadr({
        onerror: function() {
            console.log(this);
        }
    });
```

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

### parentNode (*DOM node* | Optional)  
A reference to a DOM node/element where Riloadr must look for images to process.  
This is the key to create image groups.  

```js
    var group1 = new Riloadr({
        parentNode: document.getElementById('main-column')
    });
    
    var group2 = new Riloadr({
        parentNode: document.getElementById('sidebar')
    });
```

Image groups are awesome because you can set different options for different sets of images (i.e. An image group for the main column, another for the sidebar, another for the footer...).    
If `parentNode` is not set, it defaults to the `body` element (1 group).  

### retries (*Integer* | Optional)  
Number of times Riloadr must try to load an image if it fails to load.

```js
    var group1 = new Riloadr({
        retries: 2
    });
```

If `retries` is not set, it defaults to `0` (no retries). 

### serverBreakpoints (*Boolean* | Optional)   
If you prefer to create or resize images on-demand in the server set `serverBreakpoints` to `true` and do not set the `breakpoints` option.  
If set to `true`, you must add the data attribute `data-src` on each `img` tag of a group because Riloadr will append a query string (GET request) to the value (URL) of the `data-src` attribute.    
This query string will contain the following 3 parameters:

* `vwidth`: The viewport width in CSS pixels.
* `swidth`: The screen width in device pixels.
* `dpr`: The device pixel ratio.

```js
    var group1 = new Riloadr({
        className: 'resp-images',
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

`serverBreakpoints` defaults to `false`.



## Testing

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

## To-Dos & Ideas

* jQuery version (to reduce code size)
* Give option to set minDevicePixelRatio in `breakpoints` to allow delivery of High Resolution images?

## Contribute
This project was originally created for my company as a need to handle different image sizes for different device screens in order to make websites load faster (specially for mobile devices). Please feel free to improve this project in any way you can.

**Contact Me**

[@tubalmartin](https://twitter.com/#!/tubalmartin)

## Bug tracker

Find a bug? Please create an issue here on GitHub!

[Submit an issue](https://github.com/tubalmartin/riloadr/issues)

## License

Copyright (c) 2012 Tubal Martin

Licensed under the MIT license.

