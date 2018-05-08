---
layout: post
title:  "Building an extension for Chrome and Firefox"
subtitle: "Or Why does our fault logging app not have notifications?"
date:   2018-05-04 18:39:00
---

I've always been curious how browser extensions work. And at work we use a browser based application called Remedy that could really use notifications. So I threw together a little browser extension to add notifications to Remedy. Killing two birds with one stone.

Now every time an item (for example an incident or work order) is added or removed from my team's stack, I get a little notification in the corner of my screen. This way I don't have to keep checking Remedy to see if anything has changed. As soon as anything changes I get a notification to tell me.

<a class="image" href="{{site.baseurl}}/images/Browser notifications.png" data-lightbox="image-1" data-title="Browser notifications">
<img src="{{site.baseurl}}/images/Browser notifications.png" style="width:400px;" /></a>

*Disclaimer: I threw this together in about a day. It works and the world hasn't ended so far. That doesn't mean this code won't do that tomorrow. You have been warned.*

How it works
------------

The extension is quite simple. All the calls assigned to my team are listed in a &lt;TABLE&gt; within Remedy. The extension watches that table for changes, compares it to a previous state, and displays notifications for any changes it finds.

The heart of the extension is a few lines of JavaScript code that are split over two files. The [WebExtensions API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) that is used by extensions to talk to their host browsers separates certain functions for security reasons. [Background scripts](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension) can interact with the browser (for example to update a toolbar icon), but cannot access the content of web pages. And [content scripts](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts) can access the content of web pages but can't interact with the browser, except to send messages to a background script.

How to build it
---------------

Extensions are deployed and distributed as single zipped files, but while developing one you can just point your browser to a folder that contains the individual files that make up the extension and it'll load them for testing from there.

So create a folder and put the following files in it...

Manifest
========

Start with a file called ``manifest.json``. This gives the browser basic information about the extension, and points to all the other files that make up the extension.

The matches key is a required key that tells the browser which web pages to load the content script into. You may want to change the URL in the matches key; unless of course you do actually work for the Jupiter Mining Corporation.

{% highlight json linenos %}
{
    "name": "Remedy Notifications",
    "version": "0.1",
    "manifest_version": 2,
    "description": "This extension shows a notification when an Incident or Work Order is added or removed from your stack.",
    "browser_action": {
        "default_icon": "icon.png"
    },
    "content_scripts": [{
        "run_at": "document_idle",
        "matches": ["*://jupiterminingcorporation.onbmc.com/*"],
        "js": [
            "jquery.js",
            "content_script.js"
        ]
    }],
    "background": {
        "scripts": ["background.js"]
    },
    "permissions": [
        "notifications"
    ]
}
{% endhighlight %}

Content script
==============

The first thing the extension needs to do is locate the &lt;TABLE&gt; element within the application and grab the rows of data from the table. The extension does this in the "content script" that gets loaded into the web page. Create a file imaginatively called ``content_script.js`` and paste the following code into it.

{% highlight javascript linenos %}
$(document).ready(function() {

    function addObserverIfDesiredNodeAvailable() {

        // T301444200 is the unique identifier given to
        // the table with the data we're interested in
        var targetNode = document.getElementById('T301444200');

        // The application can take a while to load so
        // if we don't initally find the table, we set
        // a timer to check back in 5 seconds to see if
        // it's appeared
        if(!targetNode) {
            window.setTimeout(addObserverIfDesiredNodeAvailable,5000);
            return;
        }
        console.log('Found T301444200');

        // Once we find the table we set a "Mutation
        // Observer" on it
        //
        // Any time the table changes the observer 
		// will be notified and run the code in the
		// function below
        observer.observe(targetNode, {
            attributes: true, 
            childList: true, 
            characterData: true 
        });
    }

	// Creates our Mutation Observer
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

			// Figures out the total number of items
			// listed in the table
            var total = mutation.target.childNodes[1].getElementsByTagName('tr').length-1;

			// Parses through each row of the table, 
			// grabs the data we are interested in,
			// and puts it into an array
            var requests = [];
            $('#T301444200 > tbody > tr').not(':first').each(function(index) {
                requests.push([$(this).find('td:nth-child(0n+1) > nobr > span').text(), $(this).find('td:nth-child(0n+6) > nobr > span').text()]);
            });

            // Sends the array in a message to background.js
            chrome.runtime.sendMessage({count: total, requests: requests});
            addObserverIfDesiredNodeAvailable();
        });
    });
    
    addObserverIfDesiredNodeAvailable();
});
{% endhighlight %}

