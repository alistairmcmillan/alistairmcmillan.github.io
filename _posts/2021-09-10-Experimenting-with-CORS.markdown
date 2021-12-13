---
layout: post
title:  "Experimenting with Cross Origin Resource Sharing (CORS)"
image: 
excerpt: ""
date:   2021-12-13 18:00:00
---

We had a problem recently that involved the Cross Origin Resource Sharing (CORS) protocol,  so I did a little experimenting to make sure I had it clear in my head.

# Scenario 1: Everything on the same server

Let's say you have a really simple website. An HTML page that runs a little bit of JavaScript code, that loads some data from a JSON file and uses it to populate a table on a web page. 

If all three files are hosted on the same server everything works with no problems. The HTML page loads, the JavaScript code runs, the JSON data is loaded, and the table is populated.

<a class="image" href="{{site.baseurl}}/images/cors-localfiles.png" data-lightbox="image-1" data-title="Screenshot of working website"><img src="{{site.baseurl}}/images/cors-localfiles.png" style="width:500px;" /></a>

# Scenario 2: Data is stored on one server but accessed from another server

However what if the JSON file is hosted on a different server to the HTML page and the JavaScript code. Then the HTML page loads, the JavaScript runs, but the website is blocked from accessing the data in the JSON file because it is hosted on a different server.

The request to load the JSON is blocked by the browser with the message "`CORS Missing Allow Origin`" and the more detailed "`Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://cagle.cx/cors-test1/starships.json. (Reason: CORS header 'Access-Control-Allow-Origin' missing).`"

So the table isn't populated.

<a class="image" href="{{site.baseurl}}/images/cors-remote-fail.png" data-lightbox="image-1" data-title="Screenshot of non-working website where access to JSON file has been blocked"><img src="{{site.baseurl}}/images/cors-remote-fail.png" style="width:500px;" /></a>

So how do you fix this? Well you need the server to reply to the request with an "Access-Control-Allow-Origin" header along with the JSON data file. This header tells the browser which servers are allowed access to these files. There are various ways to do this, but with Apache you can create a ".htaccess" file in the same directory as the files.

{% highlight htaccess %}
Header set Access-Control-Allow-Origin: "https://mcmillan.cx"
{% endhighlight %}

<a class="image" href="{{site.baseurl}}/images/cors-htaccess.png" data-lightbox="image-1" data-title="Screenshot of a simple .htaccess file that adds a Access-Control-Allow-Origin header to web server responses"><img src="{{site.baseurl}}/images/cors-htaccess.png" style="width:500px;" /></a>

Now with that parameter in an .htaccess file in the same directory as the JSON file, the server replies to that request with the header attribute, and the browser knows it is okay for code from mcmillan.cx to load and make use of the JSON file from cagle.cx and the page is able to successfully populate the table.

<a class="image" href="{{site.baseurl}}/images/cors-remote-success.png" data-lightbox="image-1" data-title="Screenshot of working website where access to JSON file has been allowed"><img src="{{site.baseurl}}/images/cors-remote-success.png" style="width:500px;" /></a>

# Scenario 3: Data is stored on one server but accessed from multiple other servers

Things get more complex though if you want the server to allow access from more then one other server. The browser will only accept an "Access-Control-Allow-Origin" response that includes one origin. If the server responds with more than one origin it will fail with an error like "`Multiple CORS header 'Access-Control-Allow-Origin' not allowed`" or "`CORS header 'Access-Control-Allow-Origin' does not match 'https://mcmillan.cx,https://example.com'`".

What you need the server to do is check the Origin header of the request sent from the browser, and then if it decides it should allow access then just reply with "Access-Control-Allow-Origin" set to the Origin from the request. If you are using Apache, you can do that with code like this in your .htaccess file. This checks the "Origin" header value of the request against a list, and if it finds a match, responds with the relevant origin.

{% highlight htaccess %}
<IfModule mod_headers.c>
    SetEnvIf Origin "http(s)?://(www\.)?(mcmillan.cx|example.com)$" AccessControlAllowOrigin=$0
    Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
</IfModule>
{% endhighlight %}

Alternatively if you want to allow access from any server you can set the "Access-Control-Allow-Origin" parameter to "*" and this will allow any server access to your files. However while the more complex solution above works in the following scenario, this simpler "allow all" solution doesn't.

{% highlight htaccess %}
Header set Access-Control-Allow-Origin: "*"
{% endhighlight %}

# Scenario 4: Data is stored on one server but accessed from another server AND requests include custom headers

Lets say these requests are part of a fairly complex web application and you need to send an authentication token that identifies an authorised user in the header of the request. Something like "X-SAP-LogonToken" perhaps. What happens if you send that header in the request?

<a class="image" href="{{site.baseurl}}/images/cors-remote-fail-with-token.png" data-lightbox="image-1" data-title="Screenshot of non-working website where access to JSON file has been blocked because of a custom header"><img src="{{site.baseurl}}/images/cors-remote-fail-with-token.png" style="width:500px;" /></a>

Here you can see the browser loads the HTML page and JavaScript file successfully, but because the server doesn't list the custom header X-SAP-LogonToken as one it allows in the reply the browser blocks access to the JSON file. Note also that as this is seen as a more complex request the browser makes an `OPTIONS` request first before the actual `GET`. The OPTIONS request type was introduced as a way for browsers to "preflight" requests to check that the responding server understood the CORS protocol before making a GET or POST request that could be potentially destructive (for example deleting records from a database).

To allow our server to accept requests that include custom headers like "X-SAP-LogonToken" we need the server to reply with the custom headers that it supports. So we add another parameter to the ".htaccess" file called "Access-Control-Allow-Headers" that lists the allowed custom headers.

{% highlight htaccess %}
<IfModule mod_headers.c>
    SetEnvIf Origin "http(s)?://(www\.)?(mcmillan.cx|example.com)$" AccessControlAllowOrigin=$0
    Header add Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
</IfModule>
Header set Access-Control-Allow-Headers: "X-SAP-LogonToken"
{% endhighlight %}

Now the server responds with the Access-Control-Allow-Origin parameter and the Access-Control-Allow-Headers parameter, so the browser then allows the page to load the JSON file from the server and the page can successfully populate the table.

<a class="image" href="{{site.baseurl}}/images/cors-remote-success-with-token.png" data-lightbox="image-1" data-title="Screenshot of working website where access to JSON file has been allowed even though custom header is being used"><img src="{{site.baseurl}}/images/cors-remote-success-with-token.png" style="width:500px;" /></a>

# Further reading

Some resources I found useful

* [Cross-Origin Resource Sharing (CORS) from Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [HTTP: Learn your browser's language! by Julia Evans](https://jvns.ca/blog/2019/09/12/new-zine-on-http/)
* [The current WHATWG spec that includes CORS](https://fetch.spec.whatwg.org)
* [The first recommended draft of the W3C spec for CORS](https://www.w3.org/TR/2014/REC-cors-20140116/)
