---
layout: post
title:  "The Static Countdown"
date:   2013-12-11 07:53:00
categories: website bug investigation fix
---

At the top of the [Glasgow 2014 Commonwealth Game](http://www.glasgow2014.com) website they tell you the amount of time left until the launch of the games. As of writing it says "224 DAYS 20 HOURS, 19 MINUTES & 03 SECONDS TO GO." Strangely though it doesn't count down.

It's the kind of thing you'd expect to count down.

The first time I visited the website I was using Google Chrome, so I decided to try another browser. It doesn't count down if you use Mozilla Firefox either. However if you try an old version of Internet Explorer, version 6, the website does count down. So there is a bug somewhere.
<!--more-->
The way you'd expect a countdown to work is a DIV element on an HTML page, with a piece of JavaScript set to run every second to calculate the time and update the contents of the DIV. Glancing through the code of the website and sure enough there is a DIV tagged "countdown-timer" and in an external JavaScript file called "script.js" there is a little plugin called [Countdown for jQuery](http://keith-wood.name/countdown.html).

The code in the script.js has been minified (all the extra space has been removed to reduce the amount of data sent and received over the Internet) which makes it difficult to read, but it can be passed through a beautifier to expand it again and format it in an easier to read layout. So after grabbing a copy of the code from the front page and a copy of the JavaScript file which I passed through http://jsbeautifier.org/ to make it easier to read I had a copy of the front page to play with.

Within the Countdown plugin is a function called `Countdown()` that sets up initial values for the countdown and also sets up a loop to update the time. Funnily enough it actually has code for two loops. One for older browsers (which explains why Internet Explorer 6 works), and another loop that supports modern browsers. But unfortunately as demonstrated by the static countdown in modern browsers there is a bug in that second loop.

{% highlight javascript %}
function timerCallBack(timestamp) {
	var drawStart = (timestamp || new Date().getTime());
	if (drawStart - animationStartTime >= 1000) {
		$.countdown._updateTargets();
		animationStartTime = drawStart;
	}
	requestAnimationFrame(timerCallBack);
}
var requestAnimationFrame = window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				null;
var animationStartTime = 0;
if (!requestAnimationFrame) {
	setInterval(function () {
		$.countdown._updateTargets();
	}, 980);
} else {
	animationStartTime = window.mozAnimationStartTime || new Date().getTime();
	requestAnimationFrame(timerCallBack);
}
{% endhighlight %}

The modern loop uses a new browser feature called [requestAnimationFrame](https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame) and on that linked page is the first clue to what is actually going wrong.

> The callback parameter is a DOMTimeStamp instead of a 
> DOMHighResTimeStamp if the prefixed version of this
> method was used. DOMTimeStamp only has millisecond
> precision, but DOMHightResTimeStamp has a minimal
> precision of ten microseconds.

The problem occurs because the callback function uses the timestamp to decide whether to animate the countdown. It checks whether 1000 milliseconds have elapsed between the timestamp passed into the function and the animationStartTime. Unfortunately though both values store the time, they use different formats. DOMTimeStamp is an integer that stores the number of seconds since the UNIX epoch (1 January 1970 00:00:00 UTC) while DomHighResTimeStamp is a floating point value that reports the number of milliseconds and microseconds from the moment that the browser started navigating to the page.

A simple fix to this bug is to comment out the un-prefixed version of the method "window.requestAnimationFrame" and reload, then the countdown works perfectly in Chrome, Firefox, mobile browsers, etc, because the timestamp passed into the callback is using the same format as the animationStartTime value stored earlier.

{% highlight javascript %}
var requestAnimationFrame = /* window.requestAnimationFrame || */ 
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				null;
{% endhighlight %}
