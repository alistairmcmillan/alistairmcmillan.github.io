---
layout: post
title:  "Experimenting with Postman and REST APIs"
image: 
excerpt: ""
date:   2022-05-07 00:10:00
---

[Postman](https://www.postman.com/downloads/) is a fantastic tool that lets you interact with REST APIs.

A few examples.

JIRA API
--------

List of projects in JIRA
========================

Lets say you want to get a list of all the projects in a JIRA instance.

1. Where it says "Enter request URL" type in the url for the request, for example something like this: `http://jira.starfleet.com/rest/api/2/project`
2. Set the request type to GET as we're just retrieving information with this request.
3. If Basic Auth is available in your JIRA instance select the "Auth" tab, change the "Type" dropdown to "Basic Auth", and enter your username and password. Postman will automatically encode your username and password using base64, and add the result as a header to the request. You can see this as a hidden auto-generated header under the Headers tab.
4. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case listing all the projects.

<a class="image" href="{{site.baseurl}}/images/postman_jira.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of JIRA GET request">
<img src="{{site.baseurl}}/images/postman_jira.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>

Changing the Component Lead in JIRA
===================================

1. Where it says "Enter request URL" type in the url for the request, for example something like this: `http://jira.starfleet.com/rest/api/2/component/16309`
2. Set the request type to PUT as we're updating existing information with this request.
3. If Basic Auth is available in your JIRA instance select the "Auth" tab, change the "Type" dropdown to "Basic Auth", and enter your username and password. Postman will automatically encode your username and password using base64, and add the result as a header to the request. You can see this as a hidden auto-generated header under the Headers tab.
4. Under the Body tab change the type to "raw" and the format to "JSON" and enter the following with your username of choice:
`{ leadusername: "reginald.barclay" }`
5. Click the big blue "Send" button and all being well you should see the response to your request in the bottom pane, in this case acknowledging the change.

<a class="image" href="{{site.baseurl}}/images/postman_jira_component.png" data-lightbox="image-1" data-title="Postman screenshot showing execution of JIRA PUT request">
<img src="{{site.baseurl}}/images/postman_jira_component.png" style="width:600px; border:1px solid black;background-color: black;padding: 2px" /></a>