Background script
=================

The background script runs in the context of the browser itself. It listens for messages from the content script. When it receives a message it checks through the content of the array passed from the content script, to see whether something has been added or removed.

Create a file called ``background.js`` and paste the following code into it...

{% highlight javascript linenos %}
// Create some variables to store the state
// of the queue between runs
var previousCountOfRequests = -1;
var countOfRequests = -1;

// Create arrays to hold the previous list
// of items and the current list of items
var requests = [];
var newRequests = [];

// Create a listener that waits for messages from
// the content script.
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    // First of all we check to see if the message
	// contains data
    if (request.count || request.count === 0) {
        countOfRequests = request.count;

        newRequests = request.requests;

        // If this is the first time we are running, we just
        // store the data, as there is nothing to compare to
        if (previousCountOfRequests == -1) {

            // Each item in the queue is stored in an array, so that
            // we can compare it when we receive subsequent messages
            // to identify changes
            for (var index = 0; index < newRequests.length; index++) {
                requests.push(newRequests[index]);
                console.log(index, "INITIALISING: " + newRequests[index]);
            }

            // And we display a notification on screen with a count
            // of the items
            chrome.notifications.create("", {
                type: "basic",
                title: "Remedy",
                iconUrl: "sad.png",
                message: "There are " + countOfRequests + " items in your stack."
            }, function(notificationId) {});

        // If this isn't the first message then
		// we check for anything that has changed
        } else {

            // First we look for calls that exist in our stored array
            // that don't exist in the array we've just been passed
            // i.e. calls that have either been resolved, completed,
            // or moved to another team's stack
            //
            // If we find any that don't exist in the new array, then
            // we display a notification to the user and remove them
            // from our stored array
            for (var index = 0; index < requests.length; index++) {
                var found = false;
                for (var index2 = 0; index2 < newRequests.length; index2++) {
                    if (requests[index][0] === newRequests[index2][0]) {
                        found = true;
                    }
                }
                if (found === false) {
                    chrome.notifications.create("", {
                        type: "basic",
                        title: "Remedy: Item closed or removed",
                        iconUrl: "happy.png",
                        message: requests[index][0] + " - "  + requests[index][1]
                    }, function(notificationId) {});
                    console.log(index, "REMOVED: " + requests[index][0] + " - " + requests[index][1]);
                    requests.splice(index, 1);
                    index--;
                }
            }

            // Next we check for calls that are in the new array
            // but not in our stored copy i.e. new calls that have
            // appeared in our stack
            //
            // If we find any we add them to the stored array and
            // display a notification to the user
            for (var index = 0; index < newRequests.length; index++) {
                var found = false;
                for (var index2 = 0; index2 < requests.length; index2++) {
                    if (requests[index2][0] === newRequests[index][0]) {
                        found = true;
                        if (requests[index2][1] !== newRequests[index][1]) { // Checking to see if the summary field has changed
                            console.log(index, "CHANGED: \"" + requests[index2][1] + "\" changed to \"" + newRequests[index][1] + "\".");
                            requests[index2][1] = newRequests[index][1];
                        }
                    }
                }
                if (found === false) {
                    requests.push(newRequests[index]);
                    chrome.notifications.create("", {
                        type: "basic",
                        title: "Remedy: New item",
                        iconUrl: "sad.png",
                        message: newRequests[index][0] + " - " + newRequests[index][1]
                    }, function(notificationId) {});
                    console.log(index, "ADDED: " + newRequests[index][0] + " - " + newRequests[index][1]);
                }
            }

            countOfRequests = request.count;
            console.log("There are " + countOfRequests + " items in your stack!");
        }

        previousCountOfRequests = request.count;
        
        // The last thing we do here is tell the browser to update
        // the extensions toolbar icon with the number of calls in
        // our stack
        chrome.browserAction.setBadgeText({"text": countOfRequests.toString()});
    }
});
{% endhighlight %}

