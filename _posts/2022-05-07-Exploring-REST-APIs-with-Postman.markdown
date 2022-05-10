---
layout: post
title:  "Exploring REST APIs with Postman"
image: 
excerpt: ""
date:   2022-05-07 00:10:00
---

[Postman](https://www.postman.com/downloads/) is a fantastic tool that lets you interact with REST APIs.

A simple example.

JIRA API
========

Lets say you want to get a list of all the projects in a JIRA instance.

1. Where it says "Enter request URL" type in the url for the request, for example something like this: `http://jira.starfleet.com/rest/api/2/project`
2. Set the request type to GET as we're just retrieving information with this request.
3. If Basic Auth is available in your JIRA instance select the "Auth" tab, change the "Type" dropdown to "Basic Auth", and enter your username and password. Postman will automatically encode your username and password using base64 and add the result as a header to the request. You can see this as a hidden auto-generated header under the Headers tab.
4. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case listing all the projects.

<a class="image" href="{{site.baseurl}}/images/postman_jira.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of GET request">
<img src="{{site.baseurl}}/images/postman_jira.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>