JQuery
======

The extension uses the JQuery library to find HTML elements and parse the data within them, so we need to grab a copy of the library from [here](https://jquery.com/download/). The compressed, slimmed down version of the library is more than enough for this simple extension, so grab it and drop it in the folder with the other files. The name will be something like ``jquery-3.3.1.slim.min.js`` but simplify that to ``jquery.js``, or modify the manifest.json file with the full name.

PNG files
=========

Very last thing is some images.

We need a 19x19 pixel image to appear in the browser toolbar called ``icon.png``.

And because the notifications look a bit plain, two 128 x 128 pixel images to represent good notifications and bad notifications called ``happy.png`` and ``sad.png``.

How to test it
--------------

At this point we have a simple barebones but functioning browser extension. To test it we can tell Firefox and Chrome to load the extension from the folder.

Within Firefox...
* Choose "Add-Ons" from the menu button (the hamburger icon)
* Click on the "Tools" menu (the gear icon) and select "Debug Add-On"
* Click on the "Load Temporary Add-on" button, select the manifest.json file and click Open

Within Chrome...
* Select "Extensions" from the More tools submenu of the menu button (the hamburger icon)
* Flip the "Developer mode" button in the top-right corner of the Extensions page
* Click on the "LOAD UNPACKED" button and point it to the folder

If everything goes well, the extension icon should appear in the browser toolbar and you should see an initial notification message that tells you how many items there are in your stack.

<a class="image" href="{{site.baseurl}}/images/Browser notifications with sad image.png" data-lightbox="image-1" data-title="Browser notifications">
<img src="{{site.baseurl}}/images/Browser notifications with sad image.png" style="width:400px;" /></a>

<a class="image" href="{{site.baseurl}}/images/Browser notifications with happy image.png" data-lightbox="image-1" data-title="Browser notifications">
<img src="{{site.baseurl}}/images/Browser notifications with happy image.png" style="width:400px;" /></a>

You potentially need to change one settings in Remedy though. The extension doesn't do anything until it sees the content of Remedy change, and by default Remedy doesn't refresh its content automatically. So you need to set the Refresh Interval to something other than zero.

<a class="image" href="{{site.baseurl}}/images/Set Refresh Interval.png" data-lightbox="image-1" data-title="Browser notifications">
<img src="{{site.baseurl}}/images/Set Refresh Interval.png" /></a>

Distributing an extension
---------------------------

To distribute an extension for Firefox you really need to get it validated and signed by Mozilla. There's a few different ways to do this, that you can [read about here](https://developer.mozilla.org/en-US/Add-ons/Distribution). The way I found easiest was just to submit my extension through the Developer Hub [here](https://addons.mozilla.org/en-US/developers/addon/submit/agreement). This also gives you the option to have your extension hosted on Mozilla's servers and made available for users to install through the browser. But if you don't want that, you can just get your extensions validated and signed.

To distribute an extension for Chrome similarly there are a few options, but ideally it should be hosted in the Chrome Web Store. You have the choice whether you want your Web Store hosted extension to be available publicly, or private. You upload your extension through the Chrome Developer Dashboard available [here](https://chrome.google.com/webstore/developer/dashboard).

What next?
----------

You can read more about building extensions here:

* [https://developer.mozilla.org/en-US/Add-ons/WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)
* [https://developer.chrome.com/extensions/overview](https://developer.chrome.com/extensions/overview)

